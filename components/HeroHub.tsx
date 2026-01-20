
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SkillLevel, type Mission, type Hero, type Category, type Report, type IapPack, type StoreItem, type NftTheme, type SkillNode, Archetype } from '../types';
import { useTranslations } from '../i18n';
import { ArrowLeft, Loader, Coins, Gem, Star, Award, RefreshCw, List, ChevronDown, Check, Zap, UserCircle, Store, Broadcast, Sparkles, ArrowRight, MapPin, Crosshair, Monitor, Eye, EyeOff, Target, Box, Database, Clock, ShieldCheck, Fingerprint, Activity, CheckCircle, Map, User, Search, ListFilter, Package } from './icons';
import { RANKS, CATEGORIES_WITH_ICONS } from '../constants';
import CollectionCodex from './CollectionCodex';
import NftMintingStation from './NftMintingStation';
import StoreView from './StoreView';
import HeroPersonaManager from './HeroPersonaManager';
import HeroProfileTab from './HeroProfileTab';
import TacticalVault from './TacticalVault';

interface HeroHubProps {
  onReturnToHub: () => void;
  missions: Mission[];
  isLoadingMissions: boolean;
  hero: Hero;
  setHero: React.Dispatch<React.SetStateAction<Hero>>;
  heroLocation: string;
  setHeroLocation: (loc: string) => void;
  onGenerateNewMissions: (preferences: { skillLevel: SkillLevel; categories: Category[]; location?: string; }) => void;
  onMintNft: (prompt: string, theme: NftTheme, dpalCategory: Category) => Promise<Report>;
  reports: Report[];
  iapPacks: IapPack[];
  storeItems: StoreItem[];
  onInitiateHCPurchase: (pack: IapPack) => void;
  onInitiateStoreItemPurchase: (item: StoreItem) => void;
  onAddHeroPersona: (description: string, archetype: Archetype) => Promise<void>;
  onDeleteHeroPersona: (personaId: string) => void;
  onEquipHeroPersona: (personaId: string | null) => void;
  onGenerateHeroBackstory: () => Promise<void>;
  onNavigateToMissionDetail: (mission: Mission) => void;
  onNavigate: (view: any) => void;
  activeTab: any;
  setActiveTab: (tab: any) => void;
}

const QUICK_LOCATIONS = ["San Jose, CA", "Los Angeles, CA", "Chicago, IL", "New York, NY", "London, UK"];

