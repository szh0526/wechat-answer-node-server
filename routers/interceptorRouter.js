const cache = require('../common/cache'),
  util = require('../common/wxutil');

const errorMsg = err => {
  console.log(err)
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
    // '/api/'
  ]

  for (var i = 0, len = arr.length; i < len; i++) {
    var _arrVal = arr[i]
    if (str.indexOf(_arrVal) != -1 && str != '/') {
      return true
    }
  }
  return result
}

function interceptorRouter (req, res, next) {
  const _path = req.path,
    allowPath = judgeArrInString(req, _path),
    key = req.cookies[wxWebAccessToken] || ''

  if (allowPath && !key) {
    next()
    return
  }

  cache.get(key)
    .then(data => {
      if (data) {
        next();
      }else {
        // 没有code则授权
        if (!req.query.code) {
          let redirect_uri = `${REDIRECTURLPREFIX}${_path}`;
          console.log("redirect_uri回调地址:" + redirect_uri);
          res.redirect(`${OPENWXDOMAIN}/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${redirect_uri}&response_type=code&scope=${SCOPE}&state=123#wechat_redirect`);
          return;
        }
        console.log("code值:" + req.query.code);
        const code = req.query.code;
        util.getWebAccessToken(code)
          .then((data) => {
            const result = JSON.parse(data)
            if (result.errcode) {
              throw new Error(data)
            }else {
              const {expires_in, openid} = result
              // openid为用户唯一id
              const key = `${wxWebAccessToken}_${openid}`
              /**
               * 保存到redis中,由于微信的access_token是7200秒过期,
               * 存到redis中的数据减少60秒,设置为7140秒过期
               */
              const expireTime = expires_in - 60
              const maxAge = expires_in * 1000; // 单位毫秒
              // key没有则新增token 有则覆盖token
              cache.set(key, JSON.stringify(result), expireTime)
                .then((data) => {
                  // 设置key 跳转至首页
                  res.cookie(wxWebAccessToken, key, {
                    maxAge: maxAge,
                    path: '/',
                    domain: cookie_domain,
                    httpOnly: true
                  })
                  res.redirect(`${REDIRECTURLPREFIX}/pages/answerIntroduce/answerIntroduce`);
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
}

module.exports = interceptorRouter
