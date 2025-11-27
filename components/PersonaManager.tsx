import React, { useState } from 'react';
import { Persona, Platform } from '../types';
import { PersonaCard } from './PersonaCard';
import { Button } from './Button';
import { Plus, X } from 'lucide-react';

interface PersonaManagerProps {
  personas: Persona[];
  setPersonas: React.Dispatch<React.SetStateAction<Persona[]>>;
}

export const PersonaManager: React.FC<PersonaManagerProps> = ({ personas, setPersonas }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const initialFormState = {
    name: '',
    role: '',
    platform: Platform.LINKEDIN,
    tone: '',
    description: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleOpenModal = (id?: string) => {
    if (id) {
      const personaToEdit = personas.find(p => p.id === id);
      if (personaToEdit) {
        setFormData({
          name: personaToEdit.name,
          role: personaToEdit.role,
          platform: personaToEdit.platform,
          tone: personaToEdit.tone,
          description: personaToEdit.description,
        });
        setEditingId(id);
      }
    } else {
      setFormData(initialFormState);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setPersonas(prev => prev.map(p => p.id === editingId ? { ...p, ...formData } : p));
    } else {
      const colors = ['#4F46E5', '#0EA5E9', '#E11D48', '#059669', '#D946EF', '#F59E0B'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newPersona: Persona = {
        id: crypto.randomUUID(),
        ...formData,
        avatarColor: randomColor,
      };
      setPersonas(prev => [...prev, newPersona]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个数字分身吗?')) {
      setPersonas(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">数字分身矩阵</h2>
            <p className="text-gray-500 text-sm mt-1">管理您在不同平台的内容发布人格</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={<Plus size={18} />}>
          新建分身
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map(persona => (
          <PersonaCard 
            key={persona.id} 
            persona={persona} 
            onEdit={handleOpenModal} 
            onDelete={handleDelete} 
          />
        ))}
        
        {personas.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <p>还没有创建任何数字分身</p>
            <Button variant="ghost" onClick={() => handleOpenModal()} className="mt-2">
              立即创建
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">{editingId ? '编辑分身' : '创建新分身'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分身名称</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="例如: 科技极客Bob"
                  className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">目标平台</label>
                    <select 
                      value={formData.platform}
                      onChange={e => setFormData({...formData, platform: e.target.value as Platform})}
                      className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                    >
                      {Object.values(Platform).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">角色定位</label>
                    <input 
                      required
                      type="text" 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      placeholder="例如: 行业专家"
                      className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">语气风格</label>
                <input 
                  required
                  type="text" 
                  value={formData.tone}
                  onChange={e => setFormData({...formData, tone: e.target.value})}
                  placeholder="例如: 犀利、幽默、亲和、严谨"
                  className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">详细描述 (Prompt指令)</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="详细描述该分身的说话习惯、用词偏好、以及需要避免的内容。AI将严格遵循此设定。"
                  className="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">越详细的描述，生成的差异化效果越好。</p>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <Button type="button" variant="ghost" onClick={handleCloseModal}>取消</Button>
                <Button type="submit">{editingId ? '保存修改' : '立即创建'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
