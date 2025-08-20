import { Layout } from '@/components/Layout';
import { generateSEO } from '@/lib/seo';

export const metadata = generateSEO({
  title: '隐私政策',
  description: '工具分享站的隐私政策，了解我们如何收集、使用和保护您的个人信息',
  url: '/privacy',
});

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              隐私政策
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                最后更新日期：2025年1月1日
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                1. 信息收集
              </h2>
              <p className="text-gray-700 mb-4">
                我们可能会收集以下类型的信息：
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>您主动提供的信息（如联系表单中的信息）</li>
                <li>自动收集的技术信息（如IP地址、浏览器类型、访问时间）</li>
                <li>通过Cookie和类似技术收集的信息</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                2. 信息使用
              </h2>
              <p className="text-gray-700 mb-4">
                我们使用收集的信息用于：
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>提供和改进我们的服务</li>
                <li>分析网站使用情况</li>
                <li>显示相关广告</li>
                <li>与您沟通</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                3. Google AdSense
              </h2>
              <p className="text-gray-700 mb-4">
                我们使用Google AdSense在我们的网站上显示广告。Google使用Cookie来根据您对本网站和其他网站的访问情况向您显示个性化广告。Google可能会收集和使用您的信息来改善广告相关性。
              </p>
              <p className="text-gray-700 mb-6">
                您可以通过以下方式管理广告偏好：<br/>• 访问<a href="https://www.google.com/privacy/ads/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google广告设置页面</a>来选择不使用个性化广告<br/>• 访问<a href="https://optout.aboutads.info/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">DAA WebChoices工具</a>来退出基于兴趣的广告
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                4. Cookie使用
              </h2>
              <p className="text-gray-700 mb-6">
                我们使用Cookie来改善用户体验。您可以通过浏览器设置控制Cookie的使用，但这可能会影响网站的某些功能。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                5. 数据安全
              </h2>
              <p className="text-gray-700 mb-6">
                我们采取合理的安全措施来保护您的个人信息，但无法保证互联网传输的绝对安全性。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                6. 第三方链接
              </h2>
              <p className="text-gray-700 mb-6">
                我们的网站可能包含指向第三方网站的链接。我们不对这些网站的隐私做法负责。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                7. 联系我们
              </h2>
              <p className="text-gray-700 mb-6">
                如果您对本隐私政策有任何问题，请通过以下方式联系我们：
              </p>
              <p className="text-gray-700">
                电子邮件：1217112842@qq.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}