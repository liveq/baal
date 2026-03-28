package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type geoCache struct {
	mu    sync.RWMutex
	store map[string]*geoResult
}

type geoResult struct {
	Country   string `json:"country"`
	CountryCode string `json:"countryCode"`
	IsVPN     bool   `json:"isVPN"`
	cachedAt  time.Time
}

var cache = &geoCache{store: make(map[string]*geoResult)}

func (c *geoCache) get(ip string) *geoResult {
	c.mu.RLock()
	defer c.mu.RUnlock()
	if r, ok := c.store[ip]; ok && time.Since(r.cachedAt) < 24*time.Hour {
		return r
	}
	return nil
}

func (c *geoCache) set(ip string, r *geoResult) {
	c.mu.Lock()
	defer c.mu.Unlock()
	r.cachedAt = time.Now()
	c.store[ip] = r
}

func lookupIP(ip string) *geoResult {
	if cached := cache.get(ip); cached != nil {
		return cached
	}

	// Use ip-api.com free tier (45 req/min)
	resp, err := http.Get(fmt.Sprintf("http://ip-api.com/json/%s?fields=country,countryCode,proxy,hosting", ip))
	if err != nil {
		return &geoResult{Country: "Unknown", CountryCode: "XX"}
	}
	defer resp.Body.Close()

	var data struct {
		Country     string `json:"country"`
		CountryCode string `json:"countryCode"`
		Proxy       bool   `json:"proxy"`
		Hosting     bool   `json:"hosting"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return &geoResult{Country: "Unknown", CountryCode: "XX"}
	}

	result := &geoResult{
		Country:     data.Country,
		CountryCode: data.CountryCode,
		IsVPN:       data.Proxy || data.Hosting,
	}
	cache.set(ip, result)
	return result
}

var countryFlags = map[string]string{
	"KR": "🇰🇷", "JP": "🇯🇵", "US": "🇺🇸", "CN": "🇨🇳", "TW": "🇹🇼",
	"GB": "🇬🇧", "DE": "🇩🇪", "FR": "🇫🇷", "CA": "🇨🇦", "AU": "🇦🇺",
	"IN": "🇮🇳", "BR": "🇧🇷", "RU": "🇷🇺", "VN": "🇻🇳", "TH": "🇹🇭",
	"PH": "🇵🇭", "ID": "🇮🇩", "MY": "🇲🇾", "SG": "🇸🇬", "HK": "🇭🇰",
}

func GeoIP() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()

		// Skip for local
		if strings.HasPrefix(ip, "127.") || strings.HasPrefix(ip, "::") || strings.HasPrefix(ip, "192.168.") {
			c.Set("country", "KR")
			c.Set("country_flag", "🇰🇷")
			c.Set("is_vpn", false)
			c.Next()
			return
		}

		geo := lookupIP(ip)
		flag := countryFlags[geo.CountryCode]
		if flag == "" {
			flag = "🏳️"
		}
		if geo.IsVPN {
			flag = "🏴"
		}

		c.Set("country", geo.CountryCode)
		c.Set("country_flag", flag)
		c.Set("is_vpn", geo.IsVPN)
		c.Next()
	}
}
