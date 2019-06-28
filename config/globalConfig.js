'use strict'

module.exports = function () {
  // 阿里云云服务器ip地址
  const SERVERIP = '62.234.160.135'; // 或localhost

  // 项目根目录
  global.CWD = process.cwd()
  // 环境变量
  global.NODE_ENV = (process.env && process.env.NODE_ENV) ? process.env.NODE_ENV : 'test'
  // 是否生产环境
  global.isProduction = NODE_ENV === 'production'

  // #region redis配置
  global.redis = isProduction ? {
    pwd: 'Ceping123',
    host: SERVERIP,
    port: '6379', // 防止端口号冲突
  } : {
    pwd: '',
    host: '127.0.0.1',
    port: '6379'
  }

  // #endregion
  global.WXAUTHKEY = 'wx_auth_key'; // 前端token名

  // node服务地址
  global.SERVER = {
    port: 3999,
    url: 'http://127.0.0.1:3999'
  }

  // JavaAPI服务
  global.API = {
    url: `http://${SERVERIP}:80/assessment`
  }

  global.cookie_domain = isProduction ? '.52huashengmi.com' : '.52huashengmi.com'

  // CDN地址 此路径后面的/必须加 否则devserver启动异常
  global.PUBLICPATH = isProduction ? (SERVER.url + '/build/') : 'http://127.0.0.1:8000/'

  // #region 微信测试或正式公众号信息

  global.MERCHANTNO = '1540617221'; // 支付商户号：1540617221

  global.APPID = isProduction ? 'wx433c71a793816f6f' :  'wx433c71a793816f6f'//'wxcb11c3655f5fc36f'

  global.APPSECRET = isProduction ? '5e7a884d5936325cfb42340803b76c06' : '5e7a884d5936325cfb42340803b76c06'//'a9b09d953a829b171cbd6bc92a96f950'

  global.REDIRECTURLPREFIX = isProduction ? 'http://www.52huashengmi.com' : 'http://www.52huashengmi.com'

  global.SCOPE = 'snsapi_userinfo'; // "snsapi_base"

  global.APIDOMAIN = 'https://api.weixin.qq.com'

  global.OPENWXDOMAIN = 'https://open.weixin.qq.com'

// #endregion
}
