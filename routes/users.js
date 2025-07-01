// 用户管理路由 - 实现用户的增删改查（CRUD）功能

// 引入Express路由模块
const express = require('express');
// 创建路由实例
const router = express.Router();

// 引入数据模型
const { User } = require('../models');  // 用户数据模型

// 引入Sequelize操作符
const { Op } = require('sequelize');  // 用于构建复杂查询条件

// 引入统一响应处理工具
const {
  NotFoundError,  // 自定义的404错误类
  success,        // 成功响应处理函数
  failure         // 失败响应处理函数
} = require('../utils/response');

/**
 * 用户登录
 * 路径: POST /users/login
 * 功能: 验证用户邮箱和密码，返回用户信息
 * 请求体参数:
 *   - email: 用户邮箱
 *   - password: 用户密码
 */
router.post('/login', async function (req, res) {
  try {
    const { email, password } = req.body;
    
    // 验证必填参数
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: '邮箱和密码不能为空',
        errors: ['请提供邮箱和密码']
      });
    }
    
    // 根据邮箱查找用户
    const user = await User.findOne({ 
      where: { email },
      attributes: { exclude: [] }  // 包含密码字段用于验证
    });
    
    // 用户不存在
    if (!user) {
      return res.status(401).json({
        status: false,
        message: '登录失败',
        errors: ['邮箱或密码错误']
      });
    }
    
    // 验证密码
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: false,
        message: '登录失败',
        errors: ['邮箱或密码错误']
      });
    }
    
    // 登录成功，返回用户信息（排除密码）
    const userData = user.toJSON();
    delete userData.password;
    
    success(res, '登录成功', { user: userData });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 查询用户列表 - 支持分页和搜索
 * 路径: GET /users
 * 查询参数:
 *   - currentPage: 当前页码，默认1
 *   - pageSize: 每页数量，默认10
 *   - username: 用户名关键词搜索，可选
 *   - email: 邮箱关键词搜索，可选
 *   - role: 用户角色筛选，可选
 */
router.get('/', async function (req, res) {
  try {
    const query = req.query;  // 获取URL查询参数
    
    // 分页参数处理，确保为正整数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;    // 当前页码
    const pageSize = Math.abs(Number(query.pageSize)) || 10;         // 每页数量
    const offset = (currentPage - 1) * pageSize;                     // 计算偏移量

    // 构建基础查询条件
    const condition = {
      order: [['id', 'DESC']],  // 按ID降序排列，最新的用户在前
      limit: pageSize,          // 限制返回数量
      offset: offset,           // 设置偏移量（跳过的记录数）
      attributes: { exclude: ['password'] }  // 排除密码字段，保护用户隐私
    };

    // 构建搜索条件
    const whereConditions = {};
    
    // 用户名模糊搜索
    if (query.username) {
      whereConditions.username = {
        [Op.like]: `%${query.username}%`  // SQL LIKE操作，实现模糊搜索
      };
    }
    
    // 邮箱模糊搜索
    if (query.email) {
      whereConditions.email = {
        [Op.like]: `%${query.email}%`  // SQL LIKE操作，实现模糊搜索
      };
    }
    
    // 角色筛选
    if (query.role !== undefined && query.role !== '') {
      whereConditions.role = Number(query.role);  // 精确匹配角色
    }
    
    // 如果有搜索条件，添加到查询中
    if (Object.keys(whereConditions).length > 0) {
      condition.where = whereConditions;
    }

    // 执行查询，同时获取总数和数据
    const { count, rows } = await User.findAndCountAll(condition);
    
    // 返回成功响应
    success(res, '查询用户列表成功。', {
      users: rows,           // 用户数据列表
      pagination: {          // 分页信息
        total: count,        // 总记录数
        currentPage,         // 当前页码
        pageSize,           // 每页数量
      }
    });
  } catch (error) {
    // 统一错误处理
    failure(res, error);
  }
});

/**
 * 查询用户详情
 * 路径: GET /users/:id
 * 路径参数:
 *   - id: 用户ID
 */
