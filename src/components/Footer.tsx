import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🛠️</span>
              <span className="text-xl font-bold">工具分享站</span>
            </Link>
            <p className="text-gray-400 text-sm">
              为新手提供最实用的工具推荐和详细教程，快速提升工作效率
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速导航</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools" className="text-gray-400 hover:text-white transition-colors">
                  工具分享
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-gray-400 hover:text-white transition-colors">
                  教程中心
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-white transition-colors">
                  搜索工具
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">热门内容</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tutorials/google-adsense-guide-for-beginners" className="text-gray-400 hover:text-white transition-colors">
                  AdSense申请指南
                </Link>
              </li>
              <li>
                <Link href="/tools/1" className="text-gray-400 hover:text-white transition-colors">
                  VS Code
                </Link>
              </li>
              <li>
                <Link href="/tools/2" className="text-gray-400 hover:text-white transition-colors">
                  Figma
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">法律信息</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  使用条款
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {SITE_CONFIG.name}. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>
  );
}