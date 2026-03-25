package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/clawpanel/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func init() {
	gin.SetMode(gin.TestMode)
}

// 测试健康检查
func TestHealthCheck(t *testing.T) {
	router := gin.New()
	router.GET("/health", HealthCheck)

	req, _ := http.NewRequest("GET", "/health", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试登录 - 成功
func TestLoginSuccess(t *testing.T) {
	router := gin.New()
	router.POST("/auth/login", Login)

	loginReq := models.LoginRequest{
		Username: "admin",
		Password: "admin123",
	}
	body, _ := json.Marshal(loginReq)

	req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试登录 - 失败（错误密码）
func TestLoginFailure(t *testing.T) {
	router := gin.New()
	router.POST("/auth/login", Login)

	loginReq := models.LoginRequest{
		Username: "admin",
		Password: "wrongpassword",
	}
	body, _ := json.Marshal(loginReq)

	req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.False(t, response.Success)
	assert.Equal(t, "用户名或密码错误", response.Error)
}

// 测试登录 - 缺少参数
func TestLoginMissingParams(t *testing.T) {
	router := gin.New()
	router.POST("/auth/login", Login)

	loginReq := models.LoginRequest{
		Username: "",
		Password: "",
	}
	body, _ := json.Marshal(loginReq)

	req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

// 测试获取仪表盘状态
func TestGetDashboardStatus(t *testing.T) {
	router := gin.New()
	router.GET("/dashboard/status", GetDashboardStatus)

	req, _ := http.NewRequest("GET", "/dashboard/status", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)

	// 验证返回的数据包含必要字段
	data, ok := response.Data.(map[string]interface{})
	assert.True(t, ok)
	assert.Contains(t, data, "cpu")
	assert.Contains(t, data, "memory")
	assert.Contains(t, data, "disk")
}

// 测试获取资源历史
func TestGetResourceHistory(t *testing.T) {
	router := gin.New()
	router.GET("/dashboard/resources", GetResourceHistory)

	req, _ := http.NewRequest("GET", "/dashboard/resources", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)

	data, ok := response.Data.(map[string]interface{})
	assert.True(t, ok)
	assert.Contains(t, data, "cpu")
	assert.Contains(t, data, "memory")
}

// 测试列出容器
func TestListContainers(t *testing.T) {
	router := gin.New()
	router.GET("/containers", ListContainers)

	req, _ := http.NewRequest("GET", "/containers", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)

	// 验证返回的是数组
	data, ok := response.Data.([]interface{})
	assert.True(t, ok)
	assert.Greater(t, len(data), 0)
}

// 测试列出镜像
func TestListImages(t *testing.T) {
	router := gin.New()
	router.GET("/containers/images", ListImages)

	req, _ := http.NewRequest("GET", "/containers/images", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试容器操作
func TestContainerOperations(t *testing.T) {
	router := gin.New()
	router.POST("/containers/:id/start", StartContainer)
	router.POST("/containers/:id/stop", StopContainer)
	router.POST("/containers/:id/restart", RestartContainer)
	router.DELETE("/containers/:id", RemoveContainer)

	tests := []struct {
		method string
		path   string
	}{
		{"POST", "/containers/container-1/start"},
		{"POST", "/containers/container-1/stop"},
		{"POST", "/containers/container-1/restart"},
		{"DELETE", "/containers/container-1"},
	}

	for _, tt := range tests {
		req, _ := http.NewRequest(tt.method, tt.path, nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response models.APIResponse
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.True(t, response.Success)
	}
}

// 测试 AI 模型相关接口
func TestAIModels(t *testing.T) {
	router := gin.New()
	router.GET("/ai/models", ListAIModels)
	router.POST("/ai/models", AddAIModel)

	// 测试列出模型
	req, _ := http.NewRequest("GET", "/ai/models", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)

	// 测试添加模型
	newModel := map[string]interface{}{
		"name":          "test-model",
		"displayName":   "Test Model",
		"provider":      "openai",
		"type":          "chat",
		"contextWindow": 8192,
		"maxOutput":     2048,
		"enabled":       true,
	}
	body, _ := json.Marshal(newModel)

	req, _ = http.NewRequest("POST", "/ai/models", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试 AI Agent 相关接口
func TestAIAgents(t *testing.T) {
	router := gin.New()
	router.GET("/ai/agents", ListAIAgents)
	router.POST("/ai/agents", CreateAIAgent)

	// 测试列出智能体
	req, _ := http.NewRequest("GET", "/ai/agents", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)

	// 测试创建智能体
	newAgent := map[string]interface{}{
		"name":         "Test Agent",
		"description":  "Test Description",
		"model":        "gpt-4o",
		"systemPrompt": "You are a test agent",
		"temperature":  0.7,
		"maxTokens":    4096,
		"tools":        []string{"terminal"},
		"enabled":      true,
	}
	body, _ := json.Marshal(newAgent)

	req, _ = http.NewRequest("POST", "/ai/agents", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试网站相关接口
func TestWebsites(t *testing.T) {
	router := gin.New()
	router.GET("/websites", ListWebsites)
	router.POST("/websites", CreateWebsite)

	// 测试列出网站
	req, _ := http.NewRequest("GET", "/websites", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试数据库相关接口
func TestDatabases(t *testing.T) {
	router := gin.New()
	router.GET("/databases", ListDatabases)

	req, _ := http.NewRequest("GET", "/databases", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试计划任务相关接口
func TestCronJobs(t *testing.T) {
	router := gin.New()
	router.GET("/cronjobs", ListCronJobs)

	req, _ := http.NewRequest("GET", "/cronjobs", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试应用商店相关接口
func TestApps(t *testing.T) {
	router := gin.New()
	router.GET("/apps", ListApps)

	req, _ := http.NewRequest("GET", "/apps", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试日志相关接口
func TestLogs(t *testing.T) {
	router := gin.New()
	router.GET("/logs", ListLogs)

	req, _ := http.NewRequest("GET", "/logs", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试设置相关接口
func TestSettings(t *testing.T) {
	router := gin.New()
	router.GET("/settings", GetSettings)

	req, _ := http.NewRequest("GET", "/settings", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试 AI 聊天（非流式）
func TestChatCompletionNonStream(t *testing.T) {
	router := gin.New()
	router.POST("/ai/chat/completions", ChatCompletion)

	chatReq := ChatRequest{
		Messages: []ChatMessage{
			{Role: "user", Content: "你好"},
		},
		Model:  "gpt-4o",
		Stream: false,
	}
	body, _ := json.Marshal(chatReq)

	req, _ := http.NewRequest("POST", "/ai/chat/completions", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}
