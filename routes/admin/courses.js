// 后台课程管理路由 - 实现课程的增删改查（CRUD）功能

// 引入Express路由模块
const express = require('express');
// 创建路由实例
const router = express.Router();

// 引入数据模型
const { Course, Category, User } = require('../../models');  // 课程数据模型

// 引入Sequelize操作符
const { Op } = require('sequelize');  // 用于构建复杂查询条件

// 引入统一响应处理工具
const {
  NotFoundError,  // 自定义的404错误类
  success,        // 成功响应处理函数
  failure         // 失败响应处理函数
} = require('../../utils/response');

/**
 * 查询课程列表 - 支持分页和多条件搜索
 * 路径: GET /admin/courses
 * 查询参数:
 *   - currentPage: 当前页码，默认1
 *   - pageSize: 每页数量，默认10
 *   - categoryId: 分类ID筛选，可选
 *   - userId: 用户ID筛选，可选
 *   - name: 课程名称关键词搜索，可选
 *   - recommended: 是否推荐（true/false），可选
 *   - introductory: 是否入门课程（true/false），可选
 */
router.get('/', async function (req, res) {
  try {
    const query = req.query;  // 获取URL查询参数
    // 分页参数处理，确保为正整数
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 构建基础查询条件
    const condition = {
      attributes: {exclude: ['categoryId', 'userId']},
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ],
      order: [['id', 'DESC']],  // 按ID降序排列
      limit: pageSize,
      offset: offset
    };
    // 多条件筛选
    const where = {};
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }
    if (query.userId) {
      where.userId = query.userId;
    }
    if (query.name) {
      where.name = { [Op.like]: `%${query.name}%` };
    }
    if (query.recommended !== undefined) {
      where.recommended = query.recommended === 'true';
    }
    if (query.introductory !== undefined) {
      where.introductory = query.introductory === 'true';
    }
    if (Object.keys(where).length > 0) {
      condition.where = where;
    }

    // 执行查询，同时获取总数和数据
    const { count, rows } = await Course.findAndCountAll(condition);
    // 返回成功响应
    success(res, '查询课程列表成功。', {
      courses: rows,        // 课程数据列表
      pagination: {
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
 * 查询课程详情
 * 路径: GET /admin/courses/:id
 * 路径参数:
 *   - id: 课程ID
 */
router.get('/:id', async function (req, res) {
  try {
    const condition = {
      attributes: {exclude: ['categoryId', 'userId']},
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    };
    const course = await Course.findByPk(req.params.id, condition);
    // 返回成功响应
    success(res, '查询课程成功。', { course });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建课程
 * 路径: POST /admin/courses
 * 请求体参数:
 *   - categoryId: 分类ID（必需）
 *   - userId: 用户ID（必需）
 *   - name: 课程名称（必需）
 *   - image: 课程封面（可选）
 *   - recommended: 是否推荐（可选）
 *   - introductory: 是否入门课程（可选）
 *   - content: 课程介绍内容（可选）
 *   - likesCount: 点赞数（可选）
 *   - chaptersCount: 章节数（可选）
 */
router.post('/', async function (req, res) {
  try {
    // 过滤请求体，只保留允许的字段（白名单机制）
    const body = filterBody(req);
    // 创建新课程，Sequelize会自动进行数据验证
    const course = await Course.create(body);
    // 返回成功响应，状态码201表示创建成功
    success(res, '创建课程成功。', { course }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新课程
 * 路径: PUT /admin/courses/:id
 * 路径参数:
 *   - id: 课程ID
 * 请求体参数: 同创建课程，但所有字段都是可选的
 */
router.put('/:id', async function (req, res) {
  try {
    // 先查询课程是否存在
    const course = await getCourse(req);
    // 过滤请求体，只保留允许的字段
    const body = filterBody(req);
    // 更新课程数据
    await course.update(body);
    // 返回成功响应
    success(res, '更新课程成功。', { course });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 删除课程
 * 路径: DELETE /admin/courses/:id
 * 路径参数:
 *   - id: 课程ID
 */
router.delete('/:id', async function (req, res) {
  try {
    // 先查询课程是否存在
    const course = await getCourse(req);
    // 删除课程（物理删除）
    await course.destroy();
    // 返回成功响应
    success(res, '删除课程成功。');
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：根据ID查询课程
 * @param {Object} req - Express请求对象
 * @returns {Promise<Object>} 课程实例
 * @throws {NotFoundError} 当课程不存在时抛出404错误
 */
async function getCourse(req) {
  const { id } = req.params;
  
  // 查询课程时包含关联的分类和用户信息
  const course = await Course.findByPk(id, {
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'rank']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'nickname']
      }
    ]
  });
  
  if (!course) {
    throw new NotFoundError(`ID: ${id}的课程未找到。`);
  }
  return course;
}

/**
 * 公共方法：请求体白名单过滤
 * 只允许特定字段通过，防止用户提交不应该修改的字段
 * @param {Object} req - Express请求对象
 * @returns {Object} 过滤后的请求体数据
 */
function filterBody(req) {
  return {
    categoryId: req.body.categoryId,
    userId: req.body.userId,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content,
    likesCount: req.body.likesCount,
    chaptersCount: req.body.chaptersCount
  };
}

// 导出路由模块，供app.js使用
module.exports = router;
