const express = require('express'),
  router = express.Router(),
  wxutil = require('../common/wxutil'),
  logger = require('../config/logger'),
  sign = require('../common/sign')

/** 
 * 获取权限签名
 * 确认签名算法正确，可用http://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign 页面工具进行校验。
 * 常见错误解决办法 https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
*/
router.get('/getSignature', function (req, res) {
  try {
    wxutil.getUserToken()
      .then((data) => {
        const base_token_data = JSON.parse(data)
        if (base_token_data.code !== 200) {
          throw new Error(base_token_data.message)
        }else {
          const accessToken = base_token_data.data.accessToken;
          wxutil.getJssdkTicket(accessToken)
            .then((data) => {
              const ticket_data = JSON.parse(data)
              if (ticket_data.errmsg !== 'ok') {
                throw new Error(data)
              }else {
                let jsapi_ticket = ticket_data.ticket
                let signature = sign(jsapi_ticket, req.query.url)
                logger.info(`
                  基础accessToken:${accessToken},
                  jsapi_ticket:${jsapi_ticket},
                  回调地址:${req.query.url},
                  权限签名数据:${JSON.stringify(signature)}
                `);
                res.json({
                  code: 200,
                  message: '成功',
                  data: {
                    appId: global.APPID, // 必填，公众号的唯一标识
                    timestamp: signature.timestamp, // 必填，生成签名的时间戳
                    nonceStr: signature.nonceStr, // 必填，生成签名的随机串
                    signature: signature.signature, // 必填，签名
                  }
                })
              }
            })
        }
      })
  } catch (error) {
    logger.error(error)
    res.json({
      code: 6000,
      message: '请求getSignature接口异常',
      data: null
    })
  }
})

module.exports = router
