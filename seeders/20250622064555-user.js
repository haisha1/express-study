// 数据库种子文件 - 批量插入测试用户数据
// 文件名格式：时间戳-描述.js
// 20250622064555 表示创建时间：2025年06月22日 06:45:55

'use strict';

// 引入bcryptjs用于密码加密
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */  // TypeScript类型注释
module.exports = {
  /**
   * 执行种子数据插入
   * 当运行 `sequelize db:seed:all` 时会执行此方法
   * @param {QueryInterface} queryInterface - Sequelize查询接口
   * @param {Sequelize} Sequelize - Sequelize类
   */
  async up(queryInterface, Sequelize) {
    // 加密密码的辅助函数
    const hashPassword = async (password) => {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    };

    // 批量插入用户数据到Users表
    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@clwy.cn',        // 管理员邮箱
        username: 'admin',              // 管理员用户名
        password: await hashPassword('123123'),  // 管理员密码（已加密）
        nickname: '超厉害的管理员',      // 管理员昵称
        sex: 2,                         // 性别：2=未选择
        role: 100,                      // 角色：100=管理员
        createdAt: new Date(),          // 创建时间
        updatedAt: new Date()           // 更新时间
      },
      {
        email: 'user1@clwy.cn',         // 用户1邮箱
        username: 'user1',              // 用户1用户名
        password: await hashPassword('123123'),  // 用户1密码（已加密）
        nickname: '普通用户1',           // 用户1昵称
        sex: 0,                         // 性别：0=男性
        role: 0,                        // 角色：0=普通用户
        createdAt: new Date(),          // 创建时间
        updatedAt: new Date()           // 更新时间
      },
      {
        email: 'user2@clwy.cn',         // 用户2邮箱
        username: 'user2',              // 用户2用户名
        password: await hashPassword('123123'),  // 用户2密码（已加密）
        nickname: '普通用户2',           // 用户2昵称
        sex: 0,                         // 性别：0=男性
        role: 0,                        // 角色：0=普通用户
        createdAt: new Date(),          // 创建时间
        updatedAt: new Date()           // 更新时间
      },
      {
        email: 'user3@clwy.cn',         // 用户3邮箱
        username: 'user3',              // 用户3用户名
        password: await hashPassword('123123'),  // 用户3密码（已加密）
        nickname: '普通用户3',           // 用户3昵称
        sex: 1,                         // 性别：1=女性
        role: 0,                        // 角色：0=普通用户
        createdAt: new Date(),          // 创建时间
        updatedAt: new Date()           // 更新时间
      }
    ], {});
  },
  
  /**
   * 回滚种子数据
   * 当运行 `sequelize db:seed:undo` 时会执行此方法
   * @param {QueryInterface} queryInterface - Sequelize查询接口
   * @param {Sequelize} Sequelize - Sequelize类
   */
  async down(queryInterface, Sequelize) {
    // 删除所有用户数据
    await queryInterface.bulkDelete('Users', null, {});
  }
};
