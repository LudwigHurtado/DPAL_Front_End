
import React, { useState } from 'react';
import { type Hero, type TrainingModule, type SkillType } from '../types';
/** FIX: Added CheckSquare and Activity to the imports from ./icons */
import { ArrowLeft, Award, Book, Check, Loader, Lock, ShieldCheck, Zap, Star, Monitor, FileText, ChevronRight, User, Heart, Scale, Target, Sparkles, Broadcast, AlertTriangle, Eye, Info, CheckSquare, Activity } from './icons';
import { ACADEMY_CURRICULUM } from '../constants';

interface AcademyViewProps {
    onReturn: () => void;
    hero: Hero;
    onCompleteModule: (reward: number, skillType: SkillType) => void;
}

const AcademyView: React.FC<AcademyViewProps> = ({ onReturn, hero, onCompleteModule }) => {
    const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
    const [isStudying, setIsStudying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showPowerDirective, setShowPowerDirective] = useState(false);
    const [acceptedLiability, setAcceptedLiability] = useState(false);

    const handleStartModule = (mod: TrainingModule) => {
        if (mod.isLocked && hero.level < 5) return;
        setActiveModule(mod);
        setAcceptedLiability(false);
        setIsStudying(false);
        setProgress(0);
    };

    const initializeModule = () => {
        if (!acceptedLiability) return;
        setShowPowerDirective(true);
        setTimeout(() => {
            setShowPowerDirective(false);
            setIsStudying(true);
            const timer = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        return 100;
                    }
                    return prev + 5;
                });
            }, 120);
        }, 3000);
    };

    const handleFinish = () => {
        if (activeModule) {
            onCompleteModule(activeModule.masteryReward, activeModule.skillType);
            setActiveModule(null);
            setIsStudying(false);
        }
    };

    return (
        <div className="bg-zinc-950 text-white min-h-[85vh] rounded-[2.5rem] border border-zinc-800 shadow-2xl animate-fade-in font-mono overflow-hidden flex flex-col relative">
            <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 z-20">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                        <Award className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter">Vanguard_Academy</h1>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Holodeck_Accreditation_Terminal</p>
                    </div>
                </div>
                <button onClick={onReturn} className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Exit_Academy</span>
                </button>
            </header>

            <main className="flex-grow p-10 overflow-y-auto custom-scrollbar relative">
                {showPowerDirective && (
                    <div className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center text-center px-10 animate-fade-in">
                         <div className="p-6 bg-cyan-500/10 rounded-full mb-8 border border-cyan-500/20 animate-pulse">
                            <Sparkles className="w-16 h-16 text-cyan-400" />
                         </div>
                         <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none max-w-4xl power-motto">
                            THE POWER IS GIVEN.<br/>
                            <span className="text-cyan-500 italic">YOU CHOOSE WHAT YOU DO WITH IT.</span>
                         </h2>
                         <div className="mt-12 h-1 w-64 bg-zinc-900 rounded-full overflow-hidden">
                             <div className="h-full bg-cyan-500 animate-loading-bar"></div>
                         </div>
                    </div>
                )}

                {activeModule && !isStudying ? (
                    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in py-10">
                        <div className="lg:col-span-4 space-y-6">
                            <button onClick={() => setActiveModule(null)} className="flex items-center space-x-2 text-[10px] font-black uppercase text-zinc-600 hover:text-white transition-colors">
                                <ArrowLeft className="w-3 h-3"/><span>Return_To_Catalog</span>
                            </button>
                            <div className={`p-8 rounded-[2.5rem] border-2 ${activeModule.isScripture ? 'bg-yellow-950/10 border-yellow-500/30' : activeModule.title.includes('NVC') ? 'bg-rose-950/10 border-rose-500/30' : 'bg-zinc-900 border-zinc-800'} text-center shadow-2xl`}>
                                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${activeModule.isScripture ? 'bg-yellow-500/20 text-yellow-500' : activeModule.title.includes('NVC') ? 'bg-rose-500/20 text-rose-500' : 'bg-cyan-500/20 text-cyan-500'}`}>
                                    {getModuleIcon(activeModule.skillType)}
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{activeModule.title}</h3>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{activeModule.skillType}_Sector_Accreditation</p>
                            </div>

                            <div className="bg-rose-950/20 border-2 border-rose-500/30 p-6 rounded-3xl space-y-4 shadow-xl">
                                <div className="flex items-center space-x-2 text-rose-500">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-widest">Liability_Shield</span>
                                </div>
                                <p className="text-[11px] text-zinc-400 font-bold leading-relaxed italic">"{activeModule.notAskedToDo}"</p>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-8">
                            <section className="bg-zinc-900/40 p-8 rounded-[3rem] border border-zinc-800 space-y-6 shadow-inner">
                                <div className="flex items-center space-x-3 text-cyan-500">
                                    <Eye className="w-5 h-5"/>
                                    <h4 className="text-xs font-black uppercase tracking-widest">Observable_Indicators</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeModule.indicators.map((ind, i) => (
                                        <div key={i} className="flex items-start space-x-3 p-4 bg-black/40 rounded-xl border border-zinc-800">
                                            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0"></div>
                                            <span className="text-xs font-bold text-zinc-300">{ind}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-zinc-900/40 p-8 rounded-[3rem] border border-zinc-800 space-y-6 shadow-inner">
                                <div className="flex items-center space-x-3 text-emerald-500">
                                    <CheckSquare className="w-5 h-5" />
                                    <h4 className="text-xs font-black uppercase tracking-widest">Operational_Checklist</h4>
                                </div>
                                <div className="space-y-3">
                                    {activeModule.checklist.map((step, i) => (
                                        <div key={i} className="flex items-center space-x-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-900">
                                            <span className="text-[10px] font-black text-zinc-600">0{i+1}</span>
                                            <span className="text-xs font-bold text-zinc-400">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="pt-6 flex flex-col items-center space-y-6">
                                <label className="flex items-center space-x-4 cursor-pointer group">
                                    <div 
                                        onClick={() => setAcceptedLiability(!acceptedLiability)}
                                        className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${acceptedLiability ? 'bg-cyan-600 border-cyan-500' : 'bg-black border-zinc-800 group-hover:border-zinc-700'}`}
                                    >
                                        {acceptedLiability && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest leading-relaxed">I verify that I understand the professional boundaries of this accreditation.</span>
                                </label>
                                
                                <button 
                                    onClick={initializeModule}
                                    disabled={!acceptedLiability}
                                    className="w-full bg-white text-black font-black py-6 rounded-[2rem] uppercase tracking-[0.4em] text-xs shadow-2xl active:scale-95 transition-all disabled:opacity-20"
                                >
                                    Initialize_Holodeck_Handshake
                                </button>
                            </div>
                        </div>
                    </div>
                ) : isStudying && activeModule ? (
                    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in py-10">
                        <div className={`text-center space-y-4 ${activeModule.isScripture ? 'scripture-glow' : activeModule.title.includes('NVC') ? 'nvc-glow' : ''}`}>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">{activeModule.title}</h2>
                            <p className="text-zinc-500 text-sm max-w-2xl mx-auto leading-relaxed italic">"{activeModule.description}"</p>
                        </div>

                        <div className={`bg-zinc-900 border-2 ${activeModule.isScripture ? 'border-yellow-500/30' : activeModule.title.includes('NVC') ? 'border-rose-500/30' : 'border-zinc-800'} p-12 rounded-[3rem] relative overflow-hidden shadow-2xl`}>
                             <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
                                <div className={`h-full ${activeModule.isScripture ? 'bg-yellow-500 shadow-[0_0_15px_gold]' : activeModule.title.includes('NVC') ? 'bg-rose-500 shadow-[0_0_15px_rose]' : 'bg-cyan-500 shadow-[0_0_15px_cyan]'} transition-all duration-300`} style={{ width: `${progress}%` }}></div>
                             </div>
                             
                             <div className="flex flex-col items-center justify-center space-y-10 min-h-[300px]">
                                {progress < 100 ? (
                                    <>
                                        <div className="relative">
                                            <Loader className={`w-20 h-20 animate-spin ${activeModule.isScripture ? 'text-yellow-500' : activeModule.title.includes('NVC') ? 'text-rose-400' : 'text-cyan-500'}`} />
                                            <div className="absolute inset-0 bg-cyan-500/5 blur-3xl animate-ping"></div>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 animate-pulse">Encoding_Holodeck_Pattern_Recognition...</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-8 text-center animate-fade-in">
                                        <div className={`w-32 h-32 ${activeModule.isScripture ? 'bg-yellow-500' : activeModule.title.includes('NVC') ? 'bg-rose-500' : 'bg-emerald-500'} rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.3)]`}>
                                            <Check className="w-16 h-16 text-black" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black uppercase text-white tracking-tighter">Accreditation_Successful</h3>
                                            <p className="text-zinc-500 mt-2 font-bold uppercase tracking-widest text-xs">Credential Artifact: +{activeModule.masteryReward} {activeModule.skillType} Mastery</p>
                                        </div>
                                        <button onClick={handleFinish} className="bg-white text-black font-black py-6 px-16 rounded-2xl uppercase tracking-[0.4em] text-xs shadow-2xl active:scale-95 transition-all hover:bg-cyan-50">Commit_Mastery</button>
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-8 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Star className="w-48 h-48 text-emerald-500"/></div>
                                <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest flex items-center space-x-3">
                                    <Star className="w-5 h-5 text-emerald-500"/>
                                    <span>Accreditation_Ledger</span>
                                </h3>
                                <div className="flex items-end space-x-4 border-b border-zinc-800 pb-8">
                                    <span className="text-7xl font-black text-white tracking-tighter leading-none">{hero.masteryScore || 0}</span>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Rank_Xp</span>
                                </div>
                                <div className="space-y-6 pt-4">
                                    <SkillProgress label="Conflict_Resolution" value={Math.min(100, (hero.socialMastery || 0) * 1.5)} color="rose" />
                                    <SkillProgress label="Non_Violent_Comms" value={Math.min(100, (hero.socialMastery || 0))} color="emerald" />
                                    <SkillProgress label="Wisdom_Theology" value={Math.min(100, (hero.wisdomMastery || 0))} color="yellow" />
                                    <SkillProgress label="Environmental_Scan" value={hero.environmentalMastery || 0} color="cyan" />
                                    <SkillProgress label="Civic_Process" value={hero.civicMastery || 0} color="purple" />
                                    <SkillProgress label="Infr_Assessment" value={hero.infrastructureMastery || 0} color="amber" />
                                </div>
                            </div>

                            <div className="p-8 bg-zinc-950/50 border-2 border-dashed border-zinc-900 rounded-[2.5rem] space-y-4">
                                <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Expert_Post-Compliance</p>
                                <p className="text-[11px] text-zinc-500 leading-relaxed font-bold italic">
                                    "Training nodes are designed to improve detection accuracy. We are not replacing professionals; we are surfacing patterns they never see alone."
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-10">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center space-x-4">
                                    <Book className="w-8 h-8 text-emerald-500" />
                                    <span>Holodeck_Modules</span>
                                </h2>
                                <span className="bg-black border border-zinc-800 px-4 py-1.5 rounded-full text-[9px] font-black text-zinc-600 uppercase tracking-widest">Session: STANDBY</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {ACADEMY_CURRICULUM.map(mod => (
                                    <button 
                                        key={mod.id}
                                        onClick={() => handleStartModule(mod)}
                                        className={`group relative text-left p-8 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${
                                            mod.isLocked && hero.level < 5 ? 'bg-zinc-950 border-zinc-900 grayscale opacity-40 cursor-not-allowed' : 
                                            mod.id === 'MOD-REP-01' ? 'bg-zinc-900 border-cyan-900/50 hover:border-cyan-500' :
                                            mod.isScripture ? 'bg-zinc-900 border-yellow-900/50 hover:border-yellow-500' :
                                            mod.title.includes('NVC') ? 'bg-zinc-900 border-rose-900/50 hover:border-rose-500' :
                                            'bg-zinc-900 border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900 shadow-2xl'
                                        }`}
                                    >
                                        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl transition-colors ${mod.id === 'MOD-REP-01' ? 'bg-cyan-500/5 group-hover:bg-cyan-500/10' : mod.isScripture ? 'bg-yellow-500/5 group-hover:bg-yellow-500/10' : mod.title.includes('NVC') ? 'bg-rose-500/5 group-hover:bg-rose-500/10' : 'bg-cyan-500/5 group-hover:bg-cyan-500/10'}`}></div>
                                        
                                        <div className="relative z-10 h-full flex flex-col justify-between">
                                            <div className="flex justify-between items-start mb-8">
                                                 <div className={`p-4 rounded-2xl ${
                                                     mod.id === 'MOD-REP-01' ? 'bg-cyan-500/10 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]' :
                                                     mod.skillType === 'Wisdom' ? 'bg-yellow-500/10 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 
                                                     mod.title.includes('NVC') ? 'bg-rose-500/10 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]' :
                                                     'bg-emerald-500/10 text-emerald-500'
                                                 }`}>
                                                    {getModuleIcon(mod.skillType)}
                                                 </div>
                                                 {mod.isLocked && hero.level < 5 && <Lock className="w-5 h-5 text-zinc-700" />}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black uppercase tracking-tight text-white mb-2 leading-none">{mod.title}</h4>
                                                <p className="text-[11px] text-zinc-500 leading-relaxed font-bold group-hover:text-zinc-300 transition-colors line-clamp-2">{mod.description}</p>
                                            </div>
                                            <div className="pt-6 mt-6 border-t border-zinc-800/50 flex justify-between items-center">
                                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{mod.skillType}_Node</span>
                                                <div className="flex items-center space-x-1 text-emerald-500 font-black text-[10px]">
                                                    <span>+{mod.masteryReward}</span><Sparkles className="w-3 h-3 fill-current"/>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
                .power-motto { text-shadow: 0 0 30px rgba(34,211,238,0.4); animation: pulseText 2s infinite alternate; }
                @keyframes pulseText { from { transform: scale(1); opacity: 0.9; } to { transform: scale(1.02); opacity: 1; } }
                @keyframes loading-bar { 0% { width: 0; } 100% { width: 100%; } }
                .animate-loading-bar { animation: loading-bar 3s ease-in-out forwards; }
                .scripture-glow h2 { color: #facc15; text-shadow: 0 0 20px rgba(250,204,21,0.3); }
                .nvc-glow h2 { color: #fb7185; text-shadow: 0 0 20px rgba(251,113,133,0.3); }
            `}</style>
        </div>
    );
};

const getModuleIcon = (type: SkillType) => {
    switch(type) {
        case 'Logic': return <Scale className="w-6 h-6"/>;
        case 'Empathy': return <Heart className="w-6 h-6"/>;
        case 'Social': return <User className="w-6 h-6"/>;
        case 'Tactical': return <Target className="w-6 h-6"/>;
        case 'Wisdom': return <ShieldCheck className="w-6 h-6"/>;
        case 'Civic': return <Info className="w-6 h-6"/>;
        case 'Environmental': return <Zap className="w-6 h-6"/>;
        case 'Infrastructure': return <Monitor className="w-6 h-6"/>;
        case 'Technical': return <Activity className="w-6 h-6"/>;
        default: return <Broadcast className="w-6 h-6"/>;
    }
}

const SkillProgress: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
            <span className={`text-[9px] font-black uppercase text-${color}-500`}>{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50 shadow-inner">
            <div className={`h-full bg-${color}-500 shadow-[0_0_10px_currentColor] transition-all duration-1000`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

export default AcademyView;
