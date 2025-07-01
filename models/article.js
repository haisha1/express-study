// 文章数据模型 - 定义文章的数据结构、验证规则和数据库映射

'use strict';

// 引入Sequelize的Model基类
const {Model} = require('sequelize');

// 导出模型定义函数，接收sequelize实例和数据类型作为参数
module.exports = (sequelize, DataTypes) => {
  // 定义Article类，继承自Sequelize的Model基类
  class Article extends Model {
    /**
     * 模型关联方法 - 定义与其他模型的关系
     * 这个方法不是Sequelize生命周期的一部分
     * models/index.js文件会自动调用这个方法
     */
    static associate(models) {
      // 在这里定义模型关联关系
      // 例如：Article.belongsTo(models.Category, { foreignKey: 'categoryId' });
      // 例如：Article.hasMany(models.Comment, { foreignKey: 'articleId' });
    }
  }
  
  // 初始化Article模型，定义字段属性和验证规则
  Article.init(
    {
      // 字段定义对象
      title: {                           // 文章标题字段
        type: DataTypes.STRING,          // 数据类型：字符串（VARCHAR）
        allowNull: false,                // 不允许为空值
        validate: {                      // 字段验证规则
          notNull: {                     // 非空验证
            msg: '标题必须存在。',        // 验证失败时的错误消息
          },
          notEmpty: {                    // 非空字符串验证
            msg: '标题不能为空。',        // 验证失败时的错误消息
          },
          len: {                         // 长度验证
            args: [2, 45],               // 参数：最小2个字符，最大45个字符
            msg: '标题长度需要在2 ~ 45个字符之间。', // 验证失败时的错误消息
          },
        },
      },
      content: {                         // 文章内容字段
        type: DataTypes.TEXT,            // 数据类型：长文本（TEXT）
        allowNull: false,                // 不允许为空值
        validate: {                      // 字段验证规则
          notNull: {                     // 非空验证
            msg: '内容必须存在。',        // 验证失败时的错误消息
          },
          notEmpty: {                    // 非空字符串验证
            msg: '内容不能为空。',        // 验证失败时的错误消息
          },
        }, 
      },
      // 注意：id、createdAt、updatedAt字段会被Sequelize自动添加
      // id: 主键，自增整数
      // createdAt: 创建时间，自动管理
      // updatedAt: 更新时间，自动管理
    },
    {
      // 模型配置选项
      sequelize,                         // 传入sequelize实例
      modelName: 'Article',              // 模型名称，用于关联和引用
      // tableName: 'articles',          // 可选：显式指定表名，默认会自动推断
      // timestamps: true,               // 可选：启用时间戳字段，默认为true
      // paranoid: true,                 // 可选：启用软删除，添加deletedAt字段
      // underscored: true,              // 可选：使用下划线命名约定
    }
  );
  
  // 返回定义好的Article模型
  return Article;
};
