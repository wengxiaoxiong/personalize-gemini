import React from 'react';
import { Persona, Platform } from '../types';
import { Trash2, Edit2, Check } from 'lucide-react';

interface PersonaCardProps {
  persona: Persona;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelect?: (id: string) => void;
  selected?: boolean;
  selectable?: boolean;
}

const getPlatformBadge = (platform: Platform) => {
  const styles: Record<Platform, string> = {
    [Platform.LINKEDIN]: "bg-blue-100 text-blue-800 border-blue-200",
    [Platform.TWITTER]: "bg-gray-100 text-gray-800 border-gray-200",
    [Platform.XIAOHONGSHU]: "bg-red-100 text-red-800 border-red-200",
    [Platform.DOUYIN]: "bg-slate-900 text-white border-slate-700",
    [Platform.INSTAGRAM]: "bg-pink-100 text-pink-800 border-pink-200",
    [Platform.WECHAT]: "bg-green-100 text-green-800 border-green-200",
  };
  return styles[platform] || "bg-gray-100 text-gray-800";
};

export const PersonaCard: React.FC<PersonaCardProps> = ({ 
  persona, 
  onEdit, 
  onDelete, 
  onSelect,
  selected = false,
  selectable = false
}) => {
  return (
    <div 
      onClick={() => selectable && onSelect && onSelect(persona.id)}
      className={`
        relative flex flex-col p-5 rounded-xl border transition-all duration-200 
        ${selectable ? 'cursor-pointer hover:shadow-md' : 'bg-white shadow-sm'}
        ${selected ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/50' : 'border-gray-200 bg-white'}
      `}
    >
      {selectable && selected && (
        <div className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full p-1">
          <Check size={12} />
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
            style={{ backgroundColor: persona.avatarColor }}
          >
            {persona.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 leading-tight">{persona.name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium border ${getPlatformBadge(persona.platform)}`}>
              {persona.platform}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">角色</span>
          <span className="text-sm text-gray-700">{persona.role}</span>
        </div>
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">语气</span>
          <span className="text-sm text-gray-700">{persona.tone}</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{persona.description}</p>
      </div>

      {!selectable && (
        <div className="mt-4 flex justify-end space-x-2 border-t pt-3 border-gray-100">
          <button 
            onClick={() => onEdit?.(persona.id)} 
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete?.(persona.id)} 
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
