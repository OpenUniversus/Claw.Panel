package handlers

import (
	"net/http"
	"time"

	"github.com/clawpanel/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// 模拟用户数据
var mockUser = models.User{
	ID:        "1",
	Username:  "admin",
	Role:      "admin",
	CreatedAt: time.Now(),
}

// 预设密码的哈希值（admin123）
var passwordHash, _ = bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)

// Login 登录处理
func Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	// 验证用户名和密码
	if req.Username != mockUser.Username {
		c.JSON(http.StatusUnauthorized, models.APIResponse{
			Success: false,
			Error:   "用户名或密码错误",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword(passwordHash, []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, models.APIResponse{
			Success: false,
			Error:   "用户名或密码错误",
		})
		return
	}

	// 生成JWT令牌
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":      mockUser.ID,
		"username": mockUser.Username,
		"role":     mockUser.Role,
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte("claw-panel-secret-key-change-in-production"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "生成令牌失败",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data: models.LoginResponse{
			Token: tokenString,
			User:  mockUser,
		},
	})
}

// Logout 登出处理
func Logout(c *gin.Context) {
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "登出成功"},
	})
}

// HealthCheck 健康检查
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data: map[string]interface{}{
			"status":    "healthy",
			"timestamp": time.Now().Unix(),
			"version":   "1.0.0",
		},
	})
}
