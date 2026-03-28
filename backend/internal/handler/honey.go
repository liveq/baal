package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/baal-ai/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type HoneyHandler struct {
	sb *repository.SupabaseClient
}

func NewHoneyHandler(sb *repository.SupabaseClient) *HoneyHandler {
	return &HoneyHandler{sb: sb}
}

func (h *HoneyHandler) ListAds(c *gin.Context) {
	var ads []map[string]any
	if err := h.sb.Get("honey_ads?select=*&is_active=eq.true&order=reward_points.asc", &ads); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ads": ads})
}

// ClaimReward 광고 보상 수령
func (h *HoneyHandler) ClaimReward(c *gin.Context) {
	var body struct {
		AdID string `json:"ad_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ad_id 필수"})
		return
	}

	ip := c.ClientIP()

	// 광고 존재 확인
	var ads []map[string]any
	if err := h.sb.Get("honey_ads?select=*&id=eq."+body.AdID+"&is_active=eq.true", &ads); err != nil || len(ads) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "유효하지 않은 광고"})
		return
	}
	ad := ads[0]

	points := 0
	if v, ok := ad["reward_points"].(float64); ok {
		points = int(v)
	}

	dailyLimit := 0
	if v, ok := ad["daily_limit"].(float64); ok {
		dailyLimit = int(v)
	}

	// 일일 한도 체크 (해당 광고의 오늘 클레임 수)
	if dailyLimit > 0 {
		today := time.Now().Format("2006-01-02")
		var todayHistory []map[string]any
		h.sb.Get(fmt.Sprintf(
			"honey_history?select=id&ip_address=eq.%s&ad_id=eq.%s&completed_at=gte.%sT00:00:00Z&completed_at=lt.%sT23:59:59Z",
			ip, body.AdID, today, today,
		), &todayHistory)
		if len(todayHistory) >= dailyLimit {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "일일 한도 초과"})
			return
		}
	}

	// 전체 일일 한도 (IP당 하루 최대 50회)
	today := time.Now().Format("2006-01-02")
	var allToday []map[string]any
	h.sb.Get(fmt.Sprintf(
		"honey_history?select=id&ip_address=eq.%s&completed_at=gte.%sT00:00:00Z&completed_at=lt.%sT23:59:59Z",
		ip, today, today,
	), &allToday)
	if len(allToday) >= 50 {
		c.JSON(http.StatusTooManyRequests, gin.H{"error": "일일 전체 한도 초과 (50회)"})
		return
	}

	// 기록 저장
	h.sb.Post("honey_history", map[string]any{
		"ad_id":         body.AdID,
		"points_earned": points,
		"ip_address":    ip,
		"user_agent":    c.GetHeader("User-Agent"),
	}, nil)

	// 총 포인트 계산
	totalPoints := h.calcPoints(ip)

	c.JSON(http.StatusOK, gin.H{
		"ok":           true,
		"earned":       points,
		"total_points": totalPoints,
		"today_count":  len(allToday) + 1,
	})
}

// GetStats IP 기반 포인트 통계
func (h *HoneyHandler) GetStats(c *gin.Context) {
	ip := c.ClientIP()
	totalPoints := h.calcPoints(ip)

	today := time.Now().Format("2006-01-02")
	var todayHistory []map[string]any
	h.sb.Get(fmt.Sprintf(
		"honey_history?select=points_earned&ip_address=eq.%s&completed_at=gte.%sT00:00:00Z&completed_at=lt.%sT23:59:59Z",
		ip, today, today,
	), &todayHistory)

	todayPoints := 0
	for _, h := range todayHistory {
		if v, ok := h["points_earned"].(float64); ok {
			todayPoints += int(v)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"total_points": totalPoints,
		"today_points": todayPoints,
		"today_count":  len(todayHistory),
		"daily_limit":  50,
	})
}

// GetHistory IP 기반 활동 이력
func (h *HoneyHandler) GetHistory(c *gin.Context) {
	ip := c.ClientIP()
	var history []map[string]any
	h.sb.Get(fmt.Sprintf(
		"honey_history?select=*,honey_ads(title,ad_type)&ip_address=eq.%s&order=completed_at.desc&limit=30",
		ip,
	), &history)
	c.JSON(http.StatusOK, gin.H{"history": history})
}

func (h *HoneyHandler) calcPoints(ip string) int {
	var history []map[string]any
	h.sb.Get(fmt.Sprintf("honey_history?select=points_earned&ip_address=eq.%s", ip), &history)
	total := 0
	for _, h := range history {
		if v, ok := h["points_earned"].(float64); ok {
			total += int(v)
		}
	}
	return total
}

// GetLeaderboard 포인트 랭킹 (IP 기반)
func (h *HoneyHandler) GetLeaderboard(c *gin.Context) {
	var history []map[string]any
	h.sb.Get("honey_history?select=ip_address,points_earned&order=completed_at.desc", &history)

	// IP별 합산
	ipPoints := map[string]int{}
	for _, h := range history {
		ip, _ := h["ip_address"].(string)
		pts, _ := h["points_earned"].(float64)
		if ip != "" {
			ipPoints[ip] += int(pts)
		}
	}

	// 정렬
	type entry struct {
		Rank   int    `json:"rank"`
		IP     string `json:"ip"`
		Points int    `json:"points"`
	}
	var entries []entry
	for ip, pts := range ipPoints {
		// IP 마스킹
		masked := ip
		if len(ip) > 6 {
			masked = ip[:6] + "***"
		}
		entries = append(entries, entry{IP: masked, Points: pts})
	}
	// 상위 20명만
	for i := 0; i < len(entries); i++ {
		for j := i + 1; j < len(entries); j++ {
			if entries[j].Points > entries[i].Points {
				entries[i], entries[j] = entries[j], entries[i]
			}
		}
	}
	if len(entries) > 20 {
		entries = entries[:20]
	}
	for i := range entries {
		entries[i].Rank = i + 1
	}

	c.JSON(http.StatusOK, gin.H{"leaderboard": entries})
}

// LogActivity 하위 호환용
func (h *HoneyHandler) LogActivity(c *gin.Context) {
	h.ClaimReward(c)
}