const DeploymentConsole: React.FC<{
  onGenerate: (preferences: { skillLevel: SkillLevel; categories: Category[]; location?: string; }) => void;
  isGenerating: boolean;
  location: string;
  setLocation: (loc: string) => void;
}> = ({ onGenerate, isGenerating, location, setLocation }) => {
    const { t } = useTranslations();
    const [skillLevel, setSkillLevel] = useState<SkillLevel>(SkillLevel.Beginner);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

    const handleGenerate = () => {
        onGenerate({ skillLevel, categories: selectedCategories, location });
    };

    const handleCategoryToggle = (category: Category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    return (
        <div className="bg-zinc-900/60 border-4 border-zinc-800 rounded-[3.5rem] p-10 md:p-14 mb-16 shadow-4xl relative overflow-hidden font-mono">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Target className="w-64 h-64 text-cyan-500" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-14">
                <div className="lg:col-span-3 space-y-8">
                    <label className="text-sm font-black uppercase text-zinc-500 tracking-[0.4em] flex items-center space-x-4">
                        <Zap className="w-5 h-5 text-amber-500" />
                        <span>Signal_Tiers</span>
                    </label>
                    <div className="flex flex-col gap-4">
                        {Object.values(SkillLevel).map(level => (
                            <button
                                key={level}
                                onClick={() => setSkillLevel(level as SkillLevel)}
                                className={`px-8 py-6 text-sm font-black uppercase rounded-3xl transition-all border-2 text-left ${
                                    skillLevel === level 
                                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                                    : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:border-zinc-700'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{t(`skillLevels.${(level as string).toLowerCase()}`)}</span>
                                    {skillLevel === level && <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_amber]"></div>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <label className="text-sm font-black uppercase text-zinc-500 tracking-[0.4em] flex items-center space-x-4">
                        <MapPin className="w-5 h-5 text-rose-500" />
                        <span>Geospatial_Lock</span>
                    </label>
                    <div className="space-y-6">
                        <div className="relative group">
                            <Search className="w-7 h-7 text-zinc-700 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-500 transition-colors" />
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter Sector ID or City..."
                                className="w-full bg-zinc-950 text-white border-4 border-zinc-800 rounded-[2rem] pl-16 pr-6 py-6 focus:ring-8 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-black text-lg uppercase tracking-widest"
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {QUICK_LOCATIONS.map(city => (
                                <button
                                    key={city}
                                    onClick={() => setLocation(city)}
                                    className={`px-5 py-2.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                        location === city ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-zinc-400'
                                    }`}
                                >
                                    {city.split(',')[0]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-8">
                    <label className="text-sm font-black uppercase text-zinc-500 tracking-[0.4em] flex items-center space-x-4">
                        <ListFilter className="w-5 h-5 text-emerald-500" />
                        <span>Spectrum_Triage</span>
                    </label>
                    <div className="bg-zinc-950 border-4 border-zinc-800 rounded-[2.5rem] p-6 h-[220px] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {CATEGORIES_WITH_ICONS.map(cat => {
                                const isSelected = selectedCategories.includes(cat.value);
                                return (
                                    <button
                                        key={cat.value}
                                        onClick={() => handleCategoryToggle(cat.value)}
                                        className={`flex items-center space-x-4 px-5 py-4 rounded-2xl border-2 transition-all text-left ${
                                            isSelected 
                                            ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                                            : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-300'
                                        }`}
                                    >
                                        <span className="text-2xl">{cat.icon}</span>
                                        <span className="text-[11px] font-black uppercase truncate leading-none">{t(cat.translationKey)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-14 pt-12 border-t-2 border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-10">
                <div className="flex items-center space-x-6 px-8 py-4 bg-black/60 rounded-3xl border-2 border-zinc-800">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_emerald]"></div>
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">Deployment_Ready: v2.5_STABLE</span>
                </div>
                
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !location}
                    className="w-full sm:w-auto min-w-[350px] flex items-center justify-center space-x-6 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-8 px-14 rounded-[2.5rem] shadow-4xl transition-all disabled:opacity-30 disabled:bg-zinc-800 active:scale-95 uppercase tracking-[0.4em] text-sm"
                >
                    {isGenerating ? <Loader className="w-7 h-7 animate-spin text-white"/> : <Broadcast className="w-7 h-7 text-white"/>}
                    <span>{isGenerating ? 'Synthesizing...' : 'Initialize_Deployment'}</span>
                </button>
            </div>
        </div>
    );
};


const HeroHub: React.FC<HeroHubProps> = ({
  onReturnToHub,
  missions,
  isLoadingMissions,
  hero,
  setHero,
  heroLocation,
  setHeroLocation,
  onGenerateNewMissions,
  onMintNft,
  reports,
  iapPacks,
  storeItems,
  onInitiateHCPurchase,
  onInitiateStoreItemPurchase,
  onAddHeroPersona,
  onDeleteHeroPersona,
  onEquipHeroPersona,
  onGenerateHeroBackstory,
  onNavigateToMissionDetail,
  onNavigate,
  activeTab,
  setActiveTab
}) => {
  const { t } = useTranslations();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMissions = async (preferences: { skillLevel: SkillLevel; categories: Category[]; location?: string; }) => {
    setIsGenerating(true);
    await onGenerateNewMissions(preferences);
    setIsGenerating(false);
  };

  const tabs = [
    { id: 'profile', label: 'Operative_Dossier', icon: UserCircle },
    { id: 'missions', label: 'Field_Log', icon: List },
    { id: 'training', label: 'Holodeck', icon: Monitor },
    { id: 'vault', label: 'Coin_Exchange', icon: Coins },
    { id: 'collection', label: 'Asset_Archive', icon: Package },
    { id: 'mint', label: 'Forge', icon: Gem },
    { id: 'store', label: 'Market', icon: Store },
  ];

  return (
    <div className="animate-fade-in text-white font-mono min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <button
          onClick={onReturnToHub}
          className="inline-flex items-center space-x-4 text-xs font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-cyan-400 transition-colors group"
        >
          <ArrowLeft className="w-7 h-7 transition-transform group-hover:-translate-x-2" />
          <span>Terminal_Return</span>
        </button>
        <div className="flex items-center space-x-6">
             <div className="p-4 bg-cyan-500/10 rounded-2xl border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Operative_Command</h1>
                <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mt-2">Personal_Operations_Terminal</p>
            </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto w-full">
        <div className="bg-zinc-900 border-4 border-zinc-800 rounded-3xl md:rounded-[3.5rem] p-1.5 flex items-center justify-start space-x-1.5 mb-16 overflow-x-auto no-scrollbar shadow-4xl backdrop-blur-xl sticky top-[6.5rem] z-[80]">
            {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                const TabIcon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => {
                            if (tab.id === 'briefing') {
                                onNavigate('liveIntelligence');
                            } else {
                                setActiveTab(tab.id as any)
                            }
                        }}
                        className={`flex-shrink-0 flex items-center justify-center space-x-3 md:space-x-4 px-5 py-2.5 md:px-10 md:py-6 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] rounded-2xl md:rounded-[2.5rem] transition-all duration-500 ${
                            isActive ? 'bg-cyan-600 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] border-t border-cyan-400/30 md:scale-105' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <TabIcon className="w-4 h-4 md:w-6 md:h-6" />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>

        <div className="animate-fade-in-fast relative h-full">
            {activeTab === 'profile' && (
              <HeroProfileTab 
                hero={hero} 
                setHero={setHero} 
                onNavigate={onNavigate}
                onAddHeroPersona={onAddHeroPersona}
                onDeleteHeroPersona={onDeleteHeroPersona}
                onEquipHeroPersona={onEquipHeroPersona}
                onGenerateBackstory={onGenerateHeroBackstory}
              />
            )}

            {activeTab === 'missions' && (
            <div className="space-y-16 max-w-[1400px] mx-auto pb-32">
              <DeploymentConsole onGenerate={handleGenerateMissions} isGenerating={isGenerating} location={heroLocation} setLocation={setHeroLocation} />

              <div className="space-y-20">
                {missions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-10">
                        {missions.map(m => {
                            const totalSteps = (m.reconActions?.length || 0) + (m.mainActions?.length || 0) || 1;
                            const currentIdx = m.status === 'completed' ? totalSteps : (m.currentActionIndex || 0);
                            const progressPercent = Math.round((currentIdx / totalSteps) * 100);

                            return (
                                <button 
                                    key={m.id}
                                    onClick={() => onNavigateToMissionDetail(m)}
                                    className={`w-full text-left bg-zinc-900 border-4 rounded-[4rem] p-12 transition-all duration-700 relative overflow-hidden group hover:shadow-4xl ${m.status === 'completed' ? 'border-emerald-900/30 opacity-60' : 'border-zinc-800 hover:border-cyan-500/50'}`}
                                >
                                    <div className="absolute top-0 left-0 w-2 h-full bg-cyan-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-center space-x-4 mb-6">
                                                <span className={`px-6 py-2 rounded-full border-2 text-[10px] font-black uppercase tracking-[0.3em] bg-black/60 ${m.status === 'completed' ? 'border-emerald-500/40 text-emerald-500' : 'border-cyan-500/40 text-cyan-400'}`}>
                                                    {m.status === 'completed' ? 'SYNC_COMPLETE' : 'ACTIVE_DIRECTIVE'}
                                                </span>
                                                <div className="flex items-center space-x-3 bg-zinc-950 px-4 py-2 rounded-2xl border-2 border-zinc-800">
                                                    <Target className="w-5 h-5 text-zinc-600" />
                                                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">RM_{m.id.split('-').pop()?.toUpperCase()}</span>
                                                </div>
                                            </div>
                                            <h4 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none mb-4">{m.title}</h4>
                                            <p className="text-base text-zinc-500 font-bold leading-relaxed line-clamp-2 italic border-l-4 border-zinc-800 pl-8 mb-6 group-hover:border-cyan-900 transition-colors">"{m.backstory}"</p>
                                            <div className="flex flex-wrap items-center gap-8">
                                                <span className="flex items-center space-x-3 text-sm font-black uppercase text-zinc-600"><Target className="w-6 h-6 text-cyan-500"/><span>{m.category}</span></span>
                                                <span className="flex items-center space-x-3 text-sm font-black uppercase text-zinc-600"><MapPin className="w-6 h-6 text-rose-500"/><span>{m.location || 'GLOBAL'}</span></span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-center lg:items-end gap-6 flex-shrink-0 w-full lg:w-auto">
                                            <div className="bg-black/60 p-8 rounded-[3rem] border-4 border-zinc-800 shadow-inner flex items-center space-x-10">
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Success_Index</p>
                                                    <p className="text-4xl font-black text-white leading-none tracking-tighter">{Math.round(m.successProbability * 100)}%</p>
                                                </div>
                                                <div className="w-px h-12 bg-zinc-800"></div>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Credits</p>
                                                    <div className="flex items-center space-x-3 text-3xl font-black text-amber-500">
                                                        <span>{m.finalReward.hc}</span><Coins className="w-7 h-7"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full max-w-[300px] flex items-center gap-4">
                                                <div className="flex-grow h-2 bg-zinc-950 rounded-full overflow-hidden border-2 border-zinc-800">
                                                    <div className={`h-full transition-all duration-1000 ${m.status === 'completed' ? 'bg-emerald-500' : 'bg-cyan-500'}`} style={{ width: `${progressPercent}%` }}></div>
                                                </div>
                                                <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">{progressPercent}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-40 text-center bg-zinc-900/20 border-4 border-dashed border-zinc-800 rounded-[5rem]">
                        <Box className="w-32 h-32 text-zinc-800 mx-auto mb-8 opacity-20" />
                        <h3 className="text-3xl font-black text-zinc-700 uppercase tracking-widest">No_Active_Missions</h3>
                    </div>
                )}
              </div>
            </div>
            )}

            {activeTab === 'collection' && <CollectionCodex reports={reports} hero={hero} onReturn={() => setActiveTab('missions')} />}
            {activeTab === 'mint' && <NftMintingStation hero={hero} setHero={setHero} onMintNft={onMintNft} reports={reports} />}
            {activeTab === 'store' && <StoreView hero={hero} iapPacks={iapPacks} storeItems={storeItems} onInitiateHCPurchase={onInitiateHCPurchase} onInitiateStoreItemPurchase={onInitiateStoreItemPurchase} onReturn={() => setActiveTab('missions')} isEmbedded />}
            {activeTab === 'vault' && <TacticalVault hero={hero} setHero={setHero} onReturn={() => setActiveTab('missions')} reports={reports} />}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 20px; }
      `}</style>
    </div>
  );
};

export default HeroHub;
