#!/bin/bash

# MatrixTools 统一管理脚本
# 整合开发环境和生产环境的所有操作
# 使用方法: ./scripts/manage.sh [环境] [命令] [选项]

set -e

# 项目配置
PROJECT_NAME="matrixtools"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PM2_APP_NAME="matrixtools-web"
ECOSYSTEM_CONFIG="$PROJECT_DIR/config/ecosystem.config.js"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 环境检测
NODE_ENV="${NODE_ENV:-development}"
USE_PM2=false
HAS_SUDO=false

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

log_dev() {
    echo -e "${CYAN}[DEV]${NC} $1"
}

log_prod() {
    echo -e "${PURPLE}[PROD]${NC} $1"
}

# 显示横幅
show_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🛠️ MatrixTools 管理脚本                    ║"
    echo "║              开发环境 & 生产环境 统一管理工具                  ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# 检查依赖
check_dependencies() {
    log_info "检查系统依赖..."

    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装，请先安装 Node.js"
        exit 1
    fi

    # 检查 npm
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装，请先安装 npm"
        exit 1
    fi

    # 检查 PM2
    if command -v pm2 &> /dev/null; then
        USE_PM2=true
        log_success "PM2 已安装，可使用高级进程管理功能"
    else
        log_warning "PM2 未安装，生产环境建议安装 PM2：npm install -g pm2"
    fi

    # 检查 sudo 权限
    if sudo -v 2>/dev/null; then
        HAS_SUDO=true
    fi

    # 检查项目文件
    if [ ! -f "$PROJECT_DIR/package.json" ]; then
        log_error "找不到 package.json，请确保在正确的项目目录中运行脚本"
        exit 1
    fi

    log_success "依赖检查完成"
}

