module.exports = {
    apps : [{
      name: 'API',
      script: 'server.js',
      key: '~/.ssh/id_rsa',
  
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: 'one two',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production',
      }
    }],
  
    deploy : {
      production : {
        key  : '~/.ssh/id_rsa',
        user : 'ubuntu',
        host : '142.93.95.14',
        ref  : 'origin/master',
        repo : 'https://github.com/tylorkolbeck/rest-blog.git',
        path : '/rest-blog',
        'post-deploy' : 'npm install && pm2 reload server'
      }
    }
  };
  