// 数据库迁移文件 - 创建分类表
// 文件名格式：时间戳-操作描述.js
// 20250622051701 表示创建时间：2025年06月22日 05:17:01

'use strict';

/** @type {import('sequelize-cli').Migration} */  // TypeScript类型注释
module.exports = {
  /**
   * 执行迁移 - 创建分类表
   * 当运行 `sequelize db:migrate` 时会执行此方法
   * @param {QueryInterface} queryInterface - Sequelize查询接口
   * @param {Sequelize} Sequelize - Sequelize类，包含数据类型定义
   */
  async up(queryInterface, Sequelize) {
    // 创建Categories表，定义表结构
    await queryInterface.createTable('Categories', {
      id: {                              // 主键字段
        allowNull: false,                // 不允许为空
        autoIncrement: true,             // 自动递增
        primaryKey: true,                // 设为主键
        type: Sequelize.INTEGER.UNSIGNED // 数据类型：无符号整数
      },
      name: {                            // 分类名称字段
        allowNull: false,                // 不允许为空
        type: Sequelize.STRING,          // 数据类型：字符串
        // 唯一的名字 
        unique: {msg: '名称已存在，请选择其他名称。'},  // 唯一性约束
        validate: {                      // 字段验证规则
          notNull: {msg: '名称必须填写。'},           // 非空验证
          notEmpty: {msg: '名称不能为空。'},          // 非空字符串验证
          len: {args: [2, 45], msg: '长度必须是2 ~ 45之间。'}, // 长度验证
        },
      },
      rank: {                            // 排序字段
        allowNull: false,                // 不允许为空
        defaultValue: 1,                 // 默认值为1
        type: Sequelize.INTEGER.UNSIGNED, // 数据类型：无符号整数
        validate: {                      // 字段验证规则
          notNull: {msg: '排序必须填写。'},           // 非空验证
          notEmpty: {msg: '排序不能为空。'},          // 非空验证
          isInt: {msg: '排序必须为整数。'},           // 整数验证
          isPositive(value) {            // 自定义验证：必须为正整数
            if (value <= 0) {
              throw new Error('排序必须是正整数。');
            }
          },
        },
      },
      createdAt: {                       // 创建时间字段（Sequelize自动管理）
        allowNull: false,                // 不允许为空
        type: Sequelize.DATE             // 数据类型：日期时间
      },
      updatedAt: {                       // 更新时间字段（Sequelize自动管理）
        allowNull: false,                // 不允许为空
        type: Sequelize.DATE             // 数据类型：日期时间
      },
    });
  },

  /**
   * 回滚迁移 - 删除分类表
   * 当运行 `sequelize db:migrate:undo` 时会执行此方法
   * @param {QueryInterface} queryInterface - Sequelize查询接口
   * @param {Sequelize} Sequelize - Sequelize类
   */
  async down(queryInterface, Sequelize) {
    // 删除Categories表，用于回滚操作
    await queryInterface.dropTable('Categories');
  },
};