# 显示系统状态
show_system_status() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}                           系统状态                            ${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

    echo "📍 项目目录: $PROJECT_DIR"
    echo "📦 Node.js: $(node --version)"
    echo "📦 npm: $(npm --version)"
    echo "🔧 PM2: $(command -v pm2 &> /dev/null && echo "$(pm2 --version)" || echo "未安装")"
    echo "🔐 Sudo: $([ "$HAS_SUDO" = true ] && echo "可用" || echo "不可用")"
    echo "🌍 当前环境: $NODE_ENV"

    # 显示端口使用情况
    echo ""
    echo "🌐 端口使用情况:"
    if lsof -i :3000 >/dev/null 2>&1; then
        echo "  Port 3000: 🟢 已占用"
        lsof -i :3000 | grep LISTEN | awk '{print "    PID: " $2 ", Process: " $1}'
    else
        echo "  Port 3000: 🔴 空闲"
    fi

    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

# 安装依赖
install_dependencies() {
    log_info "安装项目依赖..."
    cd "$PROJECT_DIR"

    local install_cmd="npm install"
    if [ "$NODE_ENV" = "production" ]; then
        install_cmd="npm ci --only=production"
    fi

    $install_cmd
    log_success "依赖安装完成"
}

# 开发环境相关函数
dev_start() {
    log_dev "启动开发环境..."
    cd "$PROJECT_DIR"

    # 检查端口是否被占用
    if lsof -i :3000 >/dev/null 2>&1; then
        log_warning "端口 3000 已被占用，是否要停止现有进程? (y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            dev_stop
        else
            log_error "请先停止占用端口 3000 的进程"
            exit 1
        fi
    fi

    log_dev "正在启动 Next.js 开发服务器（带 Turbopack）..."
    npm run dev
}

dev_stop() {
    log_dev "停止开发环境..."

    # 停止开发服务器
    local dev_pids=$(pgrep -f "next dev" || true)
    if [ -n "$dev_pids" ]; then
        log_dev "停止 Next.js 开发服务器..."
        echo "$dev_pids" | xargs -r kill -TERM
        sleep 2
        # 强制杀死仍在运行的进程
        echo "$dev_pids" | xargs -r kill -KILL 2>/dev/null || true
    fi

    # 停止任何监听 3000 端口的进程
    local port_pids=$(lsof -ti :3000 || true)
    if [ -n "$port_pids" ]; then
        log_dev "停止占用端口 3000 的进程..."
        echo "$port_pids" | xargs -r kill -TERM
        sleep 1
        echo "$port_pids" | xargs -r kill -KILL 2>/dev/null || true
    fi

    log_success "开发环境已停止"
}

dev_restart() {
    log_dev "重启开发环境..."
    dev_stop
    sleep 2
    dev_start
}

dev_build() {
    log_dev "构建开发版本（用于测试）..."
    cd "$PROJECT_DIR"
    npm run build
    log_success "开发版本构建完成"
}

dev_lint() {
    log_dev "运行代码检查..."
    cd "$PROJECT_DIR"
    npm run lint
    log_success "代码检查完成"
}

dev_format() {
    log_dev "格式化代码..."
    cd "$PROJECT_DIR"
    npm run format
    log_success "代码格式化完成"
}

dev_clean() {
    log_dev "清理开发环境..."
    cd "$PROJECT_DIR"

    # 停止所有相关进程
    dev_stop

    # 清理构建文件
    log_dev "清理构建文件..."
    rm -rf .next
    rm -rf out

    # 清理缓存
    log_dev "清理缓存..."
    rm -rf node_modules/.cache
    rm -rf .next/cache

    # 清理日志
    if [ -d "logs" ]; then
        log_dev "清理日志文件..."
        rm -rf logs/*
    fi

    log_success "开发环境清理完成"
}

# 生产环境相关函数
prod_build() {
    log_prod "构建生产版本..."
    cd "$PROJECT_DIR"

    # 设置生产环境
    export NODE_ENV=production

    # 安装生产依赖
    npm ci --only=production

    # 构建项目
    npm run build

    log_success "生产版本构建完成"
}

prod_start() {
    log_prod "启动生产环境..."
    cd "$PROJECT_DIR"

    export NODE_ENV=production

    if [ "$USE_PM2" = true ]; then
        # 使用 PM2 启动
        if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
            log_warning "应用已在运行，使用 restart 重启应用"
            return 1
        fi

        log_prod "使用 PM2 启动应用..."
        if [ -f "$ECOSYSTEM_CONFIG" ]; then
            pm2 start "$ECOSYSTEM_CONFIG"
        else
            pm2 start npm --name "$PM2_APP_NAME" -- start
        fi
        pm2 save
    else
        # 直接启动
        if [ -f "/tmp/matrixtools.pid" ]; then
            local pid=$(cat /tmp/matrixtools.pid)
            if kill -0 "$pid" 2>/dev/null; then
                log_warning "应用已在运行 (PID: $pid)"
                return 1
            fi
        fi

        log_prod "直接启动应用..."
        mkdir -p logs
        nohup npm start > logs/app.log 2>&1 &
        echo $! > /tmp/matrixtools.pid
        log_info "应用已启动，PID: $(cat /tmp/matrixtools.pid)"
    fi

    log_success "生产环境启动成功"
    prod_status
}

prod_stop() {
    log_prod "停止生产环境..."

    if [ "$USE_PM2" = true ]; then
        # PM2 模式
        if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
            pm2 stop "$PM2_APP_NAME"
            pm2 delete "$PM2_APP_NAME"
            log_success "PM2 应用已停止"
        else
            log_warning "PM2 应用未在运行"
        fi
    else
        # 直接模式
        if [ -f "/tmp/matrixtools.pid" ]; then
            local pid=$(cat /tmp/matrixtools.pid)
            if kill -0 "$pid" 2>/dev/null; then
                log_prod "停止应用 (PID: $pid)..."
                kill "$pid"
                rm -f /tmp/matrixtools.pid
                log_success "应用已停止"
            else
                log_warning "PID文件存在但进程未运行，清理PID文件"
                rm -f /tmp/matrixtools.pid
            fi
        else
            log_warning "应用未在运行"
        fi
    fi

    # 强制清理所有相关进程
    local remaining_pids=$(pgrep -f "npm start\|next start" || true)
    if [ -n "$remaining_pids" ]; then
        log_prod "清理残留进程..."
        echo "$remaining_pids" | xargs -r kill -TERM
        sleep 2
        echo "$remaining_pids" | xargs -r kill -KILL 2>/dev/null || true
    fi
}

prod_restart() {
    log_prod "重启生产环境..."

    if [ "$USE_PM2" = true ]; then
        # PM2 零停机重启
        if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
            log_prod "执行 PM2 零停机重启..."
            pm2 reload "$PM2_APP_NAME"
            log_success "零停机重启完成"
        else
            log_warning "应用未在运行，启动新实例..."
            prod_start
        fi
    else
        # 传统重启
        prod_stop
        sleep 3
        prod_start
    fi

    prod_status
}

prod_status() {
    log_prod "生产环境状态："

    if [ "$USE_PM2" = true ]; then
        # PM2 状态
        if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
            pm2 status "$PM2_APP_NAME"
            echo ""
            echo "📊 详细信息："
            pm2 describe "$PM2_APP_NAME"
        else
            log_warning "PM2 应用未运行"
        fi
    else
        # 直接模式状态
        if [ -f "/tmp/matrixtools.pid" ]; then
            local pid=$(cat /tmp/matrixtools.pid)
            if kill -0 "$pid" 2>/dev/null; then
                echo "✅ 应用正在运行"
                echo "📊 进程ID: $pid"
                echo "💾 内存使用: $(ps -o rss= -p $pid | awk '{print $1/1024 " MB"}')"
                echo "⏱️  运行时间: $(ps -o etime= -p $pid)"
            else
                log_warning "PID文件存在但进程未运行"
                rm -f /tmp/matrixtools.pid
            fi
        else
            log_warning "应用未运行"
        fi
    fi

    # 通用状态信息
    echo ""
    echo "🌐 访问地址: http://localhost:3000"
    echo "📁 项目目录: $PROJECT_DIR"
    echo "📋 查看日志: ./scripts/manage.sh prod logs"
}

prod_logs() {
    log_prod "显示生产环境日志..."

    if [ "$USE_PM2" = true ]; then
        if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
            pm2 logs "$PM2_APP_NAME" --lines 50
        else
            log_error "PM2 应用未运行"
        fi
    else
        if [ -f "logs/app.log" ]; then
            tail -n 50 logs/app.log
        else
            log_error "日志文件不存在"
        fi
    fi
}

prod_deploy() {
    log_prod "执行快速部署..."

    # 停止现有服务
    prod_stop

    # 备份当前版本（可选）
    local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    if [ -d ".next" ]; then
        log_prod "备份当前版本到 $backup_dir..."
        mkdir -p "$backup_dir"
        cp -r .next "$backup_dir/"
    fi

    # 构建新版本
    prod_build

    # 启动服务
    prod_start

    # 健康检查
    log_prod "执行健康检查..."
    sleep 5
    if curl -s -f http://localhost:3000 >/dev/null; then
        log_success "🎉 部署成功！服务运行正常"
    else
        log_error "❌ 部署可能失败，服务无响应"
        if [ -d "$backup_dir" ]; then
            log_warning "可以使用备份进行回滚：./scripts/manage.sh prod rollback $backup_dir"
        fi
    fi

    prod_status
}

# 系统服务管理
install_systemd_service() {
    if [ "$HAS_SUDO" != true ]; then
        log_error "需要 sudo 权限来安装系统服务"
        exit 1
    fi

    log_prod "安装 systemd 服务..."

    # 创建服务文件
    cat > /tmp/matrixtools.service << EOF
[Unit]
Description=MatrixTools Website
After=network.target

[Service]
Type=forking
User=$USER
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/pm2 start $ECOSYSTEM_CONFIG --no-daemon
ExecReload=/usr/bin/pm2 reload $ECOSYSTEM_CONFIG
ExecStop=/usr/bin/pm2 stop $ECOSYSTEM_CONFIG
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    # 安装服务
    sudo mv /tmp/matrixtools.service /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable matrixtools

    log_success "systemd 服务安装完成"
    log_info "使用以下命令管理服务："
    echo "  sudo systemctl start matrixtools"
    echo "  sudo systemctl stop matrixtools"
    echo "  sudo systemctl restart matrixtools"
    echo "  sudo systemctl status matrixtools"
}

# 显示帮助信息
show_help() {
    show_banner

    echo -e "${BLUE}使用方法：${NC}"
    echo "  ./scripts/manage.sh [环境] [命令] [选项]"
    echo ""

    echo -e "${CYAN}🔧 开发环境命令 (dev):${NC}"
    echo "  start         启动开发服务器（热重载）"
    echo "  stop          停止开发服务器"
    echo "  restart       重启开发服务器"
    echo "  build         构建项目（测试用）"
    echo "  lint          运行代码检查"
    echo "  format        格式化代码"
    echo "  clean         清理开发环境缓存"
    echo ""

    echo -e "${PURPLE}🚀 生产环境命令 (prod):${NC}"
    echo "  build         构建生产版本"
    echo "  start         启动生产服务"
    echo "  stop          停止生产服务"
    echo "  restart       重启生产服务"
    echo "  status        显示运行状态"
    echo "  logs          显示应用日志"
    echo "  deploy        快速部署（构建+重启）"
    echo ""

    echo -e "${BLUE}🔧 系统管理命令:${NC}"
    echo "  install       安装项目依赖"
    echo "  status        显示系统状态"
    echo "  install-service  安装 systemd 服务"
    echo "  help          显示帮助信息"
    echo ""

    echo -e "${GREEN}💡 使用示例：${NC}"
    echo "  ./scripts/manage.sh dev start         # 开发环境"
    echo "  ./scripts/manage.sh prod deploy       # 生产部署"
    echo "  ./scripts/manage.sh dev clean         # 清理缓存"
    echo "  ./scripts/manage.sh prod status       # 查看状态"
    echo "  ./scripts/manage.sh status            # 系统状态"
    echo ""

    echo -e "${YELLOW}⚠️  注意事项：${NC}"
    echo "  • 开发环境使用热重载，适合开发调试"
    echo "  • 生产环境使用优化构建，适合部署上线"
    echo "  • 建议安装 PM2 以获得更好的进程管理"
    echo "  • 使用 install-service 可开机自启"
}

# 主函数
main() {
    # 显示横幅
    if [ "$1" != "status" ] && [ "$1" != "help" ]; then
        show_banner
    fi

    # 检查依赖
    check_dependencies

    case "${1:-help}" in
        "dev")
            case "${2:-help}" in
                "start") dev_start ;;
                "stop") dev_stop ;;
                "restart") dev_restart ;;
                "build") dev_build ;;
                "lint") dev_lint ;;
                "format") dev_format ;;
                "clean") dev_clean ;;
                *)
                    log_error "未知的开发环境命令: ${2:-无}"
                    echo "可用命令: start, stop, restart, build, lint, format, clean"
                    ;;
            esac
            ;;
        "prod")
            case "${2:-help}" in
                "build") prod_build ;;
                "start") prod_start ;;
                "stop") prod_stop ;;
                "restart") prod_restart ;;
                "status") prod_status ;;
                "logs") prod_logs ;;
                "deploy") prod_deploy ;;
                *)
                    log_error "未知的生产环境命令: ${2:-无}"
                    echo "可用命令: build, start, stop, restart, status, logs, deploy"
                    ;;
            esac
            ;;
        "install")
            install_dependencies
            ;;
        "status")
            show_system_status
            ;;
        "install-service")
            install_systemd_service
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            log_error "未知命令: ${1:-无}"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"