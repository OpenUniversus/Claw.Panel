package handlers

import (
	"net/http"
	"time"

	"github.com/clawpanel/backend/internal/models"
	"github.com/gin-gonic/gin"
)

// Website handlers

// ListWebsites 列出网站
func ListWebsites(c *gin.Context) {
	websites := []models.Website{
		{
			ID:        "web-1",
			Name:      "example.com",
			Domains:   []string{"example.com", "www.example.com"},
			Status:    "running",
			SSL:       true,
			SSLExpiry: strPtr("2024-12-31"),
			WebServer: "nginx",
			AppType:   "static",
			CreatedAt: time.Now().Add(-24 * time.Hour),
		},
		{
			ID:        "web-2",
			Name:      "api.example.com",
			Domains:   []string{"api.example.com"},
			Status:    "running",
			SSL:       true,
			SSLExpiry: strPtr("2024-11-30"),
			WebServer: "nginx",
			AppType:   "nodejs",
			CreatedAt: time.Now().Add(-48 * time.Hour),
		},
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    websites,
	})
}

// CreateWebsite 创建网站
func CreateWebsite(c *gin.Context) {
	var website models.Website
	if err := c.ShouldBindJSON(&website); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	website.ID = "web-" + time.Now().Format("20060102150405")
	website.CreatedAt = time.Now()

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    website,
	})
}

// UpdateWebsite 更新网站
func UpdateWebsite(c *gin.Context) {
	id := c.Param("id")
	var updates models.Website
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	updates.ID = id
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    updates,
	})
}

// DeleteWebsite 删除网站
func DeleteWebsite(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "网站 " + id + " 已删除"},
	})
}

// Database handlers

// ListDatabases 列出数据库
func ListDatabases(c *gin.Context) {
	databases := []models.Database{
		{
			ID:            "db-1",
			Name:          "MySQL Production",
			Type:          "mysql",
			Version:       "8.0",
			Status:        "running",
			Port:          3306,
			ContainerName: "mysql-prod",
			Databases:     []string{"users", "products", "orders"},
			Size:          1024 * 1024 * 512,
			CreatedAt:     time.Now().Add(-24 * time.Hour),
		},
		{
			ID:            "db-2",
			Name:          "Redis Cache",
			Type:          "redis",
			Version:       "7.0",
			Status:        "running",
			Port:          6379,
			ContainerName: "redis-cache",
			Databases:     []string{"cache", "session"},
			Size:          1024 * 1024 * 128,
			CreatedAt:     time.Now().Add(-48 * time.Hour),
		},
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    databases,
	})
}

// CreateDatabase 创建数据库
func CreateDatabase(c *gin.Context) {
	var db models.Database
	if err := c.ShouldBindJSON(&db); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	db.ID = "db-" + time.Now().Format("20060102150405")
	db.CreatedAt = time.Now()

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    db,
	})
}

// StartDatabase 启动数据库
func StartDatabase(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "数据库 " + id + " 已启动"},
	})
}

// StopDatabase 停止数据库
func StopDatabase(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "数据库 " + id + " 已停止"},
	})
}

// DeleteDatabase 删除数据库
func DeleteDatabase(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "数据库 " + id + " 已删除"},
	})
}

// CronJob handlers

// ListCronJobs 列出计划任务
func ListCronJobs(c *gin.Context) {
	jobs := []models.CronJob{
		{
			ID:         "cron-1",
			Name:       "数据库备份",
			Command:    "/usr/local/bin/backup.sh",
			Schedule:   "0 2 * * *",
			Status:     "enabled",
			LastRun:    strPtr(time.Now().Add(-22 * time.Hour).Format(time.RFC3339)),
			NextRun:    strPtr(time.Now().Add(2 * time.Hour).Format(time.RFC3339)),
			LastStatus: strPtr("success"),
			CreatedAt:  time.Now().Add(-7 * 24 * time.Hour),
		},
		{
			ID:         "cron-2",
			Name:       "日志清理",
			Command:    "/usr/local/bin/clean-logs.sh",
			Schedule:   "0 3 * * 0",
			Status:     "enabled",
			LastRun:    strPtr(time.Now().Add(-3 * 24 * time.Hour).Format(time.RFC3339)),
			NextRun:    strPtr(time.Now().Add(4 * 24 * time.Hour).Format(time.RFC3339)),
			LastStatus: strPtr("success"),
			CreatedAt:  time.Now().Add(-14 * 24 * time.Hour),
		},
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    jobs,
	})
}