router.get('/:id', async function (req, res) {
  try {
    // 调用公共方法获取用户，如果不存在会抛出NotFoundError
    const user = await getUser(req);
    
    // 返回成功响应，排除密码字段
    const userData = user.toJSON();
    delete userData.password;  // 删除密码字段
    
    success(res, '查询用户成功。', { user: userData });
  } catch (error) {
    // 统一错误处理
    failure(res, error);
  }
});

/**
 * 创建用户
 * 路径: POST /users
 * 请求体参数:
 *   - email: 用户邮箱（必需）
 *   - username: 用户名（必需）
 *   - password: 密码（必需）
 *   - nickname: 昵称（必需）
 *   - sex: 性别（必需，0=男性，1=女性，2=未选择）
 *   - company: 公司（可选）
 *   - introduce: 个人介绍（可选）
 *   - role: 用户角色（必需，0=普通用户，100=管理员）
 *   - avatar: 头像URL（可选）
 */
router.post('/', async function (req, res) {
  console.log(req.body, 123);
  
  try {
    // 过滤请求体，只保留允许的字段（白名单机制）
    const body = filterBody(req);

    // 创建新用户，Sequelize会自动进行数据验证和密码加密
    const user = await User.create(body);
    
    // 返回成功响应，排除密码字段
    const userData = user.toJSON();
    delete userData.password;
    
    // 返回成功响应，状态码201表示创建成功
    success(res, '创建用户成功。', { user: userData }, 201);
  } catch (error) {
    // 统一错误处理，包括验证错误
    failure(res, error);
  }
});

/**
 * 更新用户
 * 路径: PUT /users/:id
 * 路径参数:
 *   - id: 用户ID
 * 请求体参数: 同创建用户，但所有字段都是可选的
 */
router.put('/:id', async function (req, res) {
  try {
    // 先查询用户是否存在
    const user = await getUser(req);
    
    // 过滤请求体，只保留允许的字段
    const body = filterBody(req);

    // 更新用户数据，Sequelize会自动处理密码加密
    await user.update(body);
    
    // 返回成功响应，排除密码字段
    const userData = user.toJSON();
    delete userData.password;
    
    success(res, '更新用户成功。', { user: userData });
  } catch (error) {
    // 统一错误处理
    failure(res, error);
  }
});

/**
 * 删除用户
 * 路径: DELETE /users/:id
 * 路径参数:
 *   - id: 用户ID
 */
router.delete('/:id', async function (req, res) {
  try {
    // 先查询用户是否存在
    const user = await getUser(req);

    // 删除用户（物理删除）
    await user.destroy();
    
    // 返回成功响应，不需要返回数据
    success(res, '删除用户成功。');
  } catch (error) {
    // 统一错误处理
    failure(res, error);
  }
});

/**
 * 公共方法：根据ID查询用户
 * @param {Object} req - Express请求对象
 * @returns {Promise<Object>} 用户实例
 * @throws {NotFoundError} 当用户不存在时抛出404错误
 */
async function getUser(req) {
  const { id } = req.params;  // 从路径参数中获取用户ID

  // 根据主键查询用户，排除密码字段
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] }  // 排除密码字段
  });
  
  // 如果用户不存在，抛出自定义的404错误
  if (!user) {
    throw new NotFoundError(`ID: ${id}的用户未找到。`)
  }

  return user;  // 返回用户实例
}

/**
 * 公共方法：请求体白名单过滤
 * 只允许特定字段通过，防止用户提交不应该修改的字段
 * @param {Object} req - Express请求对象
 * @returns {Object} 过滤后的请求体数据
 */
function filterBody(req) {
  const allowedFields = {
    email: req.body.email,           // 邮箱
    username: req.body.username,     // 用户名
    password: req.body.password,     // 密码（会自动加密）
    nickname: req.body.nickname,     // 昵称
    sex: req.body.sex,               // 性别
    company: req.body.company,       // 公司
    introduce: req.body.introduce,   // 个人介绍
    role: req.body.role,             // 用户角色
    avatar: req.body.avatar          // 头像
  };
  
  // 过滤掉undefined和null的字段
  const filteredBody = {};
  Object.keys(allowedFields).forEach(key => {
    if (allowedFields[key] !== undefined && allowedFields[key] !== null) {
      filteredBody[key] = allowedFields[key];
    }
  });
  
  return filteredBody;
}

// 导出路由模块，供app.js使用
module.exports = router;
