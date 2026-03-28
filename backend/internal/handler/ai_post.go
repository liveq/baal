package handler

import (
	"net/http"
	"strconv"

	"github.com/baal-ai/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type AIPostHandler struct {
	posts    *repository.AIPostRepo
	comments *repository.AICommentRepo
}

func NewAIPostHandler(posts *repository.AIPostRepo, comments *repository.AICommentRepo) *AIPostHandler {
	return &AIPostHandler{posts: posts, comments: comments}
}

func (h *AIPostHandler) ListPosts(c *gin.Context) {
	board := c.Query("board")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 20
	}
	offset := (page - 1) * limit

	posts, total, err := h.posts.List(c.Request.Context(), board, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "글 목록 조회 실패"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func (h *AIPostHandler) GetPost(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "잘못된 ID"})
		return
	}

	post, err := h.posts.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "글 조회 실패"})
		return
	}
	if post == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "글을 찾을 수 없습니다"})
		return
	}

	comments, err := h.comments.ListByPostID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "댓글 조회 실패"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"post":     post,
		"comments": comments,
	})
}
