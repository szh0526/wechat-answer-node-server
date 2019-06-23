const express = require('express'),
  router = express.Router(),
  logger = require('../config/logger'),
  cache = require('../common/cache'),
  util = require('../common/wxutil')

const errorMsg = err => {
  logger.error(err)
  return `
      <h1>系统异常!</h1>
      <p>${err.message}</p>
      <p>${err.stack}</p>
    `
}

/** 
 * 引导用户获取code
 * code只能使用一次，5分钟未被使用自动过期
 * 2种方式获取code 其他参数一致
 * 1.非静默授权 scope=snsapi_userinfo  可以获取所有的用户信息；
 * 2.静默授权   scope=snsapi_base 只能获取到openid;用户不用手动点击确定，直接跳到回调页面。
 */
router.get('/login', function (req, res, next) {
  res.redirect('/wechatanswer/login')
})

// 通过code换取网页授权access_token
router.get('/getWebAccessToken', function (req, res, next) {
  const code = req.query.code
  util.getWebAccessToken(code)
    .then((data) => {
      const result = JSON.parse(data)
      if (result.errcode) {
        throw new Error(data)
      }else {
        const {expires_in, openid} = result
        // openid为用户唯一id
        const key = `${WXAUTHKEY}_${openid}`
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
            res.cookie(WXAUTHKEY, key, {
              maxAge: maxAge,
              path: '/',
              domain: cookie_domain,
              httpOnly: true
            })
            res.redirect(`${REDIRECTURLPREFIX}/pages/answerIntroduce/answerIntroduce`)
          })
          .catch((err) => {
            res.send(errorMsg(err))
          })
      }
    })
    .catch((err) => {
      res.send(errorMsg(err))
    })
})

// 当SCOPE为非静默授权snsapi_userinfo时才能获取用户信息
router.get('/getUserInfo', function (req, res, next) {
  const key = req.cookies[WXAUTHKEY]
  cache.get(key)
    .then((data) => {
      console.log('redis获取网页授权信息:' + data)
      const {access_token, openid} = JSON.parse(data)
      util.getUserInfo(access_token, openid)
        .then((value) => {
          const result = JSON.parse(value)
          if (result.errcode) {
            throw new Error(data)
          }else {
            console.log('微信获取用户信息成功:' + value)
            res.json(result)
          }
        })
        .catch((err) => {
          res.send(errorMsg(err))
        })
    })
    .catch((err) => {
      res.send(errorMsg(err))
    })
})

module.exports = router
