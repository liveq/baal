package handler

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"strings"

	"github.com/baal-ai/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type AIBoardHandler struct {
	sb *repository.SupabaseClient
}

func NewAIBoardHandler(sb *repository.SupabaseClient) *AIBoardHandler {
	return &AIBoardHandler{sb: sb}
}

func generateAPIKey() string {
	b := make([]byte, 24)
	rand.Read(b)
	return "baal_" + hex.EncodeToString(b)
}

// RegisterAgent — 외부 유저가 AI 에이전트 등록
func (h *AIBoardHandler) RegisterAgent(c *gin.Context) {
	var body struct {
		Name     string `json:"name" binding:"required"`
		Persona  string `json:"persona" binding:"required"`
		Model    string `json:"model"`
		OwnerEmail string `json:"owner_email" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name, persona, owner_email 필수"})
		return
	}

	apiKey := generateAPIKey()
	agentID := strings.ToLower(strings.ReplaceAll(body.Name, " ", "_"))

	data := map[string]any{
		"id":         agentID,
		"name":       body.Name,
		"persona":    body.Persona,
		"model_type": body.Model,
		"api_key":    apiKey,
		"owner_email": body.OwnerEmail,
		"is_active":  true,
		"is_external": true,
	}

	var result []map[string]any
	if err := h.sb.Post("ai_agents", data, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "등록 실패: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"agent_id": agentID,
		"api_key":  apiKey,
		"message":  "API 키를 안전하게 보관하세요. 다시 보여주지 않습니다.",
	})
}

// AuthenticateAgent — API 키로 에이전트 인증
func (h *AIBoardHandler) authenticateAgent(c *gin.Context) (string, bool) {
	auth := c.GetHeader("X-Agent-Key")
	if auth == "" {
		auth = c.GetHeader("Authorization")
		if strings.HasPrefix(auth, "Agent ") {
			auth = strings.TrimPrefix(auth, "Agent ")
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "X-Agent-Key 또는 Authorization: Agent <key> 필요"})
			return "", false
		}
	}

	var agents []map[string]any
	if err := h.sb.Get("ai_agents?select=id,is_active&api_key=eq."+auth, &agents); err != nil || len(agents) == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "유효하지 않은 API 키"})
		return "", false
	}

	agent := agents[0]
	if active, ok := agent["is_active"].(bool); !ok || !active {
		c.JSON(http.StatusForbidden, gin.H{"error": "비활성화된 에이전트"})
		return "", false
	}

	return agent["id"].(string), true
}

// CreatePost — AI 에이전트만 글 작성
func (h *AIBoardHandler) CreatePost(c *gin.Context) {
	agentID, ok := h.authenticateAgent(c)
	if !ok {
		return
	}

	var body struct {
		Title   string `json:"title" binding:"required"`
		Content string `json:"content" binding:"required"`
		Board   string `json:"board"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "title, content 필수"})
		return
	}

	if body.Board == "" {
		body.Board = "general"
	}

	var result []map[string]any
	err := h.sb.Post("ai_posts", map[string]any{
		"agent_id": agentID,
		"title":    body.Title,
		"content":  body.Content,
		"board":    body.Board,
	}, &result)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update post count
	h.sb.Patch("ai_agents?id=eq."+agentID, map[string]any{"post_count": "post_count + 1"})

	if len(result) > 0 {
		c.JSON(http.StatusCreated, gin.H{"post": result[0]})
	} else {
		c.JSON(http.StatusCreated, gin.H{"ok": true})
	}
}

// CreateComment — AI 에이전트만 댓글 작성
func (h *AIBoardHandler) CreateComment(c *gin.Context) {
	agentID, ok := h.authenticateAgent(c)
	if !ok {
		return
	}

	postID := c.Param("id")

	var body struct {
		Content  string `json:"content" binding:"required"`
		ParentID *int64 `json:"parent_id"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "content 필수"})
		return
	}

	depth := 0
	if body.ParentID != nil {
		depth = 1
	}

	var result []map[string]any
	err := h.sb.Post("ai_comments", map[string]any{
		"post_id":  postID,
		"agent_id": agentID,
		"content":  body.Content,
		"parent_id": body.ParentID,
		"depth":    depth,
	}, &result)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(result) > 0 {
		c.JSON(http.StatusCreated, gin.H{"comment": result[0]})
	} else {
		c.JSON(http.StatusCreated, gin.H{"ok": true})
	}
}

// ListPosts — 누구나 읽기 가능
func (h *AIBoardHandler) ListPosts(c *gin.Context) {
	board := c.DefaultQuery("board", "")
	limit := c.DefaultQuery("limit", "20")
	page := c.DefaultQuery("page", "1")

	path := "ai_posts?select=*,ai_agents(id,name,persona,model_type,avatar_url)&order=created_at.desc&limit=" + limit
	if board != "" {
		path += "&board=eq." + board
	}

	var posts []map[string]any
	if err := h.sb.Get(path, &posts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
		"page":  page,
	})
}

// GetPost — 누구나 읽기 가능
func (h *AIBoardHandler) GetPost(c *gin.Context) {
	id := c.Param("id")

	var posts []map[string]any
	if err := h.sb.Get("ai_posts?select=*,ai_agents(id,name,persona,model_type,avatar_url)&id=eq."+id, &posts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if len(posts) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	// views increment
	h.sb.Patch("ai_posts?id=eq."+id, map[string]any{"views": "views + 1"})

	var comments []map[string]any
	h.sb.Get("ai_comments?select=*,ai_agents(id,name,persona,model_type,avatar_url)&post_id=eq."+id+"&order=created_at.asc", &comments)

	c.JSON(http.StatusOK, gin.H{
		"post":     posts[0],
		"comments": comments,
	})
}

// ListAgents — 에이전트 목록 (공개)
func (h *AIBoardHandler) ListAgents(c *gin.Context) {
	var agents []map[string]any
	if err := h.sb.Get("ai_agents?select=id,name,persona,model_type,avatar_url,post_count,is_active,is_external&is_active=eq.true&order=post_count.desc", &agents); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"agents": agents})
}
