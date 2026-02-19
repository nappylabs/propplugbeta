'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/shared/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Logo } from '@/shared/components/Logo';
import Link from 'next/link';
import { ArrowLeft, Check, AlertTriangle, X, Share2, Brain, TrendingUp, Shield, Eye, Info, ExternalLink, MapPin, Copy } from 'lucide-react';
import { generateComparison } from '@/shared/logic/generateComparison';
import { GeneratedComparison } from '@/types/comparison';
import { ComparisonCategoryAccordion } from '@/components/compare/ComparisonCategoryAccordion';
import { ProgressBar } from '@/components/insights/ProgressBar';

const CURRENCY_SYMBOLS: { [key: string]: string } = {
  ZAR: 'R',
  KES: 'KSh',
  USD: '$'
};

type ComparisonCategory = 'investor-rental' | 'investor-flip' | 'owner' | 'tenant';

export default function ComparePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ComparisonCategory | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // Max 2
  const [isComparing, setIsComparing] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareOptions, setShareOptions] = useState({ includeSource: true, includeDealLink: true });
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
          setUser(currentUser);
          fetchProjects(currentUser.uid);
      } else {
          router.replace('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchProjects = async (uid: string) => {
    try {
        const db = getFirestore();
        const q = query(collection(db, 'projects'), where('ownerId', '==', uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setProjects(data);
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
  };

  const filteredProjects = projects.filter(p => {
      if (!selectedCategory) return false;
      const type = p.inputSnapshot?.type || 'investor';
      const strategy = p.inputSnapshot?.strategy || 'rental';
      
      if (selectedCategory === 'investor-rental') return type === 'investor' && strategy === 'rental';
      if (selectedCategory === 'investor-flip') return type === 'investor' && strategy === 'flip';
      if (selectedCategory === 'owner') return type === 'owner';
      if (selectedCategory === 'tenant') return type === 'tenant';
      return false;
  });

  const toggleSelection = (id: string) => {
      if (selectedIds.includes(id)) {
          setSelectedIds(prev => prev.filter(pid => pid !== id));
      } else {
          if (selectedIds.length < 2) {
              setSelectedIds(prev => [...prev, id]);
          }
      }
  };

  // Currency Mismatch Check
  const currencyMismatch = useMemo(() => {
      if (selectedIds.length !== 2) return false;
      const p1 = projects.find(p => p.id === selectedIds[0]);
      const p2 = projects.find(p => p.id === selectedIds[1]);
      if (!p1 || !p2) return false;
      return p1.inputSnapshot.currency !== p2.inputSnapshot.currency;
  }, [selectedIds, projects]);

  const comparisonData = useMemo<GeneratedComparison | null>(() => {
    if (selectedIds.length !== 2 || currencyMismatch) return null;
    const projectA = projects.find(p => p.id === selectedIds[0]);
    const projectB = projects.find(p => p.id === selectedIds[1]);
    if (!projectA || !projectB) return null;
    return generateComparison(projectA, projectB);
  }, [selectedIds, projects, currencyMismatch]);

  const handleCopyComparison = () => {
      if (!comparisonData) return;
      
      const pA = comparisonData.propertyA.inputSnapshot;
      const pB = comparisonData.propertyB.inputSnapshot;
      const csA = CURRENCY_SYMBOLS[pA.currency] || '';
      const csB = CURRENCY_SYMBOLS[pB.currency] || '';

      let text = `🏠 *Property Comparison*\n\n`;
      text += `*Property A:* ${pA.address || 'Untitled'}\n`;
      text += `Price: ${csA}${Number(pA.askingPrice).toLocaleString()}\n`;
      if (shareOptions.includeSource && pA.url) text += `Source: ${pA.url}\n`;
      if (shareOptions.includeDealLink) text += `Analysis: ${window.location.origin}/dashboard?projectId=${comparisonData.propertyA.id}\n`;
      
      text += `\n*Property B:* ${pB.address || 'Untitled'}\n`;
      text += `Price: ${csB}${Number(pB.askingPrice).toLocaleString()}\n`;
      if (shareOptions.includeSource && pB.url) text += `Source: ${pB.url}\n`;
      if (shareOptions.includeDealLink) text += `Analysis: ${window.location.origin}/dashboard?projectId=${comparisonData.propertyB.id}\n`;

      text += `\n*Key Differences:*\n`;
      comparisonData.keyDifferences.forEach(d => text += `• ${d.text}\n`);

      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading) {
    return (
     <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div>
     </div>
   );
 }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
        <nav className="border-b border-slate-800 bg-[#0F172A] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} /> Back
                </Link>
                <div className="h-6 w-[1px] bg-slate-700"></div>
                <span className="font-bold text-lg">Compare Properties</span>
            </div>
            <div className="h-8 w-8 flex items-center justify-center text-white"><Logo /></div>
        </nav>

        <main className="p-6 max-w-7xl mx-auto">
            {/* Step 1: Select Category */}
            {!selectedCategory ? (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">What are you comparing?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { id: 'investor-rental', label: 'Rental Strategy', desc: 'Compare Yield, Cashflow, and ROI.' },
                            { id: 'investor-flip', label: 'Flip Strategy', desc: 'Compare Profit, Burn Rate, and Velocity.' },
                            { id: 'owner', label: 'Homeowner', desc: 'Compare Monthly Costs and Affordability.' },
                            { id: 'tenant', label: 'Tenant', desc: 'Compare Rent vs. Buy scenarios.' },
                        ].map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id as ComparisonCategory)}
                                className="bg-[#0F172A] border border-slate-800 p-8 rounded-3xl hover:border-[#6366F1] hover:bg-slate-900 transition-all text-left group"
                            >
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#6366F1] transition-colors">{cat.label}</h3>
                                <p className="text-slate-400">{cat.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            ) : !isComparing ? (
                 // Step 2: Select Projects (Show list if nothing selected or loading)
                 <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Select 2 Properties to Compare ({selectedIds.length}/2)</h2>
                        <button onClick={() => { setSelectedCategory(null); setSelectedIds([]); }} className="text-sm text-slate-400 hover:text-white">Change Category</button>
                    </div>
                    
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl">
                            <p className="text-slate-500 mb-4">No projects found for this category.</p>
                            <button onClick={() => { setSelectedCategory(null); setSelectedIds([]); }} className="text-[#6366F1] font-bold hover:underline">Go back</button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredProjects.map(p => (
                                <div 
                                    key={p.id} 
                                    onClick={() => toggleSelection(p.id)}
                                    className={`p-6 rounded-2xl border flex justify-between items-center cursor-pointer transition-all ${selectedIds.includes(p.id) ? 'bg-[#6366F1]/10 border-[#6366F1]' : 'bg-[#0F172A] border-slate-800 hover:border-slate-600'}`}
                                >
                                    <div>
                                        <h4 className="font-bold text-lg text-white">{p.inputSnapshot?.askingPrice ? `${CURRENCY_SYMBOLS[p.inputSnapshot?.currency] || 'R'} ${Number(p.inputSnapshot.askingPrice).toLocaleString()}` : 'Untitled'}</h4>
                                        <p className="text-slate-400 text-sm">{p.listingUrl || 'Manual Entry'}</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedIds.includes(p.id) ? 'bg-[#6366F1] border-[#6366F1] text-white' : 'border-slate-600'}`}>
                                        {selectedIds.includes(p.id) && <Check size={14} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {selectedIds.length === 2 && (
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
                            <button onClick={() => setIsComparing(true)} className="px-8 py-3 bg-[#6366F1] text-white rounded-full font-bold shadow-xl hover:bg-[#5558DD] transition-all">
                                Compare Properties
                            </button>
                        </div>
                    )}
                 </div>
            ) : (comparisonData || currencyMismatch) && (
                // Step 3: Decision Matrix
                <div className="space-y-8 animate-fade-in">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white">Decision Matrix</h2>
                            <p className="text-slate-400">
                                {comparisonData 
                                    ? `Comparing ${comparisonData.propertyA.inputSnapshot.address} vs ${comparisonData.propertyB.inputSnapshot.address}`
                                    : 'Comparison unavailable due to mismatch'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsComparing(false)} className="text-sm font-bold text-slate-400 hover:text-white">Change Selection</button>
                            
                            {/* Share Button & Popover */}
                            <div className="relative">
                                <button 
                                    onClick={() => setIsShareOpen(!isShareOpen)} 
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors"
                                >
                                    <Share2 size={14} /> Share
                                </button>
                                {isShareOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#0F172A] border border-slate-700 rounded-xl shadow-xl p-4 z-50">
                                        <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Share Options</h4>
                                        <label className="flex items-center gap-2 text-sm text-slate-300 mb-2 cursor-pointer">
                                            <input type="checkbox" checked={shareOptions.includeSource} onChange={e => setShareOptions(prev => ({...prev, includeSource: e.target.checked}))} className="rounded border-slate-700 bg-slate-800 text-indigo-600" />
                                            Include Source Link
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-slate-300 mb-4 cursor-pointer">
                                            <input type="checkbox" checked={shareOptions.includeDealLink} onChange={e => setShareOptions(prev => ({...prev, includeDealLink: e.target.checked}))} className="rounded border-slate-700 bg-slate-800 text-indigo-600" />
                                            Include Deal Link
                                        </label>
                                        <button onClick={handleCopyComparison} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                                            {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                            {isCopied ? 'Copied to Clipboard' : 'Copy Summary'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Currency Mismatch Error */}
                    {currencyMismatch && (
                        <div className="bg-rose-900/20 border border-rose-500/50 rounded-2xl p-8 text-center">
                            <div className="mx-auto w-12 h-12 bg-rose-900/50 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="text-rose-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Currency Mismatch</h3>
                            <p className="text-slate-400 max-w-md mx-auto">
                                You are attempting to compare properties listed in different currencies. 
                                Please select properties with the same currency to ensure an accurate financial comparison.
                            </p>
                            <button onClick={() => setIsComparing(false)} className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition-colors">
                                Select Different Properties
                            </button>
                        </div>
                    )}

                    {/* Comparison Content (Only if no mismatch) */}
                    {!currencyMismatch && comparisonData && (
                        <>
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
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Brain size={20} /> Your Notes & Concerns</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[comparisonData.insightSnapshot.A, comparisonData.insightSnapshot.B].map((snapshot, i) => (
                                        <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
                                            <h4 className="font-bold text-slate-300 mb-3">{i === 0 ? 'Property A' : 'Property B'}</h4>
                                            {snapshot && Object.values(snapshot.prompts).some(p => p.isPinned) ? (
                                                <ul className="space-y-4 text-sm">
                                                    {Object.values(snapshot.prompts).filter(p => p.isPinned).map((p) => (
                                                        <li key={p.id} className="text-sm text-slate-300 border-l-2 border-slate-700 pl-3">
                                                            <p className="font-bold text-white text-xs">{p.question}</p>
                                                            <p className="text-slate-400">{p.response}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="text-sm text-slate-500">
                                                    {snapshot ? (
                                                        <p>No notes pinned. Star (⭐) your key insights to see them here.</p>
                                                    ) : (
                                                        <p>⚠ No insights recorded.</p>
                                                    )}
                                                </div>
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
                                        This score reflects how deeply you've analyzed each property using the Deal Insights engine. Higher completion leads to clearer, more confident decisions.
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
                                <Link href={`/dashboard?projectId=${comparisonData.propertyA.id}&openInsights=true`} className="text-indigo-400 text-xs font-bold mt-2 inline-block hover:underline">
                                    Add/Edit Insights
                                </Link>
                            </div>
                             <div>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="font-bold text-slate-300">Property B</span>
                                    <span className="text-slate-400">{comparisonData.insightSnapshot.B?.progress.completionPercent.toFixed(0) || 0}% complete</span>
                                </div>
                                <ProgressBar percentage={comparisonData.insightSnapshot.B?.progress.completionPercent || 0} status={comparisonData.insightSnapshot.B?.progress.status || 'getting_started'} />
                                <Link href={`/dashboard?projectId=${comparisonData.propertyB.id}&openInsights=true`} className="text-indigo-400 text-xs font-bold mt-2 inline-block hover:underline">
                                    Add/Edit Insights
                                </Link>
                            </div>
                        </div>
                    </div>

                            {/* Category Accordions */}
                            <div className="space-y-4">
                                <ComparisonCategoryAccordion category={comparisonData.financials} propertyAName="Property A" propertyBName="Property B" />
                                <ComparisonCategoryAccordion category={comparisonData.risks} propertyAName="Property A" propertyBName="Property B" />
                                <ComparisonCategoryAccordion category={comparisonData.outlook} propertyAName="Property A" propertyBName="Property B" />
                            </div>
                        </>
                    )}
                </div>
            )}
        </main>
    </div>
  );
}
