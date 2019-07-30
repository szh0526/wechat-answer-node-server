'use strict'

module.exports = function () {
  // 阿里云云服务器ip地址
  const SERVERIP = '62.234.160.135'; // 或localhost
  global.SERVERURL = 'http://www.lianaijiazu.com';

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
  global.WXAUTHKEY = 'wx_auth_key'; // h5 token名
  global.MAPPAUTHKEY = 'mapp_auth_key'; // 小程序token名

  // node服务地址
  global.SERVER = {
    port: 3999,
    url: 'http://127.0.0.1:3999'
  }

  // JavaAPI服务
  global.API = {
    url: `${SERVERURL}/assessment`
  }

  global.cookie_domain = isProduction ? '.lianaijiazu.com' : '.lianaijiazu.com'

  // CDN地址 此路径后面的/必须加 否则devserver启动异常
  global.PUBLICPATH = isProduction ? (SERVER.url + '/build/') : 'http://127.0.0.1:8001/'

  // #region 微信测试或正式公众号信息

  global.MERCHANTNO = '111111111'; // 支付商户号 写在java不能暴露

  //小程序APPID
  global.MINIAPPID = 'wxb1944e6099def33e';
  //小程序秘钥
  global.MINIAPPSECRET = '0a4dc0ceddd328fc331bd9f1889db554';

  //公众号APPID
  global.APPID = isProduction ? 'wx433c71a793816f6f' :  'wx433c71a793816f6f'//'wxcb11c3655f5fc36f'
  //公众号秘钥
  global.APPSECRET = isProduction ? '5e7a884d5936325cfb42340803b76c06' : '5e7a884d5936325cfb42340803b76c06'//'a9b09d953a829b171cbd6bc92a96f950'

  global.SCOPE = 'snsapi_userinfo'; // "snsapi_base"

  global.APIDOMAIN = 'https://api.weixin.qq.com'

  global.OPENWXDOMAIN = 'https://open.weixin.qq.com'

// #endregion
}
