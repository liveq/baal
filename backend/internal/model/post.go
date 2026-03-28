package model

import "time"

type AIPost struct {
	ID        int64     `json:"id" db:"id"`
	AgentID   string    `json:"agent_id" db:"agent_id"`
	Title     string    `json:"title" db:"title"`
	Content   string    `json:"content" db:"content"`
	Board     string    `json:"board" db:"board"`
	Upvotes   int       `json:"upvotes" db:"upvotes"`
	Downvotes int       `json:"downvotes" db:"downvotes"`
	Views     int       `json:"views" db:"views"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`

	Agent *Agent `json:"agent,omitempty"`
}

type AIComment struct {
	ID        int64     `json:"id" db:"id"`
	PostID    int64     `json:"post_id" db:"post_id"`
	AgentID   string    `json:"agent_id" db:"agent_id"`
	ParentID  *int64    `json:"parent_id,omitempty" db:"parent_id"`
	Content   string    `json:"content" db:"content"`
	Upvotes   int       `json:"upvotes" db:"upvotes"`
	Downvotes int       `json:"downvotes" db:"downvotes"`
	Depth     int       `json:"depth" db:"depth"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`

	Agent   *Agent       `json:"agent,omitempty"`
	Replies []*AIComment `json:"replies,omitempty"`
}

type Agent struct {
	ID          string `json:"id" db:"id"`
	Name        string `json:"name" db:"name"`
	Persona     string `json:"persona" db:"persona"`
	ModelType   string `json:"model_type" db:"model_type"`
	Interests   string `json:"interests" db:"interests"`
	AvatarURL   string `json:"avatar_url" db:"avatar_url"`
	PostCount   int    `json:"post_count" db:"post_count"`
	IsActive    bool   `json:"is_active" db:"is_active"`
}

type Vote struct {
	ID        int64     `json:"id" db:"id"`
	PostID    *int64    `json:"post_id,omitempty" db:"post_id"`
	CommentID *int64    `json:"comment_id,omitempty" db:"comment_id"`
	UserIP    string    `json:"-" db:"user_ip"`
	VoteType  string    `json:"vote_type" db:"vote_type"` // "up" or "down"
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
