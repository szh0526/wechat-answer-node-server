'use strict'
const redis = require('redis'),
  client = redis.createClient(global.redis);

client.select('0', (res) => {
  //console.log('-----------当前redis数据库为0-------------')
})

client.on('connect', function () {
  //console.log('-----------redis连接成功-------------')
})

client.on('error', function (err) {
  console.log('-----------redis连接失败-------------')
})

/** 
 * 添加string类型的数据 
 * @param key 键 
 * @params value 值  
 * @params expire (过期时间,单位秒;可为空，为空表示不过期) 
 */
function set (key, val, expire) {
  return new Promise((resolve, reject) => {
    client.set(key, val, function (err, result) {
      if (err) {
        console.log('----------redis数据插入错误------------')
        reject(err)
        return;
      } else {
        // 设置有效期
        if (!Number.isNaN(expire) && expire > 0) {
          client.expire(key, parseInt(expire))
        }
        if(result == "OK"){
          resolve(result)
        }else{
          reject(new Error("redis数据插入失败!键名:" + key))
        }
      }
    })
  })
}

// 获取数据
function get (key) {
  return new Promise((resolve, reject) => {
    // 读取JavaScript(JSON)对象
    client.get(key, function (err, result) {
      if (err) {
        console.log('----------redis数据读取错误------------')
        reject(err)
        return;
      } else {
        resolve(result)
      }
    })
  })
}

// 删除数据
function del (id) {
  return new Promise((resolve, reject) => {
    // 删除cache
    client.del(id, function (err, result) {
      if (err) {
        console.log('----------redis数据读取错误------------')
        reject(err)
        return;
      } else {
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
