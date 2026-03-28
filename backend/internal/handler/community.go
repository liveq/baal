package handler

import (
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/baal-ai/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type CommunityHandler struct {
	sb *repository.SupabaseClient
}

func NewCommunityHandler(sb *repository.SupabaseClient) *CommunityHandler {
	return &CommunityHandler{sb: sb}
}

func (h *CommunityHandler) ListPosts(c *gin.Context) {
	board := c.Query("board")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	if page < 1 { page = 1 }
	if limit < 1 || limit > 50 { limit = 20 }
	offset := (page - 1) * limit

	sort := c.DefaultQuery("sort", "created_at")
	order := "created_at.desc"
	if sort == "upvotes" {
		order = "upvotes.desc"
	} else if sort == "views" {
		order = "view_count.desc"
	}

	path := "posts?select=*&is_deleted=eq.false&order=" + order
	if board != "" {
		path += "&board_type=eq." + board
	}
	if minUp := c.Query("min_upvotes"); minUp != "" {
		path += "&upvotes=gte." + minUp
	}
	if minComm := c.Query("min_comments"); minComm != "" {
		path += "&comment_count=gte." + minComm
	}
	if since := c.Query("since"); since != "" {
		path += "&created_at=gte." + since
	}
	if newsCat := c.Query("news_category"); newsCat != "" {
		parts := strings.Split(newsCat, ",")
		if len(parts) == 1 {
			path += "&news_category=eq." + url.PathEscape(strings.TrimSpace(parts[0]))
		} else {
			escaped := make([]string, len(parts))
			for i, p := range parts {
				escaped[i] = url.PathEscape(strings.TrimSpace(p))
			}
			path += "&news_category=in.(" + strings.Join(escaped, ",") + ")"
		}
	}
	path += "&limit=" + strconv.Itoa(limit) + "&offset=" + strconv.Itoa(offset)

	var posts []map[string]any
	if err := h.sb.Get(path, &posts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// count — 메인 쿼리와 동일 조건으로 Count (별도 HEAD 1회)
	countPath := path // 같은 필터 조건 재활용
	// limit/offset 제거 (count에는 필요 없음)
	if idx := strings.Index(countPath, "&limit="); idx > 0 {
		countPath = countPath[:idx]
	}
	total, _ := h.sb.Count(countPath)

	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func (h *CommunityHandler) GetPost(c *gin.Context) {
	id := c.Param("id")

	var posts []map[string]any
	if err := h.sb.Get("posts?select=*&id=eq."+id, &posts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if len(posts) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	post := posts[0]

	// increment view
	viewCount, _ := post["view_count"].(float64)
	h.sb.Patch("posts?id=eq."+id, map[string]any{"view_count": int(viewCount) + 1})

	// comments
	var comments []map[string]any
	h.sb.Get("comments?select=*&post_id=eq."+id+"&is_deleted=eq.false&order=created_at.desc", &comments)

	c.JSON(http.StatusOK, gin.H{
		"post":     post,
		"comments": comments,
	})
}

func (h *CommunityHandler) CreatePost(c *gin.Context) {
	var body map[string]any
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	// 욕설 마스킹
	if title, ok := body["title"].(string); ok {
		body["title"] = MaskProfanity(title)
	}
	if content, ok := body["content"].(string); ok {
		body["content"] = MaskProfanity(content)
	}

	var result []map[string]any
	if err := h.sb.Post("posts", body, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(result) > 0 {
		c.JSON(http.StatusCreated, result[0])
	} else {
		c.JSON(http.StatusCreated, gin.H{"ok": true})
	}
}

func (h *CommunityHandler) GetComments(c *gin.Context) {
	postID := c.Param("id")

	var comments []map[string]any
	if err := h.sb.Get("comments?select=*&post_id=eq."+postID+"&is_deleted=eq.false&order=created_at.desc", &comments); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"comments": comments})
}

func (h *CommunityHandler) CreateComment(c *gin.Context) {
	var body map[string]any
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}
	body["post_id"] = c.Param("id")

	// 욕설 마스킹
	if content, ok := body["content"].(string); ok {
		body["content"] = MaskProfanity(content)
	}

	// anonymous_nickname -> author_nickname 변환
	if nick, ok := body["anonymous_nickname"]; ok {
		body["author_nickname"] = nick
		delete(body, "anonymous_nickname")
	}
	if _, ok := body["author_nickname"]; !ok {
		body["author_nickname"] = "익명"
	}

	var result []map[string]any
	if err := h.sb.Post("comments", body, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(result) > 0 {
		c.JSON(http.StatusCreated, result[0])
	} else {
		c.JSON(http.StatusCreated, gin.H{"ok": true})
	}
}

func (h *CommunityHandler) VotePost(c *gin.Context) {
	var body map[string]any
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	body["user_ip"] = c.ClientIP()

	var result []map[string]any
	if err := h.sb.Post("votes", body, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *CommunityHandler) DeletePost(c *gin.Context) {
	id := c.Param("id")

	var body struct {
		Password string `json:"password"`
	}
	c.ShouldBindJSON(&body)

	// Get post
	var posts []map[string]any
	if err := h.sb.Get("posts?select=anonymous_password&id=eq."+id, &posts); err != nil || len(posts) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "글을 찾을 수 없습니다"})
		return
	}

	storedPw, _ := posts[0]["anonymous_password"].(string)
	if storedPw != "" && storedPw != body.Password {
		c.JSON(http.StatusForbidden, gin.H{"error": "비밀번호가 틀립니다"})
		return
	}

	h.sb.Patch("posts?id=eq."+id, map[string]any{"is_deleted": true})
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *CommunityHandler) ReportPost(c *gin.Context) {
	postID := c.Param("id")

	var body struct {
		Reason string `json:"reason"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reason 필수"})
		return
	}

	// Get post info
	var posts []map[string]any
	h.sb.Get("posts?select=title,author_nickname&id=eq."+postID, &posts)

	title := "신고: "
	author := "익명"
	if len(posts) > 0 {
		if t, ok := posts[0]["title"].(string); ok {
			title += t
		}
		if a, ok := posts[0]["author_nickname"].(string); ok {
			author = a
		}
	}

	// 같은 글에 이미 진행중 재판 있으면 복합건
	var existingCases []map[string]any
	h.sb.Get("court_cases?select=id,title&post_id=eq."+postID+"&status=neq.completed&limit=1", &existingCases)

	if len(existingCases) > 0 {
		caseID, _ := existingCases[0]["id"].(string)
		h.sb.Post("court_messages", map[string]any{
			"case_id":      caseID,
			"message":      "추가 신고: " + body.Reason,
			"message_type": "evidence",
			"nickname":     c.ClientIP(),
		}, nil)
		oldTitle, _ := existingCases[0]["title"].(string)
		if len(oldTitle) > 0 && oldTitle[:3] != "[복합" {
			h.sb.Patch("court_cases?id=eq."+caseID, map[string]any{"title": "[복합] " + oldTitle})
		}
		c.JSON(http.StatusCreated, gin.H{"ok": true, "message": "기존 재판에 복합건으로 추가되었습니다.", "case_id": caseID})
		return
	}

	h.sb.Post("court_cases", map[string]any{
		"title":       title,
		"description": body.Reason,
		"plaintiff":   c.ClientIP(),
		"defendant":   author,
		"judge_type":  "ai",
		"status":      "pending",
		"post_id":     postID,
	}, nil)

	c.JSON(http.StatusCreated, gin.H{"ok": true, "message": "신고가 접수되었습니다. 바알의 저울에서 심리됩니다."})
}

func (h *CommunityHandler) SearchPosts(c *gin.Context) {
	q := c.Query("q")
	if q == "" || len(q) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "검색어 2자 이상 필요"})
		return
	}

	board := c.Query("board")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit := 20
	if page < 1 { page = 1 }
	offset := (page - 1) * limit

	// Supabase full-text search via ilike on title and content
	path := "posts?select=*&is_deleted=eq.false&order=created_at.desc"
	path += "&or=(title.ilike.*" + q + "*,content.ilike.*" + q + "*)"
	if board != "" {
		path += "&board_type=eq." + board
	}
	path += "&limit=" + strconv.Itoa(limit) + "&offset=" + strconv.Itoa(offset)

	var posts []map[string]any
	if err := h.sb.Get(path, &posts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
		"total": len(posts),
		"query": q,
		"page":  page,
	})
}

// ReportComment 댓글 신고 → 재판 생성 (같은 글에서 다중 신고 시 복합건)
func (h *CommunityHandler) ReportComment(c *gin.Context) {
	commentID := c.Param("commentId")

	var body struct {
		Reason string `json:"reason"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reason 필수"})
		return
	}

	// 댓글 정보
	var comments []map[string]any
	h.sb.Get("comments?select=content,author_nickname,post_id&id=eq."+commentID, &comments)
	if len(comments) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "댓글 없음"})
		return
	}
	comment := comments[0]
	author, _ := comment["author_nickname"].(string)
	postID, _ := comment["post_id"].(string)

	// 같은 글에 이미 진행중인 재판 있으면 복합건으로 변론 추가
	var existingCases []map[string]any
	if postID != "" {
		h.sb.Get("court_cases?select=id,title,description&post_id=eq."+postID+"&status=neq.completed&limit=1", &existingCases)
	}

	if len(existingCases) > 0 {
		// 복합건: 기존 재판에 추가 증거로 등록
		caseID, _ := existingCases[0]["id"].(string)
		h.sb.Post("court_messages", map[string]any{
			"case_id":      caseID,
			"message":      "추가 신고: " + body.Reason + "\n대상 댓글: " + comment["content"].(string),
			"message_type": "evidence",
			"nickname":     c.ClientIP(),
		}, nil)

		// 제목에 [복합] 태그
		oldTitle, _ := existingCases[0]["title"].(string)
		if len(oldTitle) > 0 && oldTitle[:3] != "[복합" {
			h.sb.Patch("court_cases?id=eq."+caseID, map[string]any{
				"title": "[복합] " + oldTitle,
			})
		}

		c.JSON(http.StatusCreated, gin.H{"ok": true, "message": "기존 재판에 복합건으로 추가되었습니다.", "case_id": caseID})
		return
	}

	// 새 재판 생성
	h.sb.Post("court_cases", map[string]any{
		"title":       "댓글 신고: " + author,
		"description": body.Reason + "\n신고 대상 댓글: " + comment["content"].(string),
		"plaintiff":   c.ClientIP(),
		"defendant":   author,
		"judge_type":  "ai",
		"status":      "pending",
		"post_id":     postID,
	}, nil)

	c.JSON(http.StatusCreated, gin.H{"ok": true, "message": "댓글 신고가 접수되었습니다."})
}

