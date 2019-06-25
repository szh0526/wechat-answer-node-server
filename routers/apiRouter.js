const express = require('express'),
  router = express.Router(),
  error = require('../config/errorCode'),
  apiServer = require('../common/fetch'),
  apiConfig = require('../config/apiConfig')

const getApiUrl = (method) => {
  return apiConfig[method.toUpperCase()]
}

const getRequestOptions = (apiName, req, method) => {
  let defaultOpt = {
    url: getApiUrl(apiName),
    method: 'get',
    headers: {
      // 解析互联网媒体类型,是处理表单和AJAX 请求最常用的方式
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
  }

  let openid = req[WXAUTHKEY] ? req[WXAUTHKEY].openid : "";

  let reverseOpt = {}
  if (method && method.toUpperCase() == 'POST') {
    req.body.openId = openid;
    reverseOpt = {
      method: 'post',
      dataType: 'json',
      data: req.body
    }
  } else {
    req.query.openId = openid;
    reverseOpt = {
      data: req.query
    }
  }

  return Object.assign({}, defaultOpt, reverseOpt)
}

const defaultJson = (code, err) => {
  return {
    success: false,
    errorCode: code || '0019991001',
    errorMsg: err ? err.message : error[code] ,
    data: err.stack || ""
  }
}

router.get('/introducePage/getIntroducePage', function (req, res) {
  apiServer.request(getRequestOptions('getIntroducePage', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/introducePage/getIntroduceQRCode', function (req, res) {
  apiServer.request(getRequestOptions('getIntroduceQRCode', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/preparePage/getPreparePage', function (req, res) {
  apiServer.request(getRequestOptions('getPreparePage', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/questions/getQuestionsTitles', function (req, res) {
  apiServer.request(getRequestOptions('getQuestionsTitles', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/questions/getNextQuestion', function (req, res) {
  apiServer.request(getRequestOptions('getNextQuestion', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/questions/getPreviousQuestion', function (req, res) {
  apiServer.request(getRequestOptions('getPreviousQuestion', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/questions/getUserPayAmount', function (req, res) {
  apiServer.request(getRequestOptions('getUserPayAmount', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/questions/userShare', function (req, res) {
  apiServer.request(getRequestOptions('userShare', req, 'post'))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/questions/userPay', function (req, res) {
  apiServer.request(getRequestOptions('userPay', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/userComment/getUserComment', function (req, res) {
  apiServer.request(getRequestOptions('getUserComment', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/userComment/saveUserComment', function (req, res) {
  apiServer.request(getRequestOptions('saveUserComment', req , 'post'))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/userInfo/getUserPayInfo', function (req, res) {
  apiServer.request(getRequestOptions('getUserPayInfo', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/userInfo/getUserQuestionsPayInfo', function (req, res) {
  apiServer.request(getRequestOptions('getUserQuestionsPayInfo', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/userInfo/getUserInfo', function (req, res) {
  apiServer.request(getRequestOptions('getUserInfo', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/userReport/getNextUserReport', function (req, res) {
  apiServer.request(getRequestOptions('getNextUserReport', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/userReport/getPreviousUserReport', function (req, res) {
  apiServer.request(getRequestOptions('getPreviousUserReport', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/userReport/getUserReportPage', function (req, res) {
  apiServer.request(getRequestOptions('getUserReportPage', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/userReport/createUserReport', function (req, res) {
  apiServer.request(getRequestOptions('createUserReport', req , 'post'))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

router.get('/orders/unifiedOrder', function (req, res) {
  apiServer.request(getRequestOptions('unifiedOrder', req))
    .then(response => {
      res.json(response)})
    .catch(err => {
      res.json(defaultJson('0019991001', err))})
})

// router.get('/*', function (req, res) {
//   let data = mockServer(req.path)
//   if (data) {
//     res.setHeader('Content-Type', 'application/json; charset=UTF-8')
//     res.status(200).json(data)
//   } else {
//     res.setHeader('Content-Type', 'application/json; charset=UTF-8')
//     res.status(500).json({message: 'mockserver未获取到数据!'})
//   }
//   res.end()
// })

// router.post('/*', function (req, res) {
//   let data = mockServer(req.path)
//   if (data) {
//     res.setHeader('Content-Type', 'application/json; charset=UTF-8')
//     res.status(200).json(data)
//   } else {
//     res.setHeader('Content-Type', 'application/json; charset=UTF-8')
//     res.status(500).json({message: 'mockserver未获取到数据!'})
//   }
//   res.end()
// })

module.exports = router;
