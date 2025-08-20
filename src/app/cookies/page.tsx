import { Layout } from '@/components/Layout';
import { generateStructuredData } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/constants';
import Script from 'next/script';

export const metadata = {
  title: 'Cookie政策 - MatrixTools',
  description: 'MatrixTools网站Cookie使用政策和隐私保护说明',
};

export default function CookiesPage() {
  const structuredData = generateStructuredData({
    type: 'Article',
    name: 'Cookie政策 - MatrixTools',
    description: 'MatrixTools网站Cookie使用政策和隐私保护说明',
    url: `${SITE_CONFIG.url}/cookies`,
  });

  return (
    <>
      <Script
        id="cookies-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Layout>
        <div className="bg-gray-50 min-h-screen py-8">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                🍪 Cookie政策
              </h1>
              
              <div className="text-gray-600 leading-relaxed space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-blue-800 font-medium">
                    本Cookie政策说明MatrixTools网站如何使用Cookie和类似技术来提供更好的用户体验。
                  </p>
                </div>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">什么是Cookie？</h2>
                  <p className="mb-4">
                    Cookie是网站在您访问时存储在您设备上的小型数据文件。它们被广泛用于使网站正常工作，或者更高效地工作，以及向网站所有者提供信息。
                  </p>
                  <p>
                    Cookie通常包含网站名称、存储期限以及唯一编号等信息。这些信息帮助网站记住您的偏好设置，改善您的浏览体验。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">我们如何使用Cookie</h2>
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">🔧 必要的Cookie</h3>
                      <p>
                        这些Cookie对于网站的基本功能至关重要，包括页面导航、安全功能和基本的用户界面操作。没有这些Cookie，网站将无法正常运行。
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 分析Cookie</h3>
                      <p>
                        我们使用分析Cookie来了解访问者如何与网站互动，帮助我们改进网站内容和用户体验。这些数据是匿名收集的，不会识别您的个人身份。
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">🎯 功能性Cookie</h3>
                      <p>
                        这些Cookie使网站能够记住您的选择（如用户名、语言或地区），并提供增强的个性化功能。
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">📢 广告Cookie</h3>
                      <p>
                        我们可能使用第三方广告Cookie来展示相关的广告内容。这些Cookie也用于限制广告展示次数并衡量广告活动的效果。
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">第三方Cookie</h2>
                  <p className="mb-4">
                    我们的网站可能包含来自第三方服务提供商的Cookie，包括但不限于：
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Google Analytics:</strong> 用于网站分析和性能监控</li>
                    <li><strong>Google AdSense:</strong> 用于展示相关广告内容</li>
                    <li><strong>社交媒体插件:</strong> 用于社交分享功能</li>
                    <li><strong>CDN服务:</strong> 用于提高网站加载速度</li>
                  </ul>
                  <p className="mt-4">
                    这些第三方服务有自己的隐私政策和Cookie政策，我们建议您查阅相关政策以了解详情。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">管理您的Cookie偏好</h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔧 浏览器设置</h3>
                    <p className="text-yellow-700">
                      您可以通过浏览器设置来控制和删除Cookie。大多数浏览器都允许您查看、管理和删除Cookie。
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Chrome浏览器</h4>
                      <p className="text-sm text-gray-600">
                        设置 → 隐私和安全 → Cookie和其他网站数据
                      </p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Firefox浏览器</h4>
                      <p className="text-sm text-gray-600">
                        选项 → 隐私与安全 → Cookie和网站数据
                      </p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Safari浏览器</h4>
                      <p className="text-sm text-gray-600">
                        偏好设置 → 隐私 → 管理网站数据
                      </p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Edge浏览器</h4>
                      <p className="text-sm text-gray-600">
                        设置 → Cookie和站点权限 → Cookie和存储的数据
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">
                      <strong>请注意：</strong>禁用某些Cookie可能会影响网站的功能和您的用户体验。
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookie的存储期限</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Cookie类型</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">存储期限</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">说明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-800">会话Cookie</td>
                          <td className="px-4 py-3 text-sm text-gray-600">浏览器关闭时删除</td>
                          <td className="px-4 py-3 text-sm text-gray-600">临时存储，维持会话状态</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-800">持久性Cookie</td>
                          <td className="px-4 py-3 text-sm text-gray-600">最长2年</td>
                          <td className="px-4 py-3 text-sm text-gray-600">记住用户偏好和设置</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-800">分析Cookie</td>
                          <td className="px-4 py-3 text-sm text-gray-600">最长26个月</td>
                          <td className="px-4 py-3 text-sm text-gray-600">网站使用情况分析</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-800">广告Cookie</td>
                          <td className="px-4 py-3 text-sm text-gray-600">最长12个月</td>
                          <td className="px-4 py-3 text-sm text-gray-600">个性化广告投放</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">您的权利</h2>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">访问权</h3>
                        <p className="text-gray-600">您有权了解我们收集的关于您的Cookie数据</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">🔧</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">控制权</h3>
                        <p className="text-gray-600">您可以随时更改或撤回Cookie设置</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">🗑️</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">删除权</h3>
                        <p className="text-gray-600">您可以要求删除存储的Cookie数据</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">📞</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">联系权</h3>
                        <p className="text-gray-600">如有疑问，您可以随时联系我们的隐私团队</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">政策更新</h2>
                  <p className="mb-4">
                    我们可能会不时更新此Cookie政策，以反映我们做法的变化或其他运营、法律或监管原因。
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      <strong>最后更新：</strong>2024年8月19日<br />
                      <strong>生效日期：</strong>2024年8月19日
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">联系我们</h2>
                  <p className="mb-4">
                    如果您对我们的Cookie政策有任何疑问或需要进一步信息，请通过以下方式联系我们：
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="space-y-2">
                      <p><strong>网站：</strong> MatrixTools.cn</p>
                      <p><strong>邮箱：</strong> privacy@matrixtools.cn</p>
                      <p><strong>地址：</strong> 中国大陆地区</p>
                    </div>
                  </div>
                </section>

                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-center">
                    💚 感谢您信任MatrixTools。我们致力于保护您的隐私和提供透明的Cookie使用政策。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}