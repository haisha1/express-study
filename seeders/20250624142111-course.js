// 数据库种子文件 - 批量插入测试课程数据
// 文件名格式：时间戳-描述.js
// 20250624142111 表示创建时间：2025年06月24日 14:21:11

'use strict';

/** @type {import('sequelize-cli').Migration} */  // TypeScript类型注释
module.exports = {
  /**
   * 执行种子数据插入
   * 当运行 `sequelize db:seed:all` 时会执行此方法
   * @param {QueryInterface} queryInterface - Sequelize查询接口
   * @param {Sequelize} Sequelize - Sequelize类
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Courses', [
      {
        categoryId: 1,           // 分类ID
        userId: 1,               // 用户ID
        name: 'CSS 入门',         // 课程名称
        recommended: true,       // 是否推荐
        introductory: true,      // 是否入门课程
        createdAt: new Date(),   // 创建时间
        updatedAt: new Date()    // 更新时间
      },
      {
        categoryId: 2,
        userId: 1,
        name: 'Node.js 项目实践（2024 版）',
        recommended: true,
        introductory: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },
  /**
   * 回滚种子数据
   * 当运行 `sequelize db:seed:undo` 时会执行此方法
   * @param {QueryInterface} queryInterface - Sequelize查询接口
   * @param {Sequelize} Sequelize - Sequelize类
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Courses', null, {});
  }
};
