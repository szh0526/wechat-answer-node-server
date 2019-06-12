// log4js初始化配置
const log4js = require('log4js'),
  path = require('path'),
  fs = require('fs'),
  basePath = path.resolve(global.CWD, './logs')
  
/**
 * 确定目录是否存在，如果不存在则创建目录
 */
const checkAndCreateDir = function(pathStr) {
  if (!fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr)
    console.log('createPath: ' + pathStr)
  }
}

log4js.configure({
  appenders: {
    logErr: {
      type: 'dateFile', // 日志类型
      filename: basePath + '/error/wechat-answer-node-server', // 日志输出位置
      alwaysIncludePattern: true, // 是否总是有后缀名
      pattern: 'yyyy-MM-dd.err', // 后缀，每小时创建一个新的日志文件
      maxLogSize : 10000000,//文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
      backups : 5,//当文件内容超过文件存储空间时，备份文件的数量
    },
    logInfo: {
      type: 'dateFile',
      filename: basePath + '/info/wechat-answer-node-server',
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd.log',
      maxLogSize : 10000000,//文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
      backups : 5,//当文件内容超过文件存储空间时，备份文件的数量
    }
  },
  categories: {
    logErr: {
      appenders: ['logErr'],
      level: 'error'
    },
    logInfo: {
      appenders: ['logInfo'],
      level: 'info'
    },
    default: {
      appenders: ['logInfo', 'logErr'],
      level: 'trace'
    }
  },
  // pm2: true,
  // pm2InstanceVar: 'INSTANCE_ID',
  disableClustering: true //解决pm2在cluster模式下启动，导致log4js不正常输出日志
})

// 创建log的根目录'logs'
if (basePath) {
  checkAndCreateDir(basePath)
}

module.exports = log4js
