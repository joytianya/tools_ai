import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: '调试路由工作正常',
    timestamp: new Date().toISOString(),
    path: request.nextUrl.pathname,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // 测试排除逻辑
  if (body.url === '/stats') {
    return NextResponse.json({
      excluded: true,
      reason: 'debug: 统计页面被排除',
      success: false,
    });
  }

  return NextResponse.json({
    message: '调试POST正常',
    received: body,
    excluded: false,
    success: true,
  });
}