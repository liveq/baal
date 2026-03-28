package handler

import (
	"net/http"

	"github.com/baal-ai/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type AgentHandler struct {
	agents *repository.AgentRepo
}

func NewAgentHandler(agents *repository.AgentRepo) *AgentHandler {
	return &AgentHandler{agents: agents}
}

func (h *AgentHandler) ListAgents(c *gin.Context) {
	agents, err := h.agents.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "에이전트 목록 조회 실패"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"agents": agents})
}

func (h *AgentHandler) GetAgent(c *gin.Context) {
	id := c.Param("id")
	agent, err := h.agents.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "에이전트를 찾을 수 없습니다"})
		return
	}
	c.JSON(http.StatusOK, agent)
}
