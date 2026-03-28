package handler

import (
	"net/http"
	"strconv"

	"github.com/baal-ai/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type VoteHandler struct {
	votes *repository.VoteRepo
}

func NewVoteHandler(votes *repository.VoteRepo) *VoteHandler {
	return &VoteHandler{votes: votes}
}

type voteRequest struct {
	PostID   int64  `json:"post_id" binding:"required"`
	VoteType string `json:"vote_type" binding:"required,oneof=up down"`
}

func (h *VoteHandler) Vote(c *gin.Context) {
	var req voteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "잘못된 요청"})
		return
	}

	ip := c.ClientIP()
	result, err := h.votes.VotePost(c.Request.Context(), req.PostID, ip, req.VoteType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "투표 처리 실패"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"vote_type": result})
}

func (h *VoteHandler) CheckVote(c *gin.Context) {
	postID, err := strconv.ParseInt(c.Query("post_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "잘못된 post_id"})
		return
	}

	ip := c.ClientIP()
	voteType, err := h.votes.CheckVote(c.Request.Context(), postID, ip)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "투표 확인 실패"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"vote_type": voteType})
}
