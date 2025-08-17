import { Layout } from '@/components/Layout';
import { generateSEO } from '@/lib/seo';

export const metadata = generateSEO({
  title: '关于我们',
  description: '了解工具分享站的使命、愿景和团队',
  url: '/about',
});

export default function AboutPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* 头部介绍 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                关于工具分享站
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                我们致力于为新手用户提供最实用的工具推荐和详细教程，帮助大家快速提升工作效率
              </p>
            </div>

            {/* 使命愿景 */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-4xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">我们的使命</h2>
                <p className="text-gray-700 leading-relaxed">
                  降低工具使用门槛，让每个人都能轻松找到并使用最适合的工具来提升工作效率。
                  我们相信好工具应该让工作变得更简单，而不是更复杂。
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-4xl mb-4">🌟</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">我们的愿景</h2>
                <p className="text-gray-700 leading-relaxed">
                  成为最受新手信赖的工具分享平台，通过优质内容和贴心指导，
                  帮助用户从工具新手成长为效率专家。
                </p>
              </div>
            </div>

            {/* 核心价值 */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                💎 我们的价值观
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">🔍</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">精心筛选</h3>
                  <p className="text-gray-600 text-sm">
                    每个推荐的工具都经过实际测试和深度体验
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">📚</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">新手友好</h3>
                  <p className="text-gray-600 text-sm">
                    所有教程都以新手视角编写，步骤详细易懂
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">🆓</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">免费优先</h3>
                  <p className="text-gray-600 text-sm">
                    优先推荐免费工具，让每个人都能负担得起
                  </p>
                </div>
              </div>
            </div>

            {/* 内容特色 */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🚀 我们提供什么
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🛠️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">精选工具推荐</h3>
                    <p className="text-gray-700">
                      涵盖开发、设计、效率、营销等各个领域的优质工具，每个工具都有详细的介绍和使用场景说明。
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">📖</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">详细使用教程</h3>
                    <p className="text-gray-700">
                      从基础入门到高级技巧，提供循序渐进的学习路径，让你快速上手各种工具。
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">实用技巧分享</h3>
                    <p className="text-gray-700">
                      分享工作中的实际经验和技巧，帮助你更高效地使用各种工具。
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🎓</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">新手指南</h3>
                    <p className="text-gray-700">
                      专门为初学者准备的入门指南，包括工具选择建议和学习路线规划。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 联系方式 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📞 联系我们
              </h2>
              <p className="text-gray-700 mb-6">
                有任何问题或建议？我们很乐意听到您的声音！
              </p>
              <div className="space-y-2 text-gray-600">
                <p>电子邮件：1217112842@qq.com</p>
                <p>反馈建议：1217112842@qq.com</p>
                <p>商务合作：1217112842@qq.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}