
import React, { useState, useRef, useEffect } from 'react';
import { type Hero, type Report, Archetype, type Item, type SkillType, HeroPath } from '../types';
import { useTranslations } from '../i18n';
import { Loader, Coins, Gem, Award, ChevronDown, Check, Zap, Sparkles, ShieldCheck, User, Monitor, MapPin, RefreshCw, Maximize2, Target, Box, Database, ArrowRight, Activity, Eye, Search, Pencil, X, Sun, Scale, Mask, Home } from './icons';
import { RANKS } from '../constants';
import HeroPersonaManager from './HeroPersonaManager';

interface HeroProfileTabProps {
    hero: Hero;
    setHero: React.Dispatch<React.SetStateAction<Hero>>;
    onNavigate: (view: any) => void;
    onAddHeroPersona: (description: string, archetype: Archetype) => Promise<void>;
    onDeleteHeroPersona: (personaId: string) => void;
    onEquipHeroPersona: (personaId: string | null) => void;
    onGenerateBackstory: () => Promise<void>;
}

const getPathIcon = (path: HeroPath) => {
    switch(path) {
        case HeroPath.Sentinel: return <ShieldCheck className="w-5 h-5" />;
        case HeroPath.Steward: return <Sun className="w-5 h-5" />;
        case HeroPath.Seeker: return <Search className="w-5 h-5" />;
        case HeroPath.Arbiter: return <Scale className="w-5 h-5" />;
        case HeroPath.Ghost: return <Mask className="w-5 h-5" />;
        default: return <User className="w-5 h-5" />;
    }
}

