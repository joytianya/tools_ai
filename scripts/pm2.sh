#!/bin/bash

# MatrixTools 快捷管理脚本
# 使用方法: ./pm2.sh [start|stop|restart|status|logs|deploy]

case "${1:-help}" in
    "start")
        echo "🚀 启动生产环境..."
        ./scripts/production.sh start
        ;;
    "stop")
        echo "⏹️  停止生产环境..."
        ./scripts/production.sh stop
        ;;
    "restart")
        echo "🔄 重启生产环境..."
        ./scripts/production.sh restart
        ;;
    "status")
        echo "📊 查看运行状态..."
        ./scripts/production.sh status
        ;;
    "logs")
        echo "📋 查看应用日志..."
        ./scripts/production.sh logs
        ;;
    "deploy")
        echo "🚀 快速部署..."
        ./scripts/production.sh deploy
        ;;
    "build")
        echo "🔨 构建项目..."
        ./scripts/production.sh build
        ;;
    *)
        echo "MatrixTools 快捷管理脚本"
        echo ""
        echo "使用方法: ./pm2.sh [命令]"
        echo ""
        echo "可用命令:"
        echo "  start    启动生产环境"
        echo "  stop     停止生产环境"
        echo "  restart  重启生产环境"
        echo "  status   显示运行状态"
        echo "  logs     显示应用日志"
        echo "  build    构建项目"
        echo "  deploy   快速部署（构建+重启）"
        echo ""
        echo "示例:"
        echo "  ./pm2.sh start     # 启动服务"
        echo "  ./pm2.sh restart   # 重启服务"
        echo "  ./pm2.sh deploy    # 快速部署"
        ;;
esac