// EditPost 글 수정 (댓글 달린 글은 수정 불가)
func (h *CommunityHandler) EditPost(c *gin.Context) {
	id := c.Param("id")

	// 댓글 있는지 확인
	var comments []map[string]any
	h.sb.Get("comments?select=id&post_id=eq."+id+"&is_deleted=eq.false&limit=1", &comments)
	if len(comments) > 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "댓글이 달린 글은 수정할 수 없습니다"})
		return
	}

	var body struct {
		Title    string `json:"title"`
		Content  string `json:"content"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	// 비밀번호 확인
	var posts []map[string]any
	h.sb.Get("posts?select=anonymous_password&id=eq."+id, &posts)
	if len(posts) > 0 {
		storedPw, _ := posts[0]["anonymous_password"].(string)
		if storedPw != "" && storedPw != body.Password {
			c.JSON(http.StatusForbidden, gin.H{"error": "비밀번호가 틀립니다"})
			return
		}
	}

	update := map[string]any{}
	if body.Title != "" {
		update["title"] = body.Title
	}
	if body.Content != "" {
		update["content"] = body.Content
	}
	if len(update) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "수정할 내용이 없습니다"})
		return
	}

	h.sb.Patch("posts?id=eq."+id, update)
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// EditComment 댓글 수정 (대댓글 달린 댓글은 수정 불가)
func (h *CommunityHandler) EditComment(c *gin.Context) {
	commentID := c.Param("commentId")

	// 대댓글 있는지 확인 (parent_id가 이 댓글인 댓글)
	var replies []map[string]any
	h.sb.Get("comments?select=id&parent_id=eq."+commentID+"&is_deleted=eq.false&limit=1", &replies)
	if len(replies) > 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "대댓글이 달린 댓글은 수정할 수 없습니다"})
		return
	}

	var body struct {
		Content string `json:"content" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "content 필수"})
		return
	}

	h.sb.Patch("comments?id=eq."+commentID, map[string]any{"content": body.Content})
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *CommunityHandler) ListBoards(c *gin.Context) {
	boards := []map[string]string{
		{"type": "ai", "name": "AI"},
		{"type": "humor", "name": "유머"},
		{"type": "philosophy", "name": "철학"},
		{"type": "occult", "name": "오컬트"},
		{"type": "it", "name": "IT"},
		{"type": "hardware", "name": "뉴스"},
		{"type": "economy", "name": "경제"},
		{"type": "qna", "name": "Q&A"},
		{"type": "free", "name": "자유"},
	}
	c.JSON(http.StatusOK, gin.H{"boards": boards})
}
