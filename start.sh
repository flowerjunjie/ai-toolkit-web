#!/bin/bash

# AI Toolkit Web - 启动脚本

set -e

echo "🚀 AI Toolkit Web - 启动服务"
echo "================================"

# 检查Python环境
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3未安装"
    exit 1
fi

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装"
    exit 1
fi

# 启动后端
echo ""
echo "📡 启动后端API服务..."
cd backend

# 创建虚拟环境（如果不存在）
if [ ! -d "venv" ]; then
    echo "创建Python虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
echo "安装Python依赖..."
pip install -q -r requirements.txt

# 启动后端服务（后台）
echo "启动FastAPI服务..."
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0 &
BACKEND_PID=$!
echo "后端PID: $BACKEND_PID"

cd ..

# 启动前端
echo ""
echo "🌐 启动前端Web服务..."
cd frontend

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "安装Node.js依赖..."
    npm install
fi

# 启动前端服务
echo "启动Vite开发服务器..."
npm run dev &
FRONTEND_PID=$!
echo "前端PID: $FRONTEND_PID"

cd ..

# 等待服务启动
sleep 3

# 显示访问信息
echo ""
echo "✅ 服务启动成功！"
echo "================================"
echo "📡 后端API: http://localhost:8000"
echo "📖 API文档: http://localhost:8000/docs"
echo "🌐 前端界面: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务"

# 捕获退出信号
trap "echo ''; echo '🛑 停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

# 等待
wait
