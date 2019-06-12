"use strict";

const ERROR = {
    "0019991001": "系统异常",
    "0019991002": "对不起！系统繁忙，请稍后重试!",
    "0019991003": "用户未登录",
    "0019991004": "暂无登录权限",
    "0019991005": "路径错误",
    "0019991006": "邮箱账号或密码有误",
    "0019991007": "暂无数据",
    "0019991008": "请求成功",
    'systemError': { 'code': 5000, 'message': '系统异常' },
    'noLogin': { 'code': 5001, 'message': '用户未登录' },
    'loginFailure': { 'code': 5002, 'message': '登录失败' },
    'nonData': { 'code': 5003, 'message': '暂无数据' },
    'wrongPath': { 'code': 5004, 'message': '访问路径404' },
    'loginErr': { 'code': 5005, 'message': '邮箱账号或密码有误' },
    'noPermission': { 'code': 5006, 'message': '暂无登录权限' },
    'loginProcessingErr': { 'code': 5007, 'message': '权限菜单数据转换异常' },
    'renderInfoErr': { 'code': 5008, 'message': '初始化页面异常' },
};

module.exports = ERROR;