import React, { useState } from 'react';
    import { GeneratedContent, Persona } from '../types';
    import { Copy, CheckCircle, RefreshCw } from 'lucide-react';
    
    interface ResultCardProps {
      result: GeneratedContent;
      persona: Persona;
    }
    
    export const ResultCard: React.FC<ResultCardProps> = ({ result, persona }) => {
      const [copied, setCopied] = useState(false);
    
      const handleCopy = () => {
        navigator.clipboard.writeText(result.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };
    
      if (result.status === 'loading') {
        return (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse h-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
               <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        );
      }
    
      if (result.status === 'error') {
        return (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm h-full flex flex-col justify-center items-center text-center">
            <div className="text-red-500 mb-2">
              <RefreshCw size={24} />
            </div>
            <h3 className="text-red-800 font-medium">生成失败</h3>
            <p className="text-red-600 text-sm mt-1">请检查网络或重试</p>
          </div>
        );
      }
    
      return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: persona.avatarColor }}
              >
                {persona.name.charAt(0)}
              </div>
              <span className="font-semibold text-gray-700 text-sm">{persona.name}</span>
              <span className="text-gray-400 text-xs">• {persona.platform}</span>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={handleCopy}
                className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                title="复制内容"
              >
                {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
    
          {/* Content */}
          <div className="p-5 flex-1 overflow-y-auto max-h-[400px]">
             {/* Analysis Badge */}
            {result.analysis && (
                <div className="mb-4 bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                    <p className="text-xs text-indigo-800 flex items-start">
                        <span className="font-bold mr-1">AI策略:</span>
                        {result.analysis}
                    </p>
                </div>
            )}

            <div className="prose prose-sm prose-indigo max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
              {result.content}
            </div>

            {/* Tags */}
            {result.tags && result.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {result.tags.map((tag, i) => (
                        <span key={i} className="text-xs text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
          </div>
        </div>
      );
    };
    