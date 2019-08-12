const express = require('express'),
  router = express.Router(),
  logger = require('../config/logger'),
  cache = require('../common/cache'),
  wxutil = require('../common/wxutil'),
  crypto = require('../common/crypto')

const errorMsg = err => {
  logger.error(err)
  return {
    code:6000,
    message:'系统异常!',
    data:null
  }
}

//根据code获取授权信息,并返回token给前端
router.get('/mAppLogin', function (req, res, next) {
  const code = req.query.code;
  wxutil.getMiniAppSessionKey(code)
  .then((data) => {
    const session_key_data = JSON.parse(data);
    if (session_key_data.errcode) {
      throw new Error(data)
    }else {
      // openid为用户唯一id  用于存储redis
      const key = `${MAPPAUTHKEY}_${session_key_data.openid}`
      // 生成aes加密串 用于token值
      const aesEncryptKey = crypto.aesEncrypt(key);

      // 存入redis
      cache.set(key, JSON.stringify(session_key_data), 60 * 60 * 24 * 30 * 1000)
        .then((data) => {
          res.json({
            code:200,
            message:'登录成功',
            data:{
              token:aesEncryptKey
            }
          })
        })
        .catch((err) => {
          res.send(errorMsg(err))
        })
    }
  })
  .catch((err) => {
    res.send(errorMsg(err))
  })
});

module.exports = router;
