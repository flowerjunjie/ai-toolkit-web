
# AI Toolkit Web Interface

**Web界面让非技术用户也能轻松使用AI Toolkit的2096+命令！** 🚀

## 🎯 项目简介

AI Toolkit Web是一个现代化的Web界面，为AI Toolkit命令行工具提供图形化操作界面。让非技术用户（商务人士、研究人员、内容创作者等）也能轻松使用强大的AI工具。

## ✨ 核心特性

- 🎨 **现代化UI**: React 18 + Ant Design 5.x
- 🚀 **高性能**: Vite构建，秒级启动
- 📱 **响应式**: 完美支持桌面和移动端
- 🔍 **智能搜索**: 快速找到需要的命令
- 📊 **表单化操作**: 无需记忆命令语法
- 🌐 **多语言**: 支持中文界面
- 📜 **历史记录**: 支持查看和管理命令执行历史
- ⭐ **收藏功能**: 支持收藏常用命令，一键执行

## 🏗️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **UI库**: Ant Design 5.x
- **构建**: Vite 5.x
- **路由**: React Router 6
- **状态**: Zustand

### 后端
- **框架**: FastAPI 0.109.0
- **ASGI服务器**: Uvicorn
- **验证**: Pydantic 2.x
- **数据库**: SQLite（历史记录和收藏）
- **文档**: Swagger/OpenAPI

## 🚀 快速开始

### 一键启动（推荐）

```bash
# 克隆仓库
git clone https://github.com/flowerjunjie/ai-toolkit-web.git
cd ai-toolkit-web

# 启动服务
./start.sh
```

### 手动启动

#### 1. 后端

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### 2. 前端

```bash
cd frontend
npm install
npm run dev
```

### 访问

- **前端**: http://localhost:3000
- **后端**: http://localhost:8000
- **API文档**: http://localhost:8000/docs

## 📖 使用指南

### 1. 浏览模块

访问首页，查看所有功能模块：

- 🤖 **AI核心**: LLM、RAG、ML、NLP
- 📊 **数据分析**: 统计、可视化、挖掘
- 🔧 **开发工具**: 编码、CI/CD、DevOps
- ☁️ **云服务**: 部署、监控、容器
- 💼 **商业应用**: 电商、营销、金融
- 🔬 **科学研究**: 生物、医疗、物理
- 🏥 **医疗健康**: 医疗分析、健康管理

### 2. 选择命令

点击模块卡片，查看可用命令列表。

### 3. 配置参数

选择命令后，填写表单参数：

- 文本输入
- 数字输入
- 下拉选择
- 文件上传
- 多行文本

### 4. 执行查看结果

点击"执行命令"，实时查看执行状态和结果。

### 5. 历史记录

访问"历史记录"页面，查看和管理所有命令执行历史：
- 搜索和过滤
- 删除或清空
- 重新执行

### 6. 收藏功能

访问"我的收藏"页面，管理收藏的常用命令：
- 在工具页收藏命令
- 搜索和过滤
- 一键执行

## 🎯 核心功能

### ✅ 已实现

- [x] 模块浏览和搜索
- [x] 命令表单生成
- [x] 参数验证
- [x] 文件上传
- [x] 命令执行
- [x] 结果展示
- [x] RESTful API
- [x] Swagger文档
- [x] 历史记录（SQLite存储）
- [x] 收藏功能
- [x] 快速入口
- [x] 首页优化

### 🚧 开发中

- [ ] 用户系统
- [ ] 多语言支持
- [ ] 主题切换
- [ ] 更多动画效果

## 📁 项目结构

```
ai-toolkit-web/
├── frontend/              # 前端
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── pages/        # 页面
│   │   │   ├── home/     # 首页
│   │   │   ├── modules/  # 模块页
│   │   │   ├── tools/    # 工具页
│   │   │   ├── history/  # 历史记录页
│   │   │   ├── favorites/ # 收藏页
│   │   │   └── ...
│   │   ├── data/         # 数据
│   │   └── App.tsx
│   └── package.json
├── backend/              # 后端
│   ├── app/
│   │   ├── api/         # API路由
│   │   │   ├── modules.py
│   │   │   ├── execute.py
│   │   │   ├── history.py # 历史记录API
│   │   │   └── ...
│   │   ├── models/      # 数据模型
│   │   │   ├── history.py # 历史记录模型
│   │   │   └── ...
│   │   ├── core/        # 核心组件
│   │   │   ├── database.py # 数据库配置
│   │   │   └── ...
│   │   └── main.py
│   └── requirements.txt
├── start.sh              # 启动脚本
├── DEPLOYMENT.md         # 部署指南
└── README.md
```

## 🎨 界面预览

### 首页
- 项目统计（108个模块，2096+命令，705K+代码）
- 快速入口（快速开始、仪表盘、历史记录、我的收藏）
- 功能分类（AI核心、数据分析、开发工具、云服务、商业应用、科学研究、医疗健康）

### 模块页
- 模块卡片
- 命令列表
- 分类导航

### 工具页
- 表单配置
- 参数输入
- 收藏按钮
- 结果展示

### 历史记录页
- 历史记录列表
- 搜索和过滤
- 删除和重新执行

### 收藏页
- 收藏列表
- 搜索和过滤
- 一键执行

## 🔗 相关链接

- **主项目**: [AI Toolkit](https://github.com/flowerjunjie/ai-toolkit)
- **在线演示**: 即将上线
- **问题反馈**: [GitHub Issues](https://github.com/flowerjunjie/ai-toolkit-web/issues)

## 🤝 贡献

欢迎贡献代码、提供建议、反馈问题！

## 📄 许可证

MIT License

## 🎉 致谢

- [FastAPI](https://fastapi.tiangolo.com/) - 现代化Python Web框架
- [React](https://react.dev/) - 用户界面JavaScript库
- [Ant Design](https://ant.design/) - 企业级UI设计语言

---

**💰 产品为王 - 用户友好 - 永远beta！** 🚀

Made with ❤️ by AI Toolkit Team
