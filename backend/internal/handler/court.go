package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/baal-ai/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type CourtHandler struct {
	sb *repository.SupabaseClient
}

func NewCourtHandler(sb *repository.SupabaseClient) *CourtHandler {
	return &CourtHandler{sb: sb}
}

// ListCases 재판 목록 (메시지수/투표수 포함)
func (h *CourtHandler) ListCases(c *gin.Context) {
	status := c.DefaultQuery("status", "")

	path := "court_cases?select=*&order=created_at.desc&limit=50"
	if status != "" {
		path += "&status=eq." + status
	}

	var cases []map[string]any
	if err := h.sb.Get(path, &cases); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 각 사건의 메시지수/투표수 집계
	for i, cs := range cases {
		caseID, _ := cs["id"].(string)
		if caseID == "" {
			continue
		}

		var msgs []map[string]any
		h.sb.Get("court_messages?select=id&case_id=eq."+caseID+"&message_type=neq.reaction", &msgs)
		cases[i]["message_count"] = len(msgs)

		var votes []map[string]any
		h.sb.Get("jury_votes?select=id&case_id=eq."+caseID, &votes)
		cases[i]["vote_count"] = len(votes)
	}

	c.JSON(http.StatusOK, gin.H{"cases": cases})
}

// GetCase 사건 상세 (투표 집계 포함)
func (h *CourtHandler) GetCase(c *gin.Context) {
	id := c.Param("id")

	var cases []map[string]any
	if err := h.sb.Get("court_cases?select=*&id=eq."+id, &cases); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if len(cases) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	var messages []map[string]any
	h.sb.Get("court_messages?select=*&case_id=eq."+id+"&message_type=neq.reaction&order=created_at.asc", &messages)

	// 투표 집계
	var pVotes []map[string]any
	h.sb.Get("jury_votes?select=id&case_id=eq."+id+"&verdict=eq.plaintiff_win", &pVotes)
	var dVotes []map[string]any
	h.sb.Get("jury_votes?select=id&case_id=eq."+id+"&verdict=eq.defendant_win", &dVotes)

	c.JSON(http.StatusOK, gin.H{
		"case":     cases[0],
		"messages": messages,
		"votes": gin.H{
			"plaintiff_votes": len(pVotes),
			"defendant_votes": len(dVotes),
			"total":           len(pVotes) + len(dVotes),
		},
	})
}

// PostMessage 변론/증거 제출 + 첫 메시지 시 상태 자동 전환
func (h *CourtHandler) PostMessage(c *gin.Context) {
	caseID := c.Param("id")

	var body struct {
		Message     string `json:"message" binding:"required"`
		MessageType string `json:"message_type"`
		Nickname    string `json:"nickname"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "message 필수"})
		return
	}

	if body.MessageType == "" {
		body.MessageType = "chat"
	}
	if body.Nickname == "" {
		body.Nickname = "익명"
	}

	// 사건 상태 확인 — 완료된 사건에는 메시지 불가
	var cases []map[string]any
	h.sb.Get("court_cases?select=status&id=eq."+caseID, &cases)
	if len(cases) > 0 {
		st, _ := cases[0]["status"].(string)
		if st == "completed" {
			c.JSON(http.StatusForbidden, gin.H{"error": "완료된 재판에는 발언할 수 없습니다"})
			return
		}
		// pending → in_progress 자동 전환
		if st == "pending" {
			h.sb.Patch("court_cases?id=eq."+caseID, map[string]any{
				"status": "in_progress",
			})
		}
	}

	var result []map[string]any
	h.sb.Post("court_messages", map[string]any{
		"case_id":      caseID,
		"message":      body.Message,
		"message_type": body.MessageType,
		"nickname":     body.Nickname,
	}, &result)

	if len(result) > 0 {
		c.JSON(http.StatusCreated, result[0])
	} else {
		c.JSON(http.StatusCreated, gin.H{"ok": true})
	}
}

// AddReaction 관전 반응
func (h *CourtHandler) AddReaction(c *gin.Context) {
	caseID := c.Param("id")
	var body struct {
		Type string `json:"type" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type 필수"})
		return
	}

	h.sb.Post("court_messages", map[string]any{
		"case_id":      caseID,
		"message":      body.Type,
		"message_type": "reaction",
		"nickname":     c.ClientIP(),
	}, nil)

	c.JSON(http.StatusOK, h.countReactions(caseID))
}

// GetReactions 반응 조회
func (h *CourtHandler) GetReactions(c *gin.Context) {
	c.JSON(http.StatusOK, h.countReactions(c.Param("id")))
}

func (h *CourtHandler) countReactions(caseID string) map[string]int {
	var reactions []map[string]any
	h.sb.Get("court_messages?select=message&case_id=eq."+caseID+"&message_type=eq.reaction", &reactions)
	counts := map[string]int{}
	for _, r := range reactions {
		if t, ok := r["message"].(string); ok {
			counts[t]++
		}
	}
	return counts
}

