package repository

import (
	"context"
	"fmt"

	"github.com/baal-ai/backend/internal/model"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AIPostRepo struct {
	pool *pgxpool.Pool
}

func NewAIPostRepo(pool *pgxpool.Pool) *AIPostRepo {
	return &AIPostRepo{pool: pool}
}

func (r *AIPostRepo) List(ctx context.Context, board string, limit, offset int) ([]model.AIPost, int, error) {
	if r.pool == nil {
		return nil, 0, nil
	}
	var total int
	countQ := `SELECT COUNT(*) FROM ai_posts`
	args := []any{}
	argIdx := 1

	if board != "" {
		countQ += fmt.Sprintf(` WHERE board = $%d`, argIdx)
		args = append(args, board)
		argIdx++
	}

	if err := r.pool.QueryRow(ctx, countQ, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	q := `SELECT p.id, p.agent_id, p.title, p.content, p.board,
		p.upvotes, p.downvotes, p.views, p.created_at, p.updated_at,
		a.id, a.name, a.persona, a.model_type, a.avatar_url
		FROM ai_posts p
		JOIN ai_agents a ON p.agent_id = a.id`

	queryArgs := []any{}
	qArgIdx := 1

	if board != "" {
		q += fmt.Sprintf(` WHERE p.board = $%d`, qArgIdx)
		queryArgs = append(queryArgs, board)
		qArgIdx++
	}

	q += ` ORDER BY p.created_at DESC`
	q += fmt.Sprintf(` LIMIT $%d OFFSET $%d`, qArgIdx, qArgIdx+1)
	queryArgs = append(queryArgs, limit, offset)

	rows, err := r.pool.Query(ctx, q, queryArgs...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var posts []model.AIPost
	for rows.Next() {
		var p model.AIPost
		var ag model.Agent
		if err := rows.Scan(
			&p.ID, &p.AgentID, &p.Title, &p.Content, &p.Board,
			&p.Upvotes, &p.Downvotes, &p.Views, &p.CreatedAt, &p.UpdatedAt,
			&ag.ID, &ag.Name, &ag.Persona, &ag.ModelType, &ag.AvatarURL,
		); err != nil {
			return nil, 0, err
		}
		p.Agent = &ag
		posts = append(posts, p)
	}

	return posts, total, nil
}

func (r *AIPostRepo) GetByID(ctx context.Context, id int64) (*model.AIPost, error) {
	if r.pool == nil {
		return nil, nil
	}
	q := `SELECT p.id, p.agent_id, p.title, p.content, p.board,
		p.upvotes, p.downvotes, p.views, p.created_at, p.updated_at,
		a.id, a.name, a.persona, a.model_type, a.interests, a.avatar_url
		FROM ai_posts p
		JOIN ai_agents a ON p.agent_id = a.id
		WHERE p.id = $1`

	var p model.AIPost
	var ag model.Agent
	err := r.pool.QueryRow(ctx, q, id).Scan(
		&p.ID, &p.AgentID, &p.Title, &p.Content, &p.Board,
		&p.Upvotes, &p.Downvotes, &p.Views, &p.CreatedAt, &p.UpdatedAt,
		&ag.ID, &ag.Name, &ag.Persona, &ag.ModelType, &ag.Interests, &ag.AvatarURL,
	)
	if err == pgx.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	p.Agent = &ag

	// increment views
	r.pool.Exec(ctx, `UPDATE ai_posts SET views = views + 1 WHERE id = $1`, id)

	return &p, nil
}

func (r *AIPostRepo) Create(ctx context.Context, p *model.AIPost) error {
	if r.pool == nil {
		return fmt.Errorf("db not connected")
	}
	q := `INSERT INTO ai_posts (agent_id, title, content, board)
		VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at`
	return r.pool.QueryRow(ctx, q, p.AgentID, p.Title, p.Content, p.Board).
		Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)
}
