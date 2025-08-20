import { Layout } from '@/components/Layout';
import { generateSEO } from '@/lib/seo';

export const metadata = generateSEO({
  title: '使用条款',
  description: '工具分享站的使用条款和服务协议',
  url: '/terms',
});

export default function TermsPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              使用条款
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                最后更新日期：2025年1月1日
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                1. 接受条款
              </h2>
              <p className="text-gray-700 mb-6">
                通过访问和使用工具分享站，您同意遵守本使用条款。如果您不同意这些条款，请停止使用我们的服务。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                2. 服务描述
              </h2>
              <p className="text-gray-700 mb-6">
                工具分享站提供工具推荐、评测和使用教程。我们致力于为用户提供有价值的信息和资源。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                3. 用户责任
              </h2>
              <p className="text-gray-700 mb-4">
                使用我们的服务时，您同意：
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>遵守所有适用的法律法规</li>
                <li>不进行任何可能损害网站的活动</li>
                <li>不发布违法、有害或不当的内容</li>
                <li>尊重他人的知识产权</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                4. 知识产权
              </h2>
              <p className="text-gray-700 mb-6">
                本网站的内容，包括但不限于文本、图像、设计和软件，均受版权和其他知识产权法保护。未经授权，不得复制、分发或修改。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                5. 免责声明
              </h2>
              <p className="text-gray-700 mb-6">
                我们提供的信息仅供参考。我们不保证信息的准确性、完整性或时效性。使用第三方工具的风险由用户自行承担。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                6. 广告
              </h2>
              <p className="text-gray-700 mb-6">
                我们可能在网站上显示广告。广告商对其广告内容负责，我们不对广告内容或通过广告访问的网站负责。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                7. 服务变更
              </h2>
              <p className="text-gray-700 mb-6">
                我们保留随时修改或终止服务的权利，恕不另行通知。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                8. 条款变更
              </h2>
              <p className="text-gray-700 mb-6">
                我们可能会不时更新这些使用条款。更新后的条款将在本页面发布。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                9. 联系信息
              </h2>
              <p className="text-gray-700 mb-6">
                如果您对这些使用条款有任何问题，请联系我们：
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