// 用户数据模型 - 定义用户的数据结构、验证规则和数据库映射

'use strict';

// 引入Sequelize的Model基类
const {Model} = require('sequelize');
// 引入bcryptjs用于密码加密
const bcrypt = require('bcryptjs');

// 导出模型定义函数，接收sequelize实例和数据类型作为参数
module.exports = (sequelize, DataTypes) => {
  // 定义User类，继承自Sequelize的Model基类
  class User extends Model {
    /**
     * 模型关联方法 - 定义与其他模型的关系
     * 这个方法不是Sequelize生命周期的一部分
     * models/index.js文件会自动调用这个方法
     */
    static associate(models) {
      // 一个用户可以创建多个课程（一对多关系）
      models.User.hasMany(models.Course, { 
        foreignKey: 'userId',
        as: 'courses'  // 别名，用于查询时使用
      });
      
      // 一个用户可以写多篇文章（一对多关系）
      // models.User.hasMany(models.Article, { 
      //   foreignKey: 'authorId',
      //   as: 'articles'
      // });
    }

    /**
     * 验证密码是否正确
     * @param {string} password - 明文密码
     * @returns {Promise<boolean>} 密码是否匹配
     */
    async validatePassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    /**
     * 加密密码
     * @param {string} password - 明文密码
     * @returns {Promise<string>} 加密后的密码
     */
    static async hashPassword(password) {
      const saltRounds = 10; // 加密强度，数值越大越安全但越慢
      return await bcrypt.hash(password, saltRounds);
    }
  }
  
  // 初始化User模型，定义字段属性和验证规则
  User.init(
    {
      // 字段定义对象
      email: {                              // 用户邮箱字段
        type: DataTypes.STRING,             // 数据类型：字符串
        allowNull: false,                   // 不允许为空值
        validate: {                         // 字段验证规则
          notNull: {msg: '邮箱必须填写。'},  // 非空验证
          notEmpty: {msg: '邮箱不能为空。'}, // 非空字符串验证
          isEmail: {msg: '邮箱格式不正确。'}, // 邮箱格式验证
          async isUnique(value) {           // 自定义唯一性验证
            const user = await User.findOne({where: {email: value}});
            if (user) {
              throw new Error('邮箱已存在，请直接登录。');
            }
          },
        },
      },
      username: {                           // 用户名字段
        type: DataTypes.STRING,             // 数据类型：字符串
        allowNull: false,                   // 不允许为空值
        validate: {                         // 字段验证规则
          notNull: {msg: '用户名必须填写。'}, // 非空验证
          notEmpty: {msg: '用户名不能为空。'}, // 非空字符串验证
          len: {args: [2, 45], msg: '用户名长度必须是2 ~ 45之间。'}, // 长度验证
          async isUnique(value) {           // 自定义唯一性验证
            const user = await User.findOne({where: {username: value}});
            if (user) {
              throw new Error('用户名已经存在。');
            }
          },
        },
      },
      password: {                           // 密码字段
        type: DataTypes.STRING,             // 数据类型：字符串（存储加密后的密码）
        allowNull: false,                   // 不允许为空值
        validate: {                         // 字段验证规则
          notNull: {msg: '密码必须填写。'},   // 非空验证
          notEmpty: {msg: '密码不能为空。'},  // 非空字符串验证
          len: {args: [6, 45], msg: '密码长度必须是6 ~ 45之间。'}, // 长度验证
        },
      },
      nickname: {                           // 昵称字段
        type: DataTypes.STRING,             // 数据类型：字符串
        allowNull: false,                   // 不允许为空值
        validate: {                         // 字段验证规则
          notNull: {msg: '昵称必须填写。'},   // 非空验证
          notEmpty: {msg: '昵称不能为空。'},  // 非空字符串验证
          len: {args: [2, 45], msg: '昵称长度必须是2 ~ 45之间。'}, // 长度验证
        },
      },
      sex: {                                // 性别字段
        type: DataTypes.TINYINT,            // 数据类型：小整数
        allowNull: false,                   // 不允许为空值
        validate: {                         // 字段验证规则
          notNull: {msg: '性别必须填写。'},   // 非空验证
          notEmpty: {msg: '性别不能为空。'},  // 非空验证
          isIn: {                           // 枚举值验证
            args: [[0, 1, 2]],              // 允许的值：0=男性，1=女性，2=未选择
            msg: '性别的值必须是，男性：0 女性：1 未选择：2。',
          },
        },
      },
      company: DataTypes.STRING,            // 公司字段（可选）
      introduce: DataTypes.TEXT,            // 个人介绍字段（可选，长文本）
      role: {                               // 用户角色字段
        type: DataTypes.TINYINT,            // 数据类型：小整数
        allowNull: false,                   // 不允许为空值
        validate: {                         // 字段验证规则
          notNull: {msg: '用户组必须选择。'}, // 非空验证
          notEmpty: {msg: '用户组不能为空。'}, // 非空验证
          isIn: {                           // 枚举值验证
            args: [[0, 100]],               // 允许的值：0=普通用户，100=管理员
            msg: '用户组的值必须是，普通用户：0 管理员：100。',
          },
        },
      },
      avatar: {                             // 头像字段（可选）
        type: DataTypes.STRING,             // 数据类型：字符串（URL地址）
        validate: {                         // 字段验证规则
          isUrl: {msg: '图片地址不正确。'},   // URL格式验证
        },
      },
      // 注意：id、createdAt、updatedAt字段会被Sequelize自动添加
      // id: 主键，自增整数
      // createdAt: 创建时间，自动管理
      // updatedAt: 更新时间，自动管理
    },
    {
      // 模型配置选项
      sequelize,                            // 传入sequelize实例
      modelName: 'User',                    // 模型名称，用于关联和引用
      // tableName: 'users',                // 可选：显式指定表名，默认会自动推断
      // timestamps: true,                  // 可选：启用时间戳字段，默认为true
      // paranoid: true,                    // 可选：启用软删除，添加deletedAt字段
      // underscored: true,                 // 可选：使用下划线命名约定
      
      // 钩子函数 - 在数据操作前后执行
      hooks: {
        /**
         * 创建用户前钩子 - 加密密码
         * @param {Object} user - 用户实例
         * @param {Object} options - 选项
         */
        async beforeCreate(user, options) {
          // 如果密码存在且不是已经加密的格式，则进行加密
          if (user.password && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
            user.password = await User.hashPassword(user.password);
          }
        },
        
        /**
         * 更新用户前钩子 - 加密密码
         * @param {Object} user - 用户实例
         * @param {Object} options - 选项
         */
        async beforeUpdate(user, options) {
          // 如果密码字段被修改且不是已经加密的格式，则进行加密
          if (user.changed('password') && user.password && 
              !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
            user.password = await User.hashPassword(user.password);
          }
        }
      }
    }
  );
  
  // 返回定义好的User模型
  return User;
};
