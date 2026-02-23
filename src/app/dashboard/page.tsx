'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Analyzer from '../Analyzer';
import { auth } from '@/shared/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { Logo } from '@/shared/components/Logo';
import Link from 'next/link';
import { Plus, LayoutGrid, LogOut, Trash2, AlertTriangle, ArrowRightLeft, ExternalLink, HelpCircle, MessageSquare, PlayCircle, TrendingUp, Bed, Bath, Car, Maximize, Home, MapPin } from 'lucide-react';
import { ProgressBar } from '@/components/insights/ProgressBar';
import { OnboardingProvider, useOnboarding } from './OnboardingContext';
import { ActivationOverlay } from './ActivationOverlay';
import { ExtensionCheck } from './ExtensionCheck';
import { PersonaMorpher } from './PersonaMorpher';
import { TourGuide } from './TourGuide';
import { LegalGatekeeper } from './LegalGatekeeper';

const CURRENCY_SYMBOLS: { [key: string]: string } = {
  ZAR: 'R',
  KES: 'KSh',
  USD: '$'
};

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean, onConfirm: () => void, onCancel: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-zinc-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-700 shadow-xl max-w-sm w-full text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-500/10 mb-4">
            <AlertTriangle className="h-6 w-6 text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Confirm Deletion</h3>
        <p className="text-zinc-400 mb-8">Are you sure you want to delete this project? This action cannot be undone.</p>
        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg text-sm font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors">
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

const EmptyState = ({ type, onAction }: { type: string, onAction: () => void }) => (
    <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
        <p className="text-zinc-500 mb-4">No {type}s saved yet.</p>
        <button onClick={onAction} className="text-orange-500 font-bold hover:underline">Create your first one</button>
    </div>
);

