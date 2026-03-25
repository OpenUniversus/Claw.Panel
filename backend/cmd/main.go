package main

import (
	"log"
	"os"

	"github.com/clawpanel/backend/internal/config"
	"github.com/clawpanel/backend/internal/handlers"
	"github.com/clawpanel/backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	// 加载配置
	cfg := config.Load()
	
	// 设置运行模式
	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 创建路由
	r := gin.Default()

	// CORS 中间件
	r.Use(middleware.CORS())

	// 公开路由
	public := r.Group("/api")
	{
		// 认证
		public.POST("/auth/login", handlers.Login)
		public.POST("/auth/logout", handlers.Logout)
		
		// 健康检查
		public.GET("/health", handlers.HealthCheck)
	}

	// 需要认证的路由
	auth := r.Group("/api")
	auth.Use(middleware.AuthRequired())
	{
		// 仪表盘
		auth.GET("/dashboard/status", handlers.GetDashboardStatus)
		auth.GET("/dashboard/resources", handlers.GetResourceHistory)

		// 容器管理
		auth.GET("/containers", handlers.ListContainers)
		auth.GET("/containers/images", handlers.ListImages)
		auth.POST("/containers/:id/start", handlers.StartContainer)
		auth.POST("/containers/:id/stop", handlers.StopContainer)
		auth.POST("/containers/:id/restart", handlers.RestartContainer)
		auth.DELETE("/containers/:id", handlers.RemoveContainer)

		// 网站管理
		auth.GET("/websites", handlers.ListWebsites)
		auth.POST("/websites", handlers.CreateWebsite)
		auth.PUT("/websites/:id", handlers.UpdateWebsite)
		auth.DELETE("/websites/:id", handlers.DeleteWebsite)

		// 数据库管理
		auth.GET("/databases", handlers.ListDatabases)
		auth.POST("/databases", handlers.CreateDatabase)
		auth.POST("/databases/:id/start", handlers.StartDatabase)
		auth.POST("/databases/:id/stop", handlers.StopDatabase)
		auth.DELETE("/databases/:id", handlers.DeleteDatabase)

		// 计划任务
		auth.GET("/cronjobs", handlers.ListCronJobs)
		auth.POST("/cronjobs", handlers.CreateCronJob)
		auth.PUT("/cronjobs/:id", handlers.UpdateCronJob)
		auth.POST("/cronjobs/:id/toggle", handlers.ToggleCronJob)
		auth.DELETE("/cronjobs/:id", handlers.DeleteCronJob)

		// 应用商店
		auth.GET("/apps", handlers.ListApps)
		auth.POST("/apps/:id/install", handlers.InstallApp)
		auth.DELETE("/apps/:id", handlers.UninstallApp)

		// AI 模块
		auth.GET("/ai/models", handlers.ListAIModels)
		auth.POST("/ai/models", handlers.AddAIModel)
		auth.PUT("/ai/models/:id", handlers.UpdateAIModel)
		auth.DELETE("/ai/models/:id", handlers.DeleteAIModel)

		auth.GET("/ai/agents", handlers.ListAIAgents)
		auth.POST("/ai/agents", handlers.CreateAIAgent)
		auth.PUT("/ai/agents/:id", handlers.UpdateAIAgent)
		auth.DELETE("/ai/agents/:id", handlers.DeleteAIAgent)

		auth.POST("/ai/chat/completions", handlers.ChatCompletion)

		// 日志
		auth.GET("/logs", handlers.ListLogs)

		// 系统设置
		auth.GET("/settings", handlers.GetSettings)
		auth.PUT("/settings", handlers.UpdateSettings)
	}

	// 获取端口
	port := os.Getenv("DEPLOY_RUN_PORT")
	if port == "" {
		port = "5000"
	}

	// 启动服务
	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
