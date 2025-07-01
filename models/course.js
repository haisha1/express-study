// 课程数据模型 - 定义课程的数据结构、验证规则和数据库映射

'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  // 定义Course类，继承自Sequelize的Model基类
  class Course extends Model {
    /**
     * 模型关联方法 - 定义与其他模型的关系
     * 这个方法不是Sequelize生命周期的一部分
     * models/index.js文件会自动调用这个方法
     */
    static associate(models) {
      // 课程属于某个分类（多对一关系）
      models.Course.belongsTo(models.Category, { 
        foreignKey: 'categoryId',
        as: 'category'  // 别名，用于查询时使用
      });
      
      // 课程属于某个用户/作者（多对一关系）
      models.Course.belongsTo(models.User, { 
        foreignKey: 'userId',
        as: 'user'  // 别名，用于查询时使用
      });
    }
  }
  // 初始化Course模型，定义字段属性和验证规则
  Course.init(
    {
      categoryId: { // 分类ID，外键
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {msg: '分类ID必须填写。'},
          notEmpty: {msg: '分类ID不能为空。'},
          async isPresent(value) {
            const category = await sequelize.models.Category.findByPk(value);
            if (!category) {
              throw new Error(`ID为：${value} 的分类不存在。`);
            }
          },
        },
      },
      userId: { // 用户ID，外键
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {msg: '用户ID必须填写。'},
          notEmpty: {msg: '用户ID不能为空。'},
          async isPresent(value) {
            const user = await sequelize.models.User.findByPk(value);
            if (!user) {
              throw new Error(`ID为：${value} 的用户不存在。`);
            }
          },
        },
      },
      name: { // 课程名称
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {msg: '名称必须填写。'},
          notEmpty: {msg: '名称不能为空。'},
          len: {args: [2, 45], msg: '名称长度必须是2 ~ 45之间。'},
        },
      },
      image: { // 课程封面图片
        type: DataTypes.STRING,
        validate: {
          isUrl: {msg: '图片地址不正确。'},
        },
      },
      recommended: { // 是否推荐课程
        type: DataTypes.BOOLEAN,
        validate: {
          isIn: {
            args: [[true, false]],
            msg: '是否推荐的值必须是，推荐:true 不推荐:false。',
          },
        },
      },
      introductory: { // 是否为入门课程
        type: DataTypes.BOOLEAN,
        validate: {
          isIn: {
            args: [[true, false]],
            msg: '是否入门课程的值必须是，推荐:true 不推荐:false。',
          },
        },
      },
      content: DataTypes.TEXT, // 课程介绍内容
      likesCount: DataTypes.INTEGER, // 点赞数
      chaptersCount: DataTypes.INTEGER, // 章节数
    },
    {
      sequelize,
      modelName: 'Course',
      // tableName: 'Courses', // 可选：显式指定表名
      // timestamps: true, // 可选：启用时间戳字段，默认为true
    }
  );
  return Course;
};
