# AI Toolkit Web Backend

FastAPI后端服务，为Web界面提供API支持。

## 🎯 功能

- ✅ RESTful API
- ✅ 命令执行引擎
- ✅ 文件上传处理
- ✅ JWT认证
- ✅ CORS支持
- ✅ API文档（Swagger）

## 🚀 快速开始

```bash
# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
uvicorn app.main:app --reload --port 8000

# 访问API文档
http://localhost:8000/docs
```

## 📁 项目结构

```
backend/
├── app/
│   ├── api/              # API路由
│   ├── core/             # 核心配置
│   ├── models/           # 数据模型
│   ├── services/         # 业务逻辑
│   └── main.py           # FastAPI应用
└── requirements.txt
```

## 🔗 API端点

### 模块管理
- `GET /api/modules` - 获取所有模块
- `GET /api/modules/{id}` - 获取模块详情
- `GET /api/modules/category/{category}` - 按分类获取模块

### 命令执行
- `POST /api/execute` - 执行命令

### 文件处理
- `POST /api/upload` - 上传文件

---

**💰 产品为王 - 用户友好 - 永远beta！** 🚀
