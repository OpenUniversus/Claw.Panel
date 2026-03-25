package config

import "os"

type Config struct {
	Env        string
	Port       string
	JWTSecret  string
	DBPath     string
}

func Load() *Config {
	env := os.Getenv("COZE_PROJECT_ENV")
	if env == "" {
		env = "development"
	}
	
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "claw-panel-secret-key-change-in-production"
	}

	return &Config{
		Env:       env,
		Port:      os.Getenv("DEPLOY_RUN_PORT"),
		JWTSecret: jwtSecret,
		DBPath:    "/tmp/clawpanel.db",
	}
}
