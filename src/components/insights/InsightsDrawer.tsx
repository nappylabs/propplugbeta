import React, { useState, useMemo } from 'react';
import { X, Brain, Check, Plus, ArrowRight } from 'lucide-react';
import { DealInsightsV2, ChecklistItem, ProfileType } from '@/types/insights';
import { ProgressBar } from './ProgressBar';
import { INSIGHTS_CONFIG } from '@/shared/data/prompts';

const Chip = ({ label, isSelected, onClick }: { label: string, isSelected: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
  >
    {label}
  </button>
);

interface InsightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  insights: DealInsightsV2 | null;
  updateInsight: (path: string, value: any) => void;
  toggleMultiSelect: (path: string, value: string, max?: number) => void;
}

export const InsightsDrawer: React.FC<InsightsDrawerProps> = ({ isOpen, onClose, insights, updateInsight, toggleMultiSelect }) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  if (!isOpen || !insights) return null;

  const config = INSIGHTS_CONFIG[insights.profileType as keyof typeof INSIGHTS_CONFIG];
  const progress = insights?.progress || { completionPercent: 0, status: 'getting_started' };
  
  const sections = [
    { key: 'snapshot', title: 'Snapshot' },
    { key: 'drivers', title: 'Drivers' },
    { key: 'risks', title: 'Risks' },
    { key: 'opportunities', title: 'Opportunities' },
    { key: 'personalFit', title: 'Personal Fit' },
    { key: 'observations', title: 'Observations' },
    { key: 'finalAssessment', title: 'Final Assessment' },
    { key: 'notes', title: 'Notes' },
  ];

  const activeSectionKey = sections[activeSectionIndex].key;

  const renderSectionContent = () => {
    const content = (() => {
      switch (activeSectionKey) {
        case 'snapshot':
          return (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-400">Key Positives (Max 5)</h4>
              <div className="flex flex-wrap gap-2">
                {config.snapshot.positives.map(p => <Chip key={p} label={p} isSelected={insights.snapshot.positives.includes(p)} onClick={() => toggleMultiSelect('snapshot.positives', p, 5)} />)}
              </div>
              <h4 className="text-xs font-bold text-zinc-400">Key Negatives (Max 5)</h4>
              <div className="flex flex-wrap gap-2">
                {config.snapshot.negatives.map(n => <Chip key={n} label={n} isSelected={insights.snapshot.negatives.includes(n)} onClick={() => toggleMultiSelect('snapshot.negatives', n, 5)} />)}
              </div>
              <h4 className="text-xs font-bold text-zinc-400">Primary reason you saved this deal?</h4>
              <div className="flex flex-wrap gap-2">
                {config.snapshot.primaryReason.map(r => <Chip key={r} label={r} isSelected={insights.snapshot.primaryReason === r} onClick={() => updateInsight('snapshot.primaryReason', r)} />)}
              </div>
            </div>
          );
        case 'drivers':
          return (
            <div className="flex flex-wrap gap-2">
              {config.drivers.map(d => <Chip key={d} label={d} isSelected={insights.drivers.includes(d)} onClick={() => toggleMultiSelect('drivers', d)} />)}
            </div>
          );
        case 'risks':
          return (
            <div className="flex flex-wrap gap-2">
              {config.risks.map(r => <Chip key={r} label={r} isSelected={insights.risks.includes(r)} onClick={() => toggleMultiSelect('risks', r)} />)}
            </div>
          );
        case 'opportunities':
          return (
            <div className="flex flex-wrap gap-2">
              {config.opportunities.map(o => <Chip key={o} label={o} isSelected={insights.opportunities.includes(o)} onClick={() => toggleMultiSelect('opportunities', o)} />)}
            </div>
          );
        case 'personalFit':
          return (
            <div className="space-y-4">
              {Object.entries(config.personalFit).map(([key, value]) => (
                <div key={key}>
                  <h4 className="text-xs font-bold text-zinc-400 mb-2">{value.label}</h4>
                  <div className="flex flex-wrap gap-2">
                    {value.options.map((option: string) => (
                      <Chip key={option} label={option} isSelected={insights.personalFit[key] === option} onClick={() => updateInsight(`personalFit.${key}`, option)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        case 'observations':
          return (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-400">Physical Viewing</h4>
              <div className="flex flex-wrap gap-2">
                {config.observations.viewingNotes.map(v => <Chip key={v} label={v} isSelected={insights.observations.viewingNotes.includes(v)} onClick={() => toggleMultiSelect('observations.viewingNotes', v)} />)}
              </div>
              <h4 className="text-xs font-bold text-zinc-400">Market Signals</h4>
              <div className="flex flex-wrap gap-2">
                {config.observations.marketSignals.map(m => <Chip key={m} label={m} isSelected={insights.observations.marketSignals.includes(m)} onClick={() => toggleMultiSelect('observations.marketSignals', m)} />)}
              </div>
            </div>
          );
        case 'finalAssessment':
          return (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-400">Decision Lean</h4>
              <div className="flex flex-wrap gap-2">
                {config.finalAssessment.decisionLean.map(d => <Chip key={d} label={d} isSelected={insights.finalAssessment.decisionLean === d} onClick={() => updateInsight('finalAssessment.decisionLean', d)} />)}
              </div>
              <h4 className="text-xs font-bold text-zinc-400">Confidence Level: {insights.finalAssessment.confidence}/10</h4>
              <input
                type="range"
                min="1"
                max="10"
                value={insights.finalAssessment.confidence}
                onChange={e => updateInsight('finalAssessment.confidence', parseInt(e.target.value, 10))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <h4 className="text-xs font-bold text-zinc-400">Strategy Fit</h4>
              <div className="flex flex-wrap gap-2">
                {config.finalAssessment.strategyFit.map(s => <Chip key={s} label={s} isSelected={insights.finalAssessment.strategyFit === s} onClick={() => updateInsight('finalAssessment.strategyFit', s)} />)}
              </div>
               <h4 className="text-xs font-bold text-zinc-400">Personal Stress Level</h4>
              <div className="flex flex-wrap gap-2">
                {config.finalAssessment.stressLevel.map(s => <Chip key={s} label={s} isSelected={insights.finalAssessment.stressLevel === s} onClick={() => updateInsight('finalAssessment.stressLevel', s)} />)}
              </div>
            </div>
          );
        case 'notes':
          return (
            <textarea
              value={insights.notes || ''}
              onChange={e => updateInsight('notes', e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:border-orange-500"
              rows={10}
              placeholder="Your scratchpad for anything else..."
            />
          );
        default:
          return null;
      }
    })();

    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <div className="space-y-4">{content}</div>
        <div className="mt-8 flex justify-end">
          {activeSectionIndex < sections.length - 1 ? (
            <button
              onClick={() => setActiveSectionIndex(i => i + 1)}
              className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700 transition-all"
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-all"
            >
              Complete <Check size={16} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div onClick={onClose} className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm animate-fade-in" />
      <div className="relative w-full max-w-4xl h-full bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3"><Brain size={24} className="text-orange-400" /> Deal Insights</h2>
            <button onClick={onClose} className="p-2 rounded-full text-zinc-500 hover:bg-zinc-800 hover:text-white"><X size={20} /></button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-zinc-400">Insight Completeness</span>
              <span className="text-white">{Math.round(progress.completionPercent)}%</span>
            </div>
            <ProgressBar percentage={progress.completionPercent} status={progress.status as any} />
          </div>
        </div>

        {/* Tab Bar */}
        <div className="p-2 border-b border-zinc-800 overflow-x-auto">
          <div className="flex space-x-1">
            {sections.map((section, index) => (
              <button
                key={section.key}
                onClick={() => setActiveSectionIndex(index)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${activeSectionIndex === index ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow p-6 overflow-y-auto">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};
