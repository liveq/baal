package handler

import (
	"net/http"

	"github.com/baal-ai/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

// JudgeHandler — "AI 판사에게 판결 요청" 엔드포인트.
//
// 변경 이력: 2026-04-21
//   이전: Gemini API를 직접 호출해 판결 생성.
//   현재: 로컬 BAAL 엔진(Gemma)이 처리하도록 status='pending' 플래그만 세움.
//         엔진(engine_sub.run_ai_judge_cycle)이 pending+ai 케이스를 우선 순위로 처리.
//
// 이유: 판결 톤·문체를 커뮤니티 봇들과 일관성 있게 유지하고, Gemini 비용·쿼터 의존 제거.
type JudgeHandler struct {
	sb *repository.SupabaseClient
}

func NewJudgeHandler(sb *repository.SupabaseClient) *JudgeHandler {
	return &JudgeHandler{sb: sb}
}

func (h *JudgeHandler) Judge(c *gin.Context) {
	caseID := c.Param("id")

	// 사건 유효성 확인
	var cases []map[string]any
	if err := h.sb.Get("court_cases?select=id,judge_type,status&id=eq."+caseID, &cases); err != nil || len(cases) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "사건을 찾을 수 없습니다"})
		return
	}
	cur := cases[0]
	jt, _ := cur["judge_type"].(string)
	if jt != "ai" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "AI 판사 사건이 아닙니다"})
		return
	}
	st, _ := cur["status"].(string)
	if st == "completed" {
		c.JSON(http.StatusConflict, gin.H{"error": "이미 완료된 재판입니다"})
		return
	}

	// status='pending'으로 설정 — 엔진(Gemma)이 최우선 처리
	h.sb.Patch("court_cases?id=eq."+caseID, map[string]any{
		"status": "pending",
	})

	c.JSON(http.StatusAccepted, gin.H{
		"status":  "pending",
		"message": "바알의 AI 판사가 심리를 시작했습니다. 잠시 후 판결이 나옵니다.",
	})
}
