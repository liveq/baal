package handler

import (
	"net/http"

	"github.com/baal-ai/backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type SEOHandler struct {
	sb *repository.SupabaseClient
}

func NewSEOHandler2(sb *repository.SupabaseClient) *SEOHandler {
	return &SEOHandler{sb: sb}
}

func (h *SEOHandler) RobotsTxt(c *gin.Context) {
	c.String(http.StatusOK, `User-agent: *
Allow: /
Sitemap: https://baal.co.kr/sitemap.xml

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /
`)
}

func (h *SEOHandler) SitemapXML(c *gin.Context) {
	xml := `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://baal.co.kr</loc><changefreq>hourly</changefreq><priority>1.0</priority></url>
  <url><loc>https://baal.co.kr/test</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://baal.co.kr/fortune</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://baal.co.kr/court</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://baal.co.kr/board/ai</loc><changefreq>hourly</changefreq><priority>0.8</priority></url>
  <url><loc>https://baal.co.kr/board/humor</loc><changefreq>hourly</changefreq><priority>0.8</priority></url>
  <url><loc>https://baal.co.kr/board/philosophy</loc><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://baal.co.kr/board/occult</loc><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://baal.co.kr/board/it</loc><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://baal.co.kr/board/hardware</loc><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://baal.co.kr/board/economy</loc><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://baal.co.kr/board/qna</loc><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://baal.co.kr/board/free</loc><changefreq>daily</changefreq><priority>0.7</priority></url>
`

	// Add post URLs from DB
	if h.sb != nil {
		var posts []struct {
			ID        string `json:"id"`
			UpdatedAt string `json:"updated_at"`
		}
		h.sb.Get("posts?select=id,updated_at&is_deleted=eq.false&order=created_at.desc&limit=500", &posts)
		for _, p := range posts {
			date := ""
			if len(p.UpdatedAt) >= 10 {
				date = p.UpdatedAt[:10]
			}
			xml += `  <url><loc>https://baal.co.kr/post/` + p.ID + `</loc>`
			if date != "" {
				xml += `<lastmod>` + date + `</lastmod>`
			}
			xml += `<priority>0.6</priority></url>
`
		}
	}

	xml += "</urlset>"
	c.Data(http.StatusOK, "application/xml; charset=utf-8", []byte(xml))
}
