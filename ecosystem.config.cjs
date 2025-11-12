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
        // Default language: English
        VITE_LANG_CODE: 'en_US',
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
    },
    {
      name: 'crash-game-web-vi',
      cwd: './apps/web',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        // Vietnamese language
        VITE_LANG_CODE: 'vi_VN',
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
