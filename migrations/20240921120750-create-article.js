// 数据库迁移文件 - 创建文章表
// 文件名格式：时间戳-操作描述.js
// 20240921120750 表示创建时间：2024年09月21日 12:07:50

'use strict';

/** @type {import('sequelize-cli').Migration} */  // TypeScript类型注释
module.exports = {
  /**
   * 执行迁移 - 创建文章表
   * 当运行 `sequelize db:migrate` 时会执行此方法
   * @param {QueryInterface} queryInterface - Sequelize查询接口
   * @param {Sequelize} Sequelize - Sequelize类，包含数据类型定义
   */
  async up(queryInterface, Sequelize) {
    // 创建Articles表，定义表结构
    await queryInterface.createTable('Articles', {
      id: {                              // 主键字段
        allowNull: false,                // 不允许为空
        autoIncrement: true,             // 自动递增
        primaryKey: true,                // 设为主键
        type: Sequelize.INTEGER.UNSIGNED // 数据类型：无符号整数（只能存储非负数）
      },
      title: {                           // 文章标题字段
        type: Sequelize.STRING,          // 数据类型：字符串，默认VARCHAR(255)
        allowNull: false                 // 不允许为空
      },
      content: {                         // 文章内容字段
        type: Sequelize.TEXT             // 数据类型：长文本，可存储大量文字
        // allowNull默认为true，可以为空
      },
      createdAt: {                       // 创建时间字段（Sequelize自动管理）
        allowNull: false,                // 不允许为空
        type: Sequelize.DATE             // 数据类型：日期时间
      },
      updatedAt: {                       // 更新时间字段（Sequelize自动管理）
        allowNull: false,                // 不允许为空
        type: Sequelize.DATE             // 数据类型：日期时间
      }
    });
  },
  
  /**
   * 回滚迁移 - 删除文章表
   * 当运行 `sequelize db:migrate:undo` 时会执行此方法
   * @param {QueryInterface} queryInterface - Sequelize查询接口
   * @param {Sequelize} Sequelize - Sequelize类
   */
  async down(queryInterface, Sequelize) {
    // 删除Articles表，用于回滚操作
    await queryInterface.dropTable('Articles');
  }
};