'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 一个分类可以有多个课程（一对多关系）
      models.Category.hasMany(models.Course, { 
        foreignKey: 'categoryId',
        as: 'courses'  // 别名，用于查询时使用
      });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '名称必须填写。' },
        notEmpty: { msg: '名称不能为空。' },
        len: { args: [2, 45], msg: '长度必须是2 ~ 45之间。' },
        async isUnique(value) {
          const category = await Category.findOne({ where: { name: value } })
          if (category) {
            throw new Error('名称已存在，请选择其他名称。');
          }
        }
      }
    },
    
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '排序必须填写。' },
        notEmpty: { msg: '排序不能为空。' },
        isInt: { msg: '排序必须为整数。' },
        isPositive(value) {
          if (value <= 0) {
            throw new Error('排序必须是正整数。');
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};