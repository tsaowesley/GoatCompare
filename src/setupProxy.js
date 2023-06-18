const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.sportradar.com/nba/trial/v8/en/players/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      }
    })
  );
};
