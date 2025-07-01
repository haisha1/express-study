# 分类管理 API 文档

## 概述
分类管理API提供完整的CRUD功能，支持创建、查询、更新和删除分类。所有API返回统一格式的JSON响应。

## 基础路径
```
/admin/categories
```

## 统一响应格式

### 成功响应
```json
{
  "status": true,
  "message": "操作成功信息",
  "data": { ... }
}
```

### 失败响应
```json
{
  "status": false,
  "message": "错误信息"
}
```

## API 接口

### 1. 查询分类列表

**请求方式：** `GET /admin/categories`

**查询参数：**
- `currentPage` (可选): 当前页码，默认为1
- `pageSize` (可选): 每页数量，默认为10
- `name` (可选): 分类名称关键词搜索

**请求示例：**
```bash
GET /admin/categories?currentPage=1&pageSize=10&name=技术
```

**响应示例：**
```json
{
  "status": true,
  "message": "查询分类列表成功。",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "技术分享",
        "rank": 1,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "currentPage": 1,
      "pageSize": 10
    }
  }
}
```

### 2. 查询分类详情

**请求方式：** `GET /admin/categories/:id`

**路径参数：**
- `id`: 分类ID

**请求示例：**
```bash
GET /admin/categories/1
```

**响应示例：**
```json
{
  "status": true,
  "message": "查询分类成功。",
  "data": {
    "category": {
      "id": 1,
      "name": "技术分享",
      "rank": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 3. 创建分类

**请求方式：** `POST /admin/categories`

**请求体参数：**
- `name` (必需): 分类名称，长度2-45字符，必须唯一
- `rank` (必需): 排序序号，必须为正整数

**请求示例：**
```bash
POST /admin/categories
Content-Type: application/json

{
  "name": "新技术",
  "rank": 10
}
```

**响应示例：**
```json
{
  "status": true,
  "message": "创建分类成功。",
  "data": {
    "category": {
      "id": 2,
      "name": "新技术",
      "rank": 10,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 4. 更新分类

**请求方式：** `PUT /admin/categories/:id`

**路径参数：**
- `id`: 分类ID

**请求体参数：**
- `name` (可选): 分类名称，长度2-45字符，必须唯一
- `rank` (可选): 排序序号，必须为正整数

**请求示例：**
```bash
PUT /admin/categories/1
Content-Type: application/json

{
  "name": "前端技术",
  "rank": 5
}
```

**响应示例：**
```json
{
  "status": true,
  "message": "更新分类成功。",
  "data": {
    "category": {
      "id": 1,
      "name": "前端技术",
      "rank": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

### 5. 删除分类

**请求方式：** `DELETE /admin/categories/:id`

**路径参数：**
- `id`: 分类ID

**请求示例：**
```bash
DELETE /admin/categories/1
```

**响应示例：**
```json
{
  "status": true,
  "message": "删除分类成功。"
}
```

## 错误处理

### 常见错误响应

**1. 分类不存在（404）**
```json
{
  "status": false,
  "message": "ID: 999的分类未找到。"
}
```

**2. 验证错误（400）**
```json
{
  "status": false,
  "message": "名称已存在，请选择其他名称。"
}
```

**3. 必填字段缺失（400）**
```json
{
  "status": false,
  "message": "名称必须填写。"
}
```

**4. 格式错误（400）**
```json
{
  "status": false,
  "message": "排序必须是正整数。"
}
```

## 数据验证规则

### 分类名称 (name)
- 类型：字符串
- 长度：2-45字符
- 唯一性：不能重复
- 必填：是

### 排序序号 (rank)
- 类型：整数
- 范围：必须为正整数（>0）
- 必填：是

## 使用说明

1. **分页查询**：默认按排序字段（rank）升序排列，支持按名称模糊搜索
2. **唯一性校验**：创建或更新分类时，系统会自动检查名称是否已存在
3. **排序功能**：通过rank字段控制分类的显示顺序，数值越小越靠前
4. **错误处理**：所有接口都有完善的错误处理，返回具体的错误信息
5. **数据安全**：使用白名单机制，只允许修改指定字段，防止恶意数据提交

## 测试建议

可以使用以下工具测试API：
- Postman
- curl 命令
- Thunder Client (VS Code插件)
- 浏览器开发者工具

示例curl命令：
```bash
# 创建分类
curl -X POST http://localhost:3000/admin/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"测试分类","rank":1}'

# 查询分类列表
curl http://localhost:3000/admin/categories

# 更新分类
curl -X PUT http://localhost:3000/admin/categories/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"更新后的分类"}'

# 删除分类
curl -X DELETE http://localhost:3000/admin/categories/1
``` 