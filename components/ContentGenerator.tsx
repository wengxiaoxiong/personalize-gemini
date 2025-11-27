import React, { useState } from 'react';
import { Persona, GeneratedContent } from '../types';
import { PersonaCard } from './PersonaCard';
import { ResultCard } from './ResultCard';
import { Button } from './Button';
import { Sparkles, ArrowRight, LayoutGrid, List } from 'lucide-react';
import { generatePersonaContent } from '../services/geminiService';

interface ContentGeneratorProps {
  personas: Persona[];
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ personas }) => {
  const [draft, setDraft] = useState('');
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [results, setResults] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const togglePersonaSelection = (id: string) => {
    setSelectedPersonaIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!draft.trim() || selectedPersonaIds.length === 0) return;

    setIsGenerating(true);
    
    // Initialize results with loading state
    const timestamp = Date.now();
    const initialResults: GeneratedContent[] = selectedPersonaIds.map(id => ({
      id: `${id}-${timestamp}`,
      personaId: id,
      originalDraft: draft,
      content: '',
      status: 'loading',
      timestamp
    }));
    
    setResults(initialResults);

    // Process parallel requests
    const promises = selectedPersonaIds.map(async (personaId) => {
      const persona = personas.find(p => p.id === personaId);
      if (!persona) return;

      try {
        const generatedData = await generatePersonaContent(draft, persona);
        
        setResults(prev => prev.map(res => 
          res.personaId === personaId && res.timestamp === timestamp
            ? { 
                ...res, 
                content: generatedData.content, 
                analysis: generatedData.analysis,
                tags: generatedData.tags,
                status: 'success' 
              }
            : res
        ));
      } catch (error) {
        setResults(prev => prev.map(res => 
          res.personaId === personaId && res.timestamp === timestamp
            ? { ...res, status: 'error' }
            : res
        ));
      }
    });

    await Promise.allSettled(promises);
    setIsGenerating(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[calc(100vh-4rem)]">
      
      {/* LEFT COLUMN: Input & Configuration */}
      <div className="lg:col-span-5 space-y-6 flex flex-col">
        
        {/* Core Material Input */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col flex-1">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-indigo-100 text-indigo-600 text-xs">1</span>
              输入核心素材
            </h3>
            <p className="text-sm text-gray-500 ml-8">输入您的核心观点、草稿或产品介绍</p>
          </div>
          <textarea 
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="在此输入文本... 例如：我们需要推广一款新的AI咖啡机，核心卖点是3秒速热和情绪识别功能。"
            className="flex-1 w-full rounded-xl border-gray-200 border p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-gray-50 text-base leading-relaxed"
          />
        </div>

        {/* Persona Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
           <div className="mb-4 flex justify-between items-center">
             <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-indigo-100 text-indigo-600 text-xs">2</span>
                选择分发对象
                </h3>
             </div>
             <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                已选 {selectedPersonaIds.length}
             </span>
           </div>
           
           <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
             {personas.map(persona => (
               <div 
                 key={persona.id}
                 onClick={() => togglePersonaSelection(persona.id)}
                 className={`
                    cursor-pointer flex items-center p-3 rounded-xl border transition-all
                    ${selectedPersonaIds.includes(persona.id) 
                      ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                      : 'border-gray-200 hover:bg-gray-50'}
                 `}
               >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 shadow-sm"
                    style={{ backgroundColor: persona.avatarColor }}
                  >
                    {persona.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{persona.name}</h4>
                    <p className="text-xs text-gray-500">{persona.role} · {persona.platform}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPersonaIds.includes(persona.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {selectedPersonaIds.includes(persona.id) && <Sparkles size={12} className="text-white" />}
                  </div>
               </div>
             ))}
             {personas.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">请先在"数字分身"页面创建角色</p>
             )}
           </div>

           <div className="mt-6 pt-4 border-t border-gray-100">
             <Button 
               onClick={handleGenerate} 
               disabled={!draft.trim() || selectedPersonaIds.length === 0}
               isLoading={isGenerating}
               className="w-full"
               size="lg"
               icon={<Sparkles size={18} />}
             >
               {isGenerating ? '正在重构文案...' : '智能生成文案'}
             </Button>
           </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Results */}
      <div className="lg:col-span-7 flex flex-col h-full">
        <div className="mb-4 flex items-center justify-between">
           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-indigo-100 text-indigo-600 text-xs">3</span>
              生成结果
           </h3>
           <div className="flex space-x-2">
              <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100"><LayoutGrid size={18}/></button>
           </div>
        </div>

        {results.length === 0 ? (
          <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-indigo-300" />
            </div>
            <h4 className="text-gray-900 font-medium mb-1">等待生成</h4>
            <p className="max-w-xs text-sm">在左侧输入内容并选择分身，AI 将为您生成差异化文案。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
            {results.map(result => {
              const persona = personas.find(p => p.id === result.personaId);
              if (!persona) return null;
              return (
                <ResultCard key={result.id} result={result} persona={persona} />
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
