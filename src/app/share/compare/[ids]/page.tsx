// src/app/share/compare/[ids]/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Logo } from '@/shared/components/Logo';
import { Brain, TrendingUp, Shield, Eye, Info, ExternalLink, MapPin, AlertTriangle } from 'lucide-react';
import { generateComparison } from '@/shared/logic/generateComparison';
import { GeneratedComparison } from '@/types/comparison';
import { ComparisonCategoryAccordion } from '@/components/compare/ComparisonCategoryAccordion';
import { ProgressBar } from '@/components/insights/ProgressBar';

const CURRENCY_SYMBOLS: { [key: string]: string } = {
  ZAR: 'R',
  KES: 'KSh',
  USD: '$'
};

export default function SharedComparisonPage({ params }: { params: { ids: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const db = getFirestore();
        // Decode the IDs from the URL (e.g., "id1-id2")
        const ids = decodeURIComponent(params.ids).split('-');
        
        if (ids.length !== 2) {
            setError("Invalid comparison link. Need exactly 2 properties.");
            setLoading(false);
            return;
        }

        const docs = await Promise.all(ids.map(id => getDoc(doc(db, 'projects', id))));
        
        const loadedProjects = docs.map(d => {
            if (!d.exists()) return null;
            return { id: d.id, ...d.data() };
        }).filter(Boolean);

        if (loadedProjects.length !== 2) {
            setError("One or more properties could not be found. They may have been deleted.");
        } else {
            setProjects(loadedProjects);
        }
      } catch (err) {
        console.error("Error fetching shared projects:", err);
        setError("Failed to load comparison. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [params.ids]);

  const comparisonData = useMemo<GeneratedComparison | null>(() => {
    if (projects.length !== 2) return null;
    return generateComparison(projects[0], projects[1]);
  }, [projects]);

  if (loading) {
    return (
     <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div>
     </div>
   );
 }

 if (error) {
     return (
         <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-center p-6">
             <AlertTriangle size={48} className="text-rose-500 mb-4" />
             <h1 className="text-2xl font-bold text-white mb-2">Comparison Not Found</h1>
             <p className="text-slate-400">{error}</p>
         </div>
     )
 }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
        <nav className="border-b border-slate-800 bg-[#0F172A] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <div className="h-8 w-8 flex items-center justify-center text-white"><Logo /></div>
                <span className="font-bold text-lg">PropPlug Comparison</span>
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shared View</div>
        </nav>

        <main className="p-6 max-w-7xl mx-auto">
            {comparisonData && (
                <div className="space-y-8 animate-fade-in">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white">Decision Matrix</h2>
                            <p className="text-slate-400">Comparing {comparisonData.propertyA.inputSnapshot.address} vs {comparisonData.propertyB.inputSnapshot.address}</p>
                        </div>
                    </div>

                    {/* General Details Summary */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white">General Details</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-3 gap-4 text-xs font-bold text-slate-500 uppercase mb-4">
                                <span>Detail</span>
                                <span className="text-right">Property A</span>
                                <span className="text-right">Property B</span>
                            </div>
                            
                            {/* Profile & Type */}
                            <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-800/50">
                                <span className="text-sm text-slate-300">Profile</span>
                                <span className="text-sm text-right text-white capitalize">{comparisonData.propertyA.inputSnapshot.type} - {comparisonData.propertyA.inputSnapshot.strategy}</span>
                                <span className="text-sm text-right text-white capitalize">{comparisonData.propertyB.inputSnapshot.type} - {comparisonData.propertyB.inputSnapshot.strategy}</span>
                            </div>

                            {/* Deal Source */}
                            <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-800/50">
                                <span className="text-sm text-slate-300">Source</span>
                                <div className="text-right">
                                    {comparisonData.propertyA.listingUrl ? (
                                        <a href={comparisonData.propertyA.listingUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline text-sm flex items-center justify-end gap-1">
                                            Link <ExternalLink size={10} />
                                        </a>
                                    ) : <span className="text-sm text-slate-500">Manual</span>}
                                </div>
                                <div className="text-right">
                                    {comparisonData.propertyB.listingUrl ? (
                                        <a href={comparisonData.propertyB.listingUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline text-sm flex items-center justify-end gap-1">
                                            Link <ExternalLink size={10} />
                                        </a>
                                    ) : <span className="text-sm text-slate-500">Manual</span>}
                                </div>
                            </div>

                            {/* Currency */}
                            <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-800/50">
                                <span className="text-sm text-slate-300">Currency</span>
                                <span className="text-sm text-right text-white">{comparisonData.propertyA.inputSnapshot.currency}</span>
                                <span className="text-sm text-right text-white">{comparisonData.propertyB.inputSnapshot.currency}</span>
                            </div>

                            {/* Purchase Price */}
                            <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-800/50">
                                <span className="text-sm text-slate-300">Purchase Price</span>
                                <span className="text-sm text-right text-white font-mono">{CURRENCY_SYMBOLS[comparisonData.propertyA.inputSnapshot.currency]}{Number(comparisonData.propertyA.inputSnapshot.askingPrice).toLocaleString()}</span>
                                <span className="text-sm text-right text-white font-mono">{CURRENCY_SYMBOLS[comparisonData.propertyB.inputSnapshot.currency]}{Number(comparisonData.propertyB.inputSnapshot.askingPrice).toLocaleString()}</span>
                            </div>

                            {/* Location */}
                            <div className="grid grid-cols-3 gap-4 py-3">
                                <span className="text-sm text-slate-300">Location</span>
                                <span className="text-sm text-right text-white flex items-center justify-end gap-1"><MapPin size={12} className="text-slate-500" /> {comparisonData.propertyA.inputSnapshot.address || 'Unknown'}</span>
                                <span className="text-sm text-right text-white flex items-center justify-end gap-1"><MapPin size={12} className="text-slate-500" /> {comparisonData.propertyB.inputSnapshot.address || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Key Differences */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Key Differences</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {comparisonData.keyDifferences.map((diff, i) => (
                                <div key={i} className="bg-slate-800/50 p-4 rounded-lg flex items-center gap-3">
                                    <div className="text-indigo-400">
                                        {diff.icon === 'yield' && <TrendingUp size={20} />}
                                        {diff.icon === 'cashflow' && <TrendingUp size={20} />}
                                        {diff.icon === 'price' && <Info size={20} />}
                                        {diff.icon === 'risk' && <Shield size={20} />}
                                        {diff.icon === 'cost' && <Info size={20} />}
                                    </div>
                                    <p className="text-sm text-slate-300">{diff.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* User Insights */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Brain size={20} /> Notes & Concerns</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[comparisonData.insightSnapshot.A, comparisonData.insightSnapshot.B].map((snapshot, i) => (
                                <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
                                    <h4 className="font-bold text-slate-300 mb-3">{i === 0 ? 'Property A' : 'Property B'}</h4>
                                    {snapshot ? (
                                        Object.values(snapshot.prompts).some(p => p.isPinned) ? (
                                            <ul className="space-y-4 text-sm">
                                                {Object.values(snapshot.prompts).filter(p => p.isPinned).map((p) => (
                                                    <li key={p.id} className="text-sm text-slate-300 border-l-2 border-slate-700 pl-3">
                                                        <p className="font-bold text-white text-xs">{p.question}</p>
                                                        <p className="text-slate-400">{p.response}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-slate-500">No key insights were pinned for this property.</p>
                                        )
                                    ) : (
                                        <p className="text-sm text-slate-500">⚠ No insights recorded.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Decision Confidence */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                Decision Confidence
                                <div className="group relative">
                                    <Info size={14} className="text-slate-500 cursor-help" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        This score reflects how deeply the investor analyzed each property using the Deal Insights engine.
                                    </div>
                                </div>
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="font-bold text-slate-300">Property A</span>
                                    <span className="text-slate-400">{comparisonData.insightSnapshot.A?.progress.completionPercent.toFixed(0) || 0}% complete</span>
                                </div>
                                <ProgressBar percentage={comparisonData.insightSnapshot.A?.progress.completionPercent || 0} status={comparisonData.insightSnapshot.A?.progress.status || 'getting_started'} />
                            </div>
                             <div>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="font-bold text-slate-300">Property B</span>
                                    <span className="text-slate-400">{comparisonData.insightSnapshot.B?.progress.completionPercent.toFixed(0) || 0}% complete</span>
                                </div>
                                <ProgressBar percentage={comparisonData.insightSnapshot.B?.progress.completionPercent || 0} status={comparisonData.insightSnapshot.B?.progress.status || 'getting_started'} />
                            </div>
                        </div>
                    </div>

                    {/* Category Accordions */}
                    <div className="space-y-4">
                        <ComparisonCategoryAccordion category={comparisonData.financials} propertyAName="Property A" propertyBName="Property B" />
                        <ComparisonCategoryAccordion category={comparisonData.risks} propertyAName="Property A" propertyBName="Property B" />
                        <ComparisonCategoryAccordion category={comparisonData.outlook} propertyAName="Property A" propertyBName="Property B" />
                    </div>
                </div>
            )}
        </main>
    </div>
  );
}
