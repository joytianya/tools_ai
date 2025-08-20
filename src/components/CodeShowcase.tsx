'use client';

import { useState } from 'react';
import { Copy, Check, Play, Download } from 'lucide-react';

interface CodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
  description?: string;
  runnable?: boolean;
}

interface CodeShowcaseProps {
  examples: CodeExample[];
  className?: string;
}

export function CodeShowcase({ examples, className = "" }: CodeShowcaseProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const currentExample = examples[activeTab];

  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden w-full ${className}`}>
      {/* 标签页 */}
      <div className="bg-gray-800 px-2 sm:px-4 py-2 border-b border-gray-700">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide pb-1">
          {examples.map((example, index) => (
            <button
              key={example.id}
              onClick={() => setActiveTab(index)}
              className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors whitespace-nowrap flex-shrink-0 min-w-0 ${
                activeTab === index
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              title={example.title}
            >
              <span className="truncate max-w-[120px] sm:max-w-none">
                {example.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 代码区域 */}
      <div className="relative">
        {/* 工具栏 */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 font-mono">
              {currentExample.language}
            </span>
            {currentExample.runnable && (
              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                可运行
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {currentExample.runnable && (
              <button className="p-1 text-gray-400 hover:text-green-400 transition-colors">
                <Play className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => copyToClipboard(currentExample.code, currentExample.id)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              {copiedStates[currentExample.id] ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 代码内容 */}
        <div className="p-4 w-full overflow-x-auto">
          <pre 
            className="text-xs sm:text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap w-full"
            style={{ 
              wordBreak: 'break-all', 
              overflowWrap: 'break-word',
              width: '100%',
              maxWidth: '100%'
            }}
          >
            <code>{currentExample.code}</code>
          </pre>
        </div>

        {/* 描述 */}
        {currentExample.description && (
          <div className="px-4 py-3 bg-gray-800 border-t border-gray-700">
            <p className="text-sm text-gray-400">{currentExample.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}