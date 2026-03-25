.PHONY: test build run clean

# 运行测试
test:
	go test -v ./tests/...

# 构建
build:
	go build -o bin/clawpanel ./cmd

# 运行
run:
	go run ./cmd

# 清理
clean:
	rm -rf bin/
	go clean

# 安装依赖
deps:
	go mod download
	go mod tidy

# 代码检查
lint:
	go fmt ./...
	go vet ./...

# 覆盖率测试
coverage:
	go test -v -coverprofile=coverage.out ./tests/...
	go tool cover -html=coverage.out -o coverage.html
