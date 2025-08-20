import { Layout } from '@/components/Layout';
import { generateSEO } from '@/lib/seo';

export const metadata = generateSEO({
  title: '免责声明',
  description: 'MatrixTools网站免责声明，了解我们的服务范围和责任限制',
  url: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              免责声明
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                最后更新日期：2024年1月1日
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                <p className="text-yellow-800">
                  <strong>重要提示：</strong> 请在使用本网站服务前仔细阅读本免责声明。使用本网站即表示您同意本声明的所有条款。
                </p>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                1. 信息准确性声明
              </h2>
              <p className="text-gray-700 mb-4">
                MatrixTools（以下简称&ldquo;本网站&rdquo;）致力于提供准确、有用的工具信息和教程内容。但是，我们不能保证：
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>所有信息的绝对准确性和完整性</li>
                <li>第三方工具的功能和性能表现</li>
                <li>工具官网链接的持续有效性</li>
                <li>价格信息的实时准确性</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                2. 第三方工具使用风险
              </h2>
              <p className="text-gray-700 mb-4">
                本网站仅提供工具推荐和使用指导，不对以下情况承担责任：
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>使用推荐工具造成的任何直接或间接损失</li>
                <li>第三方工具的安全性、稳定性或兼容性问题</li>
                <li>因工具使用不当导致的数据丢失或系统损坏</li>
                <li>第三方工具的服务中断、功能变更或停止服务</li>
                <li>第三方工具收费政策的变化</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                3. 外部链接声明
              </h2>
              <p className="text-gray-700 mb-6">
                本网站包含指向第三方网站的链接。这些链接仅为方便用户而提供，我们不对这些外部网站的内容、隐私政策或安全性负责。访问外部链接的风险由用户自行承担。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                4. 内容版权声明
              </h2>
              <p className="text-gray-700 mb-4">
                本网站的原创内容受版权保护。我们努力确保：
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>所有原创内容的版权归本网站所有</li>
                <li>引用的第三方内容已注明来源</li>
                <li>图片使用符合版权要求</li>
              </ul>
              <p className="text-gray-700 mb-6">
                如发现任何版权侵权问题，请及时联系我们处理。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                5. 技术支持限制
              </h2>
              <p className="text-gray-700 mb-6">
                我们提供的技术支持和指导仅限于：
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>工具使用的一般性指导</li>
                <li>常见问题的解答</li>
                <li>基础操作教程的说明</li>
              </ul>
              <p className="text-gray-700 mb-6">
                我们不提供：个人定制化技术支持、复杂技术问题的深度解决方案、收费工具的技术支持。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                6. 广告内容声明
              </h2>
              <p className="text-gray-700 mb-6">
                本网站可能显示第三方广告内容。我们不对广告内容的真实性、合法性或有效性负责。用户与广告商的任何交易均与本网站无关。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                7. 服务中断声明
              </h2>
              <p className="text-gray-700 mb-6">
                由于技术维护、升级或不可抗力等因素，本网站服务可能会暂时中断。我们不对因服务中断造成的任何损失承担责任。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                8. 用户责任
              </h2>
              <p className="text-gray-700 mb-4">
                使用本网站时，用户应当：
              </p>
              <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
                <li>自行判断信息的适用性和准确性</li>
                <li>在使用任何工具前进行充分的测试和评估</li>
                <li>遵守相关法律法规和第三方工具的使用条款</li>
                <li>对自己的操作行为和结果负完全责任</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                9. 法律适用
              </h2>
              <p className="text-gray-700 mb-6">
                本免责声明受中华人民共和国法律管辖。如有争议，应通过友好协商解决；协商不成的，提交有管辖权的人民法院解决。
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                10. 声明修改
              </h2>
              <p className="text-gray-700 mb-6">
                本网站保留随时修改本免责声明的权利。修改后的声明将在本页面发布，请定期查看以了解最新内容。
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  📞 联系我们
                </h3>
                <p className="text-blue-800">
                  如果您对本免责声明有任何疑问，请通过以下方式联系我们：
                </p>
                <p className="text-blue-800 mt-2">
                  电子邮件：1217112842@qq.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}