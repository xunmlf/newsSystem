const { createProxyMiddleware } = require('http-proxy-middleware');

// 跨域
module.exports = function (app) {
    app.use(
        '/ajax',
        createProxyMiddleware({
            target: 'https://m.maoyan.com',
            changeOrigin: true,
        })
    );
};