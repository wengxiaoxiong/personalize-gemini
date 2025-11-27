import React, { useState, useEffect } from 'react';
import { Platform, Persona } from './types';
import { PersonaManager } from './components/PersonaManager';
import { ContentGenerator } from './components/ContentGenerator';
import { Users, PenTool, LayoutDashboard, Settings, Menu, X } from 'lucide-react';

// Initial Demo Data
const initialPersonas: Persona[] = [
  {
    id: '1',
    name: '职场导师Alex',
    role: '行业专家',
    platform: Platform.LINKEDIN,
    tone: '专业、严谨、有深度',
    description: '专注于B2B营销领域的专家，善于使用数据支撑观点，行文逻辑性强，常用行业术语，不仅陈述事实还会给出战略性建议。',
    avatarColor: '#0077b5'
  },
  {
    id: '2',
    name: '种草酱Amy',
    role: '生活方式KOC',
    platform: Platform.XIAOHONGSHU,
    tone: '亲和、热情、情绪化',
    description: '喜欢分享好物，开头必须有吸引眼球的标题和Emoji，正文注重个人体验和情感连接，每段话不宜过长，结尾必须带上大量相关话题标签。',
    avatarColor: '#fe2c55'
  },
  {
    id: '3',
    name: 'CryptoPUNK',
    role: 'Web3极客',
    platform: Platform.TWITTER,
    tone: '犀利、反讽、极简',
    description: 'Web3原生用户，讨厌废话，喜欢用缩写(GM, WAGMI)，对新事物保持怀疑但开放的态度，观点鲜明，一针见血。',
    avatarColor: '#000000'
  }
];

function App() {
  const [activeTab, setActiveTab] = useState<'generate' | 'personas'>('generate');
  const [personas, setPersonas] = useState<Persona[]>(initialPersonas);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans flex overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
               <Users className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Personalize</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => { setActiveTab('generate'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'generate' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <PenTool size={20} />
            <span>内容创作</span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('personas'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'personas' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users size={20} />
            <span>数字分身</span>
            <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {personas.length}
            </span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
           <div className="flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-gray-900 cursor-not-allowed opacity-50">
             <Settings size={20} />
             <span>设置 (开发中)</span>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30">
          <span className="font-bold text-lg">Personalize</span>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'generate' ? (
              <ContentGenerator personas={personas} />
            ) : (
              <PersonaManager personas={personas} setPersonas={setPersonas} />
            )}
          </div>
        </div>
      </main>

    </div>
  );
}

export default App;
