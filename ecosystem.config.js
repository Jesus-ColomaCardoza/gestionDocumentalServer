module.exports = {
  apps: [
    {
      name: 'api-sgd',
      script: 'node',
      cwd: './',
      watch: true,
      ignore_watch: [
        'local_files',
        'development_files',
        'quality_files',
        'production_files',
      ],
      args: 'dist/src/main.js',
      env: {
        // NODE_ENV: 'production',
        NODE_ENV: 'development',
      },
    },
  ],
};
