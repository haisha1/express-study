// 主页路由 - 处理应用根路径的请求

// 引入Express路由模块
const express = require('express');
// 创建路由实例
const router = express.Router();

/**
 * GET 主页路由
 * 路径: GET /
 * 功能: 返回API欢迎信息，通常用于API健康检查
 */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' }); // 原本用于渲染模板，现已注释
  console.log(req,res,123);  // 调试输出，打印请求和响应对象
  
  // 返回JSON格式的欢迎消息
  res.json(
    {message: 'hello world1'}  // API响应数据
  )
});

// 导出路由模块，供app.js使用
module.exports = router;
