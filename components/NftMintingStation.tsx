import React, { useState, useMemo, useEffect } from 'react';
import { Category, type Hero, type Report, type NftTheme } from '../types';
import { FORGE_TRAITS, NFT_THEMES } from '../constants';
// FIX: Added missing icon imports: User, Monitor, ArrowLeft
import { Gem, Coins, Loader, Check, Sparkles, Database, Target, Zap, ShieldCheck, FileText, ArrowRight, RefreshCw, X, Broadcast, Activity, Box, Fingerprint, Activity as ActivityIcon, User, Monitor, ArrowLeft } from './icons';
import NftCard from './NftCard';
import { generateNftPromptIdeas } from '../services/geminiService';

interface NftMintingStationProps {
  hero: Hero;
  setHero: React.Dispatch<React.SetStateAction<Hero>>;
  onMintNft: (prompt: string, theme: NftTheme, dpalCategory: Category, extra?: any) => Promise<Report>;
  reports: Report[];
}

type ForgeStep = 'FRAMEWORK' | 'INFERENCE' | 'AUGMENT' | 'FORGING' | 'SUCCESS';

const NftMintingStation: React.FC<NftMintingStationProps> = ({ hero, setHero }) => {
  const [activeStep, setActiveStep] = useState<ForgeStep>('FRAMEWORK');
  const [theme, setTheme] = useState<NftTheme | ''>('');
  const [dpalCategory, setDpalCategory] = useState<Category | ''>('');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [isSyncingConcepts, setIsSyncingConcepts] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedReport, setMintedReport] = useState<Report | null>(null);

  const MINT_BASE_COST = 500;
  const traitsCost = useMemo(() => 
    selectedTraits.reduce((acc, tid) => acc + (FORGE_TRAITS.find(t => t.id === tid)?.cost || 0), 0)
  , [selectedTraits]);
  
  const totalCost = MINT_BASE_COST + traitsCost;
  const canAfford = hero.heroCredits >= totalCost;

  // Handle concept generation from Gemini
  const syncOracleVisions = async () => {
    if (!theme || !dpalCategory) return;
    setIsSyncingConcepts(true);
    try {
        const ideas = await generateNftPromptIdeas(hero, theme as NftTheme, dpalCategory as Category);
        setConcepts(ideas);
        setActiveStep('INFERENCE');
    } catch (e) {
        alert("Neural link unstable. Retrying handshake...");
    } finally {
        setIsSyncingConcepts(false);
    }
  };

  const handleFinalSynthesis = async () => {
    if (!selectedConcept || !canAfford || isMinting) return;
    
    console.log("[FORGE] Initializing Ledger Commit...");
    setIsMinting(true);
    setActiveStep('FORGING');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); 

    try {
      const timestamp = Date.now();
      const nonce = Math.random().toString(36).substring(2, 15);
      const idempotencyKey = `mint-${hero.operativeId}-${timestamp}-${nonce}`;

      const body = {
        userId: hero.operativeId,
        prompt: selectedConcept,
        theme: theme,
        category: dpalCategory,
        priceCredits: totalCost,
        idempotencyKey,
        nonce,
        timestamp,
        traits: selectedTraits.map(tid => ({
          trait_type: 'Module',
          value: FORGE_TRAITS.find(t => t.id === tid)?.name
        })),
        metadata: {
            operativeId: hero.operativeId,
            rank: hero.rank,
            generation: "GENESIS_01"
        }
      };

      const apiBase = (import.meta as any).env?.VITE_API_BASE || 'https://dpal-backend.up.railway.app';
      
      const response = await fetch(`${apiBase}/api/nft/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`CRITICAL_NETWORK_FAILURE: ${text.substring(0, 200)}`);
      }

      const receipt = await response.json();
      if (!response.ok) throw new Error(receipt.message || `MINT_REJECTED (${response.status})`);

      console.log("[FORGE] Ledger Success:", receipt);

      // Update Credits
      setHero(prev => ({
          ...prev,
          heroCredits: prev.heroCredits - (receipt.priceCredits || totalCost)
      }));

      // Materialize Report for Display
      const finalReport: Report = {
          id: receipt.tokenId,
          title: selectedConcept,
          description: `Cryptographic Shard #G1 materialized via Gemini Oracle. Theme: ${theme}. Index: ${receipt.tokenId}`,
          category: dpalCategory as Category,
          location: 'Vanguard_Ledger_Forge',
          timestamp: new Date(),
          hash: receipt.txHash,
          blockchainRef: receipt.txHash,
          status: 'Resolved',
          trustScore: 100,
          severity: 'Standard',
          isActionable: false,
          earnedNft: {
              source: 'minted',
              title: selectedConcept,
              imageUrl: receipt.imageUrl, 
              mintCategory: dpalCategory as Category,
              blockNumber: 6843021,
              txHash: receipt.txHash,
              rarity: 'Rare' as any,
              grade: 'S'
          }
      };

      setMintedReport(finalReport);
      setActiveStep('SUCCESS');
      
    } catch (e: any) {
      clearTimeout(timeoutId);
      console.error("[FORGE_ERR]", e);
      setActiveStep('AUGMENT'); // Return to last stable state
      if (e.name === 'AbortError') {
        alert("Synthesis Timed Out (60s). Check terminal logs.");
      } else {
        alert(e.message || "Synthesis disrupted. Recalibrate neural link.");
      }
    } finally {
      setIsMinting(false);
    }
  };

  const resetForge = () => {
    setActiveStep('FRAMEWORK');
    setTheme('');
    setDpalCategory('');
    setSelectedTraits([]);
    setSelectedConcept(null);
    setConcepts([]);
    setMintedReport(null);
  };

  return (
    <div className="bg-black border border-zinc-800 rounded-[3rem] p-8 md:p-16 font-mono relative overflow-hidden min-h-[850px] flex flex-col">
      <style>{`
        .forge-grid { background-image: radial-gradient(#22d3ee 1px, transparent 1px); background-size: 30px 30px; opacity: 0.03; }
        .scan-y { animation: scan-v 4s linear infinite; }
        @keyframes scan-v { 0% { top: 0; } 100% { top: 100%; } }
        .materialize { animation: materialize-anim 2s ease-out forwards; }
        @keyframes materialize-anim { 
            0% { filter: blur(20px) brightness(3); transform: scale(0.9); opacity: 0; } 
            100% { filter: blur(0) brightness(1); transform: scale(1); opacity: 1; } 
        }
        .pulse-border { animation: p-border 2s infinite alternate; }
        @keyframes p-border { from { border-color: #27272a; } to { border-color: #06b6d4; } }
      `}</style>

      <div className="absolute inset-0 forge-grid pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.05),transparent_50%)] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20 scan-y z-50 pointer-events-none"></div>

      {/* HEADER SECTION */}
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div className="flex items-center space-x-6">
              <div className="p-4 bg-cyan-950/40 rounded-3xl border-2 border-cyan-500/30 shadow-2xl">
                  <Gem className="w-10 h-10 text-cyan-400 animate-pulse" />
              </div>
              <div>
                  <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">Genesis_Forge</h1>
                  <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                      <ActivityIcon className="w-3 h-3"/> Protocol: v2.5_Materialization_Stable
                  </p>
              </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl flex items-center space-x-6 shadow-inner">
               <div className="text-right">
                   <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Resource_Link</p>
                   <div className="flex items-center space-x-2 text-xl font-black text-amber-500 tracking-tighter">
                       <span>{hero.heroCredits.toLocaleString()}</span>
                       <Coins className="w-5 h-5"/>
                   </div>
               </div>
               <div className="w-px h-10 bg-zinc-800"></div>
               <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800">
                    <User className="w-6 h-6 text-zinc-700" />
               </div>
          </div>
      </header>

      {/* PROGRESS TRACKER */}
      <div className="relative z-10 flex items-center justify-center space-x-8 mb-16">
          {[
              { id: 'FRAMEWORK', icon: <Box />, label: 'Setup' },
              { id: 'INFERENCE', icon: <Sparkles />, label: 'Vision' },
              { id: 'AUGMENT', icon: <Zap />, label: 'Augment' },
              { id: 'FORGING', icon: <Loader />, label: 'Commit' }
          ].map((s, idx) => {
              const isActive = activeStep === s.id;
              const isPast = ['FRAMEWORK', 'INFERENCE', 'AUGMENT', 'FORGING'].indexOf(activeStep) > idx;
              return (
                  <div key={s.id} className="flex items-center space-x-4 group">
                      <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                          isActive ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_20px_cyan]' :
                          isPast ? 'bg-emerald-950 border-emerald-500 text-emerald-500' :
                          'bg-zinc-900 border-zinc-800 text-zinc-700'
                      }`}>
                          {isPast ? <Check className="w-6 h-6"/> : React.cloneElement(s.icon as React.ReactElement, { className: "w-6 h-6" })}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest hidden md:block ${isActive ? 'text-white' : 'text-zinc-700'}`}>{s.label}</span>
                      {idx < 3 && <div className={`w-12 h-0.5 rounded-full ${isPast ? 'bg-emerald-500' : 'bg-zinc-900'}`}></div>}
                  </div>
              )
          })}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow relative z-10 flex flex-col">
          {activeStep === 'FRAMEWORK' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
                  <div className="lg:col-span-7 space-y-12">
                      <div className="space-y-4">
                          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Initialize_Parameters</h2>
                          <p className="text-sm text-zinc-500 font-bold uppercase leading-relaxed max-w-xl">Select the core framework and sector node for the artifact materialization process.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-4 flex items-center gap-2"><Monitor className="w-3 h-3"/>Neural_Framework</label>
                              <select 
                                value={theme} 
                                onChange={e => setTheme(e.target.value as NftTheme)}
                                className="w-full bg-zinc-900 border-2 border-zinc-800 p-6 rounded-3xl text-sm font-black uppercase text-white focus:border-cyan-500 outline-none transition-all shadow-inner appearance-none"
                              >
                                  <option value="">[SELECT_FRAMEWORK]</option>
                                  {NFT_THEMES.map(t => <option key={t.value} value={t.value}>{t.label.toUpperCase()}</option>)}
                              </select>
                          </div>
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-4 flex items-center gap-2"><Database className="w-3 h-3"/>Sector_Node</label>
                              <select 
                                value={dpalCategory} 
                                onChange={e => setDpalCategory(e.target.value as Category)}
                                className="w-full bg-zinc-900 border-2 border-zinc-800 p-6 rounded-3xl text-sm font-black uppercase text-white focus:border-cyan-500 outline-none transition-all shadow-inner appearance-none"
                              >
                                  <option value="">[SELECT_DOMAIN]</option>
                                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                          </div>
                      </div>

                      <button 
                        onClick={syncOracleVisions}
                        disabled={!theme || !dpalCategory || isSyncingConcepts}
                        className="w-full bg-white text-black font-black py-8 rounded-[2.5rem] uppercase tracking-[0.4em] text-xs shadow-4xl active:scale-95 disabled:opacity-20 transition-all flex items-center justify-center space-x-6 group border-b-8 border-zinc-300"
                      >
                        {isSyncingConcepts ? <Loader className="w-8 h-8 animate-spin" /> : <Sparkles className="w-8 h-8 text-cyan-600 transition-transform group-hover:scale-125"/>}
                        <span>Initialize_Oracle_Link</span>
                      </button>
                  </div>
                  <div className="lg:col-span-5 flex items-center justify-center bg-zinc-950 border-4 border-zinc-900 rounded-[5rem] p-12 text-center shadow-inner group transition-all duration-700 hover:border-zinc-800">
                       <div className="space-y-8 relative">
                           <div className="absolute -inset-10 bg-cyan-500/5 blur-[80px] rounded-full animate-pulse"></div>
                           <Target className="w-32 h-32 text-zinc-900 group-hover:text-zinc-800 transition-colors mx-auto" />
                           <div className="space-y-2">
                               <p className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.4em] group-hover:text-zinc-600 transition-colors">Awaiting_Hardware_Handshake</p>
                           </div>
                       </div>
                  </div>
              </div>
          )}

          {activeStep === 'INFERENCE' && (
              <div className="max-w-4xl mx-auto space-y-12 animate-fade-in w-full flex flex-col flex-grow">
                  <div className="text-center space-y-4">
                      <h2 className="text-4xl font-black uppercase tracking-tighter text-white">The_Oracle_Visions</h2>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.4em]">Decoded conceptual dispatches for the chosen sector</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
                      {concepts.map((c, i) => (
                          <button 
                            key={i} 
                            onClick={() => { setSelectedConcept(c); setActiveStep('AUGMENT'); }}
                            className="group relative flex flex-col p-10 bg-zinc-900 border-2 border-zinc-800 rounded-[3.5rem] hover:border-cyan-500 transition-all text-left overflow-hidden shadow-2xl active:scale-95"
                          >
                              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Fingerprint className="w-20 h-20 text-cyan-400"/></div>
                              <div className="mb-8 p-4 bg-zinc-950 rounded-2xl border border-zinc-800 group-hover:border-cyan-900 transition-colors inline-block w-fit">
                                  <Sparkles className="w-6 h-6 text-zinc-700 group-hover:text-cyan-400" />
                              </div>
                              <p className="text-xl font-black text-white uppercase leading-tight flex-grow group-hover:text-cyan-100 transition-colors italic">"{c}"</p>
                              <div className="mt-8 flex items-center space-x-3 text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-cyan-600 transition-colors">
                                  <span>Sync_Concept</span>
                                  <ArrowRight className="w-3 h-3" />
                              </div>
                          </button>
                      ))}
                  </div>

                  <button onClick={() => setActiveStep('FRAMEWORK')} className="text-[10px] font-black text-zinc-700 hover:text-white transition-colors uppercase tracking-[0.4em] mx-auto flex items-center space-x-2"><RefreshCw className="w-4 h-4"/> <span>Re-Initialize_Handshake</span></button>
              </div>
          )}

          {activeStep === 'AUGMENT' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
                  <div className="lg:col-span-7 space-y-12">
                      <div className="space-y-4">
                           <div className="flex items-center space-x-4 mb-4">
                                <button onClick={() => setActiveStep('INFERENCE')} className="p-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 rounded-xl transition-all border border-zinc-800"><ArrowLeft className="w-4 h-4"/></button>
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-950 px-4 py-1.5 rounded-full border border-zinc-900">Current_Vision: {selectedConcept?.substring(0,20)}...</span>
                           </div>
                           <h2 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">Augment_Metadata</h2>
                           <p className="text-sm text-zinc-500 font-bold uppercase leading-relaxed max-w-xl italic border-l-4 border-cyan-500 pl-6">
                               "Enhance the integrity and visual fidelity of the artifact with cryptographic modules."
                           </p>
                      </div>

                      <div className="space-y-6">
                           <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-4">Available_Modules</label>
                           <div className="grid grid-cols-1 gap-4">
                                {FORGE_TRAITS.map(trait => {
                                    const isSelected = selectedTraits.includes(trait.id);
                                    return (
                                        <button 
                                            key={trait.id}
                                            onClick={() => setSelectedTraits(prev => isSelected ? prev.filter(id => id !== trait.id) : [...prev, trait.id])}
                                            className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group shadow-xl ${isSelected ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                                        >
                                            <div className="flex items-center space-x-6 text-left">
                                                <div className={`p-4 rounded-2xl transition-colors ${isSelected ? 'bg-cyan-500 text-black' : 'bg-zinc-900 text-zinc-700'}`}>
                                                    <Zap className="w-5 h-5"/>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black uppercase tracking-tight">{trait.name}</h4>
                                                    <p className="text-[10px] font-bold text-zinc-600 uppercase">{trait.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                     <p className="text-[10px] font-black text-amber-500">{trait.cost} HC</p>
                                                     <p className="text-[7px] text-zinc-700 uppercase font-black tracking-widest">{trait.bonusType} +{trait.bonusValue}%</p>
                                                </div>
                                                {isSelected && <Check className="w-5 h-5 text-emerald-500" />}
                                            </div>
                                        </button>
                                    );
                                })}
                           </div>
                      </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col">
                       <div className="bg-zinc-900 border-4 border-zinc-800 rounded-[4rem] p-10 flex-grow flex flex-col justify-between shadow-3xl relative overflow-hidden">
                           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02),transparent_70%)] pointer-events-none"></div>
                           <div className="space-y-8 relative z-10">
                               <div className="flex justify-between items-center px-4">
                                   <h3 className="text-xs font-black uppercase text-white tracking-[0.4em]">Dispatch_Summary</h3>
                                   <span className="text-[8px] font-black bg-emerald-950/40 text-emerald-500 px-3 py-1 rounded-full border border-emerald-900/50">PRE_COMMIT_STABLE</span>
                               </div>
                               <div className="space-y-4">
                                   <div className="p-5 bg-black/60 rounded-2xl border border-zinc-800 flex justify-between items-center">
                                       <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Base_Artifact</span>
                                       <span className="text-[10px] font-black text-white">{MINT_BASE_COST} HC</span>
                                   </div>
                                   <div className="p-5 bg-black/60 rounded-2xl border border-zinc-800 flex justify-between items-center">
                                       <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Modules ({selectedTraits.length})</span>
                                       <span className="text-[10px] font-black text-white">{traitsCost} HC</span>
                                   </div>
                                   <div className="pt-6 border-t-2 border-zinc-800 border-dashed flex justify-between items-end">
                                       <span className="text-sm font-black text-zinc-500 uppercase tracking-[0.4em]">Total_Commitment</span>
                                       <div className="flex items-center space-x-3 text-3xl font-black text-amber-500 tracking-tighter">
                                           <span>{totalCost}</span><Coins className="w-8 h-8"/>
                                       </div>
                                   </div>
                               </div>
                           </div>

                           <div className="relative z-10 pt-10">
                               <button 
                                    onClick={handleFinalSynthesis}
                                    disabled={!canAfford || isMinting}
                                    className={`w-full py-8 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-sm shadow-4xl active:scale-95 transition-all flex items-center justify-center space-x-6 border-b-8 ${canAfford ? 'bg-cyan-600 hover:bg-cyan-500 border-cyan-800 text-white' : 'bg-zinc-800 border-zinc-900 text-zinc-600 cursor-not-allowed'}`}
                                >
                                    {isMinting ? <Loader className="w-8 h-8 animate-spin"/> : <Gem className="w-8 h-8 text-white"/>}
                                    <span>{canAfford ? 'Materialize_Shard' : 'Insufficient_Credits'}</span>
                                </button>
                                {!canAfford && <p className="text-[8px] text-rose-500 text-center mt-4 font-black uppercase tracking-widest">Protocol Rejected: Additional HeroCredits Required</p>}
                           </div>
                       </div>
                  </div>
              </div>
          )}

          {activeStep === 'FORGING' && (
              <div className="flex-grow flex flex-col items-center justify-center py-20 animate-fade-in relative">
                  <div className="relative">
                      <div className="absolute -inset-20 bg-cyan-500/10 blur-[100px] animate-pulse"></div>
                      <Loader className="w-48 h-48 text-cyan-500 animate-spin-slow relative z-10" />
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                          <Gem className="w-12 h-12 text-white animate-bounce" />
                      </div>
                  </div>
                  <div className="mt-16 text-center space-y-6">
                      <h3 className="text-4xl font-black uppercase tracking-tighter text-white">Forging_Eternal_Truth</h3>
                      <p className="text-sm font-black text-cyan-500 uppercase tracking-[0.6em] animate-pulse">Synchronizing_With_Railway_Node</p>
                      <div className="w-72 h-1 bg-zinc-900 rounded-full mx-auto overflow-hidden border border-zinc-800 p-0.5">
                          <div className="h-full bg-cyan-500 shadow-[0_0_20px_cyan] animate-[loading-bar_60s_linear_forwards] rounded-full"></div>
                      </div>
                  </div>
              </div>
          )}

          {activeStep === 'SUCCESS' && mintedReport && (
              <div className="flex-grow flex flex-col items-center justify-center py-10 animate-fade-in w-full materialize">
                  <div className="flex flex-col items-center space-y-12 max-w-4xl w-full">
                      <div className="text-center space-y-4">
                          <div className="inline-flex items-center space-x-4 bg-emerald-500/20 border border-emerald-500/30 px-8 py-3 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.2)] mb-4">
                              <ShieldCheck className="w-6 h-6 text-emerald-400" />
                              <span className="text-sm font-black text-emerald-400 uppercase tracking-[0.4em]">Materialization_Confirmed</span>
                          </div>
                          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">Artifact_Secured</h2>
                      </div>

                      <div className="relative group w-full max-w-md">
                          <div className="absolute -inset-16 bg-cyan-500/10 blur-[100px] animate-pulse rounded-full pointer-events-none"></div>
                          <div className="transform transition-transform duration-1000 hover:scale-105">
                              <NftCard report={mintedReport} />
                          </div>
                      </div>

                      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/60 p-10 rounded-[3.5rem] border border-zinc-800 shadow-3xl">
                          <div className="space-y-2">
                              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Token_Identifier</p>
                              <p className="text-sm font-black text-white truncate">{mintedReport.id}</p>
                          </div>
                          <div className="space-y-2">
                              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Ledger_Hash</p>
                              <p className="text-sm font-black text-emerald-500 truncate">{mintedReport.hash}</p>
                          </div>
                          <div className="col-span-full pt-6 border-t border-zinc-800 flex justify-between items-center">
                              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Permanent_Index_Sealed</p>
                              <div className="flex items-center space-x-3 text-cyan-500">
                                  <ShieldCheck className="w-4 h-4"/>
                                  <span className="text-[9px] font-black uppercase tracking-widest">GENESIS_01_LOCKED</span>
                              </div>
                          </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl">
                          <button 
                            onClick={resetForge}
                            className="flex-1 bg-white hover:bg-cyan-50 text-black font-black py-6 rounded-2xl uppercase tracking-[0.3em] text-xs shadow-4xl active:scale-95 transition-all"
                          >
                            Return_To_Forge
                          </button>
                          <button 
                            onClick={() => (window as any).aistudio?.onNavigate?.('hub', undefined, 'my_reports')}
                            className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-black py-6 rounded-2xl border border-zinc-800 uppercase tracking-[0.3em] text-xs shadow-xl active:scale-95 transition-all"
                          >
                            View_Ledger_Archive
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>

      {/* FOOTER METRICS */}
      {activeStep !== 'SUCCESS' && (
          <footer className="relative z-10 mt-16 pt-10 border-t border-zinc-900 flex flex-wrap justify-between items-center gap-8 opacity-60">
              <div className="flex items-center space-x-8">
                  <div className="space-y-1">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">System_Stability</p>
                      <div className="flex items-center space-x-2 text-[10px] font-black text-emerald-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span>OPTIMAL</span>
                      </div>
                  </div>
                  <div className="space-y-1">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Network_Throughput</p>
                      <p className="text-[10px] font-black text-white">482 TX/S</p>
                  </div>
              </div>
              <div className="flex items-center space-x-4 bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-900 shadow-inner">
                   <ShieldCheck className="w-4 h-4 text-cyan-500/50" />
                   <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em]">Encrypted_Neural_Pathway_Active</span>
              </div>
          </footer>
      )}
    </div>
  );
};

export default NftMintingStation;
