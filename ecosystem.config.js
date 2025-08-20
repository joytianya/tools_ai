module.exports = {
  apps: [
    {
      name: 'matrixtools-web',
      script: 'npm',
      args: 'start',
      cwd: '/home/zxw/projects/tools_ai',
      instances: 1,
      exec_mode: 'fork',
      
      // 环境变量
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      
      // 日志配置
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // 自动重启配置
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      
      // 内存监控
      max_memory_restart: '300M',
      
      // 进程管理
      kill_timeout: 3000,
      listen_timeout: 3000,
      
      // 错误处理
      exp_backoff_restart_delay: 100,
    }
  ],
  
  // 部署配置
  deploy: {
    production: {
      user: 'zxw',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'https://github.com/your-username/matrixtools.git',
      path: '/home/zxw/projects/tools_ai',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'mkdir -p /home/zxw/projects/tools_ai/logs'
    }
  }
};