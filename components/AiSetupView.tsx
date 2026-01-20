
import React from 'react';
import { ArrowLeft, Sparkles, Database, Zap, ShieldCheck, Monitor, ArrowRight, Activity, Cpu, Lock } from './icons';

interface AiSetupViewProps {
  onReturn: () => void;
  onEnableOfflineMode: () => void;
}

const AiSetupView: React.FC<AiSetupViewProps> = ({ onReturn, onEnableOfflineMode }) => {
  return (
    <div className="animate-fade-in font-mono text-white max-w-5xl mx-auto px-4 pb-24 h-full flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full space-y-12 text-center">
        <header className="space-y-6">
            <div className="p-6 bg-cyan-500/10 rounded-full border border-cyan-500/20 inline-block animate-pulse">
                <Cpu className="w-16 h-16 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Neural_Sync_Required</h1>
            <p className="text-zinc-500 text-sm font-bold tracking-[0.4em] uppercase max-w-2xl mx-auto leading-relaxed">
                The terminal is currently operating without a verified Gemini Oracle neural link.
            </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            {/* OFFLINE OPTION */}
            <button 
                onClick={onEnableOfflineMode}
                className="group p-10 bg-zinc-900 border-2 border-zinc-800 rounded-[3rem] hover:border-cyan-500 transition-all shadow-2xl relative overflow-hidden flex flex-col"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Database className="w-32 h-32 text-cyan-400"/></div>
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 mb-8 group-hover:border-cyan-500/30 transition-colors inline-block w-fit">
                    <Database className="w-8 h-8 text-cyan-500" />
                </div>
                <div className="space-y-4 flex-grow">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Offline_Mode</h3>
                        <span className="bg-emerald-500 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase">Recommended</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
                        USE CACHED DPAL ARCHIVES. FAST PERFORMANCE, NO NEURAL LINK REQUIRED. IDEAL FOR TRAINING AND FIELD RECON.
                    </p>
                    <ul className="space-y-2 pt-4">
                        <li className="flex items-center space-x-2 text-[9px] font-black text-zinc-500 uppercase"><Check className="w-3 h-3 text-emerald-500"/> <span>Zero Latency Dispatches</span></li>
                        <li className="flex items-center space-x-2 text-[9px] font-black text-zinc-500 uppercase"><Check className="w-3 h-3 text-emerald-500"/> <span>100% Reliable Field Log</span></li>
                    </ul>
                </div>
                <div className="flex items-center space-x-3 text-cyan-500 font-black uppercase text-[10px] mt-10">
                    <span>ACTIVATE_LOCAL_BUFFER</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </button>

            {/* LIVE AI OPTION */}
            <div className="group p-10 bg-zinc-900/50 border-2 border-zinc-800 rounded-[3rem] relative overflow-hidden flex flex-col grayscale opacity-50">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Zap className="w-32 h-32 text-amber-500"/></div>
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 mb-8 inline-block w-fit">
                    <Zap className="w-8 h-8 text-zinc-600" />
                </div>
                <div className="space-y-4 flex-grow">
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-400">Live_Neural_Link</h3>
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                        REQUIRES SECURE SERVER-SIDE API KEY CONFIGURATION. PROVIDES REAL-TIME PATTERN SCANNING AND DYNAMIC SYNTHESIS.
                    </p>
                    <div className="bg-rose-950/20 p-4 rounded-xl border border-rose-900/30 mt-6">
                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest leading-relaxed">To enable Live AI, you must connect a secure server key, not a browser key. Production access pending deployment.</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3 text-zinc-700 font-black uppercase text-[10px] mt-10">
                    <span>ADMIN_SETUP_REQUIRED</span>
                    <Lock className="w-4 h-4" />
                </div>
            </div>
        </div>

        <div className="pt-10">
            <button
                onClick={onReturn}
                className="inline-flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Return_To_Home_Base</span>
            </button>
        </div>
      </div>
    </div>
  );
};

// Mini Lock Icon internal
const Check: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default AiSetupView;
