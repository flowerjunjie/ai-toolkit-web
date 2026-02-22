# AI Toolkit Web - 部署指南

## 🚀 快速启动

### 一键启动（推荐）

```bash
# 给启动脚本添加执行权限
chmod +x start.sh

# 启动所有服务
./start.sh
```

### 手动启动

#### 1. 启动后端

```bash
cd backend

# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt

# 启动服务
uvicorn app.main:app --reload --port 8000
```

#### 2. 启动前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📱 访问服务

启动成功后，访问以下地址：

- **前端界面**: http://localhost:3000
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs

## 🏗️ 生产部署

### 使用Docker（推荐）

```dockerfile
# 后端Dockerfile
FROM python:3.8-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# 前端Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

### 使用Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - CORS_ORIGINS=http://localhost:3000

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

## 🔧 配置说明

### 后端配置

编辑 `backend/.env`:

```bash
APP_NAME="AI Toolkit API"
APP_VERSION="0.1.0"
SECRET_KEY="your-secret-key"
CORS_ORIGINS=["http://localhost:3000"]
```

### 前端配置

编辑 `frontend/src/config.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:8000/api'
```

## 🌐 云平台部署

### Vercel (前端)

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
cd frontend
vercel
```

### Railway (后端)

```bash
# 安装Railway CLI
npm i -g railway

# 部署
cd backend
railway up
```

## 📊 监控

### 健康检查

```bash
# 检查后端
curl http://localhost:8000/health

# 检查前端
curl http://localhost:3000
```

### 日志查看

```bash
# 后端日志
tail -f backend/logs/app.log

# 前端日志
# 查看浏览器控制台
```

## 🔒 安全建议

1. **修改SECRET_KEY**: 生产环境使用强密码
2. **启用HTTPS**: 使用SSL证书
3. **限制CORS**: 仅允许可信域名
4. **文件上传**: 限制文件大小和类型
5. **速率限制**: 防止API滥用

## 📝 维护

### 更新依赖

```bash
# 后端
cd backend
pip list --outdated
pip install -U package-name

# 前端
cd frontend
npm outdated
npm update
```

### 备份

```bash
# 备份数据
tar -czf backup.tar.gz backend/uploads/

# 备份配置
cp backend/.env backend/.env.backup
```

---

**💰 产品为王 - 用户友好 - 生产就绪！** 🚀
