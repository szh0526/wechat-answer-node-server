// 微信网页鉴权api接口对接工具类 
// 具体文档请参考: https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842
const qs = require('qs'),
  logger = require('../config/logger'),
  request = require('request')

// 通过code换取网页授权access_token
function getWebAccessToken (code) {
  const url = `${APIDOMAIN}/sns/oauth2/access_token?`
  const params = {
    appid: global.APPID,
    secret: global.APPSECRET,
    code: code,
    grant_type: 'authorization_code'
  }

  const options = {
    method: 'get',
    url: `${url}` + qs.stringify(params)
  }
  return new Promise((resolve, reject) => {
    logger.info("请求微信参数:" + JSON.stringify(options));
    request(options, function (err, res, body) {
      if (err) {
        logger.error(err);
        reject(err)
        return
      }
      resolve(body)
    })
  })
}

/** 
 * 拉取用户信息(需scope为 snsapi_userinfo)
 */
function getUserInfo (access_token, openid) {
  const url = `${APIDOMAIN}/sns/userinfo?`
  const params = {
    openid: openid,
    access_token: access_token,
    lang: 'zh_CN'
  }

  const options = {
    method: 'get',
    url: `${url}` + qs.stringify(params)
  }
  return new Promise((resolve, reject) => {
    logger.info("请求微信参数:" + JSON.stringify(options));
    request(options, function (err, res, body) {
      if (err) {
        logger.error(err);
        reject(err)
        return
      }
      resolve(body)
    })
  })
}

// 检验授权凭证（access_token）是否有效
function authWebAccessToken (access_token, openid) {
  const url = `${APIDOMAIN}/sns/auth?`
  const params = {
    openid: openid,
    access_token: access_token
  }

  const options = {
    method: 'get',
    url: `${url}` + qs.stringify(params)
  }
  return new Promise((resolve, reject) => {
    logger.info("请求微信参数:" + JSON.stringify(options));
    request(options, function (err, res, body) {
      if (err) {
        logger.error(err);
        reject(err)
        return
      }
      resolve(body)
    })
  })
}

module.exports = {
  getWebAccessToken,
  getUserInfo,
authWebAccessToken}
