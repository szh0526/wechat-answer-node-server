'use strict'
const redis = require('redis'),
  logger = require('../config/logger'),
  client = redis.createClient(global.redis);

client.select('0', (res) => {
  //console.log('-----------当前redis数据库为0-------------')
})

client.on('connect', function () {
  //console.log('-----------redis连接成功-------------')
})

client.on('error', function (err) {
  logger.error(err);
})

/** 
 * 添加string类型的数据 
 * @param key 键 
 * @params value 值  
 * @params expire (过期时间,单位秒;可为空，为空表示不过期) 
 */
function set (key, val, expire) {
  return new Promise((resolve, reject) => {
    logger.info("redis插入数据:" + JSON.stringify({key,val,expire}));
    client.set(key, val, function (err, result) {
      if (err) {
        logger.error(err);
        reject(err)
        return;
      } else {
        // 设置有效期
        if (!Number.isNaN(expire) && expire > 0) {
          client.expire(key, parseInt(expire))
        }
        if(result == "OK"){
          logger.info(`redis插入数据成功!`);
          resolve(result)
        }else{
          reject(new Error("redis数据插入失败!"));
        }
      }
    })
  })
}

// 获取数据
function get (key) {
  return new Promise((resolve, reject) => {
    logger.info("redis获取数据:" + key);
    // 读取JavaScript(JSON)对象
    client.get(key, function (err, result) {
      if (err) {
        logger.error(err);
        reject(err)
        return;
      } else {
        logger.info(`redis获取数据成功:` + JSON.stringify(result));
        resolve(result)
      }
    })
  })
}

// 删除数据
function del (id) {
  return new Promise((resolve, reject) => {
    logger.info("redis删除数据:" + id);
    // 删除cache
    client.del(id, function (err, result) {
      if (err) {
        logger.error(err);
        reject(err)
        return;
      } else {
        logger.info(`redis删除数据成功!`);
        resolve(true)
      }
    })
  })
}

module.exports = {
  get,
  set,
  del
}