const ProjectCard = ({ project, onProjectClick, onRequestDelete }: any) => {
    const snapshot = project.inputSnapshot || {};
    const title = project.projectName || snapshot.projectName || 'Untitled Project';
    const showAddress = snapshot.address;
    const hasFooterContent = (snapshot.bedrooms || snapshot.bathrooms || snapshot.propertyType) || snapshot.insights?.progress;

    return (
        <div onClick={() => onProjectClick(project)} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-orange-500 cursor-pointer transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{snapshot.type || 'Investor'}</span>
                    {snapshot.type === 'investor' && <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${snapshot.strategy === 'flip' ? 'bg-amber-900/30 text-amber-500' : 'bg-emerald-900/30 text-emerald-500'}`}>{snapshot.strategy === 'flip' ? 'Flip' : 'Rental'}</span>}
                </div>
                <button onClick={(e) => onRequestDelete(project.id, e)} className="p-2 -m-2 text-zinc-500 hover:text-rose-500 transition-colors z-10" title="Delete Project"><Trash2 size={14} /></button>
            </div>
            
            <h3 className="text-white font-bold text-lg mb-1 group-hover:text-orange-500 transition-colors truncate">{title}</h3>
            
            {showAddress && (
                <div className="flex items-center gap-1 text-zinc-500 text-xs mb-2 truncate">
                    <MapPin size={12} /> {snapshot.address}
                </div>
            )}

            <p className="text-zinc-400 text-sm font-mono">{snapshot.askingPrice ? `${CURRENCY_SYMBOLS[snapshot.currency] || 'R'} ${Number(snapshot.askingPrice).toLocaleString()}` : 'No price'}</p>
            
            <div className="flex-grow" />

            {hasFooterContent && (
                <div className="mt-4 pt-4 border-t border-zinc-800 space-y-4">
                    {(snapshot.bedrooms || snapshot.bathrooms || snapshot.propertyType) && (
                        <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                            {snapshot.bedrooms && <span className="flex items-center gap-1"><Bed size={14} /> {snapshot.bedrooms}</span>}
                            {snapshot.bathrooms && <span className="flex items-center gap-1"><Bath size={14} /> {snapshot.bathrooms}</span>}
                            {snapshot.propertyType && <span className="flex items-center gap-1 capitalize"><Home size={14} /> {snapshot.propertyType}</span>}
                        </div>
                    )}
                    {snapshot.insights?.progress && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">Insight Progress</span>
                            </div>
                            <ProgressBar percentage={snapshot.insights.progress.completionPercent} status={snapshot.insights.progress.status} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ProjectGrid = ({ projects, onProjectClick, onRequestDelete }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p: any) => (
            <ProjectCard key={p.id} project={p} onProjectClick={onProjectClick} onRequestDelete={onRequestDelete} />
        ))}
    </div>
);

const ComparisonGrid = ({ comparisons }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparisons.map((c: any) => (
            <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <h3 className="text-white font-bold text-lg mb-1 truncate">{c.propertyAName} vs {c.propertyBName}</h3>
                <p className="text-zinc-500 text-xs mb-4">Compared on {c.createdAt?.toDate().toLocaleDateString()}</p>
                <ul className="space-y-2 text-sm">
                    {c.keyDifferences?.slice(0, 3).map((diff: any, i: number) => (
                        <li key={i} className="text-zinc-300 flex items-start gap-2">
                            <span className="text-orange-400 mt-1"><TrendingUp size={14} /></span>
                            {diff.text}
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </div>
);

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const [editingProjectName, setEditingProjectName] = useState('');
  // View State
  const [view, setView] = useState<'projects' | 'analyzer' | 'comparisons'>('projects');
  const [projects, setProjects] = useState<any[]>([]);
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [shouldOpenInsights, setShouldOpenInsights] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [hasCheckedExtension, setHasCheckedExtension] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
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
          const userData = snap.data();
          const plan = userData?.plan || 'free';
          setHasCompletedTour(userData?.hasCompletedTour || false);
          setHasAcceptedTerms(userData?.termsAccepted || false);
          
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
    if (dataParam) {
      try {
        // Unicode-safe decoding
        const decoded = decodeURIComponent(escape(atob(dataParam)));
        setEditingProjectName(JSON.parse(decoded)?.projectName || '');
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

  useEffect(() => {
    const pId = searchParams.get('projectId');
    const openInsights = searchParams.get('openInsights') === 'true';
    
    if (pId && projects.length > 0 && view !== 'analyzer') { // Prevent re-triggering when already viewing
      const project = projects.find(p => p.id === pId);
      if (project) {
        handleProjectClick(project);
        if (openInsights) setShouldOpenInsights(true);
      }
    }
  }, [searchParams, projects]); // Removed `view` to prevent re-running on view change

  // Effect to start the tour after initial onboarding and extension check
  useEffect(() => {
    if (isActive && hasCompletedTour && onboardingState.step < 8) {
        // If tour is already completed, skip onboarding steps
        updateStep(8);
    }
  }, [isActive, hasCompletedTour, onboardingState.step, updateStep]);

  // Effect to mark tour as completed in backend
  useEffect(() => {
      if (onboardingState.step === 8 && user && !hasCompletedTour) {
          const db = getFirestore();
          updateDoc(doc(db, 'users', user.uid), { hasCompletedTour: true }).catch(err => {
              console.error("Failed to save tour completion status:", err);
          });
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
    setInitialData({ ...project.inputSnapshot, id: project.id, projectName: project.projectName });
    setEditingProjectName(project.projectName || project.inputSnapshot?.projectName || '');
    setView('analyzer');
    setShouldOpenInsights(false); // Reset unless explicitly set by URL later
  };

  const handleNewProject = () => {
    if (onboardingState.step === 2) {
      updateStep(3);
    }
    const newProjectName = `Project #${projects.length + 1}`;
    setEditingProjectName(newProjectName);
    setInitialData({ projectName: newProjectName });
    setView('analyzer');
  };

  const returnToDashboardView = () => {
    if (user) {
        fetchProjects(user.uid);
        fetchComparisons(user.uid);
        setView('projects');
        setInitialData(null);
        setEditingProjectName('');
        setShouldOpenInsights(false);
        router.replace('/dashboard', { scroll: false });
    } else {
        router.replace('/login'); // Fallback if user is somehow null
    }
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
            setEditingProjectName('');
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
      setHasCompletedTour(false); // Allow the tour to run again locally
      // Reset view to projects so the tour elements (like "New Analysis") are visible
      setView('projects');
      setInitialData(null);
      setEditingProjectName('');
      setShouldOpenInsights(false);
  };

  const handleTermsAcceptance = async () => {
      if (!user) return;
      try {
          const db = getFirestore();
          await updateDoc(doc(db, 'users', user.uid), { 
              termsAccepted: true,
              termsAcceptedAt: new Date()
          });
          setHasAcceptedTerms(true);
      } catch (error) {
          console.error("Error accepting terms:", error);
      }
  };

  const handleDowngrade = async () => {
      if (!user) return;
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { plan: 'free' });
      window.location.href = '/limited-dashboard'; // Force reload/redirect
  };

  if (loading) {
     return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (user && !hasAcceptedTerms) {
      return <LegalGatekeeper onAccept={handleTermsAcceptance} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
        {/* Onboarding Modals */}
        {!hasCompletedTour && (
            <>
                {onboardingState.step === 0 && <PersonaMorpher />}
                {onboardingState.step === 1 && (
                    !hasCheckedExtension 
                    ? <ExtensionCheck onComplete={() => setHasCheckedExtension(true)} /> 
                    : <ActivationOverlay />
                )}
                <TourGuide />
            </>
        )}
        <DeleteConfirmationModal 
            isOpen={!!projectToDelete}
            onConfirm={confirmDelete}
            onCancel={() => setProjectToDelete(null)}
        />
        <nav id="dashboard-nav" className="border-b border-zinc-800 bg-zinc-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <div onClick={returnToDashboardView} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="h-8 w-8 flex items-center justify-center text-white"><Logo /></div>
                <span className="text-white font-bold text-lg hidden sm:block">PropPlug</span>
            </div>
            {view === 'analyzer' && (
                <div className="flex-grow flex flex-col items-center justify-center px-4">
                    <input
                        type="text"
                        value={editingProjectName}
                        onChange={(e) => setEditingProjectName(e.target.value)}
                        onBlur={() => {
                            const finalName = editingProjectName || `Project #${projects.length + 1}`;
                            if (!editingProjectName) {
                                setEditingProjectName(finalName);
                            }
                            setInitialData((prev: any) => ({ ...prev, projectName: finalName }));
                        }}
                        placeholder="Enter project name..."
                        className="bg-transparent text-white text-center font-bold text-lg w-full max-w-md outline-none focus:bg-zinc-800 rounded-lg px-3 py-1 transition-colors placeholder:text-zinc-500"
                    />
                    {(initialData?.bedrooms || initialData?.bathrooms || initialData?.parking || initialData?.floorSize || initialData?.propertyType) && (
                        <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-wider">
                            {initialData.propertyType && (
                                <span className="hidden items-center gap-1 sm:flex"><Home size={10} /> {initialData.propertyType}</span>
                            )}
                            {initialData.bedrooms && (
                                <span className="flex items-center gap-1"><Bed size={10} /> {initialData.bedrooms}</span>
                            )}
                            {initialData.bathrooms && (
                                <span className="flex items-center gap-1"><Bath size={10} /> {initialData.bathrooms}</span>
                            )}
                            {initialData.parking && (
                                <span className="hidden items-center gap-1 sm:flex"><Car size={10} /> {initialData.parking}</span>
                            )}
                            {initialData.floorSize && (
                                <span className="hidden items-center gap-1 md:flex"><Maximize size={10} /> {initialData.floorSize}</span>
                            )}
                        </div>
                    )}
                </div>
            )}
            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        {view === 'analyzer' && (
                             <button onClick={returnToDashboardView} className="text-zinc-400 hover:text-white text-sm font-bold flex items-center gap-2">
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
                            <button onClick={() => setIsHelpOpen(!isHelpOpen)} className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                                <HelpCircle size={18} />
                            </button>
                            {isHelpOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col">
                                    <Link href="/support" className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs font-bold transition-colors text-left">
                                        <MessageSquare size={14} /> Support
                                    </Link>
                                    <button onClick={handleRestartTour} className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs font-bold transition-colors text-left border-t border-zinc-800">
                                        <PlayCircle size={14} /> Restart Tour
                                    </button>
                                </div>
                            )}
                        </div>

                        <button onClick={handleDowngrade} className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors border border-amber-500/30 px-3 py-1 rounded-lg">
                            Downgrade (Test)
                        </button>
                        <button onClick={() => auth.signOut()} className="text-zinc-500 hover:text-rose-500 transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <Link href={`/login${initialData ? '?data=' + searchParams.get('data') : ''}`} className="text-sm font-bold text-white hover:text-orange-500 transition-colors">Login</Link>
                )}
            </div>
        </nav>

        <main className={`p-4 sm:p-6 max-w-7xl mx-auto ${onboardingState.step < 2 ? 'blur-sm pointer-events-none select-none' : ''}`}>
            {view === 'projects' && user ? (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex gap-6 border-b border-zinc-800">
                            <button onClick={() => setView('projects')} className="pb-4 text-sm font-bold text-white border-b-2 border-orange-500">
                                Analyses
                            </button>
                            <button onClick={() => setView('comparisons')} className="pb-4 text-sm font-bold text-zinc-400 hover:text-white border-b-2 border-transparent transition-colors">
                                Comparisons
                            </button>
                        </div>
                        <button id="new-analysis-button" onClick={handleNewProject} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all">
                            <Plus size={16} /> New Analysis
                        </button>
                    </div>

                    {projects.length === 0 ? <EmptyState type="project" onAction={handleNewProject} /> : <ProjectGrid projects={projects} onProjectClick={handleProjectClick} onRequestDelete={requestDelete} />}
                </div>
            ) : view === 'comparisons' && user ? (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex gap-6 border-b border-zinc-800">
                            <button onClick={() => setView('projects')} className="pb-4 text-sm font-bold text-zinc-400 hover:text-white border-b-2 border-transparent transition-colors">
                                Analyses
                            </button>
                            <button onClick={() => setView('comparisons')} className="pb-4 text-sm font-bold text-white border-b-2 border-orange-500">
                                Comparisons
                            </button>
                        </div>
                        <Link href="/compare" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all">
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div></div>}>
      <OnboardingProvider>
        <DashboardContent />
      </OnboardingProvider>
    </Suspense>
  );
}