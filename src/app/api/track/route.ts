import { NextRequest, NextResponse } from 'next/server';
import { statsStorage, getClientIP } from '@/lib/stats';

// POST /api/track - 记录访问
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, userAgent, referer } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // 强制排除逻辑测试
    if (url === '/stats') {
      console.log(`统计页面被访问，应该排除: ${url}`);
      return NextResponse.json({
        excluded: true,
        reason: '排除统计页面',
        success: false,
      });
    }

    if (userAgent && userAgent.toLowerCase().includes('bot')) {
      console.log(`爬虫访问，应该排除: ${userAgent}`);
      return NextResponse.json({
        excluded: true,
        reason: '排除爬虫访问',
        success: false,
      });
    }

    const clientIP = getClientIP(request);
    console.log(`正常访问: ${url}, IP: ${clientIP}`);

    // 记录访问
    statsStorage.recordVisit({
      userId: clientIP,
      url,
      userAgent: userAgent || 'Unknown',
      referer: referer || request.headers.get('referer') || undefined,
    });

    return NextResponse.json({
      success: true,
      excluded: false,
    });
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    );
  }
}