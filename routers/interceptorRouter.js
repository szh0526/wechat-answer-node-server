const cache = require('../common/cache'),
  util = require('../common/wxutil'),
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
    '/build/',
    '/favicon.ico'
  ]

  for (var i = 0, len = arr.length; i < len; i++) {
    var _arrVal = arr[i]
    if (str.indexOf(_arrVal) != -1 && str != '/') {
      return true
    }
  }
  return result
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
            // let redirect_uri = encodeURIComponent(`${REDIRECTURLPREFIX}/wechatanswer/index`)
            let redirect_uri = encodeURIComponent(`${REDIRECTURLPREFIX}${req.originalUrl}`)
            logger.info('redirect_uri回调地址:' + redirect_uri)
            res.redirect(`${OPENWXDOMAIN}/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${redirect_uri}&response_type=code&scope=${SCOPE}&state=123#wechat_redirect`)
            return
          }
          const code = req.query.code;
          logger.info('code值:' + code)
          util.getWebAccessToken(code)
            .then((data) => {
              const web_token_data = JSON.parse(data)
              if (web_token_data.errcode) {
                throw new Error(data)
              }else {
                util.getAccessToken()
                  .then((data) => {
                    const base_token_data = JSON.parse(data)
                    if (base_token_data.errcode) {
                      throw new Error(data)
                    }else {
                      util.getJssdkTicket(base_token_data.access_token)
                        .then((data) => {
                          const ticket_data = JSON.parse(data)
                          if (ticket_data.errmsg !== 'ok') {
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

                            // 取出ticket和basetoken存入redis
                            const redisVal = Object.assign({}, web_token_data, {
                              jsapi_ticket: ticket_data.ticket, // 调用微信JS接口的临时票据
                              base_access_token: base_token_data.access_token, // 全局基础token
                              web_access_token: web_token_data.access_token // 网页授权token
                            })

                            cache.set(key, JSON.stringify(redisVal), expireTime)
                              .then((data) => {
                                // 设置key 跳转至首页
                                res.cookie(WXAUTHKEY, aesEncryptKey, {
                                  maxAge: maxAge,
                                  path: '/',
                                  domain: cookie_domain,
                                  httpOnly: true
                                })
                                // 将结果放在req请求中方便提取
                                req[WXAUTHKEY] = redisVal;
                                
                                next();
                                // let url = req.originalUrl;
                                // if(url.indexOf('code') !== -1 ){
                                //   url = url.substring(0,url.indexOf('&code'));
                                // }
                                // res.redirect(`${url}`);
                              })
                              .catch((err) => {
                                res.send(errorMsg(err))
                              })
                          }
                        }).catch((err) => {
                        res.send(errorMsg(err))
                      })
                    }
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
  if (!global.isProduction) {
    verifyIsLogin(req, res, next)
  }else {
    next()
  }
  accessLogger(req, res)
}
module.exports = interceptorRouter
