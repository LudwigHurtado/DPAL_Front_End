
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from '../i18n';
import { fetchLiveIntelligence, analyzeIntelSource } from '../services/geminiService';
import { type IntelItem, type Category, type IntelAnalysis } from '../types';
import { Loader, Search, MapPin, Crosshair, ArrowLeft, ArrowRight, FileText, Link as LinkIcon, ShieldCheck, Zap, Sparkles, Monitor, Broadcast, Target, ListFilter, CheckCircle, User, Activity, X, Send, Database, Maximize2, Megaphone } from './icons';
import { CATEGORIES_WITH_ICONS } from '../constants';
import { type TextScale } from '../App';

interface LiveIntelligenceViewProps {
  onReturn: () => void;
  onGenerateMission: (intelItem: IntelItem) => void;
  heroLocation: string;
  setHeroLocation: (loc: string) => void;
  initialCategories?: Category[];
  textScale?: TextScale;
}

const QUICK_LOCATIONS = ["San Jose, CA, USA", "Los Angeles, CA, USA", "Chicago, IL, USA", "New York, NY, USA", "London, UK", "Tokyo, JP", "Paris, FR", "Berlin, DE", "Sydney, AU"];

const LiveIntelligenceView: React.FC<LiveIntelligenceViewProps> = ({ onReturn, onGenerateMission, heroLocation, setHeroLocation, initialCategories, textScale }) => {
  const { t } = useTranslations();
  const [intelItems, setIntelItems] = useState<IntelItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasClearance, setHasClearance] = useState<boolean | null>(null);
  
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(initialCategories || []);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [nodeCount, setNodeCount] = useState(0);

  const [activeAnalysisItem, setActiveAnalysisItem] = useState<IntelItem | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<IntelAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
        aistudio.hasSelectedApiKey().then(setHasClearance);
    }
  }, []);

  useEffect(() => {
    if (isScanning) {
        const interval = setInterval(() => {
            setNodeCount(prev => (prev < 150 ? prev + Math.floor(Math.random() * 15) : prev));
        }, 100);
        return () => clearInterval(interval);
    } else {
        setNodeCount(0);
    }
  }, [isScanning]);

  const getIntel = useCallback(async (cats = selectedCategories) => {
    try {
      setHasSearched(true);
      setIsScanning(true);
      setError(null);
      await new Promise(r => setTimeout(r, 4500));
      const fetchedIntel = await fetchLiveIntelligence(cats, heroLocation);
      setIntelItems(fetchedIntel || []);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      if (message.includes("CLEARANCE_DENIED") || message.includes("403")) {
          setHasClearance(false);
      }
    } finally {
      setIsScanning(false);
    }
  }, [selectedCategories, heroLocation]);

  const handleDeepAnalysis = async (item: IntelItem) => {
      setActiveAnalysisItem(item);
      setIsAnalyzing(true);
      setCurrentAnalysis(null);
      try {
          const analysis = await analyzeIntelSource(item);
          setCurrentAnalysis(analysis);
      } catch (e) {
          setError("Neural link unstable. Deep Analysis failed.");
      } finally {
          setIsAnalyzing(false);
      }
  };

  const handleCategoryToggle = (categoryToToggle: Category) => {
    setSelectedCategories(prev =>
      prev.includes(categoryToToggle)
        ? prev.filter(c => c !== categoryToToggle)
        : [...prev, categoryToToggle]
    );
  };

  const renderTacticalMap = () => {
    const mapUrl = heroLocation 
        ? `https://maps.google.com/maps?q=${encodeURIComponent(heroLocation)}&t=k&z=15&ie=UTF8&iwloc=&output=embed`
        : "about:blank";

    return (
        <div className="relative w-full aspect-video md:aspect-[21/7] rounded-[3rem] border-4 border-zinc-800 bg-zinc-900 overflow-hidden group/map shadow-3xl">
            {heroLocation ? (
                <iframe 
                    src={mapUrl}
                    className="w-full h-full grayscale opacity-40 group-hover/map:opacity-100 group-hover/map:grayscale-0 transition-all duration-1000"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    title="Tactical Overlay"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-6 bg-zinc-950">
                    <Crosshair className="w-16 h-16 text-zinc-800 animate-pulse" />
                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Satellite_Feed_Offline</p>
                </div>
            )}
            
            <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute bottom-10 right-10 p-4 bg-zinc-950/80 backdrop-blur-md rounded-2xl border border-zinc-700/50 shadow-2xl">
                    <div className="flex items-center space-x-3">
                        <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest">SIG_INT_FEED</span>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderRadar = () => {
    const categoriesText = selectedCategories.length > 0 
        ? selectedCategories.map(c => c.toUpperCase()).join(', ')
        : "ALL_DOMAINS";

    return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in relative overflow-hidden font-mono bg-black/20 rounded-[4rem] border-2 border-zinc-900 mt-12">
            <div className="w-64 h-64 border-2 border-cyan-950 rounded-full relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 border border-cyan-900/50 rounded-full animate-radar-sweep"></div>
                <div className="absolute w-48 h-48 border border-cyan-900/30 rounded-full"></div>
                <div className="absolute w-16 h-16 border border-cyan-900/10 rounded-full"></div>
                <Target className="w-8 h-8 text-cyan-500 animate-pulse" />
            </div>

            <div className="max-w-2xl text-center space-y-6 px-6">
                <div className="space-y-2">
                    <p className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Wide-Area Operational Scan</p>
                    <div className="flex items-center justify-center space-x-3 text-cyan-500 font-black uppercase text-[10px] tracking-[0.3em]">
                        <Broadcast className="w-4 h-4" />
                        <span>Summoning Network Nodes: {nodeCount} Available</span>
                    </div>
                </div>

                <div className="bg-zinc-900/60 border border-cyan-950 p-6 rounded-3xl space-y-4 shadow-inner">
                    <div className="flex flex-col space-y-1">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Protocol_Directive</span>
                        <p className="text-sm text-cyan-100/90 leading-relaxed italic">
                            "Initializing deep regional probe for <span className="text-cyan-400 not-italic font-black underline">{categoriesText}</span> events within the <span className="text-cyan-400 not-italic font-black underline">{heroLocation.toUpperCase() || 'GLOBAL'}</span> sector."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderAnalysisPanel = () => {
    if (!activeAnalysisItem) return null;

    return (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in font-mono">
            <div className="bg-zinc-900 border-2 border-cyan-500 rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(6,182,212,0.2)]">
                <header className="bg-zinc-950 border-b border-zinc-800 p-8 flex justify-between items-center relative">
                    <div className="flex items-center space-x-6">
                         <div className="p-4 bg-cyan-900/20 rounded-2xl border border-cyan-500/30">
                            <Monitor className="w-8 h-8 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Neural_Deep_Scan</h2>
                            <p className="text-[10px] font-black text-cyan-500/80 uppercase tracking-[0.4em]">Pinpointing: {activeAnalysisItem.title.substring(0, 30)}...</p>
                        </div>
                    </div>
                    <button onClick={() => setActiveAnalysisItem(null)} className="text-zinc-600 hover:text-white transition-colors">
                        <X className="w-8 h-8" />
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto p-10 space-y-12 custom-scrollbar">
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-8">
                            <Loader className="w-20 h-20 animate-spin text-cyan-500" />
                            <div className="text-center space-y-2">
                                <p className="text-xl font-black text-white uppercase tracking-tighter">Synthesizing Context...</p>
                            </div>
                        </div>
                    ) : currentAnalysis ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl">
                                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-4">Threat_Level_Index</p>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-4xl font-black tracking-tighter ${currentAnalysis.threatScore > 70 ? 'text-rose-500' : 'text-emerald-400'}`}>{currentAnalysis.threatScore}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-8">
                                <p className="text-cyan-100/90 leading-relaxed italic text-lg border-l-2 border-cyan-500/50 pl-6">"{currentAnalysis.aiAssessment}"</p>
                            </div>
                        </div>
                    ) : null}
                </div>

                <footer className="bg-zinc-950 border-t border-zinc-800 p-8 flex justify-end">
                    <button 
                        onClick={() => {
                            if (activeAnalysisItem) {
                                onGenerateMission(activeAnalysisItem);
                                setActiveAnalysisItem(null);
                            }
                        }}
                        disabled={isAnalyzing || !currentAnalysis}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 px-16 rounded-2xl uppercase tracking-[0.3em] text-xs shadow-2xl active:scale-95 transition-all disabled:opacity-30"
                    >
                        Initialize_Tactical_Assignment
                    </button>
                </footer>
            </div>
        </div>
    );
  };

  return (
    <div className="bg-zinc-950 text-white p-4 sm:p-6 md:p-12 rounded-[3.5rem] animate-fade-in min-h-screen border border-zinc-800 shadow-2xl font-mono relative overflow-x-hidden mb-12">
        <button onClick={onReturn} className="inline-flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-cyan-400 transition-colors mb-8 group">
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Terminal_Home</span>
        </button>
        
        <header className="text-center mb-12">
            <h1 className="text-3xl sm:text-6xl font-black tracking-tighter uppercase mb-2">Field_Operations_Link</h1>
            <p className="text-zinc-500 text-xs font-bold tracking-[0.4em] uppercase">Coordinate regional accountability and field collaboration</p>
        </header>

        {/* FULL WIDTH MAP */}
        <div className="mb-12 w-full">
            {renderTacticalMap()}
        </div>

        {/* MAIN STACKED SECTIONS */}
        <div className="max-w-7xl mx-auto space-y-12">
            
            {/* 1. REGION LOCK */}
            <div className="bg-zinc-900 border-2 border-zinc-800 p-10 rounded-[3rem] shadow-inner">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="w-full space-y-4">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center space-x-3">
                            <MapPin className="w-4 h-4 text-rose-500"/><span>Geospatial_Target_Sector</span>
                        </label>
                        <input
                            type="text"
                            value={heroLocation}
                            onChange={(e) => setHeroLocation(e.target.value)}
                            placeholder="Enter City, State, or Zip..."
                            className="w-full bg-zinc-950 text-white border-2 border-zinc-800 rounded-[2rem] px-8 py-6 focus:ring-8 focus:ring-cyan-500/5 focus:border-cyan-500 transition-all font-black tracking-widest text-2xl shadow-inner placeholder:text-zinc-900"
                        />
                    </div>
                </div>
            </div>

            {/* 2. EXPANDED SPECTRUM SCOPE (CATEGORY PICKER) */}
            <div className="space-y-6">
                <label className="text-sm font-black uppercase text-zinc-500 tracking-[0.4em] flex items-center space-x-4 pl-4">
                    <ListFilter className="w-5 h-5 text-cyan-500"/><span>Spectrum_Scope_Selection</span>
                </label>
                
                <div className="bg-zinc-900 border-2 border-zinc-800 rounded-[3.5rem] p-10 shadow-2xl">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[...CATEGORIES_WITH_ICONS]
                          .sort((a, b) => t(a.translationKey).localeCompare(t(b.translationKey)))
                          .map(cat => {
                            const isSelected = selectedCategories.includes(cat.value);
                            return (
                                <button
                                    key={cat.value}
                                    onClick={() => handleCategoryToggle(cat.value)}
                                    className={`relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden group ${
                                        isSelected 
                                        ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_40px_rgba(6,182,212,0.3)] scale-[1.03]' 
                                        : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-900'
                                    }`}
                                >
                                    {isSelected && <div className="absolute top-4 right-4"><CheckCircle className="w-5 h-5 text-white" /></div>}
                                    <span className={`text-5xl mb-4 transition-transform group-hover:scale-110 ${isSelected ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}>{cat.icon}</span>
                                    <span className="text-[11px] font-black uppercase tracking-tighter text-center leading-tight">{t(cat.translationKey)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 3. OPERATIONAL NODES (FORMERLY NEARBY NODES - NOW BELOW SPECTRUM SCOPE) */}
            <div className="space-y-6">
                <label className="text-sm font-black uppercase text-zinc-500 tracking-[0.4em] flex items-center space-x-4 pl-4">
                    <Activity className="w-5 h-5 text-emerald-500"/><span>Operational_Node_Sync</span>
                </label>
                
                <div className="bg-zinc-900 border-2 border-zinc-800 rounded-[3.5rem] p-10 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { id: 'op-1', name: 'Ghost_Protocol', rank: 4, dist: '0.4km' },
                            { id: 'op-2', name: 'Civic_Sentinel', rank: 3, dist: '1.2km' },
                            { id: 'op-3', name: 'Nova_Prime', rank: 5, dist: '2.8km' },
                        ].map(op => (
                            <div key={op.id} className="flex items-center justify-between p-6 bg-black/40 rounded-[2rem] border border-zinc-800 hover:border-cyan-500/30 transition-all group shadow-xl">
                                <div className="flex items-center space-x-5">
                                    <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:text-cyan-400 group-hover:border-cyan-900 transition-all">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-tighter">{op.name}</p>
                                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Status: Standby</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-emerald-500/80 bg-emerald-950/20 px-3 py-1 rounded-lg border border-emerald-900/30">{op.dist}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. EXECUTION ACTION */}
            <div className="pt-10 space-y-6">
                <button
                    onClick={() => getIntel()}
                    disabled={isScanning || !heroLocation}
                    className="w-full flex items-center justify-center space-x-6 bg-white hover:bg-cyan-50 text-black font-black py-10 rounded-[3rem] shadow-4xl transition-all disabled:opacity-60 disabled:bg-zinc-300 uppercase tracking-[0.5em] text-xl active:scale-[0.98] border-b-8 border-zinc-200"
                >
                    {isScanning ? <Loader className="w-8 h-8 animate-spin" /> : <Search className="w-8 h-8" />}
                    <span>{isScanning ? 'SYNCHRONIZING_REGIONAL_NODES...' : 'Initialize_Regional_Intelligence_Scan'}</span>
                </button>
                
                <button
                    onClick={() => (window as any).aistudio?.onNavigate?.('categorySelection')}
                    className="w-full flex items-center justify-center space-x-6 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-black py-8 rounded-[3rem] border-2 border-zinc-800 hover:border-rose-500/30 transition-all active:scale-[0.98] uppercase tracking-[0.3em] text-sm"
                >
                    <Megaphone className="w-6 h-6 text-rose-500" />
                    <span>Switch_To_Manual_Report_Dispatch</span>
                </button>
            </div>

            {/* RESULTS AREA */}
            <div className="space-y-12">
                {!hasSearched && !isScanning && (
                   <div className="py-32 text-center animate-fade-in opacity-20">
                       <Broadcast className="w-32 h-32 mx-auto mb-10 text-zinc-700" />
                       <p className="text-sm font-black uppercase tracking-[0.8em] text-zinc-600">Terminal_Standby: Ready_For_Sector_Input</p>
                   </div>
                )}

                {hasSearched && isScanning && renderRadar()}

                {hasSearched && !isScanning && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in pb-32">
                        {intelItems.map((item) => (
                            <div key={item.id} className="bg-zinc-900/60 border-2 border-zinc-800 rounded-[3rem] p-10 hover:border-cyan-500/50 transition-all group overflow-hidden flex flex-col h-full shadow-2xl relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none"></div>
                                <h3 className="font-black text-white text-3xl leading-none uppercase tracking-tighter group-hover:text-cyan-100 transition-colors mb-6">{item.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed italic mb-10 flex-grow border-l-2 border-zinc-800 pl-6 group-hover:border-cyan-900 transition-colors">"{item.summary}"</p>
                                <div className="flex items-center justify-between pt-8 border-t border-zinc-800/50 mt-auto">
                                    <div className="flex items-center space-x-4 text-[10px] font-black text-zinc-600 uppercase">
                                        <MapPin className="w-4 h-4 text-rose-500" />
                                        <span>{item.location}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleDeepAnalysis(item)}
                                        className="py-4 px-10 bg-zinc-950 hover:bg-cyan-500 hover:text-black text-cyan-400 rounded-2xl border border-zinc-800 transition-all shadow-xl active:scale-95 flex items-center space-x-3 uppercase font-black text-xs tracking-widest"
                                    >
                                        <Broadcast className="w-5 h-5" />
                                        <span>Analyze</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {renderAnalysisPanel()}

        <style>{`
            @keyframes radar-sweep {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .animate-radar-sweep {
                background: conic-gradient(from 0deg, rgba(6, 182, 212, 0.15), transparent 60%);
                animation: radar-sweep 2.5s linear infinite;
            }
            .custom-scrollbar::-webkit-scrollbar { width: 3px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        `}</style>
    </div>
  );
};

export default LiveIntelligenceView;
