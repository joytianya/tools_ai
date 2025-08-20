'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

// Import highlight.js styles
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className={`prose prose-sm sm:prose-base lg:prose-lg max-w-none break-words overflow-hidden ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeHighlight,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }]
        ]}
        components={{
          // 自定义标题渲染
          h1: ({ children, id }) => (
            <h1 
              id={id}
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-6 sm:mt-8 mb-4 sm:mb-6 border-b border-gray-200 pb-2 sm:pb-3 scroll-mt-20 break-words"
            >
              {children}
            </h1>
          ),
          h2: ({ children, id }) => (
            <h2 
              id={id}
              className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mt-6 sm:mt-8 mb-3 sm:mb-4 scroll-mt-20 break-words"
            >
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3 
              id={id}
              className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mt-4 sm:mt-6 mb-2 sm:mb-3 scroll-mt-20 break-words"
            >
              {children}
            </h3>
          ),
          h4: ({ children, id }) => (
            <h4 
              id={id}
              className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mt-3 sm:mt-4 mb-2 scroll-mt-20 break-words"
            >
              {children}
            </h4>
          ),
          
          // 自定义段落渲染
          p: ({ children }) => (
            <p className="mb-4 leading-7 text-gray-700">
              {children}
            </p>
          ),
          
          // 自定义列表渲染
          ul: ({ children }) => (
            <ul className="mb-6 ml-6 space-y-2 list-disc marker:text-blue-500 overflow-visible">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 ml-6 space-y-2 list-decimal marker:text-blue-500 overflow-visible">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 leading-6 overflow-visible break-words pl-1">
              <div className="overflow-visible break-words w-full">
                {children}
              </div>
            </li>
          ),
          
          // 自定义代码块渲染
          pre: ({ children, ...props }) => {
            const codeContent = children?.toString() || '';
            const codeId = Math.random().toString(36).substr(2, 9);
            
            return (
              <div className="relative group my-6 w-full overflow-hidden">
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={() => copyToClipboard(codeContent, codeId)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
                    title="复制代码"
                  >
                    {copiedCode === codeId ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                </div>
                <div className="w-full">
                  <pre 
                    {...props}
                    className="bg-gray-900 text-gray-100 p-4 sm:p-6 rounded-xl text-xs sm:text-sm leading-6 border border-gray-700 min-w-0"
                    style={{ 
                      wordBreak: 'break-all', 
                      overflowWrap: 'break-word',
                      width: '100%',
                      maxWidth: '100%',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word'
                    }}
                  >
                    <code style={{ 
                      wordBreak: 'break-all', 
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                      display: 'block',
                      width: '100%'
                    }}>
                      {typeof children === 'string' 
                        ? children.split(/(\s+)/).map((part, index) => {
                            // 如果是长于30个字符的连续字符串，强制换行
                            if (part.length > 30 && !/\s/.test(part)) {
                              return <span key={index}>{part.match(/.{1,30}/g)?.join('\n') || part}</span>;
                            }
                            return <span key={index}>{part}</span>;
                          })
                        : children
                      }
                    </code>
                  </pre>
                </div>
              </div>
            );
          },
          
          // 自定义行内代码渲染
          code: ({ children, className, ...props }) => {
            const isInlineCode = !className;
            
            if (isInlineCode) {
              return (
                <code 
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono border break-all"
                  style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          
          // 自定义链接渲染
          a: ({ href, children }) => {
            const isExternal = href?.startsWith('http');
            
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium inline-flex items-center gap-1 break-all"
                style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
              >
                {children}
                {isExternal && <ExternalLink className="w-3 h-3 flex-shrink-0" />}
              </a>
            );
          },
          
          // 自定义引用块渲染
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 bg-blue-50 rounded-r-lg">
              <div className="text-gray-700 italic">
                {children}
              </div>
            </blockquote>
          ),
          
          // 自定义表格渲染
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 max-w-full">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 border-b border-gray-200 break-words">
              {children}
            </td>
          ),
          
          // 自定义强调渲染
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700">
              {children}
            </em>
          ),
          
          // 自定义删除线渲染
          del: ({ children }) => (
            <del className="line-through text-gray-500">
              {children}
            </del>
          ),
          
          // 自定义分割线渲染
          hr: () => (
            <hr className="my-8 border-t border-gray-200" />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}