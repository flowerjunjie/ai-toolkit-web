#!/bin/bash

echo "🚀 AI Toolkit Web - 部署到公网IP"
echo "================================"

# 获取公网IP
PUBLIC_IP=$(curl -s ifconfig.me)
echo "📡 公网IP: $PUBLIC_IP"

# 启动后端
echo ""
echo "📡 启动后端API服务..."
cd backend

# 创建虚拟环境
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate

# 安装依赖
pip install -q -r requirements.txt

# 启动后端（监听0.0.0.0，允许公网访问）
echo "启动FastAPI服务（监听0.0.0.0:8000）..."
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "后端PID: $BACKEND_PID"

cd ..

# 启动前端
echo ""
echo "🌐 启动前端Web服务..."
cd frontend

# 安装依赖
if [ ! -d "node_modules" ]; then
    npm install
fi

# 启动前端（监听0.0.0.0，允许公网访问）
echo "启动Vite服务（监听0.0.0.0:3000）..."
nohup npm run dev -- --host 0.0.0.0 --port 3000 > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "前端PID: $FRONTEND_PID"

cd ..

# 等待服务启动
sleep 5

echo ""
echo "✅ 部署成功！"
echo "================================"
echo "🌐 前端: http://$PUBLIC_IP:3000"
echo "📡 后端: http://$PUBLIC_IP:8000"
echo "📖 API文档: http://$PUBLIC_IP:8000/docs"
echo ""
echo "📝 查看日志:"
echo "  后端: tail -f /tmp/backend.log"
echo "  前端: tail -f /tmp/frontend.log"
echo ""
echo "🛑 停止服务:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "🔥 现在可以通过公网IP访问了！"

# 保存PID
echo $BACKEND_PID > /tmp/backend.pid
echo $FRONTEND_PID > /tmp/frontend.pid

