// 请参考http://nodejs.cn/api/crypto.html
const crypto = require('crypto')
// 秘钥
const secret = 'wechat-answer-secret-!@#$';

/**
 * 加密hash字符串
 * code 要加密的字符串
 * encoding 编码方式 'hex', 'latin1' 或者 'base64'
 */
const hashEncrypt = function (code, encoding = 'hex') {
  // 创建hash实例
  const hash = crypto.createHmac('sha256')
  return hash
    .update(code, 'utf8') // 默认 'utf8', 'ascii' 或者 'latin1'
    .digest(encoding)
}

/**
 * 加密hmac字符串
 * code 要加密的字符串
 * encoding 编码方式 'hex', 'latin1' 或者 'base64'
 */
const hmacEncrypt = function (code, encoding = 'hex') {
  const hmac = crypto.createHmac('sha256', secret)
  return hmac
    .update(code, 'utf8') // 默认 'utf8', 'ascii' 或者 'latin1'
    .digest(encoding)
}

/**
 * AES加密
 * Decipher类的实例用于解密数据
 * data 要加密的字符串
 * key 秘钥
 */
const aesEncrypt = function (data, key = secret) {
  const cipher = crypto.createCipher('aes192', key)
  var crypted = cipher.update(data, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

/**
 * AES解密
 * Decipher类的实例用于解密数据
 * data 要解密的字符串
 * key 秘钥
 */
const aesDecrypt = function (encrypted, key = secret) {
  const decipher = crypto.createDecipher('aes192', key)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

module.exports = {
  hashEncrypt,
  hmacEncrypt,
  aesDecrypt,
aesEncrypt}