// CreateCronJob 创建计划任务
func CreateCronJob(c *gin.Context) {
	var job models.CronJob
	if err := c.ShouldBindJSON(&job); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	job.ID = "cron-" + time.Now().Format("20060102150405")
	job.CreatedAt = time.Now()

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    job,
	})
}

// UpdateCronJob 更新计划任务
func UpdateCronJob(c *gin.Context) {
	id := c.Param("id")
	var updates models.CronJob
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	updates.ID = id
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    updates,
	})
}

// ToggleCronJob 切换计划任务状态
func ToggleCronJob(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Enabled bool `json:"enabled"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	status := "enabled"
	if !req.Enabled {
		status = "disabled"
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "计划任务 " + id + " 已" + status},
	})
}

// DeleteCronJob 删除计划任务
func DeleteCronJob(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "计划任务 " + id + " 已删除"},
	})
}

// App handlers

// ListApps 列出应用
func ListApps(c *gin.Context) {
	apps := []models.App{
		{
			ID:          "app-1",
			Name:        "Nginx Proxy Manager",
			Description: "轻松管理 Nginx 反向代理",
			Icon:        "nginx",
			Category:    "proxy",
			Version:     "2.10.4",
			Tags:        []string{"proxy", "nginx", "ssl"},
			DockerImage: "jc21/nginx-proxy-manager:latest",
			Installed:   true,
		},
		{
			ID:          "app-2",
			Name:        "Portainer",
			Description: "Docker 容器管理界面",
			Icon:        "docker",
			Category:    "management",
			Version:     "2.19.4",
			Tags:        []string{"docker", "management"},
			DockerImage: "portainer/portainer-ce:latest",
			Installed:   true,
		},
		{
			ID:          "app-3",
			Name:        "Grafana",
			Description: "开源监控和数据可视化平台",
			Icon:        "chart",
			Category:    "monitoring",
			Version:     "10.2.0",
			Tags:        []string{"monitoring", "dashboard"},
			DockerImage: "grafana/grafana:latest",
			Installed:   false,
		},
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    apps,
	})
}

// InstallApp 安装应用
func InstallApp(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "应用 " + id + " 已安装"},
	})
}

// UninstallApp 卸载应用
func UninstallApp(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "应用 " + id + " 已卸载"},
	})
}

// Log handlers

// ListLogs 列出日志
func ListLogs(c *gin.Context) {
	logs := []map[string]interface{}{
		{
			"id":        "log-1",
			"level":     "info",
			"source":    "system",
			"message":   "系统启动成功",
			"timestamp": time.Now().Add(-1 * time.Hour),
		},
		{
			"id":        "log-2",
			"level":     "warn",
			"source":    "nginx",
			"message":   "SSL 证书即将过期",
			"timestamp": time.Now().Add(-2 * time.Hour),
		},
		{
			"id":        "log-3",
			"level":     "error",
			"source":    "database",
			"message":   "数据库连接超时",
			"timestamp": time.Now().Add(-3 * time.Hour),
		},
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    logs,
	})
}

// Settings handlers

// GetSettings 获取设置
func GetSettings(c *gin.Context) {
	settings := map[string]interface{}{
		"siteName":       "Claw Panel",
		"language":       "zh-CN",
		"timezone":       "Asia/Shanghai",
		"autoBackup":     true,
		"backupInterval": "daily",
		"logRetention":   30,
		"notifications": map[string]bool{
			"email": true,
			"slack": false,
		},
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    settings,
	})
}

// UpdateSettings 更新设置
func UpdateSettings(c *gin.Context) {
	var settings map[string]interface{}
	if err := c.ShouldBindJSON(&settings); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    settings,
	})
}

// 辅助函数
func strPtr(s string) *string {
	return &s
}
