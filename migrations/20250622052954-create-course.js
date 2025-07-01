// 数据库迁移文件 - 创建课程表
// 文件名格式：时间戳-操作描述.js
// 20250622052954 表示创建时间：2025年06月22日 05:29:54

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * 执行迁移 - 创建课程表
   * 当运行 `sequelize db:migrate` 时会执行此方法
   * @param {QueryInterface} queryInterface - Sequelize查询接口
   * @param {Sequelize} Sequelize - Sequelize类，包含数据类型定义
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: { // 主键
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      categoryId: { // 分类ID，外键
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED
      },
      userId: { // 用户ID，外键
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED
      },
      name: { // 课程名称
        allowNull: false,
        type: Sequelize.STRING
      },
      image: { // 课程封面图片
        type: Sequelize.STRING
      },
      recommended: { // 是否推荐
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      introductory: { // 是否为入门课程
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      content: { // 课程介绍内容
        type: Sequelize.TEXT
      },
      likesCount: { // 点赞数
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER.UNSIGNED
      },
      chaptersCount: { // 章节数
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER.UNSIGNED
      },
      createdAt: { // 创建时间
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: { // 更新时间
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    // 添加索引，提升查询性能
    await queryInterface.addIndex('Courses', { fields: ['categoryId'] });
    await queryInterface.addIndex('Courses', { fields: ['userId'] });
  },
  /**
   * 回滚迁移 - 删除课程表
   * 当运行 `sequelize db:migrate:undo` 时会执行此方法
   * @param {QueryInterface} queryInterface - Sequelize查询接口
   * @param {Sequelize} Sequelize - Sequelize类
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Courses');
  }
};