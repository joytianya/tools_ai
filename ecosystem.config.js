module.exports = {
  apps: [
    {
      name: 'tools-share-website',
      script: 'npm',
      args: 'start',
      cwd: '/home/zxw/projects/tools_ai/tools-share-website',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: '/var/log/pm2/tools-share-website-error.log',
      out_file: '/var/log/pm2/tools-share-website-out.log',
      merge_logs: true,
    },
  ],
};