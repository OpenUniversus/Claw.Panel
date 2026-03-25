package handlers

import (
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"github.com/clawpanel/backend/internal/models"
	"github.com/gin-gonic/gin"
)

// WebSocket 消息类型
type WSMessage struct {
	Type    string      `json:"type"`
	Data    interface{} `json:"data"`
	Time    int64       `json:"time"`
}

// 监控数据
type MonitorData struct {
	CPU     []int `json:"cpu"`
	Memory  []int `json:"memory"`
	Disk    []int `json:"disk"`
	Network struct {
		RX []int `json:"rx"`
		TX []int `json:"tx"`
	} `json:"network"`
}

// 日志流
type LogStream struct {
	ID        string `json:"id"`
	Level     string `json:"level"`
	Source    string `json:"source"`
	Message   string `json:"message"`
	Timestamp int64  `json:"timestamp"`
}

// WebSocket 客户端管理
type WSClient struct {
	ID      string
	Send    chan []byte
	Receive chan []byte
}

type WSClientManager struct {
	Clients    map[string]*WSClient
	Register   chan *WSClient
	Unregister chan *WSClient
	Broadcast  chan []byte
	mu         sync.RWMutex
}

var WSManager = &WSClientManager{
	Clients:    make(map[string]*WSClient),
	Register:   make(chan *WSClient),
	Unregister: make(chan *WSClient),
	Broadcast:  make(chan []byte, 100),
}

// 启动 WebSocket 管理器
func (m *WSClientManager) Run() {
	for {
		select {
		case client := <-m.Register:
			m.mu.Lock()
			m.Clients[client.ID] = client
			m.mu.Unlock()

		case client := <-m.Unregister:
			m.mu.Lock()
			if _, ok := m.Clients[client.ID]; ok {
				delete(m.Clients, client.ID)
				close(client.Send)
			}
			m.mu.Unlock()

		case message := <-m.Broadcast:
			m.mu.RLock()
			for _, client := range m.Clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(m.Clients, client.ID)
				}
			}
			m.mu.RUnlock()
		}
	}
}

// 系统监控 WebSocket
func SystemMonitor(c *gin.Context) {
	// 升级为 WebSocket 连接
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	client := &WSClient{
		ID:      generateClientID(),
		Send:    make(chan []byte, 10),
		Receive: make(chan []byte, 10),
	}

	WSManager.Register <- client
	defer func() {
		WSManager.Unregister <- client
	}()

	// 发送数据协程
	go func() {
		ticker := time.NewTicker(2 * time.Second)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				data := MonitorData{
					CPU:    generateRandomArray(1, 60, 60),
					Memory: generateRandomArray(40, 60, 60),
					Disk:   generateRandomArray(30, 50, 60),
				}
				data.Network.RX = generateRandomArray(100, 500, 60)
				data.Network.TX = generateRandomArray(50, 200, 60)

				msg := WSMessage{
					Type: "monitor",
					Data: data,
					Time: time.Now().Unix(),
				}

				jsonData, _ := json.Marshal(msg)
				WSManager.Broadcast <- jsonData
			}
		}
	}()

	// 读取客户端消息
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}

// 日志流 WebSocket
func LogStreamWS(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	// 模拟日志流
	go func() {
		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()

		levels := []string{"info", "warn", "error", "debug"}
		sources := []string{"system", "nginx", "mysql", "redis", "docker"}
		messages := []string{
			"系统运行正常",
			"请求处理完成",
			"数据库连接成功",
			"缓存更新完成",
			"容器状态检查",
			"SSL 证书即将过期",
			"内存使用率较高",
			"请求超时",
		}

		for range ticker.C {
			log := LogStream{
				ID:        generateClientID(),
				Level:     levels[randomInt(0, len(levels)-1)],
				Source:    sources[randomInt(0, len(sources)-1)],
				Message:   messages[randomInt(0, len(messages)-1)],
				Timestamp: time.Now().Unix(),
			}

			msg := WSMessage{
				Type: "log",
				Data: log,
				Time: time.Now().Unix(),
			}

			jsonData, _ := json.Marshal(msg)
			conn.WriteMessage(1, jsonData)
		}
	}()

	// 保持连接
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}

// 终端 WebSocket
func TerminalWS(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	// 模拟终端交互
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			break
		}

		// 回显消息
		response := WSMessage{
			Type: "terminal",
			Data: map[string]string{
				"output": "Command executed: " + string(msg),
			},
			Time: time.Now().Unix(),
		}

		jsonData, _ := json.Marshal(response)
		conn.WriteMessage(1, jsonData)
	}
}

// 文件管理接口
type FileItem struct {
	Name      string    `json:"name"`
	Path      string    `json:"path"`
	IsDir     bool      `json:"isDir"`
	Size      int64     `json:"size"`
	Mode      string    `json:"mode"`
	ModTime   time.Time `json:"modTime"`
}

