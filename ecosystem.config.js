module.exports = {
  apps : [{
    name: 'API',
    script: 'app.js',

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
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      key  : '~/.ssh/my-website.pem',
      user : 'ubuntu',
      host : 'ubuntu@ec2-54-184-193-9.us-west-2.compute.amazonaws.com',
      ref  : 'origin/master',
      repo : 'https://github.com/tylorkolbeck/rest-blog.git',
      path : '/apps',
      'post-deploy' : 'mkdir -p logs && touch logs/all-logs.log && npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
