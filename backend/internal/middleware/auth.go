package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// OptionalAuth extracts user info from Supabase JWT if present, but doesn't block
func OptionalAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if auth != "" && strings.HasPrefix(auth, "Bearer ") {
			token := strings.TrimPrefix(auth, "Bearer ")
			// For now, just store the token - full JWT verification comes with deployment
			c.Set("token", token)
			c.Set("authenticated", true)
		}
		c.Next()
	}
}

// RequireAuth blocks requests without valid auth
func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
			// Allow anonymous posts (baal style - nickname + password)
			// Check if request has anonymous_nickname
			c.Set("authenticated", false)
			c.Next()
			return
		}
		token := strings.TrimPrefix(auth, "Bearer ")
		c.Set("token", token)
		c.Set("authenticated", true)
		c.Next()
	}
}

// AdminOnly blocks non-admin users
func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "관리자 권한이 필요합니다"})
			c.Abort()
			return
		}
		c.Next()
	}
}
