'use strict'

let urls = {
  'introducePage': [
    'getIntroducePage', // 介绍页
    'getIntroduceQRCode',//二维码
    'clickTest' //介绍页点击开始测试
  ],
  'preparePage': [
    'getPreparePage', // 测评准备页
  ],
  'questions': [
    'getQuestionsTitles', // 题库列表
    'getNextQuestion', // 获取下一个问题
    'getPreviousQuestion', // 获取上一个问题
    'getUserPayAmount', // 需要付款金额
    'userShare', // 记录分享次数
    'userPay',//用户支付
    'getCategorys',
    'getScales',//获取测评列表
    'getAssessment',//获取测评
  ],
  'userComment': [
    'getUserComment', // 获取用户评论
    'saveUserComment', // 保存用户评论
  ],
  'userInfo': [
    'getUserPayInfo', // 查询多少人购买
    'getUserQuestionsPayInfo', // 全局接口
    'getUserInfo', // 获取用户信息
    'getUserToken', // 获取用户基础token
  ],
  'userReport': [
    'getNextUserReport', // 获取报告下一页
    'getPreviousUserReport', // 报告上一页
    'createUserReport', // 生成报告
    'getUserReportPage',//答题完成后说明页
    'getUserShareInfo',//获取当前用户分享了几次
  ],
  'orders':[
    'unifiedOrder' //预支付
  ]
}

/**
 * 获取api接口配置
 * @param  null
 * @return {}
 */
let getApiUrls = () => {
  let apiUrls = {}
  for (let key of Object.keys(urls)) {
    urls[key].map(x => {
      apiUrls[`${x}`.toUpperCase()] = `${API.url}/${key}/${x}`
    })
  }
  return apiUrls
}

module.exports = getApiUrls()