// ListFiles 列出文件
func ListFiles(c *gin.Context) {
	path := c.Query("path")
	if path == "" {
		path = "/"
	}

	// 模拟文件列表
	files := []FileItem{
		{Name: "etc", Path: "/etc", IsDir: true, Size: 4096, Mode: "drwxr-xr-x", ModTime: time.Now()},
		{Name: "var", Path: "/var", IsDir: true, Size: 4096, Mode: "drwxr-xr-x", ModTime: time.Now()},
		{Name: "home", Path: "/home", IsDir: true, Size: 4096, Mode: "drwxr-xr-x", ModTime: time.Now()},
		{Name: "root", Path: "/root", IsDir: true, Size: 4096, Mode: "drwx------", ModTime: time.Now()},
		{Name: "usr", Path: "/usr", IsDir: true, Size: 4096, Mode: "drwxr-xr-x", ModTime: time.Now()},
		{Name: "opt", Path: "/opt", IsDir: true, Size: 4096, Mode: "drwxr-xr-x", ModTime: time.Now()},
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data: map[string]interface{}{
			"path":  path,
			"files": files,
		},
	})
}

// ReadFile 读取文件内容
func ReadFile(c *gin.Context) {
	path := c.Query("path")

	// 模拟文件内容
	content := `# Claw Panel Configuration
server:
  port: 5000
  host: 0.0.0.0

database:
  type: sqlite
  path: /data/clawpanel.db

ai:
  enabled: true
  defaultModel: gpt-4o
`

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data: map[string]interface{}{
			"path":    path,
			"content": content,
		},
	})
}

// WriteFile 写入文件
func WriteFile(c *gin.Context) {
	var req struct {
		Path    string `json:"path" binding:"required"`
		Content string `json:"content"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "文件保存成功"},
	})
}

// 用户管理
type UserManage struct {
	ID       string    `json:"id"`
	Username string    `json:"username"`
	Email    string    `json:"email"`
	Role     string    `json:"role"`
	Status   string    `json:"status"`
	LastLogin *time.Time `json:"lastLogin,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
}

// ListUsers 列出用户
func ListUsers(c *gin.Context) {
	users := []UserManage{
		{
			ID:        "user-1",
			Username:  "admin",
			Email:     "admin@example.com",
			Role:      "admin",
			Status:    "active",
			LastLogin: timePtr(time.Now().Add(-1 * time.Hour)),
			CreatedAt: time.Now().Add(-30 * 24 * time.Hour),
		},
		{
			ID:        "user-2",
			Username:  "operator",
			Email:     "operator@example.com",
			Role:      "operator",
			Status:    "active",
			LastLogin: timePtr(time.Now().Add(-2 * time.Hour)),
			CreatedAt: time.Now().Add(-15 * 24 * time.Hour),
		},
		{
			ID:        "user-3",
			Username:  "viewer",
			Email:     "viewer@example.com",
			Role:      "viewer",
			Status:    "inactive",
			LastLogin: timePtr(time.Now().Add(-7 * 24 * time.Hour)),
			CreatedAt: time.Now().Add(-10 * 24 * time.Hour),
		},
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    users,
	})
}

// CreateUser 创建用户
func CreateUser(c *gin.Context) {
	var user UserManage
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	user.ID = "user-" + time.Now().Format("20060102150405")
	user.CreatedAt = time.Now()
	user.Status = "active"

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    user,
	})
}

// UpdateUser 更新用户
func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var updates UserManage
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

// DeleteUser 删除用户
func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "用户 " + id + " 已删除"},
	})
}

// 系统备份与恢复
type Backup struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Size      string    `json:"size"`
	Type      string    `json:"type"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
}

// ListBackups 列出备份
func ListBackups(c *gin.Context) {
	backups := []Backup{
		{
			ID:        "backup-1",
			Name:      "系统备份-20260325-001",
			Size:      "256 MB",
			Type:      "full",
			Status:    "completed",
			CreatedAt: time.Now().Add(-24 * time.Hour),
		},
		{
			ID:        "backup-2",
			Name:      "数据库备份-20260325-001",
			Size:      "128 MB",
			Type:      "database",
			Status:    "completed",
			CreatedAt: time.Now().Add(-12 * time.Hour),
		},
		{
			ID:        "backup-3",
			Name:      "配置备份-20260325-001",
			Size:      "16 MB",
			Type:      "config",
			Status:    "completed",
			CreatedAt: time.Now().Add(-6 * time.Hour),
		},
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    backups,
	})
}

// CreateBackup 创建备份
func CreateBackup(c *gin.Context) {
	var req struct {
		Type string `json:"type"`
		Name string `json:"name"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	backup := Backup{
		ID:        "backup-" + time.Now().Format("20060102150405"),
		Name:      req.Name,
		Size:      "0 MB",
		Type:      req.Type,
		Status:    "running",
		CreatedAt: time.Now(),
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    backup,
	})
}

// RestoreBackup 恢复备份
func RestoreBackup(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "备份 " + id + " 恢复中"},
	})
}

// DeleteBackup 删除备份
func DeleteBackup(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    map[string]string{"message": "备份 " + id + " 已删除"},
	})
}

// 辅助函数
func generateClientID() string {
	return time.Now().Format("20060102150405.999999")
}

func generateRandomArray(min, max, count int) []int {
	result := make([]int, count)
	for i := 0; i < count; i++ {
		result[i] = min + randomInt(0, max-min)
	}
	return result
}

func timePtr(t time.Time) *time.Time {
	return &t
}
