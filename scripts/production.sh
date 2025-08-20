#!/bin/bash

# MatrixTools 生产环境管理脚本
# 使用方法: ./scripts/production.sh [start|stop|restart|status|logs|build]

set -e

# 项目配置
PROJECT_NAME="matrixtools"
PROJECT_DIR="/home/zxw/projects/tools_ai"
PM2_APP_NAME="matrixtools-web"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装"
        exit 1
    fi
    
    # 检查 PM2
    if ! command -v pm2 &> /dev/null; then
        log_warning "PM2 未安装，正在安装..."
        npm install -g pm2
    fi
    
    log_success "依赖检查完成"
}

# 构建项目
build_project() {
    log_info "开始构建项目..."
    cd "$PROJECT_DIR"
    
    # 安装依赖
    log_info "安装依赖包..."
    npm ci --only=production
    
    # 构建项目
    log_info "构建 Next.js 项目..."
    npm run build
    
    log_success "项目构建完成"
}

# 启动生产服务
start_production() {
    log_info "启动生产环境..."
    cd "$PROJECT_DIR"
    
    # 检查是否已经在运行
    if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
        log_warning "应用已在运行，使用 restart 重启应用"
        return 1
    fi
    
    # 使用 PM2 启动应用
    pm2 start npm --name "$PM2_APP_NAME" -- start
    pm2 save
    
    log_success "生产环境启动成功"
    show_status
}

# 停止服务
stop_production() {
    log_info "停止生产环境..."
    
    if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
        pm2 stop "$PM2_APP_NAME"
        pm2 delete "$PM2_APP_NAME"
        log_success "生产环境已停止"
    else
        log_warning "应用未在运行"
    fi
}

# 重启服务
restart_production() {
    log_info "重启生产环境..."
    
    if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
        pm2 restart "$PM2_APP_NAME"
        log_success "生产环境重启成功"
    else
        log_warning "应用未在运行，启动新实例..."
        start_production
    fi
    
    show_status
}

# 显示状态
show_status() {
    log_info "应用状态:"
    pm2 status "$PM2_APP_NAME" 2>/dev/null || log_warning "应用未在运行"
    
    log_info "应用信息:"
    if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
        echo "📊 应用名称: $PM2_APP_NAME"
        echo "🌐 访问地址: http://localhost:3000"
        echo "📁 项目目录: $PROJECT_DIR"
        echo "📋 查看日志: pm2 logs $PM2_APP_NAME"
        echo "🔄 重启应用: pm2 restart $PM2_APP_NAME"
    fi
}

# 显示日志
show_logs() {
    log_info "显示应用日志..."
    if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
        pm2 logs "$PM2_APP_NAME" --lines 50
    else
        log_error "应用未在运行"
    fi
}

# 快速部署
quick_deploy() {
    log_info "开始快速部署..."
    
    # 停止现有服务
    if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
        pm2 stop "$PM2_APP_NAME"
    fi
    
    # 构建项目
    build_project
    
    # 启动或重启服务
    if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
        pm2 restart "$PM2_APP_NAME"
    else
        pm2 start npm --name "$PM2_APP_NAME" -- start
        pm2 save
    fi
    
    log_success "快速部署完成"
    show_status
}

# 显示帮助
show_help() {
    echo -e "${BLUE}MatrixTools 生产环境管理脚本${NC}"
    echo ""
    echo "使用方法:"
    echo "  ./scripts/production.sh [命令]"
    echo ""
    echo "可用命令:"
    echo "  start      启动生产环境"
    echo "  stop       停止生产环境"
    echo "  restart    重启生产环境"
    echo "  status     显示运行状态"
    echo "  logs       显示应用日志"
    echo "  build      构建项目"
    echo "  deploy     快速部署（构建+重启）"
    echo "  help       显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  ./scripts/production.sh start     # 启动服务"
    echo "  ./scripts/production.sh restart   # 重启服务"
    echo "  ./scripts/production.sh deploy    # 快速部署"
}

# 主函数
main() {
    check_dependencies
    
    case "${1:-help}" in
        "start")
            start_production
            ;;
        "stop")
            stop_production
            ;;
        "restart")
            restart_production
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs
            ;;
        "build")
            build_project
            ;;
        "deploy")
            quick_deploy
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"