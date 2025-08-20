#!/bin/bash

echo "🚀 正在重启 MatrixTools 服务..."

# 检查是否有 Next.js 进程在运行
echo "📋 检查当前运行的进程..."
ps aux | grep next

# 停止所有相关进程
echo "🛑 停止现有服务..."
pkill -f "next"
pkill -f "node.*3000"

# 等待进程完全停止
echo "⏳ 等待进程停止..."
sleep 3

# 清理缓存
echo "🧹 清理缓存..."
rm -rf .next
rm -rf node_modules/.cache

# 重新安装依赖（如果需要）
echo "📦 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "💾 安装依赖..."
    npm install
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 启动服务
echo "🚀 启动生产服务..."
npm start &

# 检查服务状态
echo "⏳ 等待服务启动..."
sleep 5

echo "✅ 检查服务状态..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 && echo " - 服务运行正常!" || echo " - 服务启动失败!"

echo "🎉 服务重启完成！"
echo "🌐 访问地址: http://localhost:3000"
echo "📖 教程页面: http://localhost:3000/tutorials"
echo "🔍 Figma教程: http://localhost:3000/tutorials/figma-beginner-complete-guide"

# 显示最新的进程信息
echo ""
echo "📋 当前运行的进程:"
ps aux | grep -E "(next|node.*3000)" | grep -v grep