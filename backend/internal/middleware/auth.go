package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/clawpanel/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// CORS 跨域中间件
func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin == "" {
			origin = "*"
		}

		c.Header("Access-Control-Allow-Origin", origin)
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

// AuthRequired 认证中间件
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, models.APIResponse{
				Success: false,
				Error:   "未提供认证令牌",
			})
			c.Abort()
			return
		}

		// 移除 Bearer 前缀
		if strings.HasPrefix(tokenString, "Bearer ") {
			tokenString = strings.TrimPrefix(tokenString, "Bearer ")
		}

		// 获取JWT密钥
		jwtSecret := os.Getenv("JWT_SECRET")
		if jwtSecret == "" {
			jwtSecret = "claw-panel-secret-key-change-in-production"
		}

		// 解析令牌
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, models.APIResponse{
				Success: false,
				Error:   "无效的认证令牌",
			})
			c.Abort()
			return
		}

		// 提取用户信息
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			c.Set("userID", claims["sub"])
			c.Set("username", claims["username"])
		}

		c.Next()
	}
}
