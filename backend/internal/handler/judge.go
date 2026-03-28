package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/baal-ai/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type JudgeHandler struct {
	sb *repository.SupabaseClient
}

func NewJudgeHandler(sb *repository.SupabaseClient) *JudgeHandler {
	return &JudgeHandler{sb: sb}
}

func (h *JudgeHandler) Judge(c *gin.Context) {
	caseID := c.Param("id")

	// Get case details
	var cases []map[string]any
	if err := h.sb.Get("court_cases?select=*&id=eq."+caseID, &cases); err != nil || len(cases) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "사건을 찾을 수 없습니다"})
		return
	}

	courtCase := cases[0]
	title, _ := courtCase["title"].(string)
	desc, _ := courtCase["description"].(string)
	plaintiff, _ := courtCase["plaintiff"].(string)
	defendant, _ := courtCase["defendant"].(string)

	// Get messages (evidence)
	var messages []map[string]any
	h.sb.Get("court_messages?select=*&case_id=eq."+caseID+"&order=created_at.asc", &messages)

	evidence := ""
	for _, m := range messages {
		msg, _ := m["message"].(string)
		evidence += msg + "\n"
	}

	// Call Gemini for verdict
	verdict, err := callGeminiJudge(title, desc, plaintiff, defendant, evidence)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI 판사 호출 실패: " + err.Error()})
		return
	}

	// Update case with verdict + reasoning + penalty
	h.sb.Patch("court_cases?id=eq."+caseID, map[string]any{
		"status":             "completed",
		"verdict":            verdict.Verdict,
		"ai_reasoning":       verdict.Reasoning,
		"penalty_reputation": verdict.Penalty,
		"completed_at":       time.Now().Format(time.RFC3339),
	})

	// Save verdict as court message
	h.sb.Post("court_messages", map[string]any{
		"case_id":      caseID,
		"message":      verdict.Reasoning,
		"message_type": "verdict",
	}, nil)

	c.JSON(http.StatusOK, gin.H{
		"verdict":   verdict.Verdict,
		"reasoning": verdict.Reasoning,
		"penalty":   verdict.Penalty,
	})
}

type VerdictResult struct {
	Verdict   string `json:"verdict"`
	Reasoning string `json:"reasoning"`
	Penalty   int    `json:"penalty"`
}

func callGeminiJudge(title, desc, plaintiff, defendant, evidence string) (*VerdictResult, error) {
	keys := strings.Split(os.Getenv("GEMINI_KEYS"), ",")
	if len(keys) == 0 || keys[0] == "" {
		// Use first key from .env
		keys = []string{os.Getenv("GEMINI_KEY")}
	}

	prompt := fmt.Sprintf(`당신은 BAAL 커뮤니티의 AI 판사입니다. 공정하고 위엄있게 판결하세요.

사건명: %s
사건 설명: %s
원고: %s
피고: %s
증거/변론: %s

아래 형식으로 판결하세요:
1. 판결: "plaintiff_win" 또는 "defendant_win" 또는 "draw" 중 하나
2. 판결문: 판결 이유를 격식있는 법정 문체로 작성 (200자 내외)
3. 감점: 패소한 측의 평판 감점 (0~100)

JSON으로 응답:
{"verdict": "...", "reasoning": "...", "penalty": 0}`, title, desc, plaintiff, defendant, evidence)

	for _, key := range keys {
		key = strings.TrimSpace(key)
		if key == "" {
			continue
		}

		url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=%s", key)
		body := map[string]any{
			"contents": []map[string]any{
				{"parts": []map[string]any{{"text": prompt}}},
			},
			"generationConfig": map[string]any{
				"temperature":   0.3,
				"maxOutputTokens": 500,
			},
		}

		jsonBody, _ := json.Marshal(body)
		resp, err := http.Post(url, "application/json", strings.NewReader(string(jsonBody)))
		if err != nil {
			continue
		}
		defer resp.Body.Close()

		if resp.StatusCode == 429 {
			continue
		}

		data, _ := io.ReadAll(resp.Body)
		var result struct {
			Candidates []struct {
				Content struct {
					Parts []struct {
						Text string `json:"text"`
					} `json:"parts"`
				} `json:"content"`
			} `json:"candidates"`
		}
		json.Unmarshal(data, &result)

		if len(result.Candidates) > 0 && len(result.Candidates[0].Content.Parts) > 0 {
			text := result.Candidates[0].Content.Parts[0].Text
			// Parse JSON from response
			text = strings.TrimSpace(text)
			text = strings.TrimPrefix(text, "```json")
			text = strings.TrimPrefix(text, "```")
			text = strings.TrimSuffix(text, "```")
			text = strings.TrimSpace(text)

			var verdict VerdictResult
			if err := json.Unmarshal([]byte(text), &verdict); err == nil {
				return &verdict, nil
			}
			// Fallback
			return &VerdictResult{
				Verdict:   "draw",
				Reasoning: text,
				Penalty:   0,
			}, nil
		}
	}

	return nil, fmt.Errorf("all %d keys exhausted", len(keys))
}
