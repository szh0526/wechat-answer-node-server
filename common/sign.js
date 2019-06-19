// 生成随机字符串
var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15)
}
// 生成时间戳
var createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + ''
}

/**
* @synopsis 对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1 
*
* @param args 所有参数名均为小写字符
*
* @returns
*/
var raw = function (args) {
  var keys = Object.keys(args)
  keys = keys.sort()
  var newArgs = {}
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key]
  })

  var string = ''
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  string = string.substr(1)
  return string
}

/**
* @synopsis 签名算法 
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
* @param 文档https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
*
* @returns
*/
var sign = function (jsapi_ticket, url) {
  var ret = {
    jsapi_ticket: jsapi_ticket, // 公众号用于调用微信JS接口的临时票据
    nonceStr: createNonceStr(), // 随机字符串
    timestamp: createTimestamp(), // 时间戳
    url: url // 必须是调用JS接口页面的完整URL，不包含#及其后面部分
  }
  var string = raw(ret);
  var jsSHA = require('jssha');
  var shaObj = new jsSHA(string, 'TEXT');
  ret.signature = shaObj.getHash('SHA-1', 'HEX'); // 对string1进行sha1签名

  return ret
}

module.exports = sign
