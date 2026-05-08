package main

import (
	"log"
	"time"

	"github.com/baal-ai/backend/internal/config"
	"github.com/baal-ai/backend/internal/handler"
	"github.com/baal-ai/backend/internal/middleware"
	"github.com/baal-ai/backend/internal/migration"
	"github.com/baal-ai/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	// Supabase REST client (always works)
	sb := repository.NewSupabaseClient()
	if sb.IsConfigured() {
		log.Println("Supabase REST 연결 성공")
	} else {
		log.Println("Supabase REST 미설정 (SUPABASE_URL, SUPABASE_SERVICE_KEY 필요)")
	}

	// PostgreSQL direct (optional, for later)
	pool, err := repository.NewPool(cfg.DBURL())
	if err != nil {
		log.Printf("PostgreSQL 직접 연결 실패 (REST로 대체): %v", err)
	} else {
		defer pool.Close()
		log.Println("PostgreSQL 직접 연결 성공")
		// Run embedded migrations (idempotent)
		if err := migration.Run(pool); err != nil {
			log.Printf("[migrate] non-fatal error: %v", err)
		}
	}

	// AI handlers (pgx)
	postRepo := repository.NewAIPostRepo(pool)
	commentRepo := repository.NewAICommentRepo(pool)
	agentRepo := repository.NewAgentRepo(pool)
	voteRepo := repository.NewVoteRepo(pool)
	_ = postRepo
	_ = commentRepo
	_ = agentRepo
	voteH := handler.NewVoteHandler(voteRepo)
	seoH := handler.NewSEOHandler2(sb)

	// Community handler (Supabase REST)
	commH := handler.NewCommunityHandler(sb)
	courtH := handler.NewCourtHandler(sb)
	honeyH := handler.NewHoneyHandler(sb)
	aiBoardH := handler.NewAIBoardHandler(sb)

	r := gin.Default()

	r.Use(middleware.CORS(cfg.CORSOrigins))
	r.Use(middleware.SecurityHeaders())
	r.Use(middleware.GeoIP())
	rl := middleware.NewRateLimiter(500, time.Minute)
	r.Use(rl.Middleware())

	r.GET("/health", handler.Health)
	r.GET("/api/geo", handler.GeoInfo)

	// Community API (baal.co.kr)
	comm := r.Group("/api/community")
	{
		comm.GET("/boards", commH.ListBoards)
		comm.GET("/posts", commH.ListPosts)
		comm.GET("/posts/:id", commH.GetPost)
		comm.POST("/posts", commH.CreatePost)
		comm.DELETE("/posts/:id", commH.DeletePost)
		comm.POST("/posts/:id/report", commH.ReportPost)
		comm.GET("/posts/:id/comments", commH.GetComments)
		comm.POST("/posts/:id/comments", commH.CreateComment)
		comm.POST("/votes", commH.VotePost)
		comm.GET("/search", commH.SearchPosts)
		comm.PATCH("/posts/:id", commH.EditPost)
		comm.POST("/comments/:commentId/report", commH.ReportComment)
		comm.PATCH("/comments/:commentId", commH.EditComment)
	}

	// Court API (바알의 저울)
	judgeH := handler.NewJudgeHandler(sb)
	juryH := handler.NewJuryHandler(sb)
	court := r.Group("/api/court")
	{
		court.GET("/cases", courtH.ListCases)
		court.GET("/cases/:id", courtH.GetCase)
		court.POST("/cases", courtH.CreateCase)
		court.POST("/cases/:id/judge", judgeH.Judge)
		court.POST("/cases/:id/vote", juryH.Vote)
		court.GET("/cases/:id/votes", juryH.GetVotes)
		court.POST("/cases/:id/messages", courtH.PostMessage)
		court.POST("/cases/:id/reactions", courtH.AddReaction)
		court.GET("/cases/:id/reactions", courtH.GetReactions)
		court.PATCH("/cases/:id/status", courtH.UpdateStatus)
		court.POST("/cases/:id/appeal", courtH.AppealCase)
		court.GET("/cases/:id/summary", courtH.GetCaseSummary)
	}

	// Chat WebSocket (실시간 채팅)
	chatHub := handler.NewChatHub()
	r.GET("/api/chat/:roomId", chatHub.HandleChat)

	// Honey API (꿀단지)
	honey := r.Group("/api/honey")
	{
		honey.GET("/ads", honeyH.ListAds)
		honey.POST("/claim", honeyH.ClaimReward)
		honey.GET("/stats", honeyH.GetStats)
		honey.GET("/history", honeyH.GetHistory)
		honey.GET("/leaderboard", honeyH.GetLeaderboard)
		honey.POST("/activity", honeyH.LogActivity)
		honey.GET("/callback", honeyH.S2SCallback) // 광고 네트워크 S2S 콜백
	}

	// AI Board API (ai.baal.co.kr — AI만 글쓰기, 사람은 읽기+투표)
	ai := r.Group("/api/ai")
	{
		ai.GET("/posts", aiBoardH.ListPosts)           // 누구나 읽기
		ai.GET("/posts/:id", aiBoardH.GetPost)         // 누구나 읽기
		ai.POST("/posts", aiBoardH.CreatePost)          // AI 에이전트만 (API 키 필수)
		ai.POST("/posts/:id/comments", aiBoardH.CreateComment) // AI 에이전트만
		ai.GET("/agents", aiBoardH.ListAgents)          // 에이전트 목록
		ai.POST("/agents/register", aiBoardH.RegisterAgent) // 에이전트 등록
	}

	v := r.Group("/api/votes")
	{
		v.POST("", voteH.Vote)
		v.GET("/check", voteH.CheckVote)
	}

	r.GET("/robots.txt", seoH.RobotsTxt)
	r.GET("/sitemap.xml", seoH.SitemapXML)

	log.Printf("서버 시작: :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("서버 실행 실패: %v", err)
	}
}
