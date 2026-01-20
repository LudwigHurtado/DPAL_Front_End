
import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from '../i18n';
import { type HeroPersona, Archetype } from '../types';
import { Loader, Check, User, Zap, ShieldCheck, Search, Eye, Sparkles, Activity, Target, Camera, X, RefreshCw, Heart, Scale, Monitor } from './icons';

interface HeroPersonaManagerProps {
    personas: HeroPersona[];
    equippedPersonaId: string | null;
    onAddHeroPersona: (description: string, archetype: Archetype, sourceImage?: string) => Promise<void>;
    onDeletePersona: (personaId: string) => void;
    onEquipPersona: (personaId: string | null) => void;
}

const ARCHETYPE_INFO = [
    { type: Archetype.Analyst, icon: Search, desc: 'Logical pattern scanning.', color: 'cyan', suggestion: 'Vision of a precise data architect' },
    { type: Archetype.Shepherd, icon: Heart, desc: 'Empathetic mediation.', color: 'rose', suggestion: 'A calm presence in the storm' },
    { type: Archetype.Seeker, icon: Eye, desc: 'Truth investigation.', color: 'emerald', suggestion: 'Nothing stays hidden for long' },
    { type: Archetype.Sentinel, icon: ShieldCheck, desc: 'Civic oversight.', color: 'blue', suggestion: 'Vigilant guard of the ledger' },
    { type: Archetype.Firefighter, icon: Zap, desc: 'Hazard response.', color: 'amber', suggestion: 'Running in when others run out' },
    { type: Archetype.Seraph, icon: Sparkles, desc: 'Angelic protection.', color: 'purple', suggestion: 'Radiant wings of the Oracle' },
    { type: Archetype.Guide, icon: User, desc: 'Communal wisdom.', color: 'indigo', suggestion: 'Mapping the way forward' },
];

const MAX_PERSONAS = 5;

