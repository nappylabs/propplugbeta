import React, { useState } from 'react';
import { ChevronDown, TrendingUp, Shield, Eye } from 'lucide-react';
import { ComparisonCategory } from '@/types/comparison';

const ICONS: { [key: string]: React.ReactNode } = {
  'Financial Performance': <TrendingUp size={20} />,
  'Risk Exposure': <Shield size={20} />,
  'Long-Term Outlook': <Eye size={20} />,
};

const WINNER_TEXT: { [key: string]: string } = {
    A: 'Property A appears stronger',
    B: 'Property B appears stronger',
    tie: 'Both are evenly matched'
}

interface AccordionProps {
  category: ComparisonCategory;
  propertyAName: string;
  propertyBName: string;
}

export const ComparisonCategoryAccordion: React.FC<AccordionProps> = ({ category, propertyAName, propertyBName }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-orange-400">{ICONS[category.title] || <TrendingUp size={20} />}</div>
          <div>
            <h3 className="text-lg font-bold text-white text-left">{category.title}</h3>
            <p className={`text-sm font-medium ${category.stronger === 'tie' ? 'text-zinc-400' : 'text-emerald-400'}`}>{WINNER_TEXT[category.stronger]}</p>
          </div>
        </div>
        <ChevronDown size={20} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <div className="border-t border-zinc-800 pt-4">
            <div className="grid grid-cols-3 gap-4 text-xs font-bold text-zinc-500 uppercase mb-2">
              <span>Metric</span>
              <span className="text-right">{propertyAName}</span>
              <span className="text-right">{propertyBName}</span>
            </div>
            {category.metrics.map(metric => (
              <div key={metric.label} className="grid grid-cols-3 gap-4 py-3 border-b border-zinc-800/50 last:border-b-0">
                <span className="text-sm text-zinc-300">{metric.label}</span>
                <span className={`text-sm text-right font-mono ${metric.winner === 'A' ? 'text-emerald-400 font-bold' : 'text-white'}`}>{metric.format(metric.valueA, '')}</span>
                <span className={`text-sm text-right font-mono ${metric.winner === 'B' ? 'text-emerald-400 font-bold' : 'text-white'}`}>{metric.format(metric.valueB, '')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};