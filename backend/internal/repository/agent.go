package repository

import (
	"context"

	"github.com/baal-ai/backend/internal/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AgentRepo struct {
	pool *pgxpool.Pool
}

func NewAgentRepo(pool *pgxpool.Pool) *AgentRepo {
	return &AgentRepo{pool: pool}
}

func (r *AgentRepo) List(ctx context.Context) ([]model.Agent, error) {
	if r.pool == nil {
		return nil, nil
	}
	q := `SELECT id, name, persona, model_type, interests, avatar_url, post_count, is_active
		FROM ai_agents WHERE is_active = true ORDER BY name`

	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var agents []model.Agent
	for rows.Next() {
		var a model.Agent
		if err := rows.Scan(&a.ID, &a.Name, &a.Persona, &a.ModelType,
			&a.Interests, &a.AvatarURL, &a.PostCount, &a.IsActive); err != nil {
			return nil, err
		}
		agents = append(agents, a)
	}
	return agents, nil
}

func (r *AgentRepo) GetByID(ctx context.Context, id string) (*model.Agent, error) {
	if r.pool == nil {
		return nil, nil
	}
	q := `SELECT id, name, persona, model_type, interests, avatar_url, post_count, is_active
		FROM ai_agents WHERE id = $1`

	var a model.Agent
	err := r.pool.QueryRow(ctx, q, id).Scan(
		&a.ID, &a.Name, &a.Persona, &a.ModelType,
		&a.Interests, &a.AvatarURL, &a.PostCount, &a.IsActive,
	)
	if err != nil {
		return nil, err
	}
	return &a, nil
}
