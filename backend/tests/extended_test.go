package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/clawpanel/backend/internal/handlers"
	"github.com/clawpanel/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// 测试文件管理接口
func TestListFiles(t *testing.T) {
	router := gin.New()
	router.GET("/files", handlers.ListFiles)

	req, _ := http.NewRequest("GET", "/files?path=/", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

func TestReadFile(t *testing.T) {
	router := gin.New()
	router.GET("/files/read", handlers.ReadFile)

	req, _ := http.NewRequest("GET", "/files/read?path=/etc/config.yml", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

func TestWriteFile(t *testing.T) {
	router := gin.New()
	router.POST("/files/write", handlers.WriteFile)

	fileReq := map[string]string{
		"path":    "/tmp/test.txt",
		"content": "Hello, World!",
	}
	body, _ := json.Marshal(fileReq)

	req, _ := http.NewRequest("POST", "/files/write", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试用户管理接口
func TestListUsers(t *testing.T) {
	router := gin.New()
	router.GET("/users", handlers.ListUsers)

	req, _ := http.NewRequest("GET", "/users", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)

	data, ok := response.Data.([]interface{})
	assert.True(t, ok)
	assert.Greater(t, len(data), 0)
}

func TestCreateUser(t *testing.T) {
	router := gin.New()
	router.POST("/users", handlers.CreateUser)

	userReq := map[string]string{
		"username": "testuser",
		"email":    "test@example.com",
		"role":     "operator",
	}
	body, _ := json.Marshal(userReq)

	req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

func TestUpdateUser(t *testing.T) {
	router := gin.New()
	router.PUT("/users/:id", handlers.UpdateUser)

	userReq := map[string]string{
		"username": "testuser",
		"email":    "test@example.com",
		"role":     "admin",
	}
	body, _ := json.Marshal(userReq)

	req, _ := http.NewRequest("PUT", "/users/user-1", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

func TestDeleteUser(t *testing.T) {
	router := gin.New()
	router.DELETE("/users/:id", handlers.DeleteUser)

	req, _ := http.NewRequest("DELETE", "/users/user-1", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试备份管理接口
func TestListBackups(t *testing.T) {
	router := gin.New()
	router.GET("/backups", handlers.ListBackups)

	req, _ := http.NewRequest("GET", "/backups", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)

	data, ok := response.Data.([]interface{})
	assert.True(t, ok)
	assert.Greater(t, len(data), 0)
}

func TestCreateBackup(t *testing.T) {
	router := gin.New()
	router.POST("/backups", handlers.CreateBackup)

	backupReq := map[string]string{
		"type": "full",
		"name": "test-backup",
	}
	body, _ := json.Marshal(backupReq)

	req, _ := http.NewRequest("POST", "/backups", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

func TestRestoreBackup(t *testing.T) {
	router := gin.New()
	router.POST("/backups/:id/restore", handlers.RestoreBackup)

	req, _ := http.NewRequest("POST", "/backups/backup-1/restore", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

func TestDeleteBackup(t *testing.T) {
	router := gin.New()
	router.DELETE("/backups/:id", handlers.DeleteBackup)

	req, _ := http.NewRequest("DELETE", "/backups/backup-1", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

// 测试文件写入缺少参数
func TestWriteFileMissingParams(t *testing.T) {
	router := gin.New()
	router.POST("/files/write", handlers.WriteFile)

	fileReq := map[string]string{
		"content": "Hello",
	}
	body, _ := json.Marshal(fileReq)

	req, _ := http.NewRequest("POST", "/files/write", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

// 测试创建备份缺少参数（空参数应该能成功）
func TestCreateBackupEmptyParams(t *testing.T) {
	router := gin.New()
	router.POST("/backups", handlers.CreateBackup)

	backupReq := map[string]string{}
	body, _ := json.Marshal(backupReq)

	req, _ := http.NewRequest("POST", "/backups", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}
