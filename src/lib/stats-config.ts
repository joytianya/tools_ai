// 统计排除配置
export const STATS_CONFIG = {
  // 排除的路径（不记录这些页面的访问）
  excludedPaths: [
    '/stats',           // 统计页面本身
    '/api/',            // API路径
    '/_next/',          // Next.js内部资源
    '/favicon.ico',     // 网站图标
    '/robots.txt',      // 爬虫配置
    '/sitemap.xml',     // 网站地图
  ],

  // 排除的用户代理（爬虫、机器人等）
  excludedUserAgents: [
    'bot',
    'crawler',
    'spider',
    'scraper',
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'telegrambot',
  ],

  // 管理员IP地址（这些IP的访问不计入统计）
  adminIPs: [
    '127.0.0.1',        // 本地开发
    '::1',              // IPv6本地
    '::ffff:127.0.0.1', // IPv4映射的IPv6本地地址
    // 在这里添加管理员的真实IP地址
    // '192.168.1.100',  // 示例：管理员的内网IP
    // '203.0.113.45',   // 示例：管理员的公网IP
  ],

  // 排除的引用来源（referrer）
  excludedReferrers: [
    'localhost',
    '127.0.0.1',
  ],
};

// 检查路径是否应该被排除
export function isPathExcluded(path: string): boolean {
  return STATS_CONFIG.excludedPaths.some(excludedPath =>
    path.startsWith(excludedPath)
  );
}

// 检查用户代理是否应该被排除
export function isUserAgentExcluded(userAgent: string): boolean {
  if (!userAgent) return false;

  const lowerUserAgent = userAgent.toLowerCase();
  return STATS_CONFIG.excludedUserAgents.some(excludedAgent =>
    lowerUserAgent.includes(excludedAgent.toLowerCase())
  );
}

// 检查IP是否是管理员
export function isAdminIP(ip: string): boolean {
  return STATS_CONFIG.adminIPs.includes(ip);
}

// 检查引用来源是否应该被排除
export function isReferrerExcluded(referrer: string): boolean {
  if (!referrer) return false;

  return STATS_CONFIG.excludedReferrers.some(excludedRef =>
    referrer.includes(excludedRef)
  );
}

// 综合检查是否应该排除此次访问
export function shouldExcludeVisit(params: {
  path: string;
  userAgent?: string;
  ip: string;
  referrer?: string;
}): { excluded: boolean; reason?: string } {
  const { path, userAgent, ip, referrer } = params;

  // 检查路径排除
  if (isPathExcluded(path)) {
    return { excluded: true, reason: `排除路径: ${path}` };
  }

  // 检查管理员IP
  if (isAdminIP(ip)) {
    return { excluded: true, reason: `管理员IP: ${ip}` };
  }

  // 检查用户代理排除
  if (userAgent && isUserAgentExcluded(userAgent)) {
    return { excluded: true, reason: `排除用户代理: ${userAgent}` };
  }

  // 检查引用来源排除
  if (referrer && isReferrerExcluded(referrer)) {
    return { excluded: true, reason: `排除引用来源: ${referrer}` };
  }

  return { excluded: false };
}