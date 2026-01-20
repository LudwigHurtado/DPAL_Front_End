
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from '../i18n';
import { type Hero, type TrainingScenario, SimulationMode, Category, SimulationDifficulty } from '../types';
import { generateTrainingScenario } from '../services/geminiService';
import { Loader, ArrowLeft, Zap, ShieldCheck, Target, Monitor, CheckCircle, AlertTriangle, ChevronRight, FileText, Sparkles, RefreshCw, List, Plus, ArrowRight, Map, Award, Star, Search, User, Activity, Heart, Scale, Fingerprint, Broadcast, Database } from './icons';
import { CATEGORIES_WITH_ICONS } from '../constants';

interface TrainingHolodeckViewProps {
  hero: Hero;
  onReturn: () => void;
  onComplete: (xp: number, mastery: number) => void;
}

const TrainingHolodeckView: React.FC<TrainingHolodeckViewProps> = ({ hero, onReturn, onComplete }) => {
  const { t } = useTranslations();
  const [config, setConfig] = useState<{ mode: SimulationMode | null, category: Category | null, difficulty: SimulationDifficulty }>({
      mode: null,
      category: null,
      difficulty: SimulationDifficulty.Standard
  });
  
  const [scenario, setScenario] = useState<TrainingScenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [isResultShown, setIsResultShown] = useState(false);
  
  const [clarity, setClarity] = useState(0);
  const [gatheredIntel, setGatheredIntel] = useState<string[]>([]);
  const [debrief, setDebrief] = useState<string | null>(null);

  const fetchScenario = useCallback(async () => {
    if (!config.mode || !config.category) return;
    setIsLoading(true);
    setScenario(null);
    setClarity(0);
    setGatheredIntel([]);
    setIsResultShown(false);
    setDebrief(null);
    try {
      const data = await generateTrainingScenario(hero, config.mode, config.category, config.difficulty);
      setScenario(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [hero, config]);

  const handleTacticalAction = (optionId: string) => {
    if (isProcessingAction || isResultShown) return;
    
    const option = scenario?.options.find(o => o.id === optionId);
    if (!option) return;

    setIsProcessingAction(true);
    
    setTimeout(() => {
        const nextClarity = Math.min(100, clarity + 35);
        setClarity(nextClarity);
        setGatheredIntel(prev => [...prev, option.text]);
        setIsProcessingAction(false);
        
        if (nextClarity >= 70) {
            setIsResultShown(true);
            setDebrief(option.successOutcome);
            onComplete(150, 75);
        }
    }, 1200);
  };

  if (!scenario && !isLoading) {
      return (
        <div className="bg-zinc-950 text-emerald-400 font-mono rounded-[2.5rem] border-2 border-emerald-900/50 flex flex-col p-6 md:p-10 relative overflow-hidden min-h-[90vh] pb-32">
             <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]"></div>
             
             <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12 relative z-10 w-full">
                <button onClick={onReturn} className="flex items-center space-x-2 text-[10px] font-black uppercase text-zinc-500 hover:text-emerald-400 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Exit_Academy</span>
                </button>
                <div className="flex items-center space-x-4">
                    <Monitor className="w-6 h-6 text-emerald-500" />
                    <h1 className="text-lg md:text-xl font-black tracking-[0.2em] uppercase text-white">Vanguard_Holodeck_Sim</h1>
                </div>
                <div className="hidden sm:block w-20"></div>
             </header>

             <div className="flex-grow w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
                 <div className="lg:col-span-3 space-y-8 pb-6">
                    <section className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center space-x-2"><Zap className="w-3 h-3"/><span>Accreditation_Tier</span></label>
                        <div className="grid grid-cols-1 gap-2">
                            {Object.values(SimulationDifficulty).map(diff => (
                                <button key={diff} onClick={() => setConfig(prev => ({ ...prev, difficulty: diff }))} className={`px-4 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-tight text-left transition-all ${config.difficulty === diff ? 'bg-emerald-600 text-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>{diff}</button>
                            ))}
                        </div>
                    </section>
                    <section className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center space-x-2"><List className="w-3 h-3"/><span>Test_Domain</span></label>
                        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {CATEGORIES_WITH_ICONS.map(cat => (
                                <button key={cat.value} onClick={() => setConfig(prev => ({ ...prev, category: cat.value }))} className={`p-4 rounded-xl border-2 text-[9px] font-black uppercase leading-tight text-left transition-all flex items-center space-x-4 ${config.category === cat.value ? 'bg-emerald-500/20 text-white border-emerald-500' : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-800'}`}>
                                    <span className="text-xl">{cat.icon}</span><span className="truncate flex-grow">{t(cat.translationKey)}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                 </div>

                 <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[400px]">
                    <div className="relative w-full max-w-sm aspect-square flex-shrink-0">
                        <div className="absolute inset-0 holodeck-chamber rounded-full border-4 border-emerald-950/20 overflow-hidden shadow-[inset_0_0_50px_rgba(16,185,129,0.1)]">
                            <div className="holodeck-grid-top"></div>
                            <div className="holodeck-grid-bottom"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative w-20 h-40 group/person">
                                 <div className="absolute -inset-10 bg-emerald-500/10 blur-[40px] animate-pulse rounded-full"></div>
                                 <svg viewBox="0 0 100 200" className="w-full h-full text-zinc-900 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-person-look">
                                    <path fill="currentColor" d="M50,10c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S55.5,10,50,10z M40,35c-8.3,0-15,6.7-15,15v45h10v65h30v-65h10V50C75,41.7,68.3,35,60,35H40z" />
                                    <rect x="25" y="40" width="50" height="2" fill="rgba(16,185,129,0.3)" className="animate-scan-y-fast" />
                                 </svg>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-center space-y-4 relative z-20">
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500/80 animate-pulse">Holodeck_Sync_OK</p>
                        <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest max-w-xs leading-relaxed mx-auto">Initialize protocol to begin neural immersion and accreditation.</p>
                    </div>
                 </div>

                 <div className="lg:col-span-3 space-y-4 pb-6">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center space-x-2"><Plus className="w-3 h-3"/><span>Assignment_Catalog</span></label>
                     <div className="grid grid-cols-1 gap-3">
                        <ProtocolButton 
                            label="Logic_Audit" 
                            mode={SimulationMode.Synthesist} 
                            icon={<FileText className="w-4 h-4"/>} 
                            color="emerald" 
                            config={config} 
                            onClick={(m) => { setConfig({...config, mode: m}); setTimeout(() => fetchScenario(), 50); }}
                        />
                        <ProtocolButton 
                            label="Field_Res" 
                            mode={SimulationMode.Dynamic} 
                            icon={<Zap className="w-4 h-4"/>} 
                            color="amber" 
                            config={config} 
                            onClick={(m) => { setConfig({...config, mode: m}); setTimeout(() => fetchScenario(), 50); }}
                        />
                        <ProtocolButton 
                            label="Crisis_Mediation" 
                            mode={SimulationMode.Mediation} 
                            icon={<Heart className="w-4 h-4"/>} 
                            color="rose" 
                            config={config} 
                            onClick={(m) => { setConfig({...config, mode: m}); setTimeout(() => fetchScenario(), 50); }}
                        />
                        <ProtocolButton 
                            label="Artifact_Trace" 
                            mode={SimulationMode.Forensic} 
                            icon={<Search className="w-4 h-4"/>} 
                            color="cyan" 
                            config={config} 
                            onClick={(m) => { setConfig({...config, mode: m}); setTimeout(() => fetchScenario(), 50); }}
                        />
                     </div>
                 </div>
             </div>
             
             <style>{`
                .holodeck-chamber { position: absolute; inset: 0; perspective: 600px; }
                .holodeck-grid-top, .holodeck-grid-bottom { position: absolute; left: 0; right: 0; height: 50%; background-image: linear-gradient(to right, rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.1) 1px, transparent 1px); background-size: 40px 40px; }
                .holodeck-grid-top { top: 0; transform: rotateX(-60deg); transform-origin: top; }
                .holodeck-grid-bottom { bottom: 0; transform: rotateX(60deg); transform-origin: bottom; }
                @keyframes person-look { 0%, 100% { transform: rotateY(0deg) scale(1); } 25% { transform: rotateY(15deg) scale(1.02); } 75% { transform: rotateY(-15deg) scale(0.98); } }
                .animate-person-look { animation: person-look 6s ease-in-out infinite; transform-origin: bottom; }
                @keyframes scan-y-fast { from { top: 0; } to { top: 100%; } }
                .animate-scan-y-fast { animation: scan-y-fast 2s linear infinite; }
                .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
             `}</style>
        </div>
      );
  }

  const bgUrl = scenario ? `https://picsum.photos/seed/${scenario.bgKeyword}/1600/1200` : '';

  return (
    <div className="relative h-full min-h-[90vh] bg-zinc-950 text-white font-mono overflow-hidden rounded-[3rem] border-2 border-zinc-800 shadow-2xl flex flex-col mb-12 pb-32">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 grayscale scale-105 animate-pulse-slow" style={{ backgroundImage: `url('${bgUrl}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/90 to-transparent"></div>
        <div className="scanline"></div>

        <div className="relative z-10 p-10 flex flex-col flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <button onClick={() => { setScenario(null); setConfig(prev => ({...prev, mode: null})); }} className="inline-flex items-center space-x-3 text-xs font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-emerald-400 transition-colors group">
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span>Abort_Simulation</span>
                </button>
                <div className="flex items-center space-x-8 bg-black/60 p-5 rounded-[2rem] border border-emerald-900/30 shadow-2xl">
                    <div className="text-center">
                        <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">Sync_Stability</p>
                        <div className="flex items-center space-x-2 text-emerald-400 font-black"><Activity className="w-3 h-3"/><span>{clarity}%</span></div>
                    </div>
                    <div className="h-10 w-px bg-zinc-800"></div>
                    <div className="text-center">
                        <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">XP_Potential</p>
                        <div className="flex items-center space-x-2 text-yellow-500 font-black"><Award className="w-3 h-3"/><span>+{hero.rank * 50}</span></div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center flex-grow">
                    <Loader className="w-20 h-20 animate-spin text-emerald-500" /><p className="mt-10 text-xs font-bold animate-pulse tracking-[0.8em] uppercase text-emerald-500/80">Materializing Environment...</p>
                </div>
            ) : scenario ? (
                <div className="flex-grow w-full grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
                    <div className={`lg:col-span-5 space-y-8 flex flex-col transition-all duration-700 ${isResultShown ? 'opacity-40 blur-[4px] scale-95 pointer-events-none' : ''}`}>
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] bg-emerald-950/30 px-5 py-2 rounded-full border border-emerald-900/50">Sector_Sync: {scenario.bgKeyword.toUpperCase()}</span>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white leading-none drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">{scenario.title}</h1>
                        </div>
                        <div className="bg-zinc-900/40 backdrop-blur-md border-2 border-zinc-800 p-10 rounded-[3rem] relative overflow-hidden shadow-4xl">
                            <div className="absolute top-0 right-0 p-6 opacity-5"><Broadcast className="w-32 h-32 text-emerald-500"/></div>
                            <p className="text-zinc-200 leading-relaxed italic text-xl pl-8 border-l-4 border-emerald-500 relative z-10">"{scenario.description}"</p>
                        </div>
                    </div>

                    <div className="lg:col-span-7 flex flex-col min-h-0 flex-grow">
                        <div className="bg-zinc-900/60 backdrop-blur-xl border-4 border-zinc-800 p-8 md:p-12 rounded-[4rem] shadow-4xl relative overflow-hidden h-full flex flex-col">
                            {isResultShown ? (
                                <div className="animate-fade-in space-y-10 py-10 flex flex-col items-center justify-center text-center flex-grow">
                                    <div className="w-32 h-32 bg-emerald-500 rounded-[3rem] flex items-center justify-center mb-6 shadow-[0_0_80px_rgba(16,185,129,0.4)] border-4 border-emerald-400">
                                         <ShieldCheck className="w-16 h-16 text-black" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black uppercase text-white tracking-tighter leading-none">Accreditation_Certified</h3>
                                        <p className="text-lg text-emerald-400 font-bold max-w-md leading-relaxed mx-auto italic">"{debrief}"</p>
                                    </div>
                                    <button onClick={fetchScenario} className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-500 text-white font-black py-6 rounded-3xl uppercase tracking-[0.5em] text-xs shadow-2xl active:scale-95 transition-all">Reload_Environment</button>
                                </div>
                            ) : (
                                <div className="space-y-8 flex flex-col h-full overflow-hidden flex-grow">
                                    <div className="flex justify-between items-center mb-4 px-2">
                                        <div className="flex items-center space-x-4">
                                            <Target className="w-6 h-6 text-cyan-400" />
                                            <h3 className="text-xs font-black uppercase tracking-widest text-white">Tactical_Interface</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-4 overflow-y-auto custom-scrollbar pr-4 flex-grow">
                                        {scenario.options.map((opt) => (
                                            <button 
                                                key={opt.id} 
                                                disabled={isProcessingAction || gatheredIntel.includes(opt.text)}
                                                onClick={() => handleTacticalAction(opt.id)} 
                                                className={`group w-full text-left p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${
                                                    gatheredIntel.includes(opt.text) ? 'bg-emerald-950/20 border-emerald-900/50 opacity-40 grayscale pointer-events-none' :
                                                    'bg-zinc-950 border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900 shadow-lg'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-6">
                                                    <div className="flex items-center space-x-6 min-w-0">
                                                        <div className={`p-3 rounded-2xl bg-black border border-zinc-800 transition-colors ${gatheredIntel.includes(opt.text) ? 'text-zinc-700' : 'group-hover:border-cyan-900 text-zinc-600 group-hover:text-cyan-400'}`}>
                                                            {getTacticalIcon(opt.id, config.mode)}
                                                        </div>
                                                        <p className="font-bold text-lg md:text-xl leading-tight uppercase tracking-tight text-white line-clamp-2">{opt.text}</p>
                                                    </div>
                                                    <ArrowRight className="w-6 h-6 text-zinc-800 flex-shrink-0 group-hover:text-cyan-500 transition-colors" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-6 pt-10 border-t-2 border-zinc-800 mt-auto flex-shrink-0">
                                        <div className="flex justify-between items-end mb-2 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Resonance</span>
                                                <span className="text-3xl font-black text-cyan-400 leading-none">{clarity}%</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                 <div className={`w-2 h-2 rounded-full ${isProcessingAction ? 'bg-cyan-500 animate-ping shadow-[0_0_15px_cyan]' : 'bg-zinc-800'}`}></div>
                                                 <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{isProcessingAction ? 'SCANNING' : 'IDLE'}</span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-zinc-800 shadow-inner">
                                            <div className="h-full bg-cyan-600 transition-all duration-1000 shadow-[0_0_30px_cyan]" style={{ width: `${clarity}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
        <style>{`
            .scanline { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03)); background-size: 100% 4px, 3px 100%; pointer-events: none; z-index: 50; }
        `}</style>
    </div>
  );
};

const getTacticalIcon = (id: string, mode: SimulationMode | null) => {
    if (mode === SimulationMode.Synthesist) return <FileText className="w-5 h-5"/>;
    if (mode === SimulationMode.Dynamic) return <Zap className="w-5 h-5"/>;
    if (mode === SimulationMode.Forensic) return <Search className="w-5 h-5"/>;
    if (mode === SimulationMode.Regulatory) return <Scale className="w-5 h-5"/>;
    return <Activity className="w-5 h-5"/>;
};

interface ProtocolButtonProps {
    label: string;
    mode: SimulationMode;
    icon: React.ReactNode;
    color: string;
    config: any;
    onClick: (mode: SimulationMode) => void;
}

const ProtocolButton: React.FC<ProtocolButtonProps> = ({ label, mode, icon, color, config, onClick }) => {
    const isSelected = config.mode === mode;
    const disabled = !config.category;

    return (
        <button 
            disabled={disabled}
            onClick={() => onClick(mode)}
            className={`w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 group shadow-lg ${
                disabled ? 'opacity-20 grayscale cursor-not-allowed' :
                isSelected ? `bg-${color}-500/10 border-${color}-500 shadow-[0_0_25px_rgba(0,0,0,0.4)] scale-[1.02]` :
                'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
        >
            <div className="flex items-center space-x-6">
                <div className={`p-3 rounded-2xl bg-zinc-950 border border-zinc-800 group-hover:border-${color}-500/30 transition-all shadow-inner`}>
                    <div className={`text-zinc-600 group-hover:text-${color}-400 transition-colors`}>{icon}</div>
                </div>
                <span className={`text-[12px] font-black uppercase tracking-widest ${isSelected ? `text-${color}-400` : 'text-zinc-500'}`}>{label}</span>
            </div>
            <ArrowRight className={`w-4 h-4 text-zinc-800 group-hover:text-${color}-500 transition-all ${isSelected ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
        </button>
    );
};

export default TrainingHolodeckView;
