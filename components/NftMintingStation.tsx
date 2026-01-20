
import React, { useState, useMemo } from 'react';
import { useTranslations } from '../i18n';
import type { Hero, Category, Report, NftTheme, ArtifactTrait } from '../types';
import { CATEGORIES_WITH_ICONS, NFT_THEMES, FORGE_TRAITS } from '../constants';
/** FIX: Added missing FileText import from icons */
import { Gem, Coins, Loader, RefreshCw, Check, Sparkles, Box, Database, Target, Zap, ShieldCheck, ListFilter, FileText } from './icons';
import NftCard from './NftCard';
import { generateNftPromptIdeas } from '../services/geminiService';

interface NftMintingStationProps {
  hero: Hero;
  setHero: React.Dispatch<React.SetStateAction<Hero>>;
  onMintNft: (prompt: string, theme: NftTheme, dpalCategory: Category, extra?: any) => Promise<Report>;
  reports: Report[];
}

const NftMintingStation: React.FC<NftMintingStationProps> = ({ hero, setHero, onMintNft, reports }) => {
  const { t } = useTranslations();
  
  // Synthesis Lab State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [theme, setTheme] = useState<NftTheme | ''>('');
  const [dpalCategory, setDpalCategory] = useState<Category | ''>('');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  
  // Concept & Mint State
  const [concepts, setConcepts] = useState<string[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedReport, setMintedReport] = useState<Report | null>(null);
  const [isGeneratingConcept, setIsGeneratingConcept] = useState(false);

  const MINT_BASE_COST = 500;
  const traitsCost = useMemo(() => 
    selectedTraits.reduce((acc, tid) => acc + (FORGE_TRAITS.find(t => t.id === tid)?.cost || 0), 0)
  , [selectedTraits]);
  
  const totalCost = MINT_BASE_COST + traitsCost;
  const canAfford = hero.heroCredits >= totalCost;

  const authorityScore = useMemo(() => {
    const base = selectedMaterials.length * 10;
    const traitBonus = selectedTraits.reduce((acc, tid) => acc + (FORGE_TRAITS.find(t => t.id === tid)?.bonusValue || 0), 0);
    return Math.min(100, 30 + base + traitBonus);
  }, [selectedMaterials, selectedTraits]);

  const handleToggleMaterial = (id: string) => {
      setSelectedMaterials(prev => 
        prev.includes(id) ? prev.filter(mid => mid !== id) : prev.length < 3 ? [...prev, id] : prev
      );
  };

  const handleToggleTrait = (id: string) => {
      setSelectedTraits(prev => 
        prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
      );
  };

  const handleGenerateVisions = async () => {
    if (!theme || !dpalCategory) return;
    setIsGeneratingConcept(true);
    setConcepts([]);
    try {
      const newConcepts = await generateNftPromptIdeas(hero, theme, dpalCategory);
      setConcepts(newConcepts);
    } catch (e) {
      setConcepts(["Synaptic Echo Error", "Temporal Glimpse Failure", "Fragmented Reality"]);
    } finally {
      setIsGeneratingConcept(false);
    }
  };

  const handleFinalSynthesis = async () => {
    if (!selectedConcept || !canAfford || isMinting) return;
    setIsMinting(true);
    try {
      const newReport = await onMintNft(selectedConcept, theme as NftTheme, dpalCategory as Category, {
          authorityScore,
          traits: selectedTraits.map(tid => FORGE_TRAITS.find(t => t.id === tid)?.name),
          materials: selectedMaterials
      });
      setMintedReport(newReport);
    } catch (e) {
      console.error(e);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 font-mono relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.05),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20 animate-pulse"></div>

      <header className="text-center mb-16 relative z-10">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">{t('nftMintingStation.title')}</h2>
        <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">{t('nftMintingStation.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Left Column: Synthesis Steps */}
        <div className="lg:col-span-7 space-y-10">
            {/* Step Indicators */}
            <div className="flex items-center space-x-4 mb-8">
                {[1, 2, 3].map(s => (
                    <button 
                        key={s} 
                        onClick={() => s < step && setStep(s as any)}
                        className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-cyan-500 shadow-[0_0_10px_cyan]' : 'bg-zinc-800'}`}
                    />
                ))}
            </div>

            {step === 1 && (
                <div className="space-y-8 animate-fade-in">
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase text-zinc-500 tracking-widest flex items-center space-x-2">
                            <Database className="w-4 h-4 text-cyan-500"/><span>Ingest_Data_Fragments ({selectedMaterials.length}/3)</span>
                        </label>
                        <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {reports.filter(r => r.isAuthor).map(report => (
                                <button 
                                    key={report.id}
                                    onClick={() => handleToggleMaterial(report.id)}
                                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                                        selectedMaterials.includes(report.id) ? 'bg-cyan-950/20 border-cyan-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                    }`}
                                >
                                    <div className="flex items-center space-x-4 truncate">
                                        <div className="p-2 bg-zinc-950 rounded-lg"><FileText className="w-4 h-4"/></div>
                                        <span className="text-xs font-black uppercase truncate">{report.title}</span>
                                    </div>
                                    {selectedMaterials.includes(report.id) && <Check className="w-4 h-4 text-cyan-400" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Neural_Framework</label>
                            <select 
                                value={theme} 
                                onChange={(e) => setTheme(e.target.value as NftTheme)}
                                className="w-full bg-zinc-900 border-2 border-zinc-800 p-4 rounded-2xl text-xs font-black uppercase tracking-tight text-white focus:border-cyan-500 outline-none cursor-pointer hover:bg-zinc-850 transition-colors"
                            >
                                <option value="">[SELECT_FRAMEWORK]</option>
                                {NFT_THEMES.map(t => <option key={t.value} value={t.value}>{t.label.toUpperCase()} PROTOCOL</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Ledger_Domain</label>
                            <select 
                                value={dpalCategory} 
                                onChange={(e) => setDpalCategory(e.target.value as Category)}
                                className="w-full bg-zinc-900 border-2 border-zinc-800 p-4 rounded-2xl text-xs font-black uppercase tracking-tight text-white focus:border-cyan-500 outline-none cursor-pointer hover:bg-zinc-850 transition-colors"
                            >
                                <option value="">[SELECT_DOMAIN]</option>
                                {CATEGORIES_WITH_ICONS.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
                            </select>
                        </div>
                    </div>

                    <button 
                        disabled={!theme || !dpalCategory}
                        onClick={() => { setStep(2); handleGenerateVisions(); }}
                        className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-xs shadow-2xl active:scale-95 transition-all disabled:opacity-20"
                    >
                        Initialize_Interpretation
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8 animate-fade-in">
                    <label className="text-xs font-black uppercase text-zinc-500 tracking-widest flex items-center space-x-2">
                        <Target className="w-4 h-4 text-cyan-500"/><span>Oracle_Interpretations</span>
                    </label>
                    
                    <div className="space-y-3">
                        {isGeneratingConcept ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <Loader className="w-10 h-10 animate-spin text-cyan-500" />
                                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest animate-pulse">Filtering_Synaptic_Noise...</p>
                            </div>
                        ) : (
                            concepts.map((concept, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setSelectedConcept(concept)}
                                    className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all group ${
                                        selectedConcept === concept ? 'bg-cyan-950/20 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                                    }`}
                                >
                                    <p className={`text-sm italic font-medium leading-relaxed ${selectedConcept === concept ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>"{concept}"</p>
                                </button>
                            ))
                        )}
                    </div>

                    <div className="flex space-x-4">
                        <button onClick={() => setStep(1)} className="px-10 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all">Back</button>
                        <button 
                            disabled={!selectedConcept}
                            onClick={() => setStep(3)}
                            className="flex-grow bg-white text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-xs shadow-2xl transition-all disabled:opacity-20"
                        >
                            Configure_Traits
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-10 animate-fade-in">
                    <div className="space-y-6">
                        <label className="text-xs font-black uppercase text-zinc-500 tracking-widest flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-cyan-500"/><span>Trait_Infusion_Modules</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {FORGE_TRAITS.map(trait => (
                                <button 
                                    key={trait.id}
                                    onClick={() => handleToggleTrait(trait.id)}
                                    className={`p-5 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${
                                        selectedTraits.includes(trait.id) ? 'bg-cyan-950/20 border-cyan-500' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-black uppercase text-sm tracking-tighter text-white">{trait.name}</h4>
                                        <div className="flex items-center space-x-1 text-yellow-500 font-black text-[10px]">
                                            <span>{trait.cost}</span><Coins className="w-3 h-3"/>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 leading-relaxed font-bold">{trait.description}</p>
                                    <div className="mt-4 text-[8px] font-black uppercase text-cyan-500/80">+{trait.bonusValue} {trait.bonusType}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-zinc-900 border-2 border-zinc-800 rounded-[2.5rem] p-10 space-y-10">
                         <div className="flex justify-between items-end border-b border-zinc-800 pb-8 gap-4">
                            <div className="min-w-0">
                                <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] mb-4">Verification_Authority</h3>
                                <div className="flex items-end space-x-4">
                                    <span className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">{authorityScore}</span>
                                    <span className="text-lg md:text-xl font-black text-emerald-500 mb-1">/ 100</span>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total_Cost</p>
                                <div className="flex items-center justify-end space-x-3 text-2xl md:text-3xl font-black text-yellow-500">
                                    <span>{totalCost}</span><Coins className="w-6 h-6"/>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Resonance_Sync</span>
                                <span className="text-[8px] font-black text-cyan-500">74%</span>
                            </div>
                            <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                                <div className="h-full bg-cyan-600 shadow-[0_0_10px_cyan]" style={{width: '74%'}}></div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                            <button onClick={() => setStep(2)} className="w-full sm:w-auto px-10 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all">Back</button>
                            <button 
                                onClick={handleFinalSynthesis}
                                disabled={isMinting || !canAfford}
                                className="flex-grow bg-cyan-600 hover:bg-cyan-500 text-white font-black py-6 rounded-2xl uppercase tracking-[0.3em] text-xs shadow-2xl active:scale-95 transition-all disabled:bg-zinc-800 disabled:text-zinc-600"
                            >
                                {isMinting ? <Loader className="w-5 h-5 animate-spin mx-auto"/> : t('nftMintingStation.generateVisionsButton')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Right Column: Schematic & Result */}
        <div className="lg:col-span-5 h-full min-h-[500px] flex flex-col">
            <div className="flex-grow bg-black rounded-[3rem] border-4 border-zinc-900 shadow-2xl relative overflow-hidden group p-8 flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)] animate-pulse"></div>
                
                {isMinting ? (
                    <div className="text-center space-y-6 relative z-10 animate-fade-in">
                        <div className="w-32 h-32 bg-zinc-950 rounded-[3rem] border-2 border-cyan-500/50 flex items-center justify-center relative shadow-[0_0_40px_rgba(6,182,212,0.2)] mx-auto">
                            <RefreshCw className="w-16 h-16 text-cyan-500 animate-spin" />
                            <div className="absolute inset-0 bg-cyan-500/5 rounded-[3rem] animate-ping"></div>
                        </div>
                        <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] animate-pulse">{t('nftMintingStation.generating')}</p>
                    </div>
                ) : mintedReport ? (
                    <div className="w-full animate-fade-in space-y-8">
                        <div className="flex items-center justify-center space-x-3">
                            <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            <h3 className="text-xl font-black text-emerald-400 uppercase tracking-tighter">Synthesis_Complete</h3>
                        </div>
                        <div className="max-w-[280px] mx-auto">
                            <NftCard report={mintedReport} />
                        </div>
                        <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 text-center">
                            <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Block_Height</p>
                            <p className="text-sm font-mono text-cyan-600">#{Math.floor(Math.random() * 100000) + 6843000}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-10 relative z-10 p-10 transition-all duration-700">
                         <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500/10 blur-3xl animate-pulse"></div>
                            <Gem className={`w-32 h-32 mx-auto transition-all duration-1000 ${step > 1 ? 'text-cyan-400 drop-shadow-[0_0_20px_cyan] scale-110' : 'text-zinc-900'}`} />
                         </div>
                         
                         <div className="space-y-4">
                            <h3 className="text-xl font-black uppercase text-zinc-700 tracking-tighter">Lab_Status: READY</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {[1,2,3].map(i => (
                                    <div key={i} className={`h-1.5 rounded-full ${step >= i ? 'bg-cyan-600' : 'bg-zinc-900'}`}/>
                                ))}
                            </div>
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed max-w-[20ch] mx-auto">
                                Feed raw evidence fragments into the neural loop to synthesize artifacts.
                            </p>
                         </div>
                    </div>
                )}
            </div>

            {/* Schematic Overlay (Mini) */}
            {!mintedReport && (
                <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Synthesis_Blueprint</span>
                        <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                            <div className="w-1 h-1 bg-cyan-500 rounded-full opacity-50"></div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-zinc-600">FRAMEWORK:</span>
                            <span className="text-cyan-500 truncate ml-4 text-right">{(NFT_THEMES.find(t => t.value === theme)?.label || '[PENDING]').toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-zinc-600">DATA_FRAGS:</span>
                            <span className="text-white">{selectedMaterials.length} Shards</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-zinc-600">INFUSIONS:</span>
                            <span className="text-white">{selectedTraits.length} Active</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default NftMintingStation;
