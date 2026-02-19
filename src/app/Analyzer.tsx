'use client';

import React, { useState, useMemo, useEffect, ReactNode, useCallback } from 'react';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Info, Edit3, AlertTriangle, Save, Shield, Share2, Mail, MessageCircle, Link as LinkIcon, MoreHorizontal, Check, Loader2, ExternalLink, Trash2, Plus, X, Brain, Star } from 'lucide-react';
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { calculateAnalysis } from '@/shared/logic/analysis';
import { DealInsights } from '@/types/insights';
import { PROMPTS } from '@/shared/data/prompts';
import { InsightsDrawer } from '@/components/insights/InsightsDrawer';

// --- Types & Interfaces ---

interface AnalyzerProps {
  initialData?: any;
  mode?: 'draft' | 'saved' | 'shared' | 'limited';
  user?: any;
  readOnly?: boolean;
  onDelete?: (id: string) => void;
  defaultInsightsOpen?: boolean;
  defaultPersona?: string;
}

type UserPersona = 'investor' | 'owner' | 'tenant';
type InvestorMode = 'rental' | 'flip';
type Currency = 'ZAR' | 'KES' | 'USD';

const CURRENCY_SYMBOLS: { [key in Currency]: string } = {
  ZAR: 'R',
  KES: 'KSh',
  USD: '$'
};

const formatNumber = (num: number): string => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    const abs = Math.abs(num);
    const isNeg = num < 0;
    let valStr;

    if (abs >= 1000000) {
        valStr = (abs / 1000000).toFixed(2) + 'm';
    } else if (abs >= 1000) {
        valStr = (abs / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
        valStr = Math.round(abs).toString();
    }

    return isNeg ? `(${valStr})` : valStr;
};

const formatPercentage = (num: number): string => {
    if (num === undefined || num === null || isNaN(num)) return '0.00%';
    const isNeg = num < 0;
    const absNum = Math.abs(num);

    const formatted = absNum.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).replace(/,/g, ' ');

    const valStr = `${formatted}%`;

    return isNeg ? `(${formatted})%` : valStr;
};

// --- UI Components ---

const KpiCard = ({ label, value, valType, description, threshold, colorBehavior = 'default', prefix = "", isBlurred }: any) => {
  const getStatusClasses = () => {
    const defaultClasses = { wrapper: "border-slate-800 bg-[#0F172A]", value: "text-white" };
    const greenStyle = { wrapper: "bg-emerald-900/30 border-emerald-500/30", value: "text-emerald-400" };
    const amberStyle = { wrapper: "bg-amber-900/30 border-amber-500/30", value: "text-amber-400" };
    const redStyle = { wrapper: "bg-rose-900/30 border-rose-500/30", value: "text-rose-400" };
    const blueStyle = { wrapper: "bg-sky-900/30 border-sky-500/30", value: "text-white" };

    switch (colorBehavior) {
      case 'cashflow':
        return value >= 0 ? greenStyle : amberStyle;
      case 'burnPoint':
        return (value === -1 || value > 3) ? greenStyle : amberStyle;
      case 'neutral':
        return blueStyle;
      case 'inverseThreshold':
        if (!threshold) return defaultClasses;
        if (value <= threshold.green) return greenStyle;
        if (value <= threshold.amber) return amberStyle;
        return redStyle;
      case 'default':
      default:
        if (!threshold) return defaultClasses;
        if (value >= threshold.green) return greenStyle;
        if (value >= threshold.amber) return amberStyle;
        return redStyle;
    }
  };

  const statusClasses = getStatusClasses();
  const wrapperClass = statusClasses.wrapper;
  const valueClass = statusClasses.value;
  const blurClass = isBlurred ? 'blur-lg pointer-events-none' : '';
  let displayValue = valType === 'currency' ? `${prefix || ''}${formatNumber(value)}` : valType === 'percent' ? formatPercentage(value) : value;
  if (colorBehavior === 'burnPoint') {
    displayValue = (value === -1 ? '12+' : value) + ' months';
  }

  return (
    <div className={`p-8 rounded-[2rem] border transition-all duration-300 relative group ${wrapperClass} ${blurClass}`}>
      {/* Knowledge Icon */}
      <div className="absolute top-6 right-6 cursor-help z-20">
        <Info size={16} className="opacity-30 group-hover:opacity-100 transition-opacity text-slate-400" />
        <div className="absolute right-0 top-8 w-72 p-5 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 text-xs text-slate-300 leading-relaxed backdrop-blur-xl">
          <p className="font-bold text-white mb-2 text-sm">{label} Guide</p>
          {description}
        </div>
      </div>

      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">{label}</span>
      <h3 className={`text-2xl font-black tracking-tighter ${valueClass}`}>
        {displayValue}
      </h3>
    </div>
  );
};

