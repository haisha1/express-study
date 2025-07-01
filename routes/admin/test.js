// 测试路由 - 用于开发调试和测试API功能

// 引入Express路由模块
const express = require('express');
// 创建路由实例
const router = express.Router();

// 引入数据模型
const {Article} = require('../../models');  // 文章数据模型

/**
 * 测试用的异步函数
 * 演示了异步函数的基本用法
 */
const testFunction = async () => {
  // 以下是Promise的示例用法（已注释）
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve('Hello, world!');
  //   }, 1000);
  // });
  
  // 直接返回测试数据
  return '123';
};

/**
 * 测试：查询文章列表
 * 路径: GET /admin/test
 * 功能: 用于测试数据库连接和基本查询功能
 */
router.get('/', async function (req, res) {
  // 定义查询条件
  const condition = {
    order: [['id', 'DESC']],  // 按ID降序排列
    // order: [['id', 'ASC']], // 按ID升序排列（已注释）
  };
  
  // 执行测试函数（非数据库查询）
  // const articles = await Article.findAll(condition);  // 真实数据库查询（已注释）
  const articles = await testFunction();  // 调用测试函数
  
  // 返回JSON响应
  res.json({
    status: true,                    // 请求状态
    message: '查询文章列表成功',      // 响应消息
    data: articles,                  // 响应数据
  });
  
  // 以下是原始的完整实现（已注释，保留用于参考）
  //   try {
  //     const articles = await Article.findAll();
  //     res.json({
  //       status: true,
  //       message: '查询文章列表成功',
  //       data: articles,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       status: false,
  //       message: '查询文章列表失败',
  //       errors: [error.message],
  //     });
  //   }
});

/**
 * 测试：新增文章
 * 路径: POST /admin/test
 * 功能: 用于测试文章创建功能
 * 请求体参数:
 *   - title: 文章标题
 *   - content: 文章内容
 */
router.post('/', async function (req, res) {
  // 从请求体中解构出标题和内容
  const {title, content} = req.body;
  
  try {
    // 创建新文章
    // 相当于执行: INSERT INTO articles (title, content) VALUES (?, ?)
    const article = await Article.create({
      title,     // 文章标题
      content,   // 文章内容
    });
    
    // 返回创建成功响应，状态码201表示资源创建成功
    res.status(201).json({
      status: true,            // 请求状态
      message: '新增文章成功', // 响应消息
      data: article,           // 新创建的文章数据
    });
  } catch (error) {
    // 处理创建失败的情况
    res.status(500).json({
      status: false,           // 请求状态
      message: '新增文章失败', // 响应消息
      errors: [error.message], // 错误详情
    });
  }
});

// 导出路由模块，供app.js使用
module.exports = router;
