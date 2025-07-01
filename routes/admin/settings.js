// 后台设置管理路由 - 实现设置的增删改查（CRUD）功能

// 引入Express路由模块
const express = require('express');
// 创建路由实例
const router = express.Router();

// 引入数据模型
const { Setting } = require('../../models');  // 设置数据模型

// 引入Sequelize操作符
const { Op } = require('sequelize');  // 用于构建复杂查询条件

// 引入统一响应处理工具
const {
  NotFoundError,  // 自定义的404错误类
  success,        // 成功响应处理函数
  failure         // 失败响应处理函数
} = require('../../utils/response');

/**
 * 查询设置列表 - 支持分页和搜索
 * 路径: GET /admin/settings
 * 查询参数:
 *   - currentPage: 当前页码，默认1
 *   - pageSize: 每页数量，默认10
 *   - name: 设置名称关键词搜索，可选
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
      order: [['id', 'DESC']],  // 按ID降序排列，最新的设置在前
      limit: pageSize,          // 限制返回数量
      offset: offset           // 设置偏移量（跳过的记录数）
    };

    // 如果有设置名称搜索参数，添加模糊查询条件
    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${ query.name }%`  // SQL LIKE操作，实现模糊搜索
        }
      };
    }

    // 执行查询，同时获取总数和数据
    const { count, rows } = await Setting.findAndCountAll(condition);
    
    // 返回成功响应
    success(res, '查询设置列表成功。', {
      settings: rows,        // 设置数据列表
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
 * 查询设置详情
 * 路径: GET /admin/settings/:id
 * 路径参数:
 *   - id: 设置ID
 */
router.get('/:id', async function (req, res) {
  try {
    // 调用公共方法获取设置，如果不存在会抛出NotFoundError
    const setting = await getSetting(req);
    
    // 返回成功响应
    success(res, '查询设置成功。', { setting });
  } catch (error) {
    // 统一错误处理
    failure(res, error);
  }
});

/**
 * 创建设置
 * 路径: POST /admin/settings
 * 请求体参数:
 *   - name: 设置名称（必需）
 *   - icp: ICP备案号（可选）
 *   - copyright: 版权信息（可选）
 */
router.post('/', async function (req, res) {
  try {
    // 过滤请求体，只保留允许的字段（白名单机制）
    const body = filterBody(req);

    // 创建新设置，Sequelize会自动进行数据验证
    const setting = await Setting.create(body);
    
    // 返回成功响应，状态码201表示创建成功
    success(res, '创建设置成功。', { setting }, 201);
  } catch (error) {
    // 统一错误处理，包括验证错误
    failure(res, error);
  }
});

/**
 * 更新设置
 * 路径: PUT /admin/settings/:id
 * 路径参数:
 *   - id: 设置ID
 * 请求体参数:
 *   - name: 设置名称（可选）
 *   - icp: ICP备案号（可选）
 *   - copyright: 版权信息（可选）
 */
router.put('/:id', async function (req, res) {
  try {
    // 先查询设置是否存在
    const setting = await getSetting(req);
    
    // 过滤请求体，只保留允许的字段
    const body = filterBody(req);

    // 更新设置数据
    await setting.update(body);
    
    // 返回成功响应
    success(res, '更新设置成功。', { setting });
  } catch (error) {
    // 统一错误处理
    failure(res, error);
  }
});

/**
 * 删除设置
 * 路径: DELETE /admin/settings/:id
 * 路径参数:
 *   - id: 设置ID
 */
router.delete('/:id', async function (req, res) {
  try {
    // 先查询设置是否存在
    const setting = await getSetting(req);

    // 删除设置（物理删除）
    await setting.destroy();
    
    // 返回成功响应，不需要返回数据
    success(res, '删除设置成功。');
  } catch (error) {
    // 统一错误处理
    failure(res, error);
  }
});

/**
 * 公共方法：根据ID查询设置
 * @param {Object} req - Express请求对象
 * @returns {Promise<Object>} 设置实例
 * @throws {NotFoundError} 当设置不存在时抛出404错误
 */
async function getSetting(req) {
  const { id } = req.params;  // 从路径参数中获取设置ID

  // 根据主键查询设置
  const setting = await Setting.findByPk(id);
  
  // 如果设置不存在，抛出自定义的404错误
  if (!setting) {
    throw new NotFoundError(`ID: ${ id }的设置未找到。`)
  }

  return setting;  // 返回设置实例
}

/**
 * 公共方法：请求体白名单过滤
 * 只允许特定字段通过，防止用户提交不应该修改的字段
 * @param {Object} req - Express请求对象
 * @returns {Object} 过滤后的请求体数据
 */
function filterBody(req) {
  return {
    name: req.body.name,           // 允许修改设置名称
    icp: req.body.icp,             // 允许修改ICP备案号
    copyright: req.body.copyright  // 允许修改版权信息
    // 注意：这里没有包含id、createdAt、updatedAt等字段
    // 这样可以防止客户端恶意修改这些敏感字段
  };
}

// 导出路由模块，供app.js使用
module.exports = router; 