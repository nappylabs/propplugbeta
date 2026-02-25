import React, { useState } from 'react';
import { X, Check, Plus, ListChecks } from 'lucide-react';
import { ChecklistItem } from '@/types/insights';

const ChecklistItemDisplay = ({ item, onToggle }: { item: ChecklistItem, onToggle: (id: string) => void }) => (
  <div
    onClick={() => onToggle(item.id)}
    className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700/50 transition-colors"
  >
    <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${item.completed ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
      {item.completed && <Check size={12} className="text-white" />}
    </div>
    <span className={`flex-grow text-sm font-medium ${item.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
      {item.label}
    </span>
  </div>
);

interface ChecklistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  checklist: ChecklistItem[];
  toggleChecklist: (id: string) => void;
  addChecklistItem: (label: string) => void;
}

export const ChecklistDrawer: React.FC<ChecklistDrawerProps> = ({ isOpen, onClose, checklist, toggleChecklist, addChecklistItem }) => {
  const [newChecklistItem, setNewChecklistItem] = useState('');

  if (!isOpen) return null;

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      addChecklistItem(newChecklistItem.trim());
      setNewChecklistItem('');
    }
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div onClick={onClose} className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm animate-fade-in" />
      <div className="relative w-full max-w-lg h-full bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3"><ListChecks size={24} className="text-orange-400" /> Due Diligence Checklist</h2>
            <button onClick={onClose} className="p-2 rounded-full text-zinc-500 hover:bg-zinc-800 hover:text-white"><X size={20} /></button>
          </div>
          <p className="text-sm text-zinc-400">
            {completedCount} of {totalCount} tasks completed.
          </p>
        </div>

        {/* Content */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4">
            <div className="space-y-2">
              {checklist.map(item => <ChecklistItemDisplay key={item.id} item={item} onToggle={toggleChecklist} />)}
            </div>
            <div className="flex gap-2 pt-4 border-t border-zinc-800">
              <input type="text" value={newChecklistItem} onChange={e => setNewChecklistItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem()} placeholder="Add custom task..." className="flex-grow bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-500" />
              <button onClick={handleAddChecklistItem} className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"><Plus size={18} /></button>
            </div>
        </div>
      </div>
    </div>
  );
};