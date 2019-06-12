'use strict'

const express = require('express'),
  path = require('path'),
  globalConfig = require('./config/globalConfig')(),
  app = express(),
  cookieParser = require('cookie-parser'),
  logger = require('./config/logger'),
  //Helmet-Express/Connect等Javascript Web应用安全的中间件
  helmet = require('helmet'),
  bodyParser = require('body-parser'),
  pagesRouter = require('./routers/pagesRouter'),
  interceptorRouter = require('./routers/interceptorRouter'),
  apiRouter = require('./routers/apiRouter');

// 设置cookie
app.use(cookieParser())

//防止跨站脚本攻击
//csp 内容安全策略
//csp 通过在http的响应头中设定csp的规则，可以规定当前网页可以加载的资源的白名单，从而减少网页受到XSS攻击的风险
app.use(helmet.contentSecurityPolicy({
  directives: {
      defaultSrc: ['\'self\''],
      connectSrc: ['*'],
      scriptSrc: ['\'self\'', 'localhost:8000', '\'unsafe-eval\'', '\'unsafe-inline\''],
      styleSrc: ['\'self\'', 'localhost:8000', '\'unsafe-inline\''],
      fontSrc: ['\'self\'', 'localhost:8000', 'data:','at.alicdn.com', 'img-cdn-qiniu.dcloud.net.cn'],
      mediaSrc: ['\'self\''],
      objectSrc: ['\'self\''],
      imgSrc: ['*', 'data:', 'about:'],
      frameSrc: ['\'self\'']
  }
}));

//过滤xss
app.use(helmet.xssFilter());
//隐藏 X-Powered-By: Express
app.use(helmet.hidePoweredBy({ setTo: 'none' }));

//配置静态目录 
app.use(express.static(path.join(__dirname, "static"),{
  maxAge:86400000 //静态资源缓存配置
}));

// 设置post下接收参数
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

//定义模板渲染的目录
app.set('views', CWD + '/views');
app.set("view engine","ejs");

// 设置跨域访问 
var allowCrossDomain = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', "*")
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'origin, Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.setHeader('Access-Control-Max-Age', '3600')
  res.setHeader('Access-Control-Allow-Credentials', true)
  if (req.method == 'OPTIONS')
    res.sendStatus(200); // 让options请求快速返回
  else next()
}
app.all('*', allowCrossDomain)

app.get('/', function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  })
  res.write('Hello World!')
  res.end()
})

app.use(function(req,res,next){
  interceptorRouter(req,res,next);
})

app.use("/wechatanswer",pagesRouter)

app.use("/api",apiRouter);

//监听未捕获的异常
process.on('uncaughtException', function(err) {
  logger.error(err);
})

//监听Promise没有被捕获的失败函数 
process.on('unhandledRejection', function(err, promise) {
  logger.error(err);
})

process.on('exit', function() {
  logger.error("退出前执行");
});

// 启动监听服务
app.listen(SERVER.port, function () {
  logger.info(
    `-----监听:${SERVER.port}端口服务已经启动
     -----node版本:${process.versions.node}
     -----node进程id:${process.pid}
     -----node进程名称:${process.title}
     -----当前node进程的执行路径:${process.execPath}
     -----环境变量:${NODE_ENV}
     -----是否开启MockServer:${new Boolean(process.env.DEBUG_WITH_MOCK)}
     -----启动时间:${(new Date().toLocaleString())}
     -----访问地址:${SERVER.url}`
  )
})