const AccordionCard = ({ title, summaryValue, summaryUnit, isOpen, onToggle, children }: { title: string, summaryValue: string, summaryUnit?: string, isOpen: boolean, onToggle: () => void, children: ReactNode }) => {
  return (
    <div className={`bg-[#0F172A] border border-slate-800 rounded-[2rem] transition-all duration-300 ${isOpen ? 'shadow-premium border-[#6366F1]/40' : 'hover:-translate-y-1 hover:shadow-lg hover:border-slate-700'}`}>
      <div className="p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{title}</h4>
            <p className="text-lg font-bold text-white tracking-tight">
              {summaryValue}
              {summaryUnit && <span className="text-base text-slate-400 ml-1">{summaryUnit}</span>}
            </p>
          </div>
          <div className={`transform transition-transform duration-300 text-slate-600 ${isOpen ? 'rotate-180' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="px-6 pb-6 pt-4 border-t border-slate-800 space-y-6">
          {children}
        </div>
      )}
    </div>
  );
};


const InputField = ({ label, value, onChange, type = "number", prefix, suffix, disabled }: any) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      // e.stopPropagation(); // Allow event to bubble so accordion can toggle if needed, but input is disabled
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  const formatDisplayValue = (val: string | number) => {
    if (val === '' || val === undefined || val === null) return '';
    const strVal = String(val);
    if (type !== 'number') return strVal;
    
    const parts = strVal.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join('.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (type === 'number') {
        const rawVal = val.replace(/\s/g, '');
        if (rawVal === '' || rawVal === '-' || !isNaN(Number(rawVal))) {
             onChange(rawVal);
        }
    } else {
        onChange(val);
    }
  };

  return (
    <div className="relative">
      <label className={`block group/input ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} onClick={handleClick}>
        <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 block group-hover/input:text-[#6366F1] transition-colors">{label}</span>
        <div className="relative">
          {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">{prefix}</span>}
          <input 
            type={type === 'number' ? 'text' : type} 
            value={formatDisplayValue(value)} 
            disabled={disabled}
            onChange={handleChange} 
            className={`w-full bg-[#1E293B] border border-slate-700 rounded-xl p-3 ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-10' : ''} text-white font-bold outline-none focus:border-[#6366F1] focus:bg-slate-900 transition-all ${disabled ? 'pointer-events-none' : ''}`} 
          />
          {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">{suffix}</span>}
        </div>
      </label>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap z-50 animate-in fade-in zoom-in duration-200 pointer-events-none">
          Upgrade to Unlock
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-600"></div>
        </div>
      )}
    </div>
  );
};

// New component for chart labels
const CustomizedLabel = (props: any) => {
  const { x, y, stroke, value, formatter, index, skipPredicate } = props;

  if (skipPredicate && skipPredicate(index)) {
    return null;
  }

  if (value === undefined || value === null) return null;

  return (
    <text x={x} y={y} dy={-12} fill={'#e2e8f0'} fontSize={11} fontWeight={600} textAnchor="middle">
      {formatter(value)}
    </text>
  );
};

// --- Constants ---
const CHART_COLORS = [
  '#8b5cf6', '#38bdf8', '#fb7185', '#fbbf24', '#2dd4bf', '#4ade80', 
  '#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#a3e635', '#facc15',
  '#e879f9', '#c084fc', '#818cf8', '#22d3ee', '#4ade80', '#fde047',
  '#f43f5e', '#6366f1'
];

const CurrencyWarningModal = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean, onConfirm: () => void, onCancel: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0F172A] p-8 rounded-2xl border border-slate-700 shadow-xl max-w-sm w-full text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-500/10 mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Change Currency?</h3>
        <p className="text-slate-400 mb-8">Changing the currency is for presentation only and does not convert any values. Please ensure all values are correct for the new currency.</p>
        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-6 py-2 rounded-lg text-sm font-bold bg-[#6366F1] text-white hover:bg-[#5558DD] transition-colors">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Analyzer({ initialData, mode = 'draft', user, readOnly = false, onDelete, defaultInsightsOpen = false, defaultPersona }: AnalyzerProps) {
  const [persona, setPersona] = useState<UserPersona>((defaultPersona as UserPersona) || 'investor');
  const [investorMode, setInvestorMode] = useState<InvestorMode>('rental');
  const [chartMetric, setChartMetric] = useState<'cashflow' | 'debt' | 'yield'>('cashflow');
  const [flipChartMetric, setFlipChartMetric] = useState<'profit' | 'burn'>('profit');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const assumptionsRef = React.useRef<HTMLDivElement>(null);
  const flipAssumptionsRef = React.useRef<HTMLDivElement>(null);
  const ownerAssumptionsRef = React.useRef<HTMLDivElement>(null);
  const tenantAssumptionsRef = React.useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(initialData?.id || null);
  const [isCopied, setIsCopied] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showCurrencyWarning, setShowCurrencyWarning] = useState(false);
  const [pendingCurrency, setPendingCurrency] = useState<Currency | null>(null);
  const [isInsightsOpen, setIsInsightsOpen] = useState(defaultInsightsOpen);
  
  const isLimited = mode === 'limited';
  const isInvestorLocked = readOnly || (isLimited && persona === 'investor');
  const isAdvancedLocked = readOnly || isLimited; // For advanced charts like Equity Builder
  const isActionDisabled = readOnly || isLimited; // For Save/Delete buttons

  const [inputs, setInputs] = useState({
    askingPrice: '',
    discountOnAsking: '',
    monthlyRent: '',
    levies: '',
    rates: '',
    depositPercent: '',
    interestRate: '11.75',
    termYears: '20',
    monthlyIncome: '',
    utilities: '',
    insurance: '',
    inflationRate: '5',
    rentEscalationRate: '6',
    propertyAppreciationRate: '4',
    investmentReturnRate: '8',
    // Provisions
    includeMaintenance: true,
    maintenancePercentRent: '5',
    maintenancePercentValue: '1',
    includeVacancy: true,
    vacancyPercent: '5',
    includeManagement: true,
    managementPercent: '8',
    // Flip Specifics
    renovationBudget: '',
    exitPrice: '',
    securityCost: '',
    transport: '',
    groceries: '',
    otherEssentials: '',
    bondRegistrationFees: '',
    transferCosts: '',
    url: '',
    currency: 'ZAR',
    strategy: 'rental', // Default strategy
    customExpenses: [] as { id: string, name: string, value: string }[],
    insights: null as DealInsights | null,
    ...initialData
  });

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs((prev: any) => ({
        ...prev,
        [field]: value
    }));
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setPendingCurrency(newCurrency);
    setShowCurrencyWarning(true);
  };

  const confirmCurrencyChange = () => {
    if (pendingCurrency) {
      handleInputChange('currency', pendingCurrency);
    }
    setShowCurrencyWarning(false);
    setPendingCurrency(null);
  };

  const initializeInsights = (persona: UserPersona) => {
    const personaPrompts = PROMPTS[persona] || [];
    const newInsights: DealInsights = {
      schemaVersion: 1,
      lastUpdated: Date.now(),
      progress: {
        totalPrompts: personaPrompts.length,
        completedPrompts: 0,
        completionPercent: 0,
        status: 'getting_started',
      },
      prompts: personaPrompts.reduce((acc, p) => {
        acc[p.id] = {
          id: p.id,
          category: p.category,
          question: p.question,
          response: '',
          tags: [],
          isPinned: false,
          completedAt: null,
        };
        return acc;
      }, {} as { [key: string]: any }),
      freeformNotes: '',
    };
    handleInputChange('insights', newInsights as any);
  };

  const handleUpdateInsight = useCallback((promptId: string, text: string, tags: string[]) => {
    const currentInsights = inputs.insights;
    if (!currentInsights) return;

    // Deep clone to ensure we don't mutate the state directly
    const newInsights: DealInsights = JSON.parse(JSON.stringify(currentInsights));
    const prompt = newInsights.prompts[promptId];

    if (prompt) {
      const wasCompleted = !!prompt.completedAt;
      const isNowCompleted = text.trim() !== '' || tags.length > 0;

      prompt.response = text;
      prompt.tags = tags;
      prompt.completedAt = isNowCompleted ? (prompt.completedAt || Date.now()) : null;

      if (!wasCompleted && isNowCompleted) newInsights.progress.completedPrompts++;
      if (wasCompleted && !isNowCompleted) newInsights.progress.completedPrompts--;

      // Recalculate progress
      const { totalPrompts, completedPrompts } = newInsights.progress;
      const completionPercent = totalPrompts > 0 ? (completedPrompts / totalPrompts) * 100 : 0;
      newInsights.progress.completionPercent = completionPercent;

      if (completionPercent >= 100) newInsights.progress.status = 'complete';
      else if (completionPercent >= 85) newInsights.progress.status = 'nearly_complete';
      else if (completionPercent >= 21) newInsights.progress.status = 'in_progress';
      else newInsights.progress.status = 'getting_started';

      newInsights.lastUpdated = Date.now();
      setInputs((prev: any) => ({ ...prev, insights: newInsights }));
    }
  }, [inputs.insights]);

  const handlePinInsight = useCallback((promptId: string) => {
    const currentInsights = inputs.insights;
    if (!currentInsights) return;

    const newInsights: DealInsights = JSON.parse(JSON.stringify(currentInsights));
    const prompt = newInsights.prompts[promptId];

    if (prompt && prompt.completedAt) {
      prompt.isPinned = !prompt.isPinned;
      newInsights.lastUpdated = Date.now();
      setInputs((prev: any) => ({ ...prev, insights: newInsights }));
    }
  }, [inputs.insights]);

  const handleUpdateFreeform = useCallback((text: string) => {
    const currentInsights = inputs.insights;
    if (!currentInsights) return;

    const newInsights: DealInsights = { ...currentInsights, freeformNotes: text, lastUpdated: Date.now() };
    setInputs((prev: any) => ({ ...prev, insights: newInsights }));
  }, [inputs.insights]);

  // Sync persona from extension data if available
  useEffect(() => {
    if (initialData) {
      setInputs((prev: any) => ({...prev, ...initialData}));
    }
    if (initialData?.type) {
        setPersona(initialData.type as UserPersona);
    }
    if (initialData?.strategy) {
        setInvestorMode(initialData.strategy as InvestorMode);
    }
    if (initialData?.currency) {
      handleInputChange('currency', initialData.currency);
    }
    if (initialData && !initialData.insights) {
      initializeInsights(initialData.type || persona);
    }
  }, [initialData]);

  useEffect(() => {
    if (defaultInsightsOpen) {
        setIsInsightsOpen(true);
    }
  }, [defaultInsightsOpen]);

  useEffect(() => {
    if (defaultPersona) {
        setPersona(defaultPersona as UserPersona);
    }
  }, [defaultPersona]);

  // Ensure projectId updates when initialData changes (e.g. switching projects)
  useEffect(() => {
    if (initialData && initialData.id) {
        setProjectId(initialData.id);
    } else {
        setProjectId(null);
    }
  }, [initialData]);

  // Autosave Effect
  useEffect(() => {
    if (!user || isActionDisabled) return;
    
    setAutosaveStatus('saving');
    const timer = setTimeout(() => {
        handleSave(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [inputs, user, isActionDisabled]);

  const handleSave = async (silent = false) => {
    if (!user) return null;
    if (!silent) setIsSaving(true);
    setAutosaveStatus('saving');

    try {
        const db = getFirestore();
        let id = projectId;

        if (id) {
            // Use setDoc with merge: true to handle both updates and creation of pre-generated IDs
            const projectRef = doc(db, 'projects', id);
            // Sanitize inputs to remove undefined values which Firestore rejects
            const sanitizedInputs = JSON.parse(JSON.stringify({ ...inputs, type: persona, strategy: investorMode, currency: inputs.currency }));
            await setDoc(projectRef, {
                inputSnapshot: sanitizedInputs,
                lastModified: serverTimestamp(),
                ownerId: user.uid, // Ensure ownerId is set for security rules
                listingUrl: initialData?.url || inputs.url || ''
            }, { merge: true });
        } else {
            // Create new project
            const sanitizedInputs = JSON.parse(JSON.stringify({ ...inputs, type: persona, strategy: investorMode, currency: inputs.currency }));
            const docRef = await addDoc(collection(db, 'projects'), {
                inputSnapshot: sanitizedInputs,
                ownerId: user.uid,
                createdAt: serverTimestamp(),
                source: 'Web Dashboard',
                listingUrl: initialData?.url || inputs.url || ''
            });
            id = docRef.id;
            setProjectId(id);
        }
        
        if (!silent) alert('Project saved successfully!');
        setAutosaveStatus('saved');
        if (!silent) setIsSaving(false);
        return id;
    } catch (e) {
        console.error(e);
        alert(`Failed to save project: ${(e as Error).message}`);
        setAutosaveStatus('unsaved');
        setIsSaving(false);
        return null;
    }
  };

  const handleScrollToAssumptions = () => {
    assumptionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleScrollToFlipAssumptions = () => {
    flipAssumptionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleScrollToOwnerAssumptions = () => {
    ownerAssumptionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const handleScrollToTenantAssumptions = () => {
    tenantAssumptionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Custom Expense Handlers
  const addCustomExpense = () => {
    const newExpense = { id: Date.now().toString(), name: '', value: '' };
    setInputs((prev: any) => ({ ...prev, customExpenses: [...(prev.customExpenses || []), newExpense] }));
  };

  const removeCustomExpense = (id: string) => {
    setInputs((prev: any) => ({ ...prev, customExpenses: prev.customExpenses.filter((e: any) => e.id !== id) }));
  };

  const updateCustomExpense = (id: string, field: 'name' | 'value', val: string) => {
    setInputs((prev: any) => ({
      ...prev,
      customExpenses: prev.customExpenses.map((e: any) => e.id === id ? { ...e, [field]: val } : e)
    }));
  };

  const handleShare = async (platform: 'email' | 'whatsapp' | 'copy' | 'native') => {
    if (!user) {
        alert("Please login to share this analysis.");
        return;
    }

    let id = projectId;
    
    // 1. Ensure Project is Saved
    if (!id) {
        if (readOnly) {
            alert("Cannot save a read-only project. Please duplicate it first.");
            return;
        }
        id = await handleSave();
        if (!id) return; // Save failed or cancelled
    }

    // 2. Generate Link & Message
    const shareUrl = `${window.location.origin}/project/${id}`;
    const shareText = `Check out this property investment opportunity I analyzed on PropPlug: ${shareUrl}`;

    // 3. Handle Copy Link
    if (platform === 'copy') {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        setIsShareOpen(false);
        return;
    }

    // 4. Handle Native Share (Mobile/Tablets)
    if (platform === 'native') {
        if (navigator.share) {
            navigator.share({
                title: 'PropPlug Analysis',
                text: shareText,
                url: shareUrl
            }).catch((err) => console.error('Error sharing:', err));
        } else {
            alert("Sharing is not supported on this device.");
        }
        setIsShareOpen(false);
        return;
    }

    // 5. Handle Web Intents (Email/WhatsApp)
    const encodedText = encodeURIComponent(shareText);
    let externalUrl = '';
    switch (platform) {
        case 'email':
            externalUrl = `mailto:?subject=Property Investment Analysis&body=${encodedText}`;
            break;
        case 'whatsapp':
            externalUrl = `https://wa.me/?text=${encodedText}`;
            break;
    }
    
    if (externalUrl) {
        window.open(externalUrl, '_blank');
    }
    setIsShareOpen(false);
  };

  // --- Calculations ---

  const analysis = useMemo(() => calculateAnalysis(inputs), [inputs]);
  const currencySymbol = CURRENCY_SYMBOLS[inputs.currency as Currency] || 'R';

  const chartConfig = {
    cashflow: { label: 'Net Cashflow', color: '#10B981', dataKey: 'cashflow', unit: currencySymbol },
    debt: { label: 'Loan Balance', color: '#F43F5E', dataKey: 'debt', unit: currencySymbol },
    yield: { label: 'Net Yield %', color: '#F59E0B', dataKey: 'yield', unit: '%' }
  };

  const flipChartConfig = {
    profit: { label: 'Projected Profit', color: '#10B981', dataKey: 'profit', unit: currencySymbol },
    burn: { label: 'Cumulative Burn', color: '#F43F5E', dataKey: 'burn', unit: currencySymbol },
  };

  return (
    <div className="space-y-8">
      <InsightsDrawer 
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        insights={inputs.insights}
        onUpdateInsight={handleUpdateInsight}
        onPinInsight={handlePinInsight}
        onUpdateFreeform={handleUpdateFreeform}
        persona={persona}
      />
      <CurrencyWarningModal
        isOpen={showCurrencyWarning} 
        onConfirm={confirmCurrencyChange} 
        onCancel={() => setShowCurrencyWarning(false)} 
      />
      {/* Persona Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-[#0F172A] p-1.5 rounded-2xl border border-slate-800">
            {['investor', 'owner', 'tenant'].map((p) => (
                <button 
                    key={p}
                    onClick={() => setPersona(p as UserPersona)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${persona === p ? 'bg-[#6366F1] text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                    {p}
                </button>
            ))}
        </div>
        
        {persona === 'investor' && (
            <div className="flex gap-2">
                <button 
                    onClick={() => setInvestorMode('rental')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${investorMode === 'rental' ? 'bg-[#6366F1]/10 border-[#6366F1] text-[#6366F1]' : 'border-slate-700 text-slate-400'}`}
                >
                    Rental
                </button>
                <button 
                    onClick={() => setInvestorMode('flip')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${investorMode === 'flip' ? 'bg-[#6366F1]/10 border-[#6366F1] text-[#6366F1]' : 'border-slate-700 text-slate-400'}`}
                >
                    Flip
                </button>
            </div>
        )}
        
        <div className="flex items-center gap-2" id="analyzer-actions">
            {/* Currency Dropdown */}
            <div className="relative">
                <select
                    value={inputs.currency}
                    onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
                    disabled={readOnly}
                    className="bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white appearance-none focus:outline-none focus:border-indigo-500 text-center"
                >
                    <option value="ZAR">ZAR (R)</option>
                    <option value="KES">KES (KSh)</option>
                    <option value="USD">USD ($)</option>
                </select>
            </div>

            {/* Insights Button */}
            <button 
              id="deal-insights-btn"
              onClick={() => setIsInsightsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-xl font-bold text-xs hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <Brain size={14} />
              <span className="hidden sm:inline">Deal Insights</span>
            </button>

            {/* Autosave Indicator */}
            {user && !isActionDisabled && (
                <div className="group flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 mr-2 cursor-help relative">
                    {autosaveStatus === 'saving' ? (
                        <Loader2 size={14} className="text-slate-400 animate-spin" />
                    ) : (
                        <Check size={14} className="text-emerald-500" />
                    )}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {autosaveStatus === 'saving' ? 'Saving...' : 'All changes saved'}
                    </div>
                </div>
            )}


            {/* Deal Source Button */}
            {inputs.url ? (
                <a 
                    href={inputs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-xl font-bold text-xs hover:bg-slate-700 transition-colors border border-slate-700"
                >
                    <ExternalLink size={14} />
                    <span className="hidden sm:inline">Deal Source</span>
                </a>
            ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-400 rounded-xl font-bold text-xs border border-slate-800 cursor-default">
                    <span className="hidden sm:inline">Manual</span>
                </div>
            )}

            {/* Share Button */}
            <div className="relative">
                <button 
                    onClick={() => setIsShareOpen(!isShareOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-xl font-bold text-xs hover:bg-slate-700 transition-colors border border-slate-700"
                >
                    <Share2 size={14} />
                    Share
                </button>
                
                {isShareOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#0F172A] border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col">
                        <button onClick={() => handleShare('email')} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-bold transition-colors text-left">
                            <Mail size={14} /> Email
                        </button>
                        <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-bold transition-colors text-left border-t border-slate-800">
                            <MessageCircle size={14} /> WhatsApp
                        </button>
                        <button onClick={() => handleShare('copy')} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-bold transition-colors text-left border-t border-slate-800">
                            {isCopied ? <Check size={14} className="text-emerald-500" /> : <LinkIcon size={14} />} 
                            {isCopied ? 'Copied!' : 'Copy Link'}
                        </button>
                        <button onClick={() => handleShare('native')} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-bold transition-colors text-left border-t border-slate-800 sm:hidden">
                            <MoreHorizontal size={14} /> More Options...
                        </button>
                    </div>
                )}
            </div>

            {user && !isActionDisabled && (
                <button 
                    onClick={() => handleSave()}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                    <Save size={14} />
                    {isSaving ? 'Saving...' : 'Save Project'}
                </button>
            )}
        </div>
      </div>

      {/* --- INVESTOR: RENTAL MODE --- */}
      {persona === 'investor' && investorMode === 'rental' && (
        <div className="space-y-8">
            <div id="kpi-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard 
                    label="Gross Yield" 
                    value={analysis.grossYield} 
                    valType="percent"
                    isBlurred={isInvestorLocked}
                    description="The annual rental income as a percentage of the property's purchase price. A higher value is better, but it doesn't account for expenses."
                />
                <KpiCard 
                    label="Net Yield" 
                    value={analysis.netYield} 
                    valType="percent"
                    description="Annual rental income minus operating expenses, as a percentage of the purchase price. This is a more realistic return metric than Gross Yield. A higher value is better."
                />
                <KpiCard 
                    label="Cash on Cash Return" 
                    value={analysis.cashOnCashReturn} 
                    valType="percent"
                    isBlurred={isInvestorLocked}
                    description="The annual pre-tax cashflow as a percentage of the total cash invested (deposit + closing costs). This measures the return on your actual cash-in. A higher value is better."
                />
                <KpiCard 
                    label="Annual Cashflow" 
                    value={analysis.netCashflow * 12} 
                    prefix={`${currencySymbol} `}
                    valType="currency"
                    colorBehavior="cashflow"
                    description="The actual 'take-home' profit or loss each year after all expenses are paid. A higher, positive value is better as it means the property is funding itself."
                />
            </div>

            <div className={isInvestorLocked ? 'blur-lg pointer-events-none' : ''}>
              <div className="bg-[#0F172A] border border-slate-800 p-8 rounded-[2.5rem] h-[400px] relative">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs opacity-50">10-Year Wealth Accumulation</h3>
                    {!isInvestorLocked && (
                        <button id="edit-assumptions-btn" onClick={handleScrollToAssumptions} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white">
                            <Edit3 size={12} />
                            Edit Assumptions
                        </button>
                    )}
                </div>
                
                {/* Custom Legend / Toggle */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {Object.entries(chartConfig).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setChartMetric(key as any)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${chartMetric === key ? 'bg-slate-800 text-white border-slate-600' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                        >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                            {config.label}
                        </button>
                    ))}
                </div>

                <ResponsiveContainer width="100%" height="75%">
                    <AreaChart data={analysis.rentalSeries} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
                        <defs>
                            <linearGradient id={`color${chartMetric}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartConfig[chartMetric].color} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={chartConfig[chartMetric].color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 500, fontSize: 11 }} label={{ value: 'Years', position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} />
                        <YAxis hide={true} axisLine={false} tickLine={false} width={10} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px'}} 
                            formatter={(value: number) => [chartMetric === 'yield' ? `${value}%` : `${currencySymbol} ${formatNumber(value)}`, chartConfig[chartMetric].label]}
                            itemStyle={{ color: '#e2e8f0' }}
                            labelStyle={{ color: '#94a3b8' }}
                            labelFormatter={(label) => `Year ${label}`}
                        />
                        <Area 
                            type="monotone" 
                            dataKey={chartConfig[chartMetric].dataKey} 
                            stroke={chartConfig[chartMetric].color} 
                            strokeWidth={3} 
                            fill={`url(#color${chartMetric})`} 
                            animationDuration={500} 
                            dot={{ r: 4, fill: chartConfig[chartMetric].color, stroke: '#0F172A', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: chartConfig[chartMetric].color, stroke: '#fff' }}
                            label={<CustomizedLabel formatter={(value: number) => chartMetric === 'yield' ? `${value.toFixed(1)}%` : `${currencySymbol} ${formatNumber(value)}`} />}
                        />
                    </AreaChart>
                </ResponsiveContainer>
              </div>

              <div id="assumptions-grid" ref={assumptionsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start mt-8">
                <AccordionCard 
                    title="Purchase Price"
                    summaryValue={`${currencySymbol} ${formatNumber(analysis.purchasePrice)}`}
                    isOpen={activeAccordion === 'purchase'}
                    onToggle={() => setActiveAccordion(activeAccordion === 'purchase' ? null : 'purchase')}
                >
                    <InputField label="Asking Price" value={inputs.askingPrice} onChange={(v: string) => handleInputChange('askingPrice', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <InputField label="Discount" value={inputs.discountOnAsking} onChange={(v: string) => handleInputChange('discountOnAsking', v)} suffix="%" disabled={isInvestorLocked} />
                </AccordionCard>

                <AccordionCard 
                    title="Bond"
                    summaryValue={`${currencySymbol} ${formatNumber(analysis.bondPayment)}`}
                    summaryUnit="/mo"
                    isOpen={activeAccordion === 'bond'}
                    onToggle={() => setActiveAccordion(activeAccordion === 'bond' ? null : 'bond')}
                >
                    <InputField label="Deposit" value={inputs.depositPercent} onChange={(v: string) => handleInputChange('depositPercent', v)} suffix="%" disabled={isInvestorLocked} />
                    <InputField label="Interest Rate" value={inputs.interestRate} onChange={(v: string) => handleInputChange('interestRate', v)} suffix="%" disabled={isInvestorLocked} />
                    <InputField label="Loan Term" value={inputs.termYears} onChange={(v: string) => handleInputChange('termYears', v)} suffix="Years" disabled={isInvestorLocked} />
                    <InputField label="Transfer Costs" value={inputs.transferCosts} onChange={(v: string) => handleInputChange('transferCosts', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <InputField label="Bond Registration Fees" value={inputs.bondRegistrationFees} onChange={(v: string) => handleInputChange('bondRegistrationFees', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                </AccordionCard>

                <AccordionCard 
                    title="Rental Income"
                    summaryValue={`${currencySymbol} ${formatNumber(Number(inputs.monthlyRent || 0))}`}
                    isOpen={activeAccordion === 'rental'}
                    onToggle={() => setActiveAccordion(activeAccordion === 'rental' ? null : 'rental')}
                >
                    <InputField label="Gross Monthly Rent" value={inputs.monthlyRent} onChange={(v: string) => handleInputChange('monthlyRent', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <div className="pt-4 mt-4 border-t border-slate-800 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="flex-grow"><InputField label="Vacancy Provision" value={inputs.vacancyPercent} onChange={(v: string) => handleInputChange('vacancyPercent', v)} suffix="%" disabled={isInvestorLocked} /></div>
                            <input type="checkbox" checked={inputs.includeVacancy} onChange={e => setInputs({...inputs, includeVacancy: e.target.checked})} className="mt-6" disabled={isInvestorLocked} />
                        </div>
                        <InputField label="Annual Rent Escalation" value={inputs.rentEscalationRate} onChange={(v: string) => handleInputChange('rentEscalationRate', v)} suffix="%" disabled={isInvestorLocked} />
                    </div>
                </AccordionCard>

                <AccordionCard 
                    title="Monthly Expenses"
                    summaryValue={`${currencySymbol} ${formatNumber(analysis.monthlyExpenses)}`}
                    summaryUnit="/mo"
                    isOpen={activeAccordion === 'expenses'}
                    onToggle={() => setActiveAccordion(activeAccordion === 'expenses' ? null : 'expenses')}
                >
                    <InputField label="Levies" value={inputs.levies} onChange={(v: string) => handleInputChange('levies', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <InputField label="Rates & Taxes" value={inputs.rates} onChange={(v: string) => handleInputChange('rates', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <InputField label="Utilities" value={inputs.utilities} onChange={(v: string) => handleInputChange('utilities', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <InputField label="Insurance" value={inputs.insurance} onChange={(v: string) => handleInputChange('insurance', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <InputField label="Annual Cost Escalation" value={inputs.inflationRate} onChange={(v: string) => handleInputChange('inflationRate', v)} suffix="%" disabled={isInvestorLocked} />
                    
                    <div className="pt-4 mt-2 border-t border-slate-800">
                        <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Provisions</h5>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="flex-grow"><InputField label="Maintenance Provision" value={inputs.maintenancePercentRent} onChange={(v: string) => handleInputChange('maintenancePercentRent', v)} suffix="%" disabled={isInvestorLocked} /></div>
                                <input type="checkbox" checked={inputs.includeMaintenance} onChange={e => setInputs({...inputs, includeMaintenance: e.target.checked})} className="mt-6" disabled={isInvestorLocked} />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-grow"><InputField label="Management Provision" value={inputs.managementPercent} onChange={(v: string) => handleInputChange('managementPercent', v)} suffix="%" disabled={isInvestorLocked} /></div>
                                <input type="checkbox" checked={inputs.includeManagement} onChange={e => setInputs({...inputs, includeManagement: e.target.checked})} className="mt-6" disabled={isInvestorLocked} />
                            </div>
                        </div>
                    </div>
                </AccordionCard>
              </div>
            </div>
        </div>
      )}

      {/* --- INVESTOR: FLIP MODE (NEW) --- */}
      {persona === 'investor' && investorMode === 'flip' && (
        <div className="space-y-8">
            <div id="kpi-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard 
                    label="Velocity ROI (6 Mo)" 
                    value={analysis.flip.velocityROI} 
                    valType="percent"
                    description="Annualized return on capital invested. A higher value is better, indicating a faster, more profitable flip."
                />
                <KpiCard 
                    label="Total Cash Required"
                    value={analysis.flip.totalCashRequired}
                    valType="currency"
                    prefix={`${currencySymbol} `}
                    colorBehavior="neutral"
                    description="The total out-of-pocket cash needed to acquire and renovate the property (Deposit + Closing Costs + Renovation Budget)."
                />
                <KpiCard 
                    label="Monthly Burn"
                    valType="currency"
                    value={analysis.flip.monthlyBurn}
                    prefix={`${currencySymbol} `}
                    colorBehavior="neutral"
                    isBlurred={isInvestorLocked}
                    description="The estimated monthly cost to hold the property during the flip (bond interest, levies, rates, etc.)."
                />
                <KpiCard 
                    label="Burn Point" 
                    value={analysis.flip.burnPointMonth} 
                    colorBehavior="burnPoint"
                    isBlurred={isInvestorLocked}
                    description="The month when holding costs eat your entire profit margin. A higher number is better as it gives you a longer runway to sell the property."
                />
            </div>

            <div className={isInvestorLocked ? 'blur-lg pointer-events-none' : ''}>
              <div className="bg-[#0F172A] border border-slate-800 p-8 rounded-[2.5rem] h-[450px] relative">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs opacity-50">Profit Burn Analysis</h3>
                    {!isInvestorLocked && (
                        <button id="edit-assumptions-btn" onClick={handleScrollToFlipAssumptions} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white">
                            <Edit3 size={12} />
                            Edit Assumptions
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-3 mb-6">
                    {Object.entries(flipChartConfig).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setFlipChartMetric(key as any)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${flipChartMetric === key ? 'bg-slate-800 text-white border-slate-600' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                        >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                            {config.label}
                        </button>
                    ))}
                </div>
                <ResponsiveContainer width="100%" height="75%">
                    <AreaChart data={analysis.flip.series} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
                        <defs>
                            <linearGradient id={`color${flipChartMetric}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={flipChartConfig[flipChartMetric].color} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={flipChartConfig[flipChartMetric].color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                        <XAxis dataKey="month" tickFormatter={(tick) => `M${tick}`} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 500, fontSize: 11 }} label={{ value: 'Months', position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} />
                        <YAxis hide={true} axisLine={false} tickLine={false} width={10} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px'}} 
                            formatter={(val: number) => [`${currencySymbol} ${formatNumber(val)}`, flipChartConfig[flipChartMetric].label]} 
                            itemStyle={{ color: '#e2e8f0' }}
                            labelStyle={{ color: '#94a3b8' }}
                            labelFormatter={(label) => `Month ${label}`} 
                        />
                        <ReferenceLine y={0} stroke="#94A3B8" strokeDasharray="3 3" />
                        <Area 
                            type="monotone" 
                            dataKey={flipChartConfig[flipChartMetric].dataKey} 
                            stroke={flipChartConfig[flipChartMetric].color} 
                            strokeWidth={3} 
                            fill={`url(#color${flipChartMetric})`} 
                            animationDuration={500} 
                            dot={{ r: 3, fill: flipChartConfig[flipChartMetric].color, stroke: '#0F172A', strokeWidth: 2 }}
                            activeDot={{ r: 5, fill: flipChartConfig[flipChartMetric].color, stroke: '#fff' }}
                            label={<CustomizedLabel formatter={(value: number) => `${currencySymbol} ${formatNumber(value)}`} />}
                        />
                    </AreaChart>
                </ResponsiveContainer>
              </div>

              <div id="assumptions-grid" ref={flipAssumptionsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-8">
                <AccordionCard 
                    title="Acquisition & Reno"
                    summaryValue={`${currencySymbol} ${formatNumber(analysis.purchasePrice + Number(inputs.renovationBudget || 0))}`}
                    isOpen={activeAccordion === 'flip-acq'}
                    onToggle={() => setActiveAccordion(activeAccordion === 'flip-acq' ? null : 'flip-acq')}
                >
                    <InputField label="Purchase Price" value={inputs.askingPrice} onChange={(v: string) => handleInputChange('askingPrice', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <InputField label="Discount" value={inputs.discountOnAsking} onChange={(v: string) => handleInputChange('discountOnAsking', v)} suffix="%" disabled={isInvestorLocked} />
                    <InputField label="Renovation Budget" value={inputs.renovationBudget} onChange={(v: string) => handleInputChange('renovationBudget', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <InputField label="Target Exit Price" value={inputs.exitPrice} onChange={(v: string) => handleInputChange('exitPrice', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <InputField label="Transfer Costs" value={inputs.transferCosts} onChange={(v: string) => handleInputChange('transferCosts', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <InputField label="Bond Registration Fees" value={inputs.bondRegistrationFees} onChange={(v: string) => handleInputChange('bondRegistrationFees', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                </AccordionCard>
                
                <AccordionCard 
                    title="Holding Costs"
                    summaryValue={`${currencySymbol} ${formatNumber(analysis.flip.monthlyBurn)}`}
                    summaryUnit="/mo"
                    isOpen={activeAccordion === 'flip-hold'}
                    onToggle={() => setActiveAccordion(activeAccordion === 'flip-hold' ? null : 'flip-hold')}
                >
                    <InputField label="Deposit" value={inputs.depositPercent} onChange={(v: string) => handleInputChange('depositPercent', v)} suffix="%" disabled={isInvestorLocked} />
                    <InputField label="Bond Interest Rate" value={inputs.interestRate} onChange={(v: string) => handleInputChange('interestRate', v)} suffix="%" disabled={isInvestorLocked} />
                    <InputField label="Levies" value={inputs.levies} onChange={(v: string) => handleInputChange('levies', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <InputField label="Rates & Taxes" value={inputs.rates} onChange={(v: string) => handleInputChange('rates', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <InputField label="Security" value={inputs.securityCost} onChange={(v: string) => handleInputChange('securityCost', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                    <InputField label="Utilities" value={inputs.utilities} onChange={(v: string) => handleInputChange('utilities', v)} prefix={currencySymbol} disabled={isInvestorLocked} />
                </AccordionCard>
              </div>
            </div>
        </div>
      )}

      {/* --- OWNER MODE --- */}
      {persona === 'owner' && (
        <div className="space-y-8">
            <div id="kpi-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard 
                    label="Safety Buffer" 
                    value={analysis.owner.maxRate - inputs.interestRate} 
                    valType="percent" 
                    isBlurred={readOnly}
                    description="How much interest rates can rise before you hit a 45% Debt-to-Income ratio. A higher percentage is better, indicating more resilience to interest rate hikes." />
                <KpiCard 
                    label="Total Monthly Cost" 
                    value={analysis.owner.totalCosts} 
                    valType="currency"
                    prefix={`${currencySymbol} `}
                    description="Bond + Levies + Rates + Insurance + Utilities. This is your total monthly financial commitment to owning the property. A lower value is better for your personal cash flow." />
                <KpiCard 
                    label="Affordability" 
                    value={analysis.owner.incomeRatio} 
                    valType="percent"
                    colorBehavior="inverseThreshold" threshold={{ green: 30, amber: 40 }} description="Percentage of gross income spent on housing costs. Banks typically look for this to be under 30%." 
                />
                <KpiCard 
                    label="Disposable Income" 
                    value={analysis.owner.disposableIncome} 
                    valType="currency"
                    prefix={`${currencySymbol} `} colorBehavior="cashflow" isBlurred={readOnly} description="Monthly income remaining after all housing costs and living expenses are paid." 
                />
            </div>
            <div>
              <div className="bg-[#0F172A] border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
                  <Shield size={80} fill={analysis.owner.maxRate - inputs.interestRate > 2 ? "#10B981" : "#F43F5E"} className={analysis.owner.maxRate - inputs.interestRate > 2 ? "text-emerald-600" : "text-rose-600"} />
                  <div>
                      <h3 className="text-2xl font-bold text-white">Interest Rate Shield</h3>
                      <p className="text-slate-400 mt-2 max-w-md">You can afford interest rates up to <span className="text-white font-bold">{analysis.owner.maxRate.toFixed(2)}%</span> before your housing costs exceed 45% of your income.</p>
                  </div>
              </div>

              <div className={`bg-[#0F172A] border border-slate-800 p-8 rounded-[2.5rem] h-[450px] relative mt-8 ${isAdvancedLocked ? 'blur-lg pointer-events-none' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs opacity-50">Equity Builder (10 Years)</h3>
                        <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1 border border-slate-700">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Appreciation</span>
                            <input 
                                type="number" 
                                value={inputs.propertyAppreciationRate}
                                disabled={isAdvancedLocked}
                                onChange={(e) => handleInputChange('propertyAppreciationRate', e.target.value)}
                                className="w-12 bg-transparent text-white font-bold text-xs outline-none text-right"
                            />
                            <span className="text-xs text-slate-500">%</span>
                        </div>
                    </div>
                    {!isAdvancedLocked && (
                        <button id="edit-assumptions-btn" onClick={handleScrollToOwnerAssumptions} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white">
                            <Edit3 size={12} />
                            Edit Assumptions
                        </button>
                    )}
                </div>
                
                <ResponsiveContainer width="100%" height="75%">
                    <AreaChart data={analysis.owner.series} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
                        <defs>
                            <linearGradient id="colorOwnerEquity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 500, fontSize: 11 }} label={{ value: 'Years', position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} />
                        <YAxis hide={true} axisLine={false} tickLine={false} width={10} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px'}} 
                            formatter={(value: number) => [`${currencySymbol} ${formatNumber(value)}`, 'Net Equity']}
                            itemStyle={{ color: '#e2e8f0' }}
                            labelStyle={{ color: '#94a3b8' }}
                            labelFormatter={(label) => `Year ${label}`}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="equity" 
                            stroke="#6366F1" 
                            strokeWidth={3} 
                            fill="url(#colorOwnerEquity)" 
                            animationDuration={500} 
                            dot={{ r: 4, fill: '#6366F1', stroke: '#0F172A', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#6366F1', stroke: '#fff' }}
                            label={<CustomizedLabel formatter={(value: number) => `${currencySymbol} ${formatNumber(value)}`} />}
                        />
                    </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className={`bg-[#0F172A] border border-slate-800 p-8 rounded-[2.5rem] h-[550px] mt-8 ${readOnly ? 'blur-lg pointer-events-none' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs opacity-50">Monthly Budget Breakdown</h3>
                    {!readOnly && (
                        <button id="edit-assumptions-btn" onClick={handleScrollToOwnerAssumptions} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white">
                            <Edit3 size={12} />
                            Edit Assumptions
                        </button>
                    )}
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ bottom: 100 }}>
                        <Pie
                            data={analysis.owner.budgetBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={false}
                            outerRadius={150}
                            innerRadius={80}
                            dataKey="value"
                            paddingAngle={2}
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                        >
                            {analysis.owner.budgetBreakdown.map((entry: any, index: number) => {
                                return <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} style={{ opacity: activeIndex === null || activeIndex === index ? 1 : 0.3, transition: 'opacity 0.2s' }} />;
                            })}
                        </Pie>
                        <Tooltip 
                            contentStyle={{backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px'}} 
                            itemStyle={{ color: '#e2e8f0' }}
                            formatter={(value: number, name: string) => {
                                const total = analysis.owner.budgetBreakdown.reduce((sum: number, entry: any) => sum + entry.value, 0);
                                if (total === 0 || typeof value !== 'number') {
                                    return [`(0%)`, name];
                                }
                                const percent = (value / total) * 100;
                                return [`${currencySymbol} ${formatNumber(value)} (${percent.toFixed(0)}%)`, name];
                            }}
                        />
                        <Legend verticalAlign="bottom" />
                    </PieChart>
                </ResponsiveContainer>
              </div>

              <div id="assumptions-grid" ref={ownerAssumptionsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start mt-8">
                <AccordionCard
                    title="Purchase Price"
                    summaryValue={`${currencySymbol} ${formatNumber(analysis.purchasePrice)}`}
                    isOpen={activeAccordion === 'owner-purchase'}
                    onToggle={() => setActiveAccordion(activeAccordion === 'owner-purchase' ? null : 'owner-purchase')}
                >
                    <InputField label="Asking Price" value={inputs.askingPrice} onChange={(v: string) => handleInputChange('askingPrice', v)} prefix={currencySymbol} disabled={readOnly} />
                    <InputField label="Discount" value={inputs.discountOnAsking} onChange={(v: string) => handleInputChange('discountOnAsking', v)} suffix="%" disabled={readOnly} />
                </AccordionCard>

                <AccordionCard 
                    title="Bond Cost"
                    summaryValue={`${currencySymbol} ${formatNumber(analysis.bondPayment)}`}
                    summaryUnit="/mo"
                    isOpen={activeAccordion === 'owner-bond'}
                    onToggle={() => setActiveAccordion(activeAccordion === 'owner-bond' ? null : 'owner-bond')}
                >
                    <InputField label="Deposit" value={inputs.depositPercent} onChange={(v: string) => handleInputChange('depositPercent', v)} suffix="%" disabled={readOnly} />
                    <InputField label="Interest Rate" value={inputs.interestRate} onChange={(v: string) => handleInputChange('interestRate', v)} suffix="%" disabled={readOnly} />
                    <InputField label="Loan Term" value={inputs.termYears} onChange={(v: string) => handleInputChange('termYears', v)} suffix="Years" disabled={readOnly} />
                    <InputField label="Bond Registration Fees" value={inputs.bondRegistrationFees} onChange={(v: string) => handleInputChange('bondRegistrationFees', v)} prefix={currencySymbol} disabled={readOnly} />
                </AccordionCard>

                <AccordionCard 
                    title="Monthly Expenses"
                    summaryValue={`${currencySymbol} ${formatNumber(analysis.owner.totalMonthlyOutflow - analysis.bondPayment)}`}
                    summaryUnit="/mo"
                    isOpen={activeAccordion === 'owner-costs'}
                    onToggle={() => setActiveAccordion(activeAccordion === 'owner-costs' ? null : 'owner-costs')}
                >
                    <InputField label="Levies" value={inputs.levies} onChange={(v: string) => handleInputChange('levies', v)} prefix={currencySymbol} disabled={readOnly} />
                    <InputField label="Rates & Taxes" value={inputs.rates} onChange={(v: string) => handleInputChange('rates', v)} prefix={currencySymbol} disabled={readOnly} />
                    <InputField label="Insurance" value={inputs.insurance} onChange={(v: string) => handleInputChange('insurance', v)} prefix={currencySymbol} disabled={readOnly} />
                    <InputField label="Utilities" value={inputs.utilities} onChange={(v: string) => handleInputChange('utilities', v)} prefix={currencySymbol} disabled={readOnly} />
                    <InputField label="Transport" value={inputs.transport} onChange={(v: string) => handleInputChange('transport', v)} prefix={currencySymbol} disabled={readOnly} />
                    <InputField label="Groceries" value={inputs.groceries} onChange={(v: string) => handleInputChange('groceries', v)} prefix={currencySymbol} disabled={readOnly} />
                    <InputField label="Other Essentials" value={inputs.otherEssentials} onChange={(v: string) => handleInputChange('otherEssentials', v)} prefix={currencySymbol} disabled={readOnly} />
                    <div className="pt-4 mt-2 border-t border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="flex-grow"><InputField label="Maintenance (of Value)" value={inputs.maintenancePercentValue} onChange={(v: string) => handleInputChange('maintenancePercentValue', v)} suffix="%" disabled={readOnly} /></div>
                            <input type="checkbox" checked={inputs.includeMaintenance} onChange={e => setInputs({...inputs, includeMaintenance: e.target.checked})} className="mt-6" disabled={readOnly} />
                        </div>
                    </div>
                    
                    {/* Custom Expenses Section */}
                    <div className="pt-4 mt-2 border-t border-slate-800">
                        <div className="flex justify-between items-center mb-3">
                            <h5 className="text-[10px] font-bold text-slate-500 uppercase">Custom Expenses</h5>
                            {!readOnly && <button onClick={addCustomExpense} className="p-1 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors"><Plus size={14} /></button>}
                        </div>
                        <div className="space-y-3">
                            {inputs.customExpenses?.map((expense: any) => (
                                <div key={expense.id} className="flex gap-2 items-center">
                                    <input type="text" placeholder="Name" value={expense.name} onChange={(e) => updateCustomExpense(expense.id, 'name', e.target.value)} disabled={readOnly} className="w-1/2 bg-[#1E293B] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold outline-none focus:border-[#6366F1]" />
                                    <input type="number" placeholder="Amount" value={expense.value} onChange={(e) => updateCustomExpense(expense.id, 'value', e.target.value)} disabled={readOnly} className="w-1/3 bg-[#1E293B] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold outline-none focus:border-[#6366F1]" />
                                    {!readOnly && <button onClick={() => removeCustomExpense(expense.id)} className="text-slate-500 hover:text-rose-500"><X size={14} /></button>}
                                </div>
                            ))}
                        </div>
                    </div>
                </AccordionCard>

                <AccordionCard 
                    title="Household Income"
                    summaryValue={`${currencySymbol} ${formatNumber(Number(inputs.monthlyIncome || 0))}`}
                    isOpen={activeAccordion === 'owner-income'}
                    onToggle={() => setActiveAccordion(activeAccordion === 'owner-income' ? null : 'owner-income')}
                >
                    <InputField label="Monthly Gross Income" value={inputs.monthlyIncome} onChange={(v: string) => handleInputChange('monthlyIncome', v)} prefix={currencySymbol} disabled={readOnly} />
                </AccordionCard>
              </div>
            </div>
        </div>
      )}

      {/* --- TENANT MODE --- */}
      {persona === 'tenant' && (
        <div className="space-y-8">
            <div id="kpi-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard 
                    label="Rent to Income" 
                    value={analysis.tenant.rentToIncomeRatio}
                    valType="percent"
                    colorBehavior="inverseThreshold"
                    threshold={{ green: 30, amber: 40 }}
                    description="Percentage of gross income spent on rent. A lower percentage is better, indicating better affordability. Most experts recommend keeping this below 30%."
                />
                <KpiCard 
                    label="Disposable Income"
                    value={analysis.tenant.disposableIncome}
                    valType="currency"
                    prefix={`${currencySymbol} `}
                    colorBehavior="cashflow"
                    isBlurred={readOnly}
                    description="The money you have left over for savings, entertainment, and unexpected expenses after rent and all other living costs are paid."
                />
                <KpiCard 
                    label="Savings Rate"
                    value={analysis.tenant.savingsRate}
                    valType="percent"
                    description="The percentage of your gross monthly income that you are able to save. A higher percentage is better for achieving financial goals."
                />
            </div>
            <div>
              <div className={`bg-[#0F172A] border border-slate-800 p-8 rounded-[2.5rem] h-[550px] ${readOnly ? 'blur-lg pointer-events-none' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs opacity-50">Monthly Budget Breakdown</h3>
                    {!readOnly && (
                        <button id="edit-assumptions-btn" onClick={handleScrollToTenantAssumptions} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white">
                            <Edit3 size={12} />
                            Edit Assumptions
                        </button>
                    )}
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ bottom: 100 }}>
                        <Pie
                            data={analysis.tenant.budgetBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={false}
                            outerRadius={150}
                            innerRadius={80}
                            dataKey="value"
                            paddingAngle={2}
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                        >
                            {analysis.tenant.budgetBreakdown.map((entry, index) => {
                                return <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} style={{ opacity: activeIndex === null || activeIndex === index ? 1 : 0.3, transition: 'opacity 0.2s' }} />;
                            })}
                        </Pie>
                        <Tooltip 
                            contentStyle={{backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px'}} 
                            itemStyle={{ color: '#e2e8f0' }}
                            formatter={(value: number, name: string) => {
                                const total = analysis.tenant.budgetBreakdown.reduce((sum, entry) => sum + entry.value, 0);
                                if (total === 0 || typeof value !== 'number') {
                                    return [`${currencySymbol} 0 (0%)`, name];
                                }
                                const percent = (value / total) * 100;
                                return [`${currencySymbol} ${formatNumber(value)} (${percent.toFixed(0)}%)`, name];
                            }}
                        />
                        <Legend verticalAlign="bottom" />
                    </PieChart>
                </ResponsiveContainer>
              </div>
              <div id="assumptions-grid" ref={tenantAssumptionsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-8">
                <AccordionCard 
                    title="Monthly Rent"
                    summaryValue={`${currencySymbol} ${formatNumber(Number(inputs.monthlyRent || 0))}`}
                    isOpen={activeAccordion === 'tenant-rent'}
                    onToggle={() => setActiveAccordion(activeAccordion === 'tenant-rent' ? null : 'tenant-rent')}
                >
                    <InputField label="Gross Monthly Rent" value={inputs.monthlyRent} onChange={(v: string) => handleInputChange('monthlyRent', v)} prefix={currencySymbol} disabled={readOnly} />
                </AccordionCard>
                <AccordionCard 
                    title="Household Income"
                    summaryValue={`${currencySymbol} ${formatNumber(Number(inputs.monthlyIncome || 0))}`}
                    isOpen={activeAccordion === 'tenant-income'}
                    onToggle={() => setActiveAccordion(activeAccordion === 'tenant-income' ? null : 'tenant-income')}
                >
                    <InputField label="Gross Monthly Income" value={inputs.monthlyIncome} onChange={(v: string) => handleInputChange('monthlyIncome', v)} prefix={currencySymbol} disabled={readOnly} />
                </AccordionCard>
                <AccordionCard 
                    title="Other Living Costs"
                    summaryValue={`${currencySymbol} ${formatNumber(analysis.tenant.totalLivingCosts)}`}
                    isOpen={activeAccordion === 'tenant-living'}
                    onToggle={() => setActiveAccordion(activeAccordion === 'tenant-living' ? null : 'tenant-living')}
                >
                    <InputField label="Utilities" value={inputs.utilities} onChange={(v: string) => handleInputChange('utilities', v)} prefix={currencySymbol} disabled={readOnly} />
                    <InputField label="Transport" value={inputs.transport} onChange={(v: string) => handleInputChange('transport', v)} prefix={currencySymbol} disabled={readOnly} />
                    <InputField label="Groceries" value={inputs.groceries} onChange={(v: string) => handleInputChange('groceries', v)} prefix={currencySymbol} disabled={readOnly} />
                    <InputField label="Other Essentials" value={inputs.otherEssentials} onChange={(v: string) => handleInputChange('otherEssentials', v)} prefix={currencySymbol} disabled={readOnly} />
                    
                    {/* Custom Expenses Section */}
                    <div className="pt-4 mt-2 border-t border-slate-800">
                        <div className="flex justify-between items-center mb-3">
                            <h5 className="text-[10px] font-bold text-slate-500 uppercase">Custom Expenses</h5>
                            {!readOnly && <button onClick={addCustomExpense} className="p-1 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors"><Plus size={14} /></button>}
                        </div>
                        <div className="space-y-3">
                            {inputs.customExpenses?.map((expense: any) => (
                                <div key={expense.id} className="flex gap-2 items-center">
                                    <input type="text" placeholder="Name" value={expense.name} onChange={(e) => updateCustomExpense(expense.id, 'name', e.target.value)} disabled={readOnly} className="w-1/2 bg-[#1E293B] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold outline-none focus:border-[#6366F1]" />
                                    <input type="number" placeholder="Amount" value={expense.value} onChange={(e) => updateCustomExpense(expense.id, 'value', e.target.value)} disabled={readOnly} className="w-1/3 bg-[#1E293B] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold outline-none focus:border-[#6366F1]" />
                                    {!readOnly && <button onClick={() => removeCustomExpense(expense.id)} className="text-slate-500 hover:text-rose-500"><X size={14} /></button>}
                                </div>
                            ))}
                        </div>
                    </div>
                </AccordionCard>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};