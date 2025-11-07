module.exports = {
  apps: [
    {
      name: 'crash-game-web',
      cwd: './apps/web',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
};