const HeroProfileTab: React.FC<HeroProfileTabProps> = ({
    hero,
    setHero,
    onGenerateBackstory,
    onAddHeroPersona,
    onDeleteHeroPersona,
    onEquipHeroPersona,
    onNavigate
}) => {
    const { t } = useTranslations();
    const [isEditingGlobal, setIsEditingGlobal] = useState(false);
    
    // Form States
    const [editName, setEditName] = useState(hero.name);
    const [editPath, setEditPath] = useState(hero.path);
    const [editTitle, setEditTitle] = useState(hero.equippedTitle || hero.title);
    const [editBaseName, setEditBaseName] = useState(hero.base.name);

    const nextRank = RANKS.find(r => r.level === hero.rank + 1);
    const xpProgress = nextRank ? (hero.xp / nextRank.xpNeeded) * 100 : 100;

    const equippedPersona = hero.personas.find(p => p.id === hero.equippedPersonaId);
    const avatarUrl = equippedPersona ? equippedPersona.imageUrl : 'https://i.imgur.com/8p8Vp6V.png';

    const handleSaveGlobal = () => {
        setHero(prev => ({
            ...prev,
            name: editName.trim() || prev.name,
            path: editPath,
            equippedTitle: editTitle,
            title: editTitle,
            base: {
                ...prev.base,
                name: editBaseName.trim() || prev.base.name
            }
        }));
        setIsEditingGlobal(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono animate-fade-in pb-12 overflow-hidden">
            {/* COLUMN 1: THE COMMAND DECK (Identity Focus) */}
            <div className="lg:col-span-4 space-y-6 min-w-0">
                 <div className="bg-zinc-900 border-4 border-zinc-800 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group min-h-[600px] flex flex-col items-center">
                    {/* Tactical HUD Overlays */}
                    <div className="absolute inset-0 pointer-events-none z-20">
                         <div className="absolute top-10 left-10 w-24 h-24 border-t border-l border-cyan-500/40 rounded-tl-3xl"></div>
                         <div className="absolute bottom-10 right-10 w-24 h-24 border-b border-r border-cyan-500/40 rounded-br-3xl"></div>
                    </div>

                    <div className="relative z-10 text-center flex-grow flex flex-col items-center w-full">
                        {/* THE GROUNDED HERO AVATAR */}
                        <div className="relative inline-block mb-10 mt-8">
                            <div className="absolute -inset-10 bg-cyan-500/5 blur-[60px]"></div>
                            <div className="relative z-10">
                                <div className="w-56 h-56 rounded-[3.5rem] p-1 bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-2xl overflow-hidden border-4 border-zinc-950 transition-transform duration-500 hover:scale-105">
                                     <img 
                                        src={avatarUrl} 
                                        alt="Operative Profile" 
                                        className="w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-all duration-700" 
                                    />
                                </div>
                                {/* Tactical HUD Ring */}
                                <div className="absolute -inset-4 border-2 border-cyan-500/20 rounded-[4rem] animate-pulse pointer-events-none"></div>
                                
                                {/* Edit Toggle Button Over Picture - REPLACED bg-white with bg-cyan-600 */}
                                <button 
                                    onClick={() => {
                                        setEditName(hero.name);
                                        setEditPath(hero.path);
                                        setEditTitle(hero.equippedTitle || hero.title);
                                        setEditBaseName(hero.base.name);
                                        setIsEditingGlobal(!isEditingGlobal);
                                    }}
                                    className="absolute -bottom-2 -right-2 bg-cyan-600 text-white p-4 rounded-3xl shadow-3xl hover:bg-cyan-500 transition-all active:scale-90 border-4 border-zinc-950 group/edit z-30"
                                    title="Edit Operative Profile"
                                >
                                    {isEditingGlobal ? <X className="w-5 h-5" /> : <Pencil className="w-5 h-5 group-hover/edit:rotate-12 transition-transform" />}
                                </button>
                            </div>
                        </div>

                        {isEditingGlobal ? (
                            <div className="w-full space-y-5 animate-fade-in px-4 pb-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em]">Operative_Name</label>
                                    <input 
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        className="w-full bg-black border-2 border-zinc-800 p-3 rounded-xl text-center text-lg font-black uppercase text-white outline-none focus:border-cyan-500 transition-all"
                                        placeholder="Enter name..."
                                    />
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em]">Ledger_Title</label>
                                    <select 
                                        value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)}
                                        className="w-full bg-black border-2 border-zinc-800 p-3 rounded-xl text-center text-[10px] font-black uppercase text-zinc-400 outline-none cursor-pointer hover:border-zinc-700"
                                    >
                                        {hero.unlockedTitles.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em]">Base_Node_ID</label>
                                    <input 
                                        value={editBaseName}
                                        onChange={e => setEditBaseName(e.target.value)}
                                        className="w-full bg-black border-2 border-zinc-800 p-3 rounded-xl text-center text-xs font-black uppercase text-zinc-500 outline-none focus:border-cyan-500 transition-all"
                                        placeholder="e.g. VANGUARD_ZERO"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em]">Path_Protocol</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {Object.values(HeroPath).map(p => (
                                            <button 
                                                key={p}
                                                onClick={() => setEditPath(p)}
                                                className={`p-3 rounded-xl border-2 flex items-center justify-center transition-all ${editPath === p ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-black border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
                                                title={p}
                                            >
                                                {getPathIcon(p)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    onClick={handleSaveGlobal}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-xl mt-4"
                                >
                                    Apply_Configuration
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-8 w-full px-4 min-w-0">
                                <h4 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none truncate">{hero.name}</h4>
                                <div className="inline-flex flex-col items-center space-y-3">
                                    <div className="inline-flex items-center space-x-3 bg-cyan-950/40 border border-cyan-500/30 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest truncate">{hero.equippedTitle || hero.title}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-[8px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-800/40 px-3 py-1 rounded-lg">
                                        {getPathIcon(hero.path)}
                                        <span>{hero.path}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* VITAL SIGNS (Progression Index) */}
                    {!isEditingGlobal && (
                        <div className="w-full pt-8 border-t border-zinc-800/50 space-y-6 relative z-10">
                            <div className="space-y-3">
                                <div className="flex justify-between items-end px-2">
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Field_Hardiness_Index</p>
                                    <p className="text-sm font-black text-emerald-500">{Math.round(xpProgress)}%</p>
                                </div>
                                <div className="w-full bg-zinc-950 rounded-full h-2 border border-zinc-800 overflow-hidden shadow-inner">
                                    <div className="bg-cyan-500 h-full transition-all duration-1000 shadow-[0_0_15px_cyan]" style={{ width: `${xpProgress}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between px-2 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/50">
                                <div className="flex items-center space-x-3">
                                    <Home className="w-4 h-4 text-zinc-600" />
                                    <span className="text-[9px] font-black text-zinc-600 uppercase">Base_Node:</span>
                                </div>
                                <span className="text-[9px] font-black text-white uppercase truncate ml-2">{hero.base.name}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* TRANSPARENCY DATABASE LINK */}
                <div className="bg-zinc-900 border-2 border-zinc-800 p-8 rounded-[3rem] shadow-2xl space-y-6 group min-w-0">
                    <div className="flex items-center justify-between">
                         <h3 className="text-xs font-black uppercase text-white tracking-[0.2em] flex items-center space-x-3">
                            <Database className="w-5 h-5 text-emerald-500" />
                            <span>Global_Audit_Hub</span>
                        </h3>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-widest">Access decentralized ledger for field evidence synchronization</p>
                    <button 
                        onClick={() => onNavigate('transparencyDatabase')}
                        className="w-full flex items-center justify-center space-x-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 uppercase text-xs tracking-widest"
                    >
                        <Search className="w-5 h-5" />
                        <span>Audit Public Ledger</span>
                    </button>
                </div>
            </div>

            {/* COLUMN 2: AUGMENTATIONS & PERSONA CONTROL */}
            <div className="lg:col-span-8 space-y-8 min-w-0">
                {/* Calibration Management Section */}
                <div className="bg-zinc-900 border-2 border-zinc-800 rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden min-w-0">
                    <div className="flex items-center space-x-6 mb-10 px-4 md:px-0">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <Zap className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter truncate">Hero_Calibration_Link</h2>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em] truncate">Active_Operational_Personas</p>
                        </div>
                    </div>
                    
                    <HeroPersonaManager
                        personas={hero.personas}
                        equippedPersonaId={hero.equippedPersonaId}
                        onAddHeroPersona={onAddHeroPersona}
                        onDeletePersona={onDeleteHeroPersona}
                        onEquipPersona={onEquipHeroPersona}
                    />
                </div>

                {/* Field Gear Kit Visualizer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
                    <div className="bg-zinc-900/60 border-2 border-zinc-800 p-8 rounded-[3rem] space-y-6 shadow-xl min-w-0">
                        <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] flex items-center space-x-3">
                            <Box className="w-5 h-5 text-cyan-500"/>
                            <span>Field_Deployable_Kit</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {hero.inventory.length > 0 ? hero.inventory.map(item => (
                                <div key={item.id} className="bg-black/60 p-4 rounded-2xl border border-zinc-800 hover:border-cyan-500/30 transition-all group min-w-0 overflow-hidden">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                                    </div>
                                    <p className="text-[10px] font-black text-white uppercase truncate">{item.name}</p>
                                    <p className="text-[7px] font-bold text-cyan-600 uppercase mt-1">Calib_{item.resonance}.0</p>
                                </div>
                            )) : (
                                <p className="col-span-2 text-[10px] text-zinc-700 font-black uppercase text-center py-6">Kit_Depleted</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-zinc-900/60 border-2 border-zinc-800 p-8 rounded-[3rem] space-y-6 relative overflow-hidden shadow-xl min-w-0">
                        <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] flex items-center space-x-3">
                            <Sparkles className="w-5 h-5 text-emerald-500"/>
                            <span>Accreditation_Resonance</span>
                        </h3>
                        <div className="space-y-4">
                            <SkillResonance label="Wisdom" value={hero.wisdomMastery} color="yellow" />
                            <SkillResonance label="Social" value={hero.socialMastery} color="rose" />
                            <SkillResonance label="Civic" value={hero.civicMastery} color="cyan" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SkillResonance: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
            <span className={`text-[9px] font-black uppercase text-${color}-500`}>{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50 shadow-inner">
            <div className={`h-full bg-${color}-500 shadow-[0_0_10px_currentColor] transition-all duration-1000`} style={{ width: `${Math.min(100, value)}%` }}></div>
        </div>
    </div>
);

export default HeroProfileTab;
