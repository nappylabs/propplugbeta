import React, { useState, useMemo } from 'react';
import { X, Brain, Edit, Star, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { PROMPTS, Prompt } from '@/shared/data/prompts';
import { DealInsights, InsightPromptResponse } from '@/types/insights';
import { ProgressBar } from './ProgressBar';

interface InsightCardProps {
  prompt: Prompt;
  response: InsightPromptResponse;
  onSave: (promptId: string, text: string, tags: string[]) => void;
  onPin: (promptId: string) => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ prompt, response, onSave, onPin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(response?.response || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(response?.tags || []);

  const handleSave = () => {
    onSave(prompt.id, text, selectedTags);
    setIsEditing(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (isEditing) {
    return (
      <div className="bg-slate-800/50 border border-indigo-500/50 rounded-2xl p-6">
        <h4 className="font-bold text-white mb-4">{prompt.question}</h4>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:border-indigo-500"
          rows={4}
          placeholder="Your thoughts..."
        />
        <div className="mt-4">
          <h5 className="text-xs text-slate-400 mb-2">Quick Suggestions:</h5>
          <div className="flex flex-wrap gap-2">
            {prompt.chips.map(chip => (
              <button
                key={chip}
                onClick={() => toggleTag(chip)}
                className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${selectedTags.includes(chip) ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-slate-700 border-slate-700 text-slate-300 hover:border-slate-500'}`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Insight</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 transition-all hover:border-slate-700">
      <div className="flex justify-between items-start">
        <h4 className={`font-bold ${response?.completedAt ? 'text-white' : 'text-slate-400'}`}>{prompt.question}</h4>
        {response?.completedAt ? (
          <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-white"><Edit size={14} /></button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 text-indigo-400 text-xs font-bold hover:text-indigo-300">
            <ChevronDown size={14} /> Add Insight
          </button>
        )}
      </div>
      {response?.completedAt && (
        <div className="mt-3 text-sm text-slate-300 flex items-start gap-2">
          <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
          <div>
            <p>{response.response}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {response.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-[10px] font-bold bg-slate-700 text-slate-300 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface InsightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  insights: DealInsights | null;
  onUpdateInsight: (promptId: string, text: string, tags: string[]) => void;
  onPinInsight: (promptId: string) => void;
  onUpdateFreeform: (text: string) => void;
  persona: 'investor' | 'owner' | 'tenant';
}

export const InsightsDrawer: React.FC<InsightsDrawerProps> = ({ isOpen, onClose, insights, onUpdateInsight, onPinInsight, onUpdateFreeform, persona }) => {
  const [activeTab, setActiveTab] = useState<InsightCategory | 'all'>('all');
  
  const prompts = useMemo(() => PROMPTS[persona] || [], [persona]);

  const filteredPrompts = useMemo(() => {
    if (activeTab === 'all') return prompts;
    return prompts.filter(p => p.category === activeTab);
  }, [prompts, activeTab]);

  if (!isOpen) return null;

  const progress = insights?.progress || { completionPercent: 0, status: 'getting_started' };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-fade-in" />
      <div className="relative w-full max-w-2xl h-full bg-[#0F172A] border-l border-slate-800 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3"><Brain size={24} className="text-indigo-400" /> Deal Insights</h2>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-800 hover:text-white"><X size={20} /></button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Insight Completeness</span>
              <span className="text-white">{progress.completionPercent.toFixed(0)}%</span>
            </div>
            <ProgressBar percentage={progress.completionPercent} status={progress.status} />
          </div>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex space-x-2">
            {['all', 'key_factors', 'risks', 'opportunities', 'personal_fit', 'actions'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === tab ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                {tab.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          {filteredPrompts.map(prompt => (
            <InsightCard
              key={prompt.id}
              prompt={prompt}
              response={insights?.prompts[prompt.id]!}
              onSave={onUpdateInsight}
              onPin={onPinInsight}
            />
          ))}
          
          {/* Freeform Notes */}
          <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6">
            <h4 className="font-bold text-white mb-4">✍️ Additional Notes</h4>
            <textarea
              value={insights?.freeformNotes || ''}
              onChange={(e) => onUpdateFreeform(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:border-indigo-500"
              rows={6}
              placeholder="Your scratchpad for anything else..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};