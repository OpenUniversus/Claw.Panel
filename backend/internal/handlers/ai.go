package handlers

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/clawpanel/backend/internal/models"
	"github.com/gin-gonic/gin"
)

// 模拟 AI 模型数据
var mockAIModels = []models.AIModel{
	{
		ID:            "model-1",
		Name:          "gpt-4o",
		DisplayName:   "GPT-4o",
		Provider:      "openai",
		Type:          "chat",
		ContextWindow: 128000,
		MaxOutput:     4096,
		Enabled:       true,
		CreatedAt:     time.Now().Add(-24 * time.Hour),
		UpdatedAt:     time.Now(),
	},
	{
		ID:            "model-2",
		Name:          "gpt-4-turbo",
		DisplayName:   "GPT-4 Turbo",
		Provider:      "openai",
		Type:          "chat",
		ContextWindow: 128000,
		MaxOutput:     4096,
		Enabled:       true,
		CreatedAt:     time.Now().Add(-48 * time.Hour),
		UpdatedAt:     time.Now(),
	},
	{
		ID:            "model-3",
		Name:          "claude-3-opus",
		DisplayName:   "Claude 3 Opus",
		Provider:      "anthropic",
		Type:          "chat",
		ContextWindow: 200000,
		MaxOutput:     4096,
		Enabled:       true,
		CreatedAt:     time.Now().Add(-72 * time.Hour),
		UpdatedAt:     time.Now(),
	},
	{
		ID:            "model-4",
		Name:          "llama3:70b",
		DisplayName:   "Llama 3 70B",
		Provider:      "ollama",
		Type:          "chat",
		ContextWindow: 8192,
		MaxOutput:     2048,
		Enabled:       true,
		CreatedAt:     time.Now().Add(-96 * time.Hour),
		UpdatedAt:     time.Now(),
	},
}

// 模拟 AI Agent 数据
var mockAIAgents = []models.AIAgent{
	{
		ID:           "agent-1",
		Name:         "系统运维助手",
		Description:  "专业的服务器运维助手，可以帮助诊断系统问题、优化配置、处理故障等",
		Model:        "gpt-4o",
		SystemPrompt: "你是一个专业的服务器运维助手...",
		Temperature:  0.7,
		MaxTokens:    4096,
		Tools:        []string{"terminal", "file_manager", "docker"},
		Enabled:      true,
		CreatedAt:    time.Now().Add(-24 * time.Hour),
		UpdatedAt:    time.Now(),
	},
	{
		ID:           "agent-2",
		Name:         "代码审查专家",
		Description:  "资深代码审查专家，可以审查代码质量、发现潜在问题、提供优化建议",
		Model:        "claude-3-opus",
		SystemPrompt: "你是一个资深的代码审查专家...",
		Temperature:  0.5,
		MaxTokens:    8192,
		Tools:        []string{"code_analyzer", "git"},
		Enabled:      true,
		CreatedAt:    time.Now().Add(-48 * time.Hour),
		UpdatedAt:    time.Now(),
	},
}

// ListAIModels 列出AI模型
func ListAIModels(c *gin.Context) {
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    mockAIModels,
	})
}

// AddAIModel 添加AI模型
func AddAIModel(c *gin.Context) {
	var model models.AIModel
	if err := c.ShouldBindJSON(&model); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	model.ID = fmt.Sprintf("model-%d", time.Now().Unix())
	model.CreatedAt = time.Now()
	model.UpdatedAt = time.Now()
	mockAIModels = append(mockAIModels, model)

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    model,
	})
}

