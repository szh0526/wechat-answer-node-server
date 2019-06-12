/**
 * @description 将对象转化为字符串连接
 * @param {any} obj 
 * @param {any} bol 
 */
let json2ParStr = (obj, bol = true) => {
    let query = [];
    for (let [k, v] of Object.entries(obj)) {
        if (v.constructor == Array) {
            v.map((value, index, array) => {
                if (typeof value == 'object') {
                    for (let [e, f] of Object.entries(value)) {
                        query.push(`${k}[${index}][${e}]=${bol ? encodeURIComponent(f) : f}`);
                    }
                } else {
                    query.push(`${k}[${index}]=${bol ? encodeURIComponent(value) : value}`);
                }
            });
        } else {
            query.push(`${k}=${bol ? encodeURIComponent(v) : v}`);
        }
    }
    return query.join('&');
}

let isJson = (str) => {
    try {
        return typeof JSON.parse(str) == "object";
    } catch (error) {
        return false;
    }
}

let isArray = (value) => {
    return Object.prototype.toString.call(value) == "[object Array]"
}

let isFunction = (value) => {
    return Object.prototype.toString.call(value) == "[object Function]"
}

let isRegExp = (value) => {
    return Object.prototype.toString.call(value) == "[object RegExp]"
}

let isObject = (value) => {
    return Object.prototype.toString.call(value) == "[object Object]"
}

//arrLike 类数组 如：arguments
let transArray = (arrLike) => Array.prototype.slice.call(arrLike);

let isEmptyObject = (obj) => Object.prototype.toString.call(obj) == "[object Object]" && Object.keys(obj).length == 0;

module.exports = {
    transArray,
    isObject,
    isArray,
    isFunction,
    isRegExp,
    isEmptyObject,
    json2ParStr
}