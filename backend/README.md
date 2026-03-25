# Claw Panel Backend

基于 Golang + Gin 构建的现代化服务器运维管理面板后端服务。

## 技术栈

- **Go 1.21+**
- **Gin** - Web 框架
- **JWT** - 身份认证
- **bcrypt** - 密码加密
- **GORM** - ORM（可选）

## 项目结构

```
backend/
├── cmd/
│   └── main.go              # 应用入口
├── internal/
│   ├── config/
│   │   └── config.go        # 配置管理
│   ├── handlers/
│   │   ├── auth.go          # 认证处理
│   │   ├── dashboard.go     # 仪表盘处理
│   │   ├── ai.go            # AI 模块处理
│   │   └── resources.go     # 资源处理
│   ├── middleware/
│   │   └── auth.go          # 认证中间件
│   └── models/
│       └── models.go        # 数据模型
├── pkg/
│   └── utils/               # 工具函数
├── tests/
│   └── handlers_test.go     # 测试用例
├── go.mod
├── Makefile
└── README.md
```

## 快速开始

### 安装依赖

```bash
make deps
# 或
go mod download
```

### 运行开发服务器

```bash
make run
# 或
go run ./cmd
```

服务默认运行在端口 5000。

### 运行测试

```bash
make test
# 或
go test -v ./tests/...
```

### 构建生产版本

```bash
make build
```

## API 接口

### 公开接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/auth/login` | 用户登录 |
| POST | `/api/auth/logout` | 用户登出 |
| GET | `/api/health` | 健康检查 |

### 认证接口（需要 JWT Token）

#### 仪表盘
- `GET /api/dashboard/status` - 获取系统状态
- `GET /api/dashboard/resources` - 获取资源历史

#### 容器管理
- `GET /api/containers` - 列出容器
- `GET /api/containers/images` - 列出镜像
- `POST /api/containers/:id/start` - 启动容器
- `POST /api/containers/:id/stop` - 停止容器
- `POST /api/containers/:id/restart` - 重启容器
- `DELETE /api/containers/:id` - 删除容器

#### 网站管理
- `GET /api/websites` - 列出网站
- `POST /api/websites` - 创建网站
- `PUT /api/websites/:id` - 更新网站
- `DELETE /api/websites/:id` - 删除网站

#### 数据库管理
- `GET /api/databases` - 列出数据库
- `POST /api/databases` - 创建数据库
- `POST /api/databases/:id/start` - 启动数据库
- `POST /api/databases/:id/stop` - 停止数据库
- `DELETE /api/databases/:id` - 删除数据库

#### 计划任务
- `GET /api/cronjobs` - 列出计划任务
- `POST /api/cronjobs` - 创建计划任务
- `PUT /api/cronjobs/:id` - 更新计划任务
- `POST /api/cronjobs/:id/toggle` - 切换状态
- `DELETE /api/cronjobs/:id` - 删除计划任务

#### 应用商店
- `GET /api/apps` - 列出应用
- `POST /api/apps/:id/install` - 安装应用
- `DELETE /api/apps/:id` - 卸载应用

#### AI 模块
- `GET /api/ai/models` - 列出 AI 模型
- `POST /api/ai/models` - 添加 AI 模型
- `PUT /api/ai/models/:id` - 更新 AI 模型
- `DELETE /api/ai/models/:id` - 删除 AI 模型
- `GET /api/ai/agents` - 列出 AI 智能体
- `POST /api/ai/agents` - 创建 AI 智能体
- `PUT /api/ai/agents/:id` - 更新 AI 智能体
- `DELETE /api/ai/agents/:id` - 删除 AI 智能体
- `POST /api/ai/chat/completions` - AI 聊天（支持流式）

#### 日志
- `GET /api/logs` - 列出日志

#### 系统设置
- `GET /api/settings` - 获取设置
- `PUT /api/settings` - 更新设置

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DEPLOY_RUN_PORT` | 服务端口 | 5000 |
| `COZE_PROJECT_ENV` | 运行环境 | development |
| `JWT_SECRET` | JWT 密钥 | claw-panel-secret-key-change-in-production |

## 默认账号

- 用户名: `admin`
- 密码: `admin123`

## 测试覆盖

运行测试覆盖率报告：

```bash
make coverage
```

生成的 HTML 报告将保存为 `coverage.html`。

## License

MIT
