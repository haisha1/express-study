// 后台分类管理路由 - 实现分类的增删改查（CRUD）功能

// 引入Express路由模块
const express = require('express');
// 创建路由实例
const router = express.Router();

// 引入数据模型
const { Category, Course } = require('../../models');  // 分类数据模型

// 引入Sequelize操作符
const { Op } = require('sequelize');  // 用于构建复杂查询条件

// 引入统一响应处理工具
const {
  BadRequestError,  // 自定义的400错误类
  NotFoundError,  // 自定义的404错误类
  success,        // 成功响应处理函数
  failure         // 失败响应处理函数
} = require('../../utils/response');

/**
 * 查询分类列表 - 支持分页和搜索
 * 路径: GET /admin/categories
 * 查询参数:
 *   - currentPage: 当前页码，默认1
 *   - pageSize: 每页数量，默认10
 *   - name: 分类名称关键词搜索，可选
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
      order: [['rank', 'ASC'], ['id', 'ASC']],  // 按排序字段升序，然后按ID升序
      limit: pageSize,          // 限制返回数量
      offset: offset           // 设置偏移量（跳过的记录数）
    };

    // 如果有名称搜索参数，添加模糊查询条件
    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${ query.name }%`  // SQL LIKE操作，实现模糊搜索
        }
      };
    }

    // 执行查询，同时获取总数和数据
    const { count, rows } = await Category.findAndCountAll(condition);
    
    // 返回成功响应
    success(res, '查询分类列表成功。', {
      categories: rows,      // 分类数据列表
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
 * 查询分类详情
 * 路径: GET /admin/categories/:id
 * 路径参数:
 *   - id: 分类ID
 */
router.get('/:id', async function (req, res) {
  try {
    // 调用公共方法获取分类，如果不存在会抛出NotFoundError
    const category = await getCategory(req);
    
    // 返回成功响应
    success(res, '查询分类成功。', { category });
  } catch (error) {
    // 统一错误处理
    failure(res, error);
  }
});

/**
 * 创建分类
 * 路径: POST /admin/categories
 * 请求体参数:
 *   - name: 分类名称（必需）
 *   - rank: 排序序号（必需）
 */
router.post('/', async function (req, res) {
  try {
    // 过滤请求体，只保留允许的字段（白名单机制）
    const body = filterBody(req);

    // 创建新分类，Sequelize会自动进行数据验证
    const category = await Category.create(body);
    
    // 返回成功响应，状态码201表示创建成功
    success(res, '创建分类成功。', { category }, 201);
  } catch (error) {
    // 统一错误处理，包括验证错误
    failure(res, error);
  }
});

/**
 * 更新分类
 * 路径: PUT /admin/categories/:id
 * 路径参数:
 *   - id: 分类ID
 * 请求体参数:
 *   - name: 分类名称（可选）
 *   - rank: 排序序号（可选）
 */
router.put('/:id', async function (req, res) {
  try {
    // 先查询分类是否存在
    const category = await getCategory(req);
    
    // 过滤请求体，只保留允许的字段
    const body = filterBody(req);

    // 更新分类数据
    await category.update(body);
    
    // 返回成功响应
    success(res, '更新分类成功。', { category });
  } catch (error) {
    // 统一错误处理
    failure(res, error);
  }
});

/**
 * 删除分类
 * 路径: DELETE /admin/categories/:id
 * 路径参数:
 *   - id: 分类ID
 */
router.delete('/:id', async function (req, res) {
  try {
    // 如果有对应的课程则不让删除
    const course = await Course.findOne({ where: { categoryId: req.params.id } });
    if (course) {
      throw new BadRequestError('该分类下有课程，不能删除。');
    }
    // 先查询分类是否存在
    const category = await getCategory(req);

    // 删除分类（物理删除）
    await category.destroy();
    
    // 返回成功响应，不需要返回数据
    success(res, '删除分类成功。');
  } catch (error) {
    // 统一错误处理
    failure(res, error);
  }
});

/**
 * 公共方法：根据ID查询分类
 * @param {Object} req - Express请求对象
 * @returns {Promise<Object>} 分类实例
 * @throws {NotFoundError} 当分类不存在时抛出404错误
 */
async function getCategory(req) {
  const { id } = req.params;  // 从路径参数中获取分类ID

  // 根据主键查询分类
  const category = await Category.findByPk(id);
  
  // 如果分类不存在，抛出自定义的404错误
  if (!category) {
    throw new NotFoundError(`ID: ${ id }的分类未找到。`)
  }

  return category;  // 返回分类实例
}

/**
 * 公共方法：请求体白名单过滤
 * 只允许特定字段通过，防止用户提交不应该修改的字段
 * @param {Object} req - Express请求对象
 * @returns {Object} 过滤后的请求体数据
 */
function filterBody(req) {
  return {
    name: req.body.name,  // 允许修改分类名称
    rank: req.body.rank   // 允许修改排序序号
    // 注意：这里没有包含id、createdAt、updatedAt等字段
    // 这样可以防止客户端恶意修改这些敏感字段
  };
}

// 导出路由模块，供app.js使用
module.exports = router; 