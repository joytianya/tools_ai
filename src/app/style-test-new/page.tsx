import { Layout } from '@/components/Layout';

export default function StyleTestNewPage() {
  return (
    <Layout>
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-green-600 mb-6">🎨 新样式测试页面</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">✅ CSS 工作测试</h2>
          <p className="text-gray-600 mb-4">如果你能看到这个白色卡片和绿色标题，说明CSS正常工作！</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-500 text-white p-4 rounded-lg text-center">蓝色</div>
            <div className="bg-green-500 text-white p-4 rounded-lg text-center">绿色</div>
            <div className="bg-red-500 text-white p-4 rounded-lg text-center">红色</div>
            <div className="bg-purple-500 text-white p-4 rounded-lg text-center">紫色</div>
          </div>

          <div className="flex justify-center space-x-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold">
              渐变按钮
            </div>
            <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-semibold border-2 border-yellow-400">
              边框按钮
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <p className="text-green-700">
            <strong>✅ 成功！</strong> 如果你能看到上面的彩色卡片和渐变效果，说明网站样式已经完全正常工作了！
          </p>
        </div>
      </div>
    </div>
    </Layout>
  )
}