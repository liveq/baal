package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type VoteRepo struct {
	pool *pgxpool.Pool
}

func NewVoteRepo(pool *pgxpool.Pool) *VoteRepo {
	return &VoteRepo{pool: pool}
}

func (r *VoteRepo) VotePost(ctx context.Context, postID int64, userIP, voteType string) (string, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return "", err
	}
	defer tx.Rollback(ctx)

	// check existing vote
	var existingType string
	err = tx.QueryRow(ctx,
		`SELECT vote_type FROM ai_votes WHERE post_id = $1 AND user_ip = $2`, postID, userIP,
	).Scan(&existingType)

	if err == pgx.ErrNoRows {
		// new vote
		_, err = tx.Exec(ctx,
			`INSERT INTO ai_votes (post_id, user_ip, vote_type) VALUES ($1, $2, $3)`,
			postID, userIP, voteType)
		if err != nil {
			return "", err
		}
		col := "upvotes"
		if voteType == "down" {
			col = "downvotes"
		}
		_, err = tx.Exec(ctx,
			`UPDATE ai_posts SET `+col+` = `+col+` + 1 WHERE id = $1`, postID)
	} else if err == nil {
		if existingType == voteType {
			// cancel vote
			_, _ = tx.Exec(ctx,
				`DELETE FROM ai_votes WHERE post_id = $1 AND user_ip = $2`, postID, userIP)
			col := "upvotes"
			if voteType == "down" {
				col = "downvotes"
			}
			_, _ = tx.Exec(ctx,
				`UPDATE ai_posts SET `+col+` = GREATEST(`+col+` - 1, 0) WHERE id = $1`, postID)
			voteType = "cancelled"
		} else {
			// change vote
			_, _ = tx.Exec(ctx,
				`UPDATE ai_votes SET vote_type = $1 WHERE post_id = $2 AND user_ip = $3`,
				voteType, postID, userIP)
			if voteType == "up" {
				_, _ = tx.Exec(ctx,
					`UPDATE ai_posts SET upvotes = upvotes + 1, downvotes = GREATEST(downvotes - 1, 0) WHERE id = $1`, postID)
			} else {
				_, _ = tx.Exec(ctx,
					`UPDATE ai_posts SET downvotes = downvotes + 1, upvotes = GREATEST(upvotes - 1, 0) WHERE id = $1`, postID)
			}
		}
	} else {
		return "", err
	}

	return voteType, tx.Commit(ctx)
}

func (r *VoteRepo) CheckVote(ctx context.Context, postID int64, userIP string) (string, error) {
	var voteType string
	err := r.pool.QueryRow(ctx,
		`SELECT vote_type FROM ai_votes WHERE post_id = $1 AND user_ip = $2`,
		postID, userIP,
	).Scan(&voteType)
	if err == pgx.ErrNoRows {
		return "", nil
	}
	return voteType, err
}
