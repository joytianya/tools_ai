export default function TestStylesPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">样式测试页面</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tailwind CSS 测试</h2>
          <p className="text-gray-600 mb-4">如果你能看到这个白色背景的卡片和蓝色标题，说明CSS正在工作。</p>
          
          <div className="flex space-x-4 mb-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              蓝色按钮
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              绿色按钮
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              红色按钮
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded text-center">蓝色区块</div>
            <div className="bg-green-100 p-4 rounded text-center">绿色区块</div>
            <div className="bg-red-100 p-4 rounded text-center">红色区块</div>
          </div>

          <div className="border-2 border-red-500 p-4 rounded">
            <h3 className="text-lg font-bold text-red-600 mb-2">如果CSS没有加载</h3>
            <p className="text-gray-700">你会看到这个红色边框但没有其他样式，而不是上面的美观卡片样式。</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>测试说明：</strong> 如果你能看到颜色丰富的卡片、按钮和区块，说明 Tailwind CSS 正常工作。
                如果只看到黑白文字，说明样式文件没有加载。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}