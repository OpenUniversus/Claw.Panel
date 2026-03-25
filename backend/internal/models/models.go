package models

import "time"

// Container 容器模型
type Container struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Image       string    `json:"image"`
	Status      string    `json:"status"`
	State       string    `json:"state"`
	Ports       []string  `json:"ports"`
	CPU         float64   `json:"cpu"`
	Memory      float64   `json:"memory"`
	CreatedAt   time.Time `json:"createdAt"`
}

// Website 网站模型
type Website struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Domains     []string  `json:"domains"`
	Status      string    `json:"status"`
	SSL         bool      `json:"ssl"`
	SSLExpiry   *string   `json:"sslExpiry,omitempty"`
	WebServer   string    `json:"webServer"`
	AppType     string    `json:"appType"`
	CreatedAt   time.Time `json:"createdAt"`
}

// Database 数据库模型
type Database struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	Type          string    `json:"type"`
	Version       string    `json:"version"`
	Status        string    `json:"status"`
	Port          int       `json:"port"`
	ContainerName string    `json:"containerName,omitempty"`
	Databases     []string  `json:"databases"`
	Size          int64     `json:"size"`
	CreatedAt     time.Time `json:"createdAt"`
}

// CronJob 计划任务模型
type CronJob struct {
	ID         string    `json:"id"`
	Name       string    `json:"name"`
	Command    string    `json:"command"`
	Schedule   string    `json:"schedule"`
	Status     string    `json:"status"`
	LastRun    *string   `json:"lastRun,omitempty"`
	NextRun    *string   `json:"nextRun,omitempty"`
	LastStatus *string   `json:"lastStatus,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
}

// App 应用模型
type App struct {
	ID               string   `json:"id"`
	Name             string   `json:"name"`
	Description      string   `json:"description"`
	Icon             string   `json:"icon"`
	Category         string   `json:"category"`
	Version          string   `json:"version"`
	Tags             []string `json:"tags"`
	Website          string   `json:"website,omitempty"`
	GitHub           string   `json:"github,omitempty"`
	DockerImage      string   `json:"dockerImage"`
	Installed        bool     `json:"installed"`
	InstalledVersion string   `json:"installedVersion,omitempty"`
}

// AIModel AI模型
type AIModel struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	DisplayName   string    `json:"displayName"`
	Provider      string    `json:"provider"`
	Type          string    `json:"type"`
	ContextWindow int       `json:"contextWindow"`
	MaxOutput     int       `json:"maxOutput"`
	Enabled       bool      `json:"enabled"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

// AIAgent AI智能体
type AIAgent struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	Model        string    `json:"model"`
	SystemPrompt string    `json:"systemPrompt"`
	Temperature  float64   `json:"temperature"`
	MaxTokens    int       `json:"maxTokens"`
	Tools        []string  `json:"tools"`
	Enabled      bool      `json:"enabled"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// User 用户模型
type User struct {
	ID           string    `json:"id"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"createdAt"`
}

// DashboardStatus 仪表盘状态
type DashboardStatus struct {
	CPU      int            `json:"cpu"`
	Memory   int            `json:"memory"`
	Disk     int            `json:"disk"`
	Uptime   int64          `json:"uptime"`
	Hostname string         `json:"hostname"`
	OS       string         `json:"os"`
	Kernel   string         `json:"kernel"`
	Containers ContainerStats `json:"containers"`
	Websites  WebsiteStats   `json:"websites"`
	Databases DatabaseStats  `json:"databases"`
}

type ContainerStats struct {
	Total   int `json:"total"`
	Running int `json:"running"`
	Stopped int `json:"stopped"`
}

type WebsiteStats struct {
	Total  int `json:"total"`
	Active int `json:"active"`
}

type DatabaseStats struct {
	Total  int `json:"total"`
	Active int `json:"active"`
}

// APIResponse 通用API响应
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// LoginRequest 登录请求
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse 登录响应
type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
