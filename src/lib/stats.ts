// 统计数据类型定义
export interface PageVisit {
  id: string;
  userId: string; // IP地址作为用户ID
  url: string;
  timestamp: number;
  userAgent: string;
  referer?: string;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  totalVisits: number;
  uniqueUsers: number;
  userVisits: UserVisitDetails[];
}

export interface UserVisitDetails {
  userId: string;
  visitCount: number;
  visitedPages: string[];
  firstVisit: number;
  lastVisit: number;
}

// 内存存储（实际项目中可替换为数据库）
class StatsStorage {
  private visits: PageVisit[] = [];

  // 记录访问
  recordVisit(visit: Omit<PageVisit, 'id' | 'timestamp'>): void {
    const newVisit: PageVisit = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...visit,
    };
    this.visits.push(newVisit);

    // 保持最近1000条记录，避免内存溢出
    if (this.visits.length > 1000) {
      this.visits = this.visits.slice(-1000);
    }
  }

  // 获取指定日期的统计数据
  getDailyStats(date: string): DailyStats {
    const startOfDay = new Date(date).setHours(0, 0, 0, 0);
    const endOfDay = new Date(date).setHours(23, 59, 59, 999);

    const dayVisits = this.visits.filter(
      visit => visit.timestamp >= startOfDay && visit.timestamp <= endOfDay
    );

    const userVisitsMap = new Map<string, UserVisitDetails>();

    dayVisits.forEach(visit => {
      if (!userVisitsMap.has(visit.userId)) {
        userVisitsMap.set(visit.userId, {
          userId: visit.userId,
          visitCount: 0,
          visitedPages: [],
          firstVisit: visit.timestamp,
          lastVisit: visit.timestamp,
        });
      }

      const userStats = userVisitsMap.get(visit.userId)!;
      userStats.visitCount++;

      if (!userStats.visitedPages.includes(visit.url)) {
        userStats.visitedPages.push(visit.url);
      }

      userStats.firstVisit = Math.min(userStats.firstVisit, visit.timestamp);
      userStats.lastVisit = Math.max(userStats.lastVisit, visit.timestamp);
    });

    return {
      date,
      totalVisits: dayVisits.length,
      uniqueUsers: userVisitsMap.size,
      userVisits: Array.from(userVisitsMap.values()),
    };
  }

  // 获取最近几天的数据
  getRecentStats(days: number = 7): DailyStats[] {
    const stats: DailyStats[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      stats.push(this.getDailyStats(dateStr));
    }

    return stats;
  }

  // 获取今日实时统计
  getTodayStats(): DailyStats {
    const today = new Date().toISOString().split('T')[0];
    return this.getDailyStats(today);
  }
}

// 全局实例
export const statsStorage = new StatsStorage();

// 工具函数：获取客户端IP（简化版）
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (real) {
    return real;
  }

  // 开发环境默认IP
  return '127.0.0.1';
}