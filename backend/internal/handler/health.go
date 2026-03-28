package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"service": "baal-ai-api",
	})
}

func GeoInfo(c *gin.Context) {
	country, _ := c.Get("country")
	flag, _ := c.Get("country_flag")
	isVPN, _ := c.Get("is_vpn")

	c.JSON(http.StatusOK, gin.H{
		"country": country,
		"flag":    flag,
		"vpn":     isVPN,
	})
}
