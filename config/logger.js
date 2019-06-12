const log4js = require('./log4jsConfig'),
  logErr = log4js.getLogger('logErr'), // 此处使用category的值
  logInfo = log4js.getLogger('logInfo'); // 此处使用category的值

// 格式化响应日志
const formatRes = (res) => {
  let logText = new String()
  // 响应日志开始
  logText += '\n' + '*************** response log start ***************' + '\n'
  // 响应状态码
  logText += 'response status: ' + res.res.statusCode + '\n'
  // 响应内容
  logText += 'response body: ' + '\n' + JSON.stringify(res.body) + '\n'
  // 响应日志结束
  logText += '*************** response log end ***************' + '\n'

  return logText
}

// 格式化错误日志
const formatError = function (err) {
  let logText = new String()
  // 错误信息开始
  logText += '\n' + '*************** error log start ***************' + '\n'
  // 错误名称
  logText += 'err name: ' + err.name + '\n'
  // 错误信息
  logText += 'err message: ' + err.message + '\n'
  // 错误详情
  logText += 'err stack: ' + err.stack + '\n'
  // 错误信息结束
  logText += '*************** error log end ***************' + '\n'

  return logText
}

const info = (msg) => {
  if (msg == null)
    msg = ''
  logInfo.info(msg)
  console.log(msg)
}

const error = (err = "") => {
  if(Object.prototype.toString.call(err) == "[object String]"){
    err = formatError(new Error(err));
  }
  if(Object.prototype.toString.call(err) == "[object Error]"){
    err = formatError(err);
  }
  logErr.error(err)
  console.log(err)
}

module.exports = {
  info,
  error}