// UpdateAIModel 更新AI模型
func UpdateAIModel(c *gin.Context) {
	id := c.Param("id")
	var updates models.AIModel
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	for i, model := range mockAIModels {
		if model.ID == id {
			updates.ID = id
			updates.UpdatedAt = time.Now()
			mockAIModels[i] = updates
			c.JSON(http.StatusOK, models.APIResponse{
				Success: true,
				Data:    updates,
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, models.APIResponse{
		Success: false,
		Error:   "模型不存在",
	})
}

// DeleteAIModel 删除AI模型
func DeleteAIModel(c *gin.Context) {
	id := c.Param("id")
	for i, model := range mockAIModels {
		if model.ID == id {
			mockAIModels = append(mockAIModels[:i], mockAIModels[i+1:]...)
			c.JSON(http.StatusOK, models.APIResponse{
				Success: true,
				Data:    map[string]string{"message": "模型已删除"},
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, models.APIResponse{
		Success: false,
		Error:   "模型不存在",
	})
}

// ListAIAgents 列出AI智能体
func ListAIAgents(c *gin.Context) {
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    mockAIAgents,
	})
}

// CreateAIAgent 创建AI智能体
func CreateAIAgent(c *gin.Context) {
	var agent models.AIAgent
	if err := c.ShouldBindJSON(&agent); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	agent.ID = fmt.Sprintf("agent-%d", time.Now().Unix())
	agent.CreatedAt = time.Now()
	agent.UpdatedAt = time.Now()
	mockAIAgents = append(mockAIAgents, agent)

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    agent,
	})
}

// UpdateAIAgent 更新AI智能体
func UpdateAIAgent(c *gin.Context) {
	id := c.Param("id")
	var updates models.AIAgent
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	for i, agent := range mockAIAgents {
		if agent.ID == id {
			updates.ID = id
			updates.UpdatedAt = time.Now()
			mockAIAgents[i] = updates
			c.JSON(http.StatusOK, models.APIResponse{
				Success: true,
				Data:    updates,
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, models.APIResponse{
		Success: false,
		Error:   "智能体不存在",
	})
}

// DeleteAIAgent 删除AI智能体
func DeleteAIAgent(c *gin.Context) {
	id := c.Param("id")
	for i, agent := range mockAIAgents {
		if agent.ID == id {
			mockAIAgents = append(mockAIAgents[:i], mockAIAgents[i+1:]...)
			c.JSON(http.StatusOK, models.APIResponse{
				Success: true,
				Data:    map[string]string{"message": "智能体已删除"},
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, models.APIResponse{
		Success: false,
		Error:   "智能体不存在",
	})
}

// ChatMessage 聊天消息
type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// ChatRequest 聊天请求
type ChatRequest struct {
	Messages []ChatMessage `json:"messages"`
	Model    string        `json:"model"`
	Stream   bool          `json:"stream"`
}

// ChatCompletion AI聊天补全（支持流式响应）
func ChatCompletion(c *gin.Context) {
	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "无效的请求数据",
		})
		return
	}

	// 生成模拟响应
	response := generateMockResponse(req.Messages)

	if req.Stream {
		// 流式响应
		c.Header("Content-Type", "text/event-stream")
		c.Header("Cache-Control", "no-cache")
		c.Header("Connection", "keep-alive")

		flusher, ok := c.Writer.(http.Flusher)
		if !ok {
			c.JSON(http.StatusInternalServerError, models.APIResponse{
				Success: false,
				Error:   "不支持流式响应",
			})
			return
		}

		reader := strings.NewReader(response)
		scanner := bufio.NewScanner(reader)

		for scanner.Scan() {
			word := scanner.Text()
			data, _ := json.Marshal(map[string]string{"content": word + " "})
			c.Writer.Write([]byte(fmt.Sprintf("data: %s\n\n", data)))
			flusher.Flush()
			time.Sleep(20 * time.Millisecond)
		}

		c.Writer.Write([]byte("data: [DONE]\n\n"))
		flusher.Flush()
	} else {
		// 非流式响应
		c.JSON(http.StatusOK, models.APIResponse{
			Success: true,
			Data: map[string]interface{}{
				"content": response,
				"model":   req.Model,
			},
		})
	}
}

func generateMockResponse(messages []ChatMessage) string {
	lastMsg := ""
	if len(messages) > 0 {
		lastMsg = strings.ToLower(messages[len(messages)-1].Content)
	}

	if strings.Contains(lastMsg, "容器") || strings.Contains(lastMsg, "docker") {
		return `关于容器管理，我可以帮助您：

1. **查看容器状态**：使用 docker ps 查看运行中的容器
2. **容器生命周期管理**：start、stop、restart、remove 等操作
3. **资源监控**：CPU、内存、网络等资源使用情况
4. **日志查看**：实时或历史日志分析

您需要我帮您执行什么操作？`
	}

	if strings.Contains(lastMsg, "数据库") || strings.Contains(lastMsg, "mysql") {
		return `关于数据库管理，我建议您：

1. **定期备份**：建议每天自动备份数据库
2. **性能优化**：分析慢查询日志，优化索引
3. **安全配置**：限制远程访问，使用强密码
4. **监控告警**：设置资源使用告警阈值

需要我帮您检查当前数据库状态吗？`
	}

	return `您好！我是 Claw Panel AI 助手，很高兴为您服务。

我可以帮助您：
- 🖥️ **服务器运维**：系统监控、日志分析、故障排查
- 🐳 **容器管理**：Docker 容器的创建、部署、监控
- 🗄️ **数据库管理**：MySQL、PostgreSQL、Redis 等数据库管理
- 🌐 **网站管理**：Nginx 配置、SSL 证书、域名管理

请告诉我您需要什么帮助？`
}
