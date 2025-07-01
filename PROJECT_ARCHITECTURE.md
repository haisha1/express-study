# CLWY-API 项目架构说明

这是一个基于 **Express.js + Sequelize + MySQL** 的后端API项目，用于文章内容管理系统。

## 📁 项目结构

```
clwy-api/
├── app.js                    # Express应用主文件，配置中间件和路由
├── bin/www                   # 服务器启动脚本
├── package.json              # 项目依赖和脚本配置
├── config/
│   └── config.json          # 数据库连接配置
├── models/                   # Sequelize数据模型
│   ├── index.js             # 模型入口，自动加载所有模型
│   └── article.js           # 文章数据模型
├── routes/                   # Express路由
│   ├── index.js             # 主页路由
│   ├── users.js             # 用户路由
│   └── admin/               # 后台管理路由
│       ├── articles.js      # 文章管理CRUD
│       └── test.js          # 测试路由
├── migrations/               # 数据库迁移文件
│   └── *-create-article.js  # 创建文章表
├── seeders/                  # 数据库种子文件
│   └── *-article.js         # 测试文章数据
├── utils/                    # 工具函数
│   └── response.js          # 统一响应处理
└── public/                   # 静态文件目录
```

## 🏗️ 技术栈

### 核心框架
- **Express.js 4.16.1** - Node.js Web应用框架
- **Sequelize 6.37.3** - ORM，用于数据库操作
- **MySQL2 3.11.3** - MySQL数据库驱动

### 开发工具
- **Nodemon 3.1.4** - 开发时热重载
- **Morgan 1.9.1** - HTTP请求日志
- **Debug 2.6.9** - 调试工具

## 🔧 架构设计

### 1. 应用启动流程
```
bin/www → app.js → routes → models → database
```

1. `bin/www` 创建HTTP服务器并启动
2. `app.js` 配置Express应用和中间件
3. 路由处理HTTP请求
4. 模型操作数据库
5. 返回统一格式的JSON响应

### 2. 中间件链
```javascript
// app.js 中间件执行顺序
logger('dev')                    // 1. 请求日志
express.json()                   // 2. JSON解析
express.urlencoded()             // 3. URL编码解析
cookieParser()                   // 4. Cookie解析
express.static()                 // 5. 静态文件服务
路由处理                         // 6. 业务逻辑
```

### 3. 数据库层设计

#### 模型自动加载机制
`models/index.js` 自动扫描并加载所有模型文件：
```javascript
// 扫描 models/ 目录
// 过滤 .js 文件
// 排除 index.js 和测试文件
// 动态加载模型
// 建立模型关联
```

#### 数据验证
模型层提供字段验证：
- 非空验证 (notNull, notEmpty)
- 长度验证 (len)
- 自定义验证规则

### 4. 路由设计

#### RESTful API 设计
```
GET    /admin/articles      # 获取文章列表（支持分页、搜索）
GET    /admin/articles/:id  # 获取单个文章
POST   /admin/articles      # 创建文章
PUT    /admin/articles/:id  # 更新文章
DELETE /admin/articles/:id  # 删除文章
```

#### 错误处理机制
- 统一的成功/失败响应格式
- 自定义错误类 (NotFoundError)
- Sequelize验证错误处理
- 服务器错误兜底处理

### 5. 数据库管理

#### 迁移系统
- 版本化数据库结构变更
- 支持向前迁移和回滚
- 时间戳命名确保执行顺序

#### 种子数据
- 批量插入测试数据
- 支持开发环境数据初始化
- 可回滚的数据操作

## 🚀 开发工作流

### 1. 启动项目
```bash
npm start                    # 启动开发服务器
```

### 2. 数据库操作
```bash
sequelize db:migrate         # 执行迁移
sequelize db:migrate:undo    # 回滚迁移
sequelize db:seed:all        # 运行种子数据
sequelize db:seed:undo       # 回滚种子数据
```

### 3. 创建新功能
```bash
# 1. 创建迁移文件
sequelize migration:generate --name add-new-field

# 2. 创建模型文件
# 在 models/ 目录下创建模型

# 3. 创建路由文件
# 在 routes/ 目录下创建路由

# 4. 创建种子文件（可选）
sequelize seed:generate --name demo-articles
```

## 🔒 安全特性

### 1. 数据验证
- 模型层字段验证
- 请求体白名单过滤
- SQL注入防护（Sequelize ORM）

### 2. 错误处理
- 不暴露敏感错误信息
- 统一错误响应格式
- 适当的HTTP状态码

## 📝 API 响应格式

### 成功响应
```javascript
{
  "status": true,
  "message": "操作成功消息",
  "data": {
    // 响应数据
  }
}
```

### 错误响应
```javascript
{
  "status": false,
  "message": "错误消息",
  "errors": ["具体错误详情"]
}
```

## 🎯 最佳实践

1. **模块化设计** - 每个功能模块独立，职责清晰
2. **统一响应格式** - 所有API返回标准化的JSON格式
3. **错误处理机制** - 完整的错误捕获和处理
4. **数据验证** - 多层数据验证确保数据完整性
5. **代码注释** - 详细的代码注释便于维护
6. **RESTful设计** - 遵循REST API设计规范

这个架构为中小型API项目提供了完整的解决方案，具有良好的可扩展性和维护性。 