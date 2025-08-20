import { Layout } from '@/components/Layout';
import { generateSEO } from '@/lib/seo';

export const metadata = generateSEO({
  title: '联系我们',
  description: '联系MatrixTools团队，获取技术支持、商务合作或提供建议反馈',
  url: '/contact',
});

export default function ContactPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                联系我们
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                我们很乐意听到您的声音！无论是技术支持、商务合作还是建议反馈，都欢迎与我们联系
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* 联系方式 */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  📞 联系方式
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">📧</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">电子邮箱</h3>
                      <p className="text-blue-600">1217112842@qq.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">⏰</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">回复时间</h3>
                      <p className="text-gray-600">通常在24小时内回复</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">🌍</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">服务时间</h3>
                      <p className="text-gray-600">周一至周五 9:00-18:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 联系类型 */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  💬 联系类型
                </h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900">技术支持</h3>
                    <p className="text-gray-600 text-sm">工具使用问题、技术咨询</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900">内容建议</h3>
                    <p className="text-gray-600 text-sm">工具推荐、教程建议</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-gray-900">商务合作</h3>
                    <p className="text-gray-600 text-sm">广告投放、合作洽谈</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold text-gray-900">问题反馈</h3>
                    <p className="text-gray-600 text-sm">网站问题、用户体验</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 常见问题 */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ❓ 常见问题
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Q: 如何推荐新工具？
                  </h3>
                  <p className="text-gray-700">
                    A: 您可以通过邮件向我们推荐优质工具，请包含工具名称、功能描述、官网链接和推荐理由。我们会认真评估每个推荐。
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Q: 网站内容可以转载吗？
                  </h3>
                  <p className="text-gray-700">
                    A: 欢迎转载分享，但请注明出处并添加原文链接。商业用途请先联系我们获得授权。
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Q: 如何获得最新内容推送？
                  </h3>
                  <p className="text-gray-700">
                    A: 目前我们主要通过网站更新，您可以定期访问查看最新内容。我们正在考虑添加邮件订阅功能。
                  </p>
                </div>
              </div>
            </div>

            {/* 合作机会 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🤝 合作机会
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🔗 友情链接
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">
                    我们欢迎与相关网站交换友情链接
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• 内容相关的技术、工具类网站</li>
                    <li>• 网站结构良好，内容优质</li>
                    <li>• 正常运营，无违规内容</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    📝 内容合作
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">
                    欢迎优质内容创作者与我们合作
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• 工具评测与使用教程</li>
                    <li>• 行业洞察与趋势分析</li>
                    <li>• 实用技巧与经验分享</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}