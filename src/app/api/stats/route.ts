import { NextRequest, NextResponse } from 'next/server';
import { statsStorage } from '@/lib/stats';

// GET /api/stats - 获取统计数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const days = searchParams.get('days');

    if (date) {
      // 获取指定日期的统计
      const stats = statsStorage.getDailyStats(date);
      return NextResponse.json(stats);
    } else if (days) {
      // 获取最近几天的统计
      const stats = statsStorage.getRecentStats(parseInt(days));
      return NextResponse.json(stats);
    } else {
      // 默认返回今日统计
      const stats = statsStorage.getTodayStats();
      return NextResponse.json(stats);
    }
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}