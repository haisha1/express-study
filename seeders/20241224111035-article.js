// 数据库种子文件 - 批量插入测试文章数据
// 文件名格式：时间戳-描述.js
// 20241224111035 表示创建时间：2024年12月24日 11:10:35

'use strict';

/** @type {import('sequelize-cli').Migration} */  // TypeScript类型注释
module.exports = {
  /**
   * 执行种子数据插入
   * 当运行 `sequelize db:seed:all` 时会执行此方法
   * @param {QueryInterface} queryInterface - Sequelize查询接口
   * @param {Sequelize} Sequelize - Sequelize类
   */
  async up (queryInterface, Sequelize) {
    // 创建空数组，用于存储要插入的文章数据
    const articles = [];
    
    // 定义要创建的文章数量
    const counts = 100;
  
    // 循环生成测试文章数据
    for (let i = 1; i <= counts; i++) {
      // 创建单个文章对象
      const article = {
        title: `文章的标题 ${i}`,        // 动态生成标题，包含序号
        content: `文章的内容 ${i}`,      // 动态生成内容，包含序号
        createdAt: new Date(),          // 创建时间：当前时间
        updatedAt: new Date(),          // 更新时间：当前时间
      };
  
      // 将文章对象添加到数组中
      articles.push(article);
    }
  
    // 批量插入所有文章数据到Articles表
    // 相当于执行：INSERT INTO Articles (title, content, createdAt, updatedAt) VALUES ...
    await queryInterface.bulkInsert('Articles', articles, {});
  },
  
  /**
   * 回滚种子数据
   * 当运行 `sequelize db:seed:undo` 时会执行此方法
   * 注意：这里没有实现回滚逻辑，实际项目中可根据需要添加
   * @param {QueryInterface} queryInterface - Sequelize查询接口
   * @param {Sequelize} Sequelize - Sequelize类
   */
  async down (queryInterface, Sequelize) {
    /**
     * 在这里添加回滚种子数据的命令
     * 
     * 示例：删除所有文章数据
     * await queryInterface.bulkDelete('Articles', null, {});
     * 
     * 示例：根据条件删除特定数据
     * await queryInterface.bulkDelete('Articles', {
     *   title: {
     *     [Sequelize.Op.like]: '文章的标题%'  // 删除标题以"文章的标题"开头的记录
     *   }
     * }, {});
     */
  }
};
