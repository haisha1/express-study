# CLWY API 项目说明文档

一个基于 Express.js + Sequelize + MySQL 的后台管理系统 API。

## 📋 目录

- [技术栈](#技术栈)
- [环境要求](#环境要求)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [数据库配置](#数据库配置)
- [Sequelize 使用指南](#sequelize-使用指南)
  - [创建模型和迁移文件](#创建模型和迁移文件)
  - [调整迁移文件](#调整迁移文件)
  - [运行迁移](#运行迁移)
  - [创建种子文件](#创建种子文件)
  - [运行种子文件](#运行种子文件)
- [API 接口](#api-接口)
- [常见问题](#常见问题)

## 🛠 技术栈

- **后端框架**: Express.js 4.16.1
- **ORM**: Sequelize 6.37.3
- **数据库**: MySQL 8.3.0
- **开发工具**: Nodemon 3.1.4
- **容器化**: Docker & Docker Compose

### 主要依赖

```json
{
  "express": "~4.16.1",           // Web 应用框架
  "sequelize": "^6.37.3",         // ORM 数据库操作
  "mysql2": "^3.11.3",            // MySQL 数据库驱动
  "nodemon": "^3.1.4",            // 开发时自动重启
  "morgan": "~1.9.1",             // HTTP 请求日志
  "cookie-parser": "~1.4.4",      // Cookie 解析
  "debug": "~2.6.9"               // 调试工具
}
```

## 💻 环境要求

- **Node.js**: >= 14.0.0 (推荐 16+)
- **MySQL**: >= 8.0
- **Docker**: >= 20.0 (可选)
- **Docker Compose**: >= 2.0 (可选)

## 📁 项目结构

```
clwy-api/
├── app.js                      # Express 应用主文件
├── package.json                # 项目依赖配置
├── docker-compose.yml          # Docker 配置
├── bin/
│   └── www                     # 应用启动文件
├── config/
│   └── config.json             # 数据库配置
├── models/                     # Sequelize 模型文件
│   ├── index.js                # 模型入口文件
│   ├── article.js              # 文章模型
│   ├── category.js             # 分类模型
│   └── ...                     # 其他模型
├── migrations/                 # 数据库迁移文件
│   ├── 20240921120750-create-article.js
│   └── ...
├── seeders/                    # 数据库种子文件
│   ├── 20241224111035-article.js
│   └── ...
├── routes/                     # 路由文件
│   ├── index.js                # 主路由
│   ├── users.js                # 用户路由
│   └── admin/                  # 后台管理路由
│       ├── articles.js         # 文章管理
│       └── categorys.js        # 分类管理
├── utils/
│   └── response.js             # 响应处理工具
└── public/                     # 静态文件目录
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <项目地址>
cd clwy-api
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动数据库（使用 Docker）

```bash
docker-compose up -d
```

或者手动安装 MySQL 8.0+，并创建数据库：

```sql
CREATE DATABASE clwy_api_development CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

### 4. 配置数据库连接

编辑 `config/config.json` 文件：

```json
{
  "development": {
    "username": "root",
    "password": "clwy1234",
    "database": "clwy_api_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00"
  }
}
```

### 5. 安装 Sequelize CLI

```bash
npm install -g sequelize-cli
```

### 6. 运行数据库迁移

```bash
npx sequelize-cli db:migrate
```

### 7. 运行种子文件（可选）

```bash
npx sequelize-cli db:seed:all
```

### 8. 启动应用

```bash
npm start
```

服务将在 http://localhost:3000 启动。

## 🗄 数据库配置

### 配置文件说明

`config/config.json` 包含三个环境的配置：

- **development**: 开发环境
- **test**: 测试环境  
- **production**: 生产环境

### 主要配置项

```json
{
  "development": {
    "username": "数据库用户名",
    "password": "数据库密码",
    "database": "数据库名称",
    "host": "数据库主机",
    "dialect": "mysql",
    "timezone": "+08:00"
  }
}
```

## 📚 Sequelize 使用指南

### 创建模型和迁移文件

#### 1. 使用命令生成模型和迁移文件

```bash
# 创建文章模型和迁移文件
npx sequelize-cli model:generate --name Article --attributes title:string,content:text

# 创建分类模型和迁移文件
npx sequelize-cli model:generate --name Category --attributes name:string,rank:integer

# 创建用户模型和迁移文件
npx sequelize-cli model:generate --name User --attributes username:string,email:string,password:string
```

这个命令会同时创建：
- `models/article.js` - 模型文件
- `migrations/20240921120750-create-article.js` - 迁移文件

#### 2. 模型文件示例

```javascript
// models/article.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      // 定义关联关系
      // Article.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }
  
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Article',
    tableName: 'articles',  // 可选：指定表名
    timestamps: true,       // 自动添加 createdAt 和 updatedAt
  });
  
  return Article;
};
```

### 调整迁移文件

#### 1. 基础迁移文件结构

```javascript
// migrations/20240921120750-create-article.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // 添加外键
      categoryId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
    // 添加索引
    await queryInterface.addIndex('Articles', ['categoryId']);
    await queryInterface.addIndex('Articles', ['title']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Articles');
  }
};
```

#### 2. 常用字段类型

```javascript
// 字符串类型
title: {
  type: Sequelize.STRING,        // VARCHAR(255)
  type: Sequelize.STRING(100),   // VARCHAR(100)
  type: Sequelize.TEXT,          // TEXT
  allowNull: false
}

// 数字类型
age: {
  type: Sequelize.INTEGER,       // INT
  type: Sequelize.INTEGER.UNSIGNED, // INT UNSIGNED
  type: Sequelize.DECIMAL(10,2), // DECIMAL(10,2)
  allowNull: false
}

// 日期类型  
birthday: {
  type: Sequelize.DATE,          // DATETIME
  type: Sequelize.DATEONLY,      // DATE
  allowNull: true
}

// 布尔类型
isActive: {
  type: Sequelize.BOOLEAN,       // BOOLEAN
  defaultValue: true
}

// 枚举类型
status: {
  type: Sequelize.ENUM('active', 'inactive', 'pending'),
  defaultValue: 'active'
}
```

#### 3. 创建修改表结构的迁移文件

```bash
# 添加新字段
npx sequelize-cli migration:generate --name add-status-to-articles

# 修改字段
npx sequelize-cli migration:generate --name modify-title-in-articles

# 添加索引
npx sequelize-cli migration:generate --name add-index-to-articles
```

修改迁移文件示例：

```javascript
// 添加字段
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Articles', 'status', {
      type: Sequelize.ENUM('published', 'draft', 'archived'),
      defaultValue: 'draft',
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Articles', 'status');
  }
};

// 修改字段
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Articles', 'title', {
      type: Sequelize.STRING(500),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Articles', 'title', {
      type: Sequelize.STRING(255),
      allowNull: false
    });
  }
};
```

### 运行迁移

#### 1. 执行迁移

```bash
# 运行所有未执行的迁移
npx sequelize-cli db:migrate

# 查看迁移状态
npx sequelize-cli db:migrate:status
```

#### 2. 回滚迁移

```bash
# 回滚最后一个迁移
npx sequelize-cli db:migrate:undo

# 回滚到指定迁移
npx sequelize-cli db:migrate:undo:all --to 20240921120750-create-article.js

# 回滚所有迁移
npx sequelize-cli db:migrate:undo:all
```

### 创建种子文件

#### 1. 生成种子文件

```bash
# 创建文章种子文件
npx sequelize-cli seed:generate --name article-seeder

# 创建分类种子文件  
npx sequelize-cli seed:generate --name category-seeder

# 创建用户种子文件
npx sequelize-cli seed:generate --name user-seeder
```

#### 2. 编写种子文件

```javascript
// seeders/20241224111035-article-seeder.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const articles = [];
    
    // 方法1: 循环生成测试数据
    for (let i = 1; i <= 50; i++) {
      articles.push({
        title: `测试文章标题 ${i}`,
        content: `这是第 ${i} 篇测试文章的内容。内容可以很长很长...`,
        categoryId: Math.floor(Math.random() * 5) + 1, // 随机分类ID 1-5
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    // 方法2: 预定义具体数据
    const specificArticles = [
      {
        title: '如何学习 Node.js',
        content: 'Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境...',
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Express.js 入门指南',
        content: 'Express.js 是一个灵活的 Node.js Web 应用框架...',
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    
    // 合并数据
    const allArticles = [...articles, ...specificArticles];
    
    // 批量插入
    await queryInterface.bulkInsert('Articles', allArticles, {});
  },

  async down(queryInterface, Sequelize) {
    // 删除所有种子数据
    await queryInterface.bulkDelete('Articles', null, {});
    
    // 或者根据条件删除
    // await queryInterface.bulkDelete('Articles', {
    //   title: {
    //     [Sequelize.Op.like]: '测试文章%'
    //   }
    // }, {});
  }
};
```

#### 3. 分类种子文件示例

```javascript
// seeders/category-seeder.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      {
        name: '技术分享',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '生活随笔',
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '学习笔记',
        rank: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '项目经验',
        rank: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '工具推荐',
        rank: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert('Categories', categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
```

### 运行种子文件

#### 1. 执行种子文件

```bash
# 运行所有种子文件
npx sequelize-cli db:seed:all

# 运行指定种子文件
npx sequelize-cli db:seed --seed 20241224111035-article-seeder.js

# 查看种子文件状态
npx sequelize-cli db:seed:status
```

#### 2. 回滚种子数据

```bash
# 回滚最后一个种子文件
npx sequelize-cli db:seed:undo

# 回滚指定种子文件
npx sequelize-cli db:seed:undo --seed 20241224111035-article-seeder.js

# 回滚所有种子文件
npx sequelize-cli db:seed:undo:all
```

## 🔌 API 接口

### 文章管理接口

```
GET    /admin/articles          # 获取文章列表（支持分页和搜索）
GET    /admin/articles/:id      # 获取文章详情
POST   /admin/articles          # 创建文章
PUT    /admin/articles/:id      # 更新文章
DELETE /admin/articles/:id      # 删除文章
```

### 分类管理接口

```
GET    /admin/categorys         # 获取分类列表（支持分页和搜索）
GET    /admin/categorys/:id     # 获取分类详情  
POST   /admin/categorys         # 创建分类
PUT    /admin/categorys/:id     # 更新分类
DELETE /admin/categorys/:id     # 删除分类
```

### 请求示例

#### 创建文章

```bash
curl -X POST http://localhost:3000/admin/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "我的第一篇文章",
    "content": "这是文章内容..."
  }'
```

#### 获取文章列表

```bash
curl "http://localhost:3000/admin/articles?currentPage=1&pageSize=10&title=Node"
```

## ❓ 常见问题

### 1. 数据库连接失败

**问题**: `SequelizeConnectionError: connect ECONNREFUSED`

**解决方案**:
- 检查 MySQL 服务是否启动
- 验证数据库配置信息
- 确认防火墙设置

### 2. 迁移文件执行失败

**问题**: `Migration file not found`

**解决方案**:
```bash
# 检查迁移状态
npx sequelize-cli db:migrate:status

# 重新生成 SequelizeMeta 表
npx sequelize-cli db:migrate --seed
```

### 3. 种子文件重复执行

**问题**: 种子数据重复插入

**解决方案**:
在种子文件中添加重复检查：

```javascript
async up(queryInterface, Sequelize) {
  // 检查是否已存在数据
  const existingCount = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM Articles WHERE title LIKE "测试文章%"',
    { type: Sequelize.QueryTypes.SELECT }
  );
  
  if (existingCount[0].count > 0) {
    console.log('种子数据已存在，跳过插入');
    return;
  }
  
  // 插入数据逻辑...
}
```

### 4. 模型关联问题

**问题**: 关联查询失败

**解决方案**:
确保在模型中正确定义关联：

```javascript
// models/article.js
static associate(models) {
  Article.belongsTo(models.Category, { 
    foreignKey: 'categoryId',
    as: 'category'
  });
}

// 查询时包含关联数据
const articles = await Article.findAll({
  include: [{ 
    model: Category, 
    as: 'category' 
  }]
});
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**作者**: CLWY Team  
**更新时间**: 2024年12月 