'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Analyzer from '../Analyzer';
import { auth } from '@/shared/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { Logo } from '@/shared/components/Logo';
import Link from 'next/link';
import { Plus, LayoutGrid, LogOut, Trash2, AlertTriangle, ArrowRightLeft, ExternalLink, HelpCircle, MessageSquare, PlayCircle, TrendingUp } from 'lucide-react';
import { ProgressBar } from '@/components/insights/ProgressBar';
import { OnboardingProvider, useOnboarding } from './OnboardingContext';
import { ActivationOverlay } from './ActivationOverlay';
import { ExtensionCheck } from './ExtensionCheck';
import { PersonaMorpher } from './PersonaMorpher';
import { TourGuide } from './TourGuide';

const CURRENCY_SYMBOLS: { [key: string]: string } = {
  ZAR: 'R',
  KES: 'KSh',
  USD: '$'
};

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean, onConfirm: () => void, onCancel: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0F172A] p-8 rounded-2xl border border-slate-700 shadow-xl max-w-sm w-full text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-500/10 mb-4">
            <AlertTriangle className="h-6 w-6 text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Confirm Deletion</h3>
        <p className="text-slate-400 mb-8">Are you sure you want to delete this project? This action cannot be undone.</p>
        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-6 py-2 rounded-lg text-sm font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

function DashboardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // View State
  const [view, setView] = useState<'projects' | 'analyzer' | 'comparisons'>('projects');
  const [projects, setProjects] = useState<any[]>([]);
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [shouldOpenInsights, setShouldOpenInsights] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [hasCheckedExtension, setHasCheckedExtension] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const isActive = !!user;
  const { state: onboardingState, updateStep } = useOnboarding();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
          setUser(currentUser);
          // Security Check: Ensure user is on Core plan
          const db = getFirestore();
          const userRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userRef);
          const plan = snap.data()?.plan || 'free';
          
          setHasCompletedTour(snap.data()?.hasCompletedTour || false);

          if (plan !== 'core') {
              router.replace('/limited-dashboard');
              return;
          }
          fetchProjects(currentUser.uid);
          fetchComparisons(currentUser.uid);
      } else {
          setUser(null);
          router.replace('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // Handle Extension Data Handoff
  useEffect(() => {
    const dataParam = searchParams.get('data');
    console.log('[Dashboard Page] Received data param:', dataParam ? dataParam.substring(0, 50) + '...' : 'null');
    if (dataParam) {
      try {
        // Unicode-safe decoding
        console.log('[Dashboard Page] Attempting to decode...');
        const decoded = decodeURIComponent(escape(atob(dataParam)));
        console.log('[Dashboard Page] Decode successful. Parsing JSON...');
        setInitialData(JSON.parse(decoded));
        setView('analyzer'); // Force analyzer view if data is present
      } catch (e) {
        console.error("--- CRASH REPORT ---");
        console.error("[Dashboard Page] Handoff failed. The error occurred during decoding or parsing:", e);
        console.error("--- END CRASH REPORT ---");
      }
    } else {
        // If no data param, default to dashboard list if logged in
        if (user) setView('projects');
    }
  }, [searchParams, user]);

  // Handle Deep Linking to Project via URL
  useEffect(() => {
    const pId = searchParams.get('projectId');
    const openInsights = searchParams.get('openInsights') === 'true';
    
    if (pId && projects.length > 0 && view !== 'analyzer') {
        const project = projects.find(p => p.id === pId);
        if (project) {
            handleProjectClick(project);
            if (openInsights) setShouldOpenInsights(true);
        }
    }
  }, [searchParams, projects, view]);

  // Effect to start the tour after initial onboarding and extension check
  useEffect(() => {
    if (isActive && hasCheckedExtension && onboardingState.step === 0 && !hasCompletedTour) {
      // Only start the tour if the user is active, has checked the extension,
      // and the tour hasn't been started/completed yet (step 0 implies not started).
      // AND the user hasn't completed the tour previously.
      // Set to step 2, as step 0 and 1 are pre-tour states.
      updateStep(2);
    } else if (isActive && hasCompletedTour && onboardingState.step === 0) {
        // If tour is already completed, skip onboarding steps
        updateStep(8);
    }
  }, [isActive, hasCheckedExtension, onboardingState.step, updateStep, hasCompletedTour]);

  // Effect to mark tour as completed in backend
  useEffect(() => {
      if (onboardingState.step === 8 && user && !hasCompletedTour) {
          const db = getFirestore();
          updateDoc(doc(db, 'users', user.uid), { hasCompletedTour: true });
          setHasCompletedTour(true);
      }
  }, [onboardingState.step, user, hasCompletedTour]);

  const fetchProjects = async (uid: string) => {
    try {
        const db = getFirestore();
        const q = query(collection(db, 'projects'), where('ownerId', '==', uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setProjects(data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
  };

  const fetchComparisons = async (uid: string) => {
    try {
        const db = getFirestore();
        const q = query(collection(db, 'comparisons'), where('userId', '==', uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setComparisons(data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (error) {
        console.error("Error fetching comparisons:", error);
    }
  };

  const handleProjectClick = (project: any) => {
    setInitialData({ ...project.inputSnapshot, id: project.id });
    setView('analyzer');
    setShouldOpenInsights(false); // Reset unless explicitly set by URL later
  };

  const handleNewProject = () => {
    if (onboardingState.step === 2) {
      updateStep(3);
    }
    setInitialData(null);
    setView('analyzer');
  };
  
  const handleHomeClick = () => {
    if (user) {
        fetchProjects(user.uid);
        setView('projects');
        setInitialData(null);
        setShouldOpenInsights(false);
        router.replace('/dashboard', { scroll: false });
    } else {
        router.replace('/login');
    }
  };

  const handleDowngrade = async () => {
      if (!user) return;
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { plan: 'free' });
      window.location.href = '/limited-dashboard'; // Force reload/redirect
  };

  const handleReturnToDashboard = () => {
    if (user) {
        fetchProjects(user.uid);
        fetchComparisons(user.uid);
    }
    setView('projects');
    setInitialData(null);
    setShouldOpenInsights(false);
    router.replace('/dashboard', { scroll: false });
  };

  const requestDelete = (projectId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setProjectToDelete(projectId);
  };

  const confirmDelete = async () => {
    if (!projectToDelete || !user) return;
    try {
        const db = getFirestore();
        await deleteDoc(doc(db, 'projects', projectToDelete));
        fetchProjects(user.uid); // Re-fetch projects to update the list
        if (view === 'analyzer' && initialData?.id === projectToDelete) {
            setView('projects');
            setInitialData(null);
        }
    } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project.");
    } finally {
        setProjectToDelete(null); // Close modal
    }
  };

  const handleRestartTour = () => {
      updateStep(0);
      setIsHelpOpen(false);
      // Reset view to projects so the tour elements (like "New Analysis") are visible
      setView('projects');
      setInitialData(null);
      setShouldOpenInsights(false);
  };

  if (loading) {
     return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
        {onboardingState.step === 1 && !hasCheckedExtension && !hasCompletedTour ? (
            <ExtensionCheck onComplete={() => setHasCheckedExtension(true)} />
        ) : (
            <ActivationOverlay />
        )}
        <PersonaMorpher />
        <TourGuide />
        <DeleteConfirmationModal 
            isOpen={!!projectToDelete}
            onConfirm={confirmDelete}
            onCancel={() => setProjectToDelete(null)}
        />
        <nav id="dashboard-nav" className="border-b border-slate-800 bg-[#0F172A] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <div onClick={handleHomeClick} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="h-8 w-8 flex items-center justify-center text-white"><Logo /></div>
                <span className="text-white font-bold text-lg hidden sm:block">PropPlug</span>
            </div>
            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        {view === 'analyzer' && (
                             <button onClick={handleReturnToDashboard} className="text-slate-400 hover:text-white text-sm font-bold flex items-center gap-2">
                                <LayoutGrid size={16} /> Dashboard
                             </button>
                        )}
                        {view === 'analyzer' && initialData?.id && (
                            <button onClick={(e) => requestDelete(initialData.id, e)} className="text-rose-500 hover:text-rose-400 text-sm font-bold flex items-center gap-2 transition-colors">
                                <Trash2 size={16} /> Delete Project
                            </button>
                        )}
                        
                        {/* Help Dropdown */}
                        <div className="relative">
                            <button onClick={() => setIsHelpOpen(!isHelpOpen)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                                <HelpCircle size={18} />
                            </button>
                            {isHelpOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0F172A] border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col">
                                    <Link href="/support" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-bold transition-colors text-left">
                                        <MessageSquare size={14} /> Support
                                    </Link>
                                    <button onClick={handleRestartTour} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-bold transition-colors text-left border-t border-slate-800">
                                        <PlayCircle size={14} /> Restart Tour
                                    </button>
                                </div>
                            )}
                        </div>

                        <button onClick={handleDowngrade} className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors border border-amber-500/30 px-3 py-1 rounded-lg">
                            Downgrade (Test)
                        </button>
                        <button onClick={() => auth.signOut()} className="text-slate-500 hover:text-rose-500 transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <Link href={`/login${initialData ? '?data=' + searchParams.get('data') : ''}`} className="text-sm font-bold text-white hover:text-[#6366F1] transition-colors">Login</Link>
                )}
            </div>
        </nav>

        <main className={`p-4 sm:p-6 max-w-7xl mx-auto ${onboardingState.step < 2 ? 'blur-sm pointer-events-none select-none' : ''}`}>
            {view === 'projects' && user ? (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex gap-4 border-b border-slate-800">
                        </div>
                        <button id="new-analysis-button" onClick={handleNewProject} className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl font-bold text-sm hover:bg-[#5558DD] transition-all">
                            <Plus size={16} /> New Analysis
                        </button>
                    </div>

                    {projects.length === 0 ? <EmptyState type="project" onAction={handleNewProject} /> : <ProjectGrid projects={projects} onProjectClick={handleProjectClick} onRequestDelete={requestDelete} />}
                </div>
            ) : view === 'comparisons' && user ? (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <Link href="/compare" className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-xl font-bold text-sm hover:bg-[#5558DD] transition-all">
                            <Plus size={16} /> New Comparison
                        </Link>
                    </div>
                    {comparisons.length === 0 ? <EmptyState type="comparison" onAction={() => router.push('/compare')} /> : <ComparisonGrid comparisons={comparisons} />}
                </div>
            ) : (
                <div className="flex gap-6">
                    <div className="flex-grow">
                        <Analyzer 
                            initialData={initialData} 
                            user={user} 
                            mode={user ? 'saved' : 'draft'} 
                            onDelete={requestDelete} 
                            defaultInsightsOpen={shouldOpenInsights}
                            defaultPersona={onboardingState.persona || undefined} 
                        />
                    </div>
                </div>
            )}
        </main>
    </div>
  );
}

const EmptyState = ({ type, onAction }: { type: string, onAction: () => void }) => (
    <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl">
        <p className="text-slate-500 mb-4">No {type}s saved yet.</p>
        <button onClick={onAction} className="text-[#6366F1] font-bold hover:underline">Create your first one</button>
    </div>
);

const ProjectGrid = ({ projects, onProjectClick, onRequestDelete }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p: any) => (
            <div key={p.id} onClick={() => onProjectClick(p)} className="bg-[#0F172A] border border-slate-800 p-6 rounded-2xl hover:border-[#6366F1] cursor-pointer transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-slate-400 uppercase tracking-wider">{p.inputSnapshot?.type || 'Investor'}</span>
                        {p.inputSnapshot?.type === 'investor' && <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${p.inputSnapshot?.strategy === 'flip' ? 'bg-amber-900/30 text-amber-500' : 'bg-emerald-900/30 text-emerald-500'}`}>{p.inputSnapshot?.strategy === 'flip' ? 'Flip' : 'Rental'}</span>}
                    </div>
                    <button onClick={(e) => onRequestDelete(p.id, e)} className="p-2 -m-2 text-slate-500 hover:text-rose-500 transition-colors z-10" title="Delete Project"><Trash2 size={14} /></button>
                </div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-[#6366F1] transition-colors truncate">{p.inputSnapshot?.address || 'Untitled Project'}</h3>
                <p className="text-slate-400 text-sm truncate">{p.inputSnapshot?.askingPrice ? `${CURRENCY_SYMBOLS[p.inputSnapshot?.currency] || 'R'} ${Number(p.inputSnapshot.askingPrice).toLocaleString()}` : 'No price'}</p>
                {p.inputSnapshot?.insights?.progress && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Insight Progress</span>
                        <ProgressBar percentage={p.inputSnapshot.insights.progress.completionPercent} status={p.inputSnapshot.insights.progress.status} />
                    </div>
                )}
            </div>
        ))}
    </div>
);

const ComparisonGrid = ({ comparisons }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparisons.map((c: any) => (
            <div key={c.id} className="bg-[#0F172A] border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-white font-bold text-lg mb-1 truncate">{c.propertyAName} vs {c.propertyBName}</h3>
                <p className="text-slate-500 text-xs mb-4">Compared on {c.createdAt?.toDate().toLocaleDateString()}</p>
                <ul className="space-y-2 text-sm">
                    {c.keyDifferences?.slice(0, 3).map((diff: any, i: number) => (
                        <li key={i} className="text-slate-300 flex items-start gap-2">
                            <span className="text-indigo-400 mt-1"><TrendingUp size={14} /></span>
                            {diff.text}
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </div>
);

function DashboardContent() {
    return (
        <OnboardingProvider>
            <DashboardInner />
        </OnboardingProvider>
    )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div></div>}>
      <DashboardContent />
    </Suspense>
  );
}