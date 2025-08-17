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
    <div className={`bg-gray-900 rounded-xl overflow-hidden ${className}`}>
      {/* 标签页 */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex space-x-1 overflow-x-auto">
          {examples.map((example, index) => (
            <button
              key={example.id}
              onClick={() => setActiveTab(index)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap ${
                activeTab === index
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {example.title}
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
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300 font-mono leading-relaxed">
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