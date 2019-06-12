'use strict'

const fetch = require('node-fetch'),
  util = require('./util'),
  logger = require('../config/logger'),
  mockServer = require('../config/mockServer')

/**
 * @description 异步调用api接口类
 * @class FetchApi
 */
class FetchApi {
  /**
   * Creates an instance of FetchApi.
   * 
   * @memberof FetchApi
   */
  constructor () {
    this.checkStatus = this.checkStatus.bind(this)
    this.getResponse = this.getResponse.bind(this)
    this.error = this.error.bind(this)
  }

  /**
   * @description 向数据service发送api请求
   * 
   * @param {any} opt 
   * @returns 
   * 
   * @memberof FetchApi
   */
  request (opts) { // 登录校验失败 返回登录地址
    if (process.env.DEBUG_WITH_MOCK) {
      return new Promise(function (resolve, reject) {
        let data = mockServer(opts.url)
        if (data) {
          resolve(data)
        } else {
          reject(new Error('mockserver未获取到数据!'))
        }
      })
    } else {
      let _self = this,
        options = this.transOptions(opts),
        startTime = (new Date).getTime(),
        path = options.url

      return new Promise(function (resolve, reject) {
        fetch(path, options)
          .then(_self.checkStatus)
          .then(_self.getResponse)
          .then(data => {
            let endTime = (new Date).getTime()
            _self.error('success', (endTime - startTime), path)
            resolve(data)
          }, err => {
            let endTime = (new Date).getTime()
            _self.error('error', (endTime - startTime), path, err)
            resolve(err)
          }).catch(err => {
          let endTime = (new Date).getTime()
          _self.error('error', (endTime - startTime), path, err)
          reject(err)
        })
      })
    }
  }

  /**
   * @description 设置请求参数
   * 
   * @param options = {
   *   method - 使用的HTTP动词，GET, POST, PUT, DELETE, HEAD
   *   url - 请求地址，URL of the request
   *   headers - 关联的Header对象 contentType有3种：application/x-www-form-urlencoded(默认值)、multipart/form-data、text/plain
   *   referrer - referrer
   *   mode - 请求的模式，主要用于跨域设置，cors, no-cors, same-origin
   *   credentials - 是否发送Cookie omit, same-origin
   *   redirect - 收到重定向请求之后的操作，follow, error, manual
   *   integrity - 完整性校验
   *   cache - 缓存模式(default, reload, no-cache)
   * }
   * @returns {}
   * 
   * @memberof FetchApi
   */
  transOptions (opts) {
    let defaultOptions = {
      method: 'GET',
      headers: {
        // application/x-www-form-urlencoded（大多数请求可用：eg：'name=Denzel&age=18'）
        // multipart/form-data（文件上传，这次重点说）
        // application/json（json格式对象，eg：{'name':'Denzel','age':'18'}）
        // text/xml(现在用的很少了，发送xml格式文件或流,webservice请求用的较多)
        // 解析互联网媒体类型,是处理表单和AJAX 请求最常用的方式
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      mode: 'no-cors',
      credentials: 'include',
      url: ''
    }
    let opt = Object.assign(defaultOptions, opts)
    if (opt['method'].toUpperCase() === 'GET') {
      opt['url'] = opt['data'] ? opt['url'] + '?' + util.json2ParStr(opt['data']) : opt['url']
    } else if (opt['method'].toUpperCase() == 'POST' && opt['dataType'] == 'json') {
      opt['body'] = util.json2ParStr(opt['data'])
    } else {
      opt['body'] = opt['data']
    }
    return opt
  }

  /**
   * @description 检查响应状态码
   * 
   * @param {any} response 
   * @returns 
   * 
   * @memberof FetchApi
   */
  checkStatus (response) {
    if (response.status) {
      return response
    }
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }

  /**
   * @description 根据type返回不同格式的response
   * 
   * @param {any} response 
   * @returns 
   * 
   * @memberof FetchApi
   */
  getResponse (response) {
    let result,
      type = response.headers ? response.headers.get('Content-Type').split(';')[0] : 'application/json'

    switch (type) {
      case 'text/html':
        result = response.text()
        break
      case 'application/json':
        result = response.json()
        break
      default:
        break
    }
    return result
  }

  /**
   * @description 异常捕获
   * 
   * @param {any} type 
   * @param {any} time 
   * @param {any} url 
   * @param {any} error 
   * 
   * @memberof FetchApi
   */
  error (type, time, url, error) {
    let msg = '请求时长+' + time + ' &&url=' + url
    if (type == 'success') {
      logger.info(msg)
    } else if (type == 'error') {
      error.message = msg + error.message
      logger.error(error)
    }
  }
}

module.exports = new FetchApi()
