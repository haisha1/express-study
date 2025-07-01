// 后台文章管理路由 - 实现文章的增删改查（CRUD）功能

// 引入Express路由模块
const express = require('express');
// 创建路由实例
const router = express.Router();

// 引入数据模型
const { Article } = require('../../models');  // 文章数据模型

// 引入Sequelize操作符
const { Op } = require('sequelize');  // 用于构建复杂查询条件

// 引入统一响应处理工具
const {
  NotFoundError,  // 自定义的404错误类
  success,        // 成功响应处理函数
  failure         // 失败响应处理函数
} = require('../../utils/response');

/**
 * 查询文章列表 - 支持分页和搜索
 * 路径: GET /admin/articles
 * 查询参数:
 *   - currentPage: 当前页码，默认1
 *   - pageSize: 每页数量，默认10
 *   - title: 标题关键词搜索，可选
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
      order: [['id', 'DESC']],  // 按ID降序排列，最新的文章在前
      limit: pageSize,          // 限制返回数量
      offset: offset           // 设置偏移量（跳过的记录数）
    };

    // 如果有标题搜索参数，添加模糊查询条件
    if (query.title) {
      condition.where = {
        title: {
          [Op.like]: `%${ query.title }%`  // SQL LIKE操作，实现模糊搜索
        }
      };
    }

    // 执行查询，同时获取总数和数据
    const { count, rows } = await Article.findAndCountAll(condition);
    
    // 返回成功响应
    success(res, '查询文章列表成功。', {
      articles: rows,        // 文章数据列表
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
 * 查询文章详情
 * 路径: GET /admin/articles/:id
 * 路径参数:
 *   - id: 文章ID
 */
router.get('/:id', async function (req, res) {
  try {
    // 调用公共方法获取文章，如果不存在会抛出NotFoundError
    const article = await getArticle(req);
    
    // 返回成功响应
    success(res, '查询文章成功。', { article });
  } catch (error) {
    // 统一错误处理
    failure(res, error);
  }
});

/**
 * 创建文章
 * 路径: POST /admin/articles
 * 请求体参数:
 *   - title: 文章标题（必需）
 *   - content: 文章内容（必需）
 */
router.post('/', async function (req, res) {
  try {
    // 过滤请求体，只保留允许的字段（白名单机制）
    const body = filterBody(req);

    // 创建新文章，Sequelize会自动进行数据验证
    const article = await Article.create(body);
    
    // 返回成功响应，状态码201表示创建成功
    success(res, '创建文章成功。', { article }, 201);
  } catch (error) {
    // 统一错误处理，包括验证错误
    failure(res, error);
  }
});

/**
 * 更新文章
 * 路径: PUT /admin/articles/:id
 * 路径参数:
 *   - id: 文章ID
 * 请求体参数:
 *   - title: 文章标题（可选）
 *   - content: 文章内容（可选）
 */
router.put('/:id', async function (req, res) {
  try {
    // 先查询文章是否存在
    const article = await getArticle(req);
    
    // 过滤请求体，只保留允许的字段
    const body = filterBody(req);

    // 更新文章数据
    await article.update(body);
    
    // 返回成功响应
    success(res, '更新文章成功。', { article });
  } catch (error) {
    // 统一错误处理
    failure(res, error);
  }
});

/**
 * 删除文章
 * 路径: DELETE /admin/articles/:id
 * 路径参数:
 *   - id: 文章ID
 */
router.delete('/:id', async function (req, res) {
  try {
    // 先查询文章是否存在
    const article = await getArticle(req);

    // 删除文章（物理删除）
    await article.destroy();
    
    // 返回成功响应，不需要返回数据
    success(res, '删除文章成功。');
  } catch (error) {
    // 统一错误处理
    failure(res, error);
  }
});

/**
 * 公共方法：根据ID查询文章
 * @param {Object} req - Express请求对象
 * @returns {Promise<Object>} 文章实例
 * @throws {NotFoundError} 当文章不存在时抛出404错误
 */
async function getArticle(req) {
  const { id } = req.params;  // 从路径参数中获取文章ID

  // 根据主键查询文章
  const article = await Article.findByPk(id);
  
  // 如果文章不存在，抛出自定义的404错误
  if (!article) {
    throw new NotFoundError(`ID: ${ id }的文章未找到。`)
  }

  return article;  // 返回文章实例
}

/**
 * 公共方法：请求体白名单过滤
 * 只允许特定字段通过，防止用户提交不应该修改的字段
 * @param {Object} req - Express请求对象
 * @returns {Object} 过滤后的请求体数据
 */
function filterBody(req) {
  return {
    title: req.body.title,      // 允许修改标题
    content: req.body.content   // 允许修改内容
    // 注意：这里没有包含id、createdAt、updatedAt等字段
    // 这样可以防止客户端恶意修改这些敏感字段
  };
}

// 导出路由模块，供app.js使用
module.exports = router;