// CreateCase 새 법정 개설
func (h *CourtHandler) CreateCase(c *gin.Context) {
	var body map[string]any
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	body["status"] = "pending"

	var result []map[string]any
	if err := h.sb.Post("court_cases", body, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(result) > 0 {
		c.JSON(http.StatusCreated, result[0])
	} else {
		c.JSON(http.StatusCreated, gin.H{"ok": true})
	}
}

// UpdateStatus 재판 상태 수동 변경
func (h *CourtHandler) UpdateStatus(c *gin.Context) {
	caseID := c.Param("id")
	var body struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "status 필수"})
		return
	}

	update := map[string]any{"status": body.Status}
	if body.Status == "completed" {
		update["completed_at"] = time.Now().Format(time.RFC3339)
	}

	if err := h.sb.Patch("court_cases?id=eq."+caseID, update); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// GetCaseSummary 사건 요약 (목록에서 사용)
func (h *CourtHandler) GetCaseSummary(c *gin.Context) {
	id := c.Param("id")

	var cases []map[string]any
	if err := h.sb.Get("court_cases?select=*&id=eq."+id, &cases); err != nil || len(cases) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	cs := cases[0]
	caseID, _ := cs["id"].(string)

	// 메시지수
	var msgs []map[string]any
	h.sb.Get("court_messages?select=id&case_id=eq."+caseID+"&message_type=neq.reaction", &msgs)

	// 투표
	var pVotes []map[string]any
	h.sb.Get("jury_votes?select=id&case_id=eq."+caseID+"&verdict=eq.plaintiff_win", &pVotes)
	var dVotes []map[string]any
	h.sb.Get("jury_votes?select=id&case_id=eq."+caseID+"&verdict=eq.defendant_win", &dVotes)

	// 반응
	reactions := h.countReactions(caseID)

	totalReactions := 0
	for _, v := range reactions {
		totalReactions += v
	}

	cs["message_count"] = len(msgs)
	cs["vote_count"] = len(pVotes) + len(dVotes)
	cs["plaintiff_votes"] = len(pVotes)
	cs["defendant_votes"] = len(dVotes)
	cs["reaction_count"] = totalReactions

	c.JSON(http.StatusOK, cs)
}

// AppealCase 재심/항소 요청 — 완료된 사건에 대해 새 사건 생성
func (h *CourtHandler) AppealCase(c *gin.Context) {
	caseID := c.Param("id")

	// 원본 사건 확인
	var cases []map[string]any
	if err := h.sb.Get("court_cases?select=*&id=eq."+caseID, &cases); err != nil || len(cases) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "원본 사건을 찾을 수 없습니다"})
		return
	}
	original := cases[0]
	origStatus, _ := original["status"].(string)
	if origStatus != "completed" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "완료된 사건만 재심 가능합니다"})
		return
	}

	var body struct {
		Reason    string `json:"reason" binding:"required"`
		JudgeType string `json:"judge_type"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reason 필수"})
		return
	}
	if body.JudgeType == "" {
		body.JudgeType = "ai"
	}

	origTitle, _ := original["title"].(string)
	plaintiff, _ := original["plaintiff"].(string)
	defendant, _ := original["defendant"].(string)

	newCase := map[string]any{
		"title":          fmt.Sprintf("[재심] %s", origTitle),
		"description":    body.Reason,
		"plaintiff":      plaintiff,
		"defendant":      defendant,
		"judge_type":     body.JudgeType,
		"status":         "pending",
		"parent_case_id": caseID,
	}

	var result []map[string]any
	if err := h.sb.Post("court_cases", newCase, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(result) > 0 {
		c.JSON(http.StatusCreated, result[0])
	} else {
		c.JSON(http.StatusCreated, gin.H{"ok": true})
	}
}

// 배심원 자동 판결용 — jury.go의 Vote에서 호출
func (h *CourtHandler) CheckJuryAutoVerdict(caseID string) {
	var pVotes []map[string]any
	h.sb.Get("jury_votes?select=id&case_id=eq."+caseID+"&verdict=eq.plaintiff_win", &pVotes)
	var dVotes []map[string]any
	h.sb.Get("jury_votes?select=id&case_id=eq."+caseID+"&verdict=eq.defendant_win", &dVotes)

	total := len(pVotes) + len(dVotes)
	if total < 10 {
		return // 최소 10표 필요
	}

	pCount := len(pVotes)
	dCount := len(dVotes)

	// 2/3 다수결
	threshold := total * 2 / 3
	var verdict string
	if pCount >= threshold {
		verdict = "plaintiff_win"
	} else if dCount >= threshold {
		verdict = "defendant_win"
	} else if total >= 20 {
		// 20표 이상이면 단순 다수결
		if pCount > dCount {
			verdict = "plaintiff_win"
		} else if dCount > pCount {
			verdict = "defendant_win"
		} else {
			verdict = "draw"
		}
	} else {
		return // 아직 결론 안남
	}

	// 판결 적용
	h.sb.Patch("court_cases?id=eq."+caseID, map[string]any{
		"status":       "completed",
		"verdict":      verdict,
		"completed_at": time.Now().Format(time.RFC3339),
	})

	// 판결 메시지 기록
	verdictLabels := map[string]string{
		"plaintiff_win": "원고 승",
		"defendant_win": "피고 승",
		"draw":          "무승부",
	}
	reasoning := fmt.Sprintf("배심원 투표 결과: 원고 %d표, 피고 %d표 (총 %d표). 판결: %s",
		pCount, dCount, total, verdictLabels[verdict])

	h.sb.Post("court_messages", map[string]any{
		"case_id":      caseID,
		"message":      reasoning,
		"message_type": "verdict",
		"nickname":     "배심원단",
	}, nil)
}