const HeroPersonaManager: React.FC<HeroPersonaManagerProps> = ({ personas, equippedPersonaId, onAddHeroPersona, onDeletePersona, onEquipPersona }) => {
    const { t } = useTranslations();
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
    const [draftDescription, setDraftDescription] = useState('');
    const [selectedArchetype, setSelectedArchetype] = useState<Archetype>(Archetype.Sentinel);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resonance, setResonance] = useState(0);
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setResonance(Math.min(100, (draftDescription.length / 200) * 100));
    }, [draftDescription]);

    const handleCreatePersona = async () => {
        if (!draftDescription.trim() || isGenerating) return;
        setIsGenerating(true);
        try {
            await onAddHeroPersona(draftDescription, selectedArchetype, sourceImage || undefined);
            setDraftDescription('');
            setSourceImage(null);
            setIsWorkspaceOpen(false);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSourceImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const currentMeta = ARCHETYPE_INFO.find(a => a.type === selectedArchetype);

    return (
        <div className="font-mono space-y-8 w-full overflow-hidden">
            <div className="flex justify-between items-center bg-zinc-950/80 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl backdrop-blur-md">
                <div className="flex items-center space-x-6 min-w-0">
                    <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 relative flex-shrink-0">
                        <div className="absolute inset-0 bg-cyan-400/10 blur-xl rounded-2xl animate-pulse"></div>
                        <Activity className="w-6 h-6 text-cyan-400 relative z-10" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-black text-white uppercase tracking-tighter truncate">Recruitment_Terminal</p>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] truncate">{personas.length} / {MAX_PERSONAS} SLOTS_AUTHORIZED</p>
                    </div>
                </div>
                {personas.length < MAX_PERSONAS && (
                    <button 
                        onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                        className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex-shrink-0 ${isWorkspaceOpen ? 'bg-zinc-800 text-zinc-500' : 'bg-cyan-600 text-white hover:bg-cyan-500'}`}
                    >
                        {isWorkspaceOpen ? 'Abort' : 'OPERATIVE_CONFIGURATION'}
                    </button>
                )}
            </div>

            {isWorkspaceOpen && (
                <div className="relative bg-zinc-950 border border-zinc-800 p-8 md:p-12 rounded-[3.5rem] animate-fade-in overflow-hidden shadow-3xl w-full">
                    <div className="absolute inset-0 opacity-5 pointer-events-none perspective-grid"></div>
                    
                    {isGenerating && <div className="absolute top-0 left-0 w-full h-1.5 bg-cyan-500 shadow-[0_0_30px_cyan] z-50 animate-surgical-scan"></div>}

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                        <div className="lg:col-span-4 space-y-10 min-w-0">
                            {/* PHOTO UPLOAD SLOT */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3 px-3">
                                    <Camera className="w-4 h-4 text-cyan-500" />
                                    <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Biometric_Source</label>
                                </div>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-full aspect-square rounded-[3rem] border-2 border-dashed border-zinc-800 bg-zinc-900/40 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 transition-all overflow-hidden group shadow-inner"
                                >
                                    {sourceImage ? (
                                        <>
                                            <img src={sourceImage} alt="Source" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <RefreshCw className="w-10 h-10 text-white animate-spin-slow" />
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setSourceImage(null); }}
                                                className="absolute top-6 right-6 p-3 bg-black/80 rounded-full text-zinc-400 hover:text-white transition-colors border border-zinc-700"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center p-6 space-y-4">
                                            <div className="w-16 h-16 bg-zinc-950 rounded-3xl flex items-center justify-center mx-auto border-2 border-zinc-800 group-hover:border-cyan-900 transition-all">
                                                <Camera className="w-8 h-8 text-zinc-700 group-hover:text-cyan-400 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-zinc-600 uppercase leading-relaxed tracking-widest">Upload Profile Photo</p>
                                            </div>
                                        </div>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-3 px-3">
                                    <Target className="w-4 h-4 text-cyan-500" />
                                    <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Operative_Archetype</label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {ARCHETYPE_INFO.map(arch => {
                                        const Icon = arch.icon;
                                        const isSelected = selectedArchetype === arch.type;
                                        return (
                                            <button 
                                                key={arch.type}
                                                onClick={() => setSelectedArchetype(arch.type)}
                                                className={`p-4 rounded-[2rem] border-2 flex flex-col items-center text-center transition-all min-w-0 overflow-hidden ${isSelected ? `bg-${arch.color}-500/10 border-${arch.color}-500 text-white shadow-[0_0_25px_rgba(6,182,212,0.15)]` : 'bg-zinc-900/60 border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
                                            >
                                                <Icon className={`w-6 h-6 mb-2 transition-colors ${isSelected ? `text-${arch.color}-400` : 'text-zinc-700'}`} />
                                                <span className="text-[8px] font-black uppercase leading-tight tracking-wider truncate w-full">{arch.type.split(' ').pop()}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 flex flex-col min-w-0">
                            <div className="flex flex-col flex-grow bg-zinc-900/40 rounded-[3rem] border border-zinc-800 overflow-hidden shadow-inner relative">
                                <div className="bg-zinc-900/80 border-b border-zinc-800 px-8 py-5 flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <Zap className="w-5 h-5 text-amber-500" />
                                        <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Operative_Manifesto</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{Math.round(resonance)}% SYNC</span>
                                    </div>
                                </div>

                                <div className="p-8 pb-0">
                                     <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl mb-4">
                                         <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                             <Sparkles className="w-3 h-3" /> Oracle_Suggestion:
                                         </p>
                                         <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase italic leading-relaxed">{currentMeta?.suggestion}</p>
                                     </div>
                                </div>

                                <textarea
                                    value={draftDescription}
                                    onChange={(e) => setDraftDescription(e.target.value)}
                                    placeholder="Define the hero's core determination..."
                                    className="w-full h-full min-h-[250px] bg-black/30 p-10 pt-4 text-white font-bold text-base outline-none focus:bg-black/50 transition-all placeholder:text-zinc-800 resize-none leading-relaxed"
                                    maxLength={200}
                                />

                                <div className="bg-zinc-900/80 p-5 border-t border-zinc-800 flex justify-between items-center px-10">
                                    <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Buffer: {draftDescription.length}/200</span>
                                    {isGenerating && <div className="flex items-center space-x-3 text-cyan-500 animate-pulse"><Loader className="w-4 h-4 animate-spin"/> <span className="text-[10px] font-black uppercase tracking-widest">Synthesizing...</span></div>}
                                </div>
                            </div>

                            <button 
                                onClick={handleCreatePersona}
                                disabled={!draftDescription.trim() || isGenerating}
                                className="w-full mt-8 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-6 rounded-[2rem] uppercase tracking-[0.2em] text-xs shadow-3xl active:scale-[0.98] transition-all disabled:opacity-10 flex items-center justify-center space-x-6 group overflow-hidden relative"
                            >
                                {isGenerating ? <Loader className="w-6 h-6 animate-spin text-white"/> : <Sparkles className="w-6 h-6 text-white transition-transform group-hover:scale-125"/>}
                                <span className="truncate">{isGenerating ? 'NEURAL_RECONSTRUCTION...' : 'RECRUIT_OPERATIVE'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
                {personas.map((persona) => {
                    const isEquipped = equippedPersonaId === persona.id;
                    const archData = ARCHETYPE_INFO.find(a => a.type === (persona.archetype || Archetype.Sentinel));
                    const ArchIcon = archData?.icon || ShieldCheck;
                    return (
                        <div 
                            key={persona.id}
                            className={`group relative p-1 rounded-[3rem] transition-all duration-700 ${isEquipped ? 'bg-gradient-to-br from-cyan-400 via-cyan-600 to-blue-700 shadow-3xl scale-105 z-10' : 'bg-zinc-800 hover:bg-zinc-750'}`}
                        >
                            <div className="bg-zinc-950 rounded-[2.9rem] p-8 h-full flex flex-col items-center relative overflow-hidden">
                                {isEquipped && (
                                    <>
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-cyan-400 animate-surgical-scan z-20"></div>
                                        <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>
                                    </>
                                )}
                                
                                <div className="relative mb-10 w-full">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent_70%)] blur-2xl"></div>
                                    <div className={`w-32 h-32 mx-auto rounded-[2.5rem] p-1.5 border-2 border-dashed border-zinc-800 relative z-10 transition-all duration-700 ${isEquipped ? 'scale-110 shadow-3xl border-cyan-500/50' : 'group-hover:border-zinc-700'}`}>
                                        <div className="w-full h-full rounded-[2rem] overflow-hidden border-2 border-zinc-900 bg-black">
                                            <img src={persona.imageUrl} alt={persona.name} className={`w-full h-full object-cover transition-all duration-1000 ${isEquipped ? 'grayscale-0' : 'grayscale group-hover:grayscale-0 contrast-125'}`} />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center w-full space-y-3 min-w-0">
                                     <h4 className={`text-xl font-black uppercase tracking-tighter truncate ${isEquipped ? 'text-white' : 'text-zinc-500'}`}>{persona.name}</h4>
                                     <div className="flex items-center justify-center space-x-3">
                                         <ArchIcon className={`w-3.5 h-3.5 ${isEquipped ? 'text-cyan-400' : 'text-zinc-700'}`} />
                                         <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest truncate">{persona.archetype || 'Elite Citizen'}</span>
                                     </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-zinc-900/50 w-full flex items-center justify-between gap-5">
                                    {!isEquipped ? (
                                        <button 
                                            onClick={() => onEquipPersona(persona.id)} 
                                            className="flex-grow bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-cyan-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-zinc-800 hover:border-cyan-500/30 active:scale-95"
                                        >
                                            DEPLOY
                                        </button>
                                    ) : (
                                        <div className="flex-grow flex items-center justify-center space-x-3 text-cyan-400 bg-cyan-950/20 py-4 rounded-2xl border border-cyan-500/30">
                                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">FIELD_ACTIVE</span>
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => persona.id && onDeletePersona(persona.id)} 
                                        className="p-4 bg-zinc-950 hover:bg-rose-950 text-zinc-800 hover:text-rose-500 rounded-2xl border border-zinc-800 hover:border-rose-900 transition-all active:scale-95"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                .perspective-grid {
                    background-image: 
                        linear-gradient(to right, #ffffff08 1.5px, transparent 1px),
                        linear-gradient(to bottom, #ffffff08 1.5px, transparent 1px);
                    background-size: 50px 50px;
                    transform: perspective(600px) rotateX(45deg);
                    transform-origin: center top;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
                @keyframes surgicalScan {
                    0% { transform: translateY(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(500px); opacity: 0; }
                }
                .animate-surgical-scan { animation: surgicalScan 4s linear infinite; }
            `}</style>
        </div>
    );
};

// Internal icon for deletion
const Trash2: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export default HeroPersonaManager;
