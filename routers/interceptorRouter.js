const cache = require('../common/cache'),
  wxutil = require('../common/wxutil'),
  uaparser = require('ua-parser-js'),
  logger = require('../config/logger'),
  crypto = require('../common/crypto')

const errorMsg = err => {
  logger.error(err)
  return `
      <h1>系统异常!</h1>
      <p>${err.message}</p>
      <p>${err.stack}</p>
    `
}

function judgeArrInString (req, str) {
  var result = false; // 默认元素不在数组上面
  var arr = [
    '/wxoauth/',
    '/mAppAuth/',
    '/build/',
    '/favicon.ico'
  ]
  if(req.originalUrl.indexOf('.php') !== -1){
    return true;
  }else{
    for (var i = 0, len = arr.length; i < len; i++) {
      var _arrVal = arr[i]
      if (str.indexOf(_arrVal) != -1 && str != '/') {
        return true
      }
    }
  }
  return result
}

//小程序校验登录
function verifyMAppLogin (req, res, next) {
  try {
    let _path = req.path,
      allowPath = judgeArrInString(req, _path),
      key = req.query.token || '';

    if (allowPath && !key) {
      next();
      return
    }

    key = !!key ? crypto.aesDecrypt(key) : key;

    cache.get(key)
      .then(data => {
        if (data) {
          data = JSON.parse(data)
          // 将结果放在req请求中方便提取
          req[MAPPAUTHKEY] = data;
          next()
        }else {
          logger.info('获取小程序token对应redis数据失败! token:',key);
          req[MAPPAUTHKEY] = null;
          next();
        }
      })
      .catch(err => {
        res.send(errorMsg(err))
      })
  } catch (error) {
    logger.error(error)
    next()
  }
}

function verifyIsLogin (req, res, next) {
  try {
    let _path = req.path,
      allowPath = judgeArrInString(req, _path),
      key = req.cookies[WXAUTHKEY] || ''

    if (allowPath && !key) {
      next()
      return
    }

    key = !!key ? crypto.aesDecrypt(key) : key

    cache.get(key)
      .then(data => {
        if (data) {
          data = JSON.parse(data)
          // 将结果放在req请求中方便提取
          req[WXAUTHKEY] = data
          next()
        }else {
          // 没有code则授权
          if (!req.query.code) {
            let redirect_uri = encodeURIComponent(`${SERVERURL}${req.originalUrl}`)
            logger.info('redirect_uri回调地址:' + redirect_uri)
            res.redirect(`${OPENWXDOMAIN}/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${redirect_uri}&response_type=code&scope=${SCOPE}&state=123#wechat_redirect`)
            return
          }
          const code = req.query.code
          logger.info('code值:' + code)
          wxutil.getWebAccessToken(code)
            .then((data) => {
              const web_token_data = JSON.parse(data)
              if (web_token_data.errcode) {
                throw new Error(data)
              }else {
                // openid为用户唯一id  用于存储redis
                const key = `${WXAUTHKEY}_${web_token_data.openid}`
                // 生成aes加密串 用于cookie值
                const aesEncryptKey = crypto.aesEncrypt(key)
                // console.log(key, aesEncryptKey, crypto.aesDecrypt(aesEncryptKey))
                /**
                 * 保存到redis中,由于微信的access_token是7200秒过期,
                 * 存到redis中的数据减少60秒,设置为7140秒过期
                 */
                const {expires_in} = web_token_data
                const expireTime = expires_in - 60
                const maxAge = expires_in * 1000; // 单位毫秒
                // key没有则新增token 有则覆盖token

                // 存入redis
                cache.set(key, JSON.stringify(web_token_data), expireTime)
                  .then((data) => {
                    // 设置key 跳转至首页
                    res.cookie(WXAUTHKEY, aesEncryptKey, {
                      maxAge: maxAge,
                      path: '/',
                      domain: cookie_domain,
                      httpOnly: true
                    })
                    // 将结果放在req请求中方便提取
                    req[WXAUTHKEY] = web_token_data

                    next()
                  })
                  .catch((err) => {
                    res.send(errorMsg(err))
                  })
              }
            })
            .catch((err) => {
              res.send(errorMsg(err))
            })
        }
      })
      .catch(err => {
        res.send(errorMsg(err))
      })
  } catch (error) {
    logger.error(error)
    next()
  }
}

function accessLogger (req, res) {
  const ua = uaparser(req.headers['user-agent']),
    timeStamp = + new Date(),
    deviceType = ua.device.type || 'PC',
    _url = req.protocol + '://' + req.headers.host + req.originalUrl

  const str = req.hostname + '|+|' + ua.browser.name + '&' + ua.browser.version + '|+|' + deviceType + '|+|' + ua.os.name + '&' + ua.os.version + '|+|' + timeStamp + '|+|' + _url
  logger.info('访问日志:' + str)
}

function interceptorRouter (req, res, next) {
  if (global.isProduction) {
    if(req.query.type == 'xcx'){
      verifyMAppLogin(req, res, next);
    }else{
      verifyIsLogin(req, res, next);
    }
  }else {
    next()
  }
  accessLogger(req, res)
}
module.exports = interceptorRouter
