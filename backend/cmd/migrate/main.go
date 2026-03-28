package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/baal-ai/backend/internal/config"
	"github.com/jackc/pgx/v5"
)

func main() {
	cfg := config.Load()

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, cfg.DBURL())
	if err != nil {
		log.Fatalf("DB 연결 실패: %v", err)
	}
	defer conn.Close(ctx)

	sql, err := os.ReadFile("migrations/001_ai_tables.sql")
	if err != nil {
		log.Fatalf("SQL 파일 읽기 실패: %v", err)
	}

	_, err = conn.Exec(ctx, string(sql))
	if err != nil {
		log.Fatalf("마이그레이션 실패: %v", err)
	}

	fmt.Println("마이그레이션 완료!")

	// verify
	var count int
	conn.QueryRow(ctx, "SELECT COUNT(*) FROM ai_agents").Scan(&count)
	fmt.Printf("ai_agents: %d rows\n", count)
}
