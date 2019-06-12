'use strict'

module.exports = function () {
  // 环境变量
  global.NODE_ENV = (process.env && process.env.NODE_ENV) ? process.env.NODE_ENV : 'test';

  // 项目根目录
  global.CWD = process.cwd()

  // #region redis配置
  global.redis = {
    "ip": "127.0.0.1",
    'port': '6379' //防止端口号冲突
  }
  global.wxWebAccessToken = "wx_web_access_token";//网页授权token
  global.wxAccessToken = "wx_access_token";//基础授权token
  // #endregion

  // node服务地址
  global.SERVER = {
    port: 3999,
    url: 'http://127.0.0.1:3999'
  }

  global.cookie_domain = NODE_ENV != 'test' ? '.natappfree.cc' : '.natappfree.cc';
  
  //CDN地址 此路径后面的/必须加 否则devserver启动异常
  global.PUBLICPATH = NODE_ENV != "test" ? (SERVER.url + "/build/") : "http://127.0.0.1:8000/";

  // #region 微信测试或正式公众号信息

  global.APPID = NODE_ENV != 'test' ? '' : 'wxcb11c3655f5fc36f'

  global.APPSECRET = NODE_ENV != 'test' ? '' : 'a9b09d953a829b171cbd6bc92a96f950'

  global.REDIRECTURLPREFIX = NODE_ENV != 'test' ? '' : "http://sug545.natappfree.cc"

  global.SCOPE = "snsapi_base"; //"snsapi_userinfo";

  global.APIDOMAIN = "https://api.weixin.qq.com";

  global.OPENWXDOMAIN = "https://open.weixin.qq.com";

// #endregion
}
