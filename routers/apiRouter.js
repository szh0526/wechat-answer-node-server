const express = require('express'),
  router = express.Router(),
  // mock服务
  mockServer = require('../config/mockServer');

router.get('/*', function (req, res) {
  let data = mockServer(req.path)
  if (data) {
    res.setHeader('Content-Type', 'application/json; charset=UTF-8')
    res.status(200).json(data)
  } else {
    res.setHeader('Content-Type', 'application/json; charset=UTF-8')
    res.status(500).json({message: 'mockserver未获取到数据!'})
  }
  res.end()
})

router.post('/*', function (req, res) {
  let data = mockServer(req.path)
  if (data) {
    res.setHeader('Content-Type', 'application/json; charset=UTF-8')
    res.status(200).json(data)
  } else {
    res.setHeader('Content-Type', 'application/json; charset=UTF-8')
    res.status(500).json({message: 'mockserver未获取到数据!'})
  }
  res.end()
})

module.exports = router;