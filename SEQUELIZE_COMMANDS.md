# Sequelize CLI 命令快速参考

## 前提条件

确保已全局安装 Sequelize CLI：
```bash
npm install -g sequelize-cli
```

## 数据库操作命令

### 迁移相关

```bash
# 执行所有待执行的迁移
sequelize db:migrate

# 回滚最后一个迁移
sequelize db:migrate:undo

# 回滚所有迁移
sequelize db:migrate:undo:all

# 查看迁移状态
sequelize db:migrate:status
```

### 种子数据相关

```bash
# 执行所有种子文件
sequelize db:seed:all

# 执行指定的种子文件
sequelize db:seed --seed 20241224111035-article.js

# 回滚最后一个种子
sequelize db:seed:undo

# 回滚所有种子
sequelize db:seed:undo:all
```

### 生成文件

```bash
# 生成迁移文件
sequelize migration:generate --name create-users

# 生成模型文件
sequelize model:generate --name User --attributes name:string,email:string

# 生成种子文件
sequelize seed:generate --name demo-users
```

### 数据库初始化

```bash
# 创建数据库
sequelize db:create

# 删除数据库
sequelize db:drop

# 重置数据库（删除并重新创建）
sequelize db:drop && sequelize db:create && sequelize db:migrate && sequelize db:seed:all
```

## 常用工作流程

### 1. 新功能开发流程

```bash
# 1. 生成迁移文件
sequelize migration:generate --name add-user-avatar

# 2. 编辑迁移文件，定义表结构变更

# 3. 执行迁移
sequelize db:migrate

# 4. 生成种子数据（可选）
sequelize seed:generate --name demo-user-avatars

# 5. 编辑种子文件，添加测试数据

# 6. 执行种子数据
sequelize db:seed:all
```

### 2. 回滚操作流程

```bash
# 1. 查看迁移状态
sequelize db:migrate:status

# 2. 回滚最后一个迁移
sequelize db:migrate:undo

# 3. 如果需要回滚种子数据
sequelize db:seed:undo
```

### 3. 数据库重置流程

```bash
# 完全重置数据库（谨慎使用）
sequelize db:drop
sequelize db:create
sequelize db:migrate
sequelize db:seed:all
```

## 配置文件

Sequelize CLI 使用 `config/config.json` 文件来配置数据库连接：

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

## 注意事项

1. **迁移顺序**: 迁移文件按时间戳顺序执行，确保依赖关系正确
2. **回滚谨慎**: 生产环境谨慎使用回滚命令，可能丢失数据
3. **备份数据**: 重要操作前建议备份数据库
4. **环境配置**: 确保使用正确的环境配置（development/test/production）

## 常见问题

### Q: 迁移失败怎么办？
A: 检查迁移文件语法，确保数据库连接正常，可以尝试回滚后重新执行

### Q: 种子数据重复插入怎么办？
A: 使用 `sequelize db:seed:undo:all` 清空所有种子数据，然后重新执行

### Q: 如何查看当前数据库状态？
A: 使用 `sequelize db:migrate:status` 查看迁移状态

### Q: 如何重置整个数据库？
A: 使用 `sequelize db:drop && sequelize db:create && sequelize db:migrate && sequelize db:seed:all` 