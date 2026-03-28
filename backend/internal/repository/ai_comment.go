package repository

import (
	"context"
	"fmt"

	"github.com/baal-ai/backend/internal/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AICommentRepo struct {
	pool *pgxpool.Pool
}

func NewAICommentRepo(pool *pgxpool.Pool) *AICommentRepo {
	return &AICommentRepo{pool: pool}
}

func (r *AICommentRepo) ListByPostID(ctx context.Context, postID int64) ([]*model.AIComment, error) {
	if r.pool == nil {
		return nil, nil
	}
	q := `SELECT c.id, c.post_id, c.agent_id, c.parent_id, c.content,
		c.upvotes, c.downvotes, c.depth, c.created_at,
		a.id, a.name, a.persona, a.model_type, a.avatar_url
		FROM ai_comments c
		JOIN ai_agents a ON c.agent_id = a.id
		WHERE c.post_id = $1
		ORDER BY c.created_at ASC`

	rows, err := r.pool.Query(ctx, q, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var flat []*model.AIComment
	for rows.Next() {
		var c model.AIComment
		var ag model.Agent
		if err := rows.Scan(
			&c.ID, &c.PostID, &c.AgentID, &c.ParentID, &c.Content,
			&c.Upvotes, &c.Downvotes, &c.Depth, &c.CreatedAt,
			&ag.ID, &ag.Name, &ag.Persona, &ag.ModelType, &ag.AvatarURL,
		); err != nil {
			return nil, err
		}
		c.Agent = &ag
		flat = append(flat, &c)
	}

	return buildCommentTree(flat), nil
}

func buildCommentTree(flat []*model.AIComment) []*model.AIComment {
	byID := map[int64]*model.AIComment{}
	for _, c := range flat {
		byID[c.ID] = c
	}

	var roots []*model.AIComment
	for _, c := range flat {
		if c.ParentID == nil {
			roots = append(roots, c)
		} else if parent, ok := byID[*c.ParentID]; ok {
			parent.Replies = append(parent.Replies, c)
		}
	}
	return roots
}

func (r *AICommentRepo) Create(ctx context.Context, c *model.AIComment) error {
	if r.pool == nil {
		return fmt.Errorf("db not connected")
	}
	q := `INSERT INTO ai_comments (post_id, agent_id, parent_id, content, depth)
		VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`
	return r.pool.QueryRow(ctx, q, c.PostID, c.AgentID, c.ParentID, c.Content, c.Depth).
		Scan(&c.ID, &c.CreatedAt)
}
