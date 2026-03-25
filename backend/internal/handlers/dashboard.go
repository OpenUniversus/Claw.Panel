package handlers

import (
	"net/http"
	"time"

	"github.com/clawpanel/backend/internal/models"
	"github.com/gin-gonic/gin"
)

// GetDashboardStatus 获取仪表盘状态
func GetDashboardStatus(c *gin.Context) {
	status := models.DashboardStatus{
		CPU:      randomInt(20, 60),
		Memory:   randomInt(40, 80),
		Disk:     randomInt(30, 70),
		Uptime:   1234567,
		Hostname: "claw-panel-server",
		OS:       "Ubuntu 22.04 LTS",
		Kernel:   "5.15.0-76-generic",
		Containers: models.ContainerStats{
			Total:   12,
			Running: 8,
			Stopped: 4,
		},
		Websites: models.WebsiteStats{
			Total:  6,
			Active: 5,
		},
		Databases: models.DatabaseStats{
			Total:  3,
			Active: 3,
		},
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    status,
	})
}

// GetResourceHistory 获取资源历史
func GetResourceHistory(c *gin.Context) {
	cpu := make([]int, 60)
	memory := make([]int, 60)

	for i := 0; i < 60; i++ {
		cpu[i] = randomInt(20, 50)
		memory[i] = randomInt(40, 70)
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data: map[string]interface{}{
			"cpu":    cpu,
			"memory": memory,
		},
	})
}

// 模拟容器数据
var mockContainers = []models.Container{
	{
		ID:        "container-1",
		Name:      "nginx-proxy",
		Image:     "nginx:alpine",
		Status:    "running",
		State:     "running",
		Ports:     []string{"80:80", "443:443"},
		CPU:       2.5,
		Memory:    45.2,
		CreatedAt: time.Now().Add(-24 * time.Hour),
	},
	{
		ID:        "container-2",
		Name:      "mysql-db",
		Image:     "mysql:8.0",
		Status:    "running",
		State:     "running",
		Ports:     []string{"3306:3306"},
		CPU:       8.3,
		Memory:    512.5,
		CreatedAt: time.Now().Add(-48 * time.Hour),
	},
	{
		ID:        "container-3",
		Name:      "redis-cache",
		Image:     "redis:7-alpine",
		Status:    "running",
		State:     "running",
		Ports:     []string{"6379:6379"},
		CPU:       1.2,
		Memory:    32.1,
		CreatedAt: time.Now().Add(-72 * time.Hour),
	},
	{
		ID:        "container-4",
		Name:      "ollama-ai",
		Image:     "ollama/ollama:latest",
		Status:    "running",
		State:     "running",
		Ports:     []string{"11434:11434"},
		CPU:       25.3,
		Memory:    2048.0,
		CreatedAt: time.Now().Add(-96 * time.Hour),
	},
	{
		ID:        "container-5",
		Name:      "mongodb",
		Image:     "mongo:7",
		Status:    "exited",
		State:     "exited",
		Ports:     []string{"27017:27017"},
		CPU:       0,
		Memory:    0,
		CreatedAt: time.Now().Add(-120 * time.Hour),
	},
}

// ListContainers 列出容器
func ListContainers(c *gin.Context) {
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    mockContainers,
	})
}

// ListImages 列出镜像
func ListImages(c *gin.Context) {
	images := []map[string]interface{}{
		{
			"id":      "image-1",
			"name":    "nginx",
			"tag":     "alpine",
			"size":    "25.2 MB",
			"created": time.Now().Add(-24 * time.Hour),
			"used":    true,
		},
		{
			"id":      "image-2",
			"name":    "mysql",
			"tag":     "8.0",
			"size":    "546.2 MB",
			"created": time.Now().Add(-48 * time.Hour),
			"used":    true,
		},
		{
			"id":      "image-3",
			"name":    "redis",
			"tag":     "7-alpine",
			"size":    "32.5 MB",
			"created": time.Now().Add(-72 * time.Hour),
			"used":    true,
		},
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    images,
	})
}

// StartContainer 启动容器
func StartContainer(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "容器 " + id + " 已启动"},
	})
}

// StopContainer 停止容器
func StopContainer(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "容器 " + id + " 已停止"},
	})
}

// RestartContainer 重启容器
func RestartContainer(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "容器 " + id + " 已重启"},
	})
}

// RemoveContainer 删除容器
func RemoveContainer(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "容器 " + id + " 已删除"},
	})
}

// 辅助函数
func randomInt(min, max int) int {
	return min + int(time.Now().UnixNano()%int64(max-min))
}
