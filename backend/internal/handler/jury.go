package handler

import (
	"net/http"

	"github.com/baal-ai/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type JuryHandler struct {
	sb      *repository.SupabaseClient
	courtH  *CourtHandler
}

func NewJuryHandler(sb *repository.SupabaseClient) *JuryHandler {
	return &JuryHandler{
		sb:     sb,
		courtH: NewCourtHandler(sb),
	}
}

func (h *JuryHandler) Vote(c *gin.Context) {
	caseID := c.Param("id")

	var body struct {
		Verdict string `json:"verdict" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "verdict 필수 (plaintiff_win 또는 defendant_win)"})
		return
	}

	// 사건 상태 확인 — 완료된 사건에는 투표 불가
	var cases []map[string]any
	h.sb.Get("court_cases?select=status,judge_type&id=eq."+caseID, &cases)
	if len(cases) > 0 {
		st, _ := cases[0]["status"].(string)
		if st == "completed" {
			c.JSON(http.StatusForbidden, gin.H{"error": "이미 완료된 재판입니다"})
			return
		}
		jt, _ := cases[0]["judge_type"].(string)
		if jt != "jury" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "배심원 재판이 아닙니다"})
			return
		}
		// pending → in_progress 자동 전환
		if st == "pending" {
			h.sb.Patch("court_cases?id=eq."+caseID, map[string]any{
				"status": "in_progress",
			})
		}
	}

	ip := c.ClientIP()

	// 중복 투표 방지
	var existing []map[string]any
	h.sb.Get("jury_votes?select=id&case_id=eq."+caseID+"&voter_ip=eq."+ip, &existing)
	if len(existing) > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "이미 투표했습니다"})
		return
	}

	h.sb.Post("jury_votes", map[string]any{
		"case_id":  caseID,
		"verdict":  body.Verdict,
		"voter_ip": ip,
	}, nil)

	// 투표 집계
	var pVotes []map[string]any
	h.sb.Get("jury_votes?select=id&case_id=eq."+caseID+"&verdict=eq.plaintiff_win", &pVotes)
	var dVotes []map[string]any
	h.sb.Get("jury_votes?select=id&case_id=eq."+caseID+"&verdict=eq.defendant_win", &dVotes)

	// 배심원 자동 판결 체크 (10표+2/3 다수결 또는 20표+단순 다수결)
	h.courtH.CheckJuryAutoVerdict(caseID)

	c.JSON(http.StatusOK, gin.H{
		"plaintiff_votes": len(pVotes),
		"defendant_votes": len(dVotes),
		"total":           len(pVotes) + len(dVotes),
	})
}

func (h *JuryHandler) GetVotes(c *gin.Context) {
	caseID := c.Param("id")

	var pVotes []map[string]any
	h.sb.Get("jury_votes?select=id&case_id=eq."+caseID+"&verdict=eq.plaintiff_win", &pVotes)
	var dVotes []map[string]any
	h.sb.Get("jury_votes?select=id&case_id=eq."+caseID+"&verdict=eq.defendant_win", &dVotes)

	c.JSON(http.StatusOK, gin.H{
		"plaintiff_votes": len(pVotes),
		"defendant_votes": len(dVotes),
		"total":           len(pVotes) + len(dVotes),
	})
}
