// Express.js应用主文件 - 配置Express应用实例和中间件

// 引入必要的模块
const express = require('express');               // Express.js框架
const path = require('path');                     // Node.js路径处理模块
const cookieParser = require('cookie-parser');   // Cookie解析中间件
const logger = require('morgan');                 // HTTP请求日志中间件

// 引入路由模块
const indexRouter = require('./routes/index');   // 主页路由
const usersRouter = require('./routes/users');   // 用户路由

// 后台管理相关路由文件
const adminArticlesRouter = require('./routes/admin/articles');  // 后台文章管理路由
const adminCategoriesRouter = require('./routes/admin/categories');  // 后台分类管理路由
const adminSettingsRouter = require('./routes/admin/settings');  // 后台设置管理路由
const adminCoursesRouter = require('./routes/admin/courses');  // 后台课程管理路由


// 测试路由
const testRouter = require('./routes/admin/test');  // 测试路由，用于开发调试

// 创建Express应用实例
const app = express();

// 配置中间件（按执行顺序排列）

// 1. 日志中间件 - 记录HTTP请求日志，'dev'格式适合开发环境
app.use(logger('dev'));

// 2. JSON解析中间件 - 解析JSON格式的请求体
app.use(express.json());

// 3. URL编码解析中间件 - 解析URL编码的请求体（如表单数据）
// extended: false 表示使用querystring库解析
app.use(express.urlencoded({ extended: false }));

// 4. Cookie解析中间件 - 解析HTTP请求中的Cookie
app.use(cookieParser());

// 5. 静态文件服务中间件 - 提供public目录下的静态文件访问
// 如CSS、JavaScript、图片等静态资源
app.use(express.static(path.join(__dirname, 'public')));

// 配置路由 - 将不同的URL路径分发到对应的路由处理器

// 前台路由
app.use('/', indexRouter);                        // 根路径路由
app.use('/users', usersRouter);                   // 用户相关路由

// 后台管理路由 - 通常用于管理员操作
app.use('/admin/articles', adminArticlesRouter);  // 文章管理：增删改查文章
app.use('/admin/categories', adminCategoriesRouter);  // 分类管理：增删改查分类
app.use('/admin/settings', adminSettingsRouter);  // 设置管理：增删改查设置
app.use('/admin/courses', adminCoursesRouter);  // 课程管理：增删改查课程

// 开发测试路由 - 仅用于开发和调试
app.use('/admin/test', testRouter);               // 测试API接口

// 导出Express应用实例，供其他模块使用（如bin/www启动脚本）
module.exports = app;
