// Sequelize ORM 模型入口文件 - 自动加载所有模型并建立数据库连接

'use strict';

// 引入必要的Node.js核心模块
const fs = require('fs');                    // 文件系统模块，用于读取文件和目录
const path = require('path');                // 路径处理模块，用于处理文件路径
const Sequelize = require('sequelize');     // Sequelize ORM核心模块
const process = require('process');          // 进程模块，用于获取环境变量等进程信息

// 获取当前文件名（不包含路径）
const basename = path.basename(__filename);

// 确定运行环境，默认为development开发环境
const env = process.env.NODE_ENV || 'development';

// 根据环境加载对应的数据库配置
const config = require(__dirname + '/../config/config.json')[env];

// 创建空对象，用于存储所有的数据库模型
const db = {};

// 声明Sequelize实例变量
let sequelize;

// 根据配置创建Sequelize实例
if (config.use_env_variable) {
  // 如果配置中指定了环境变量名，从环境变量中获取数据库连接字符串
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // 使用配置文件中的详细配置创建数据库连接
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 自动扫描并加载当前目录下的所有模型文件
fs
  .readdirSync(__dirname)           // 读取models目录下的所有文件
  .filter(file => {                 // 过滤文件，只处理符合条件的模型文件
    return (
      file.indexOf('.') !== 0 &&    // 排除隐藏文件（以.开头的文件）
      file !== basename &&          // 排除当前文件（index.js）
      file.slice(-3) === '.js' &&   // 只处理.js文件
      file.indexOf('.test.js') === -1  // 排除测试文件
    );
  })
  .forEach(file => {                // 遍历过滤后的文件
    // 动态引入每个模型文件，并传入sequelize实例和数据类型
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    // 将模型添加到db对象中，以模型名作为键
    db[model.name] = model;
  });

// 建立模型之间的关联关系
Object.keys(db).forEach(modelName => {  // 遍历所有已加载的模型
  if (db[modelName].associate) {         // 如果模型定义了associate方法
    db[modelName].associate(db);         // 调用associate方法建立关联关系
  }
});

// 将sequelize实例和Sequelize类添加到db对象中
db.sequelize = sequelize;  // 数据库连接实例，用于执行原生SQL等操作
db.Sequelize = Sequelize;  // Sequelize类，包含数据类型、操作符等

// 导出db对象，供其他模块使用
// 其他文件可以通过 const { Article, sequelize } = require('./models') 的方式使用
module.exports = db;
