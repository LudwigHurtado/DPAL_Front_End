
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Monitor, Zap, Loader, ShieldCheck, Broadcast, Activity, Coins, RefreshCw, X, Play, Square, Sparkles, CheckCircle } from './icons';

interface SustainmentCenterProps {
    onReturn: () => void;
    onReward: (hc: number) => void;
}

const SustainmentCenter: React.FC<SustainmentCenterProps> = ({ onReturn, onReward }) => {
    const [isWatching, setIsWatching] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'IDLE' | 'TRANSMITTING' | 'COMPLETE'>('IDLE');
    const [watchCount, setWatchCount] = useState(0);
    const [currentChannel, setCurrentChannel] = useState('AD_NODE_ALPHA_4');

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (isWatching) {
            timer = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        handleFinish();
                        return 100;
                    }
                    return prev + 1;
                });
            }, 150); // ~15 seconds per supportive briefing
        }
        return () => clearInterval(timer);
    }, [isWatching]);

    const handleStart = () => {
        setIsWatching(true);
        setStatus('TRANSMITTING');
        setProgress(0);
    };

    const handleFinish = () => {
        setIsWatching(false);
        setStatus('COMPLETE');
        setWatchCount(prev => prev + 1);
        onReward(25);
        setTimeout(() => setStatus('IDLE'), 4000);
    };

    return (
        <div className="bg-zinc-950 text-white min-h-[85vh] rounded-[3.5rem] border-2 border-zinc-800 shadow-2xl animate-fade-in font-mono overflow-hidden flex flex-col relative">
            <style>{`
                @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
                .scanline { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); background-size: 100% 4px, 3px 100%; pointer-events: none; z-index: 20; opacity: 0.2; }
                .noise { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.03; pointer-events: none; background-image: url('https://media.giphy.com/media/oEI9uWUicG7v2/giphy.gif'); z-index: 10; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
                @keyframes loading-bar { 0% { width: 0; } 100% { width: 100%; } }
                .animate-loading-bar { animation: loading-bar 15s linear forwards; }
            `}</style>

            <header className="bg-zinc-900 border-b-2 border-zinc-800 px-10 py-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 z-30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-500/20"></div>
                <div className="flex items-center space-x-6">
                    <div className="p-5 bg-purple-500/10 rounded-3xl border border-purple-500/30 shadow-xl">
                        <Monitor className="w-10 h-10 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Sustainment_Terminal</h1>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] mt-2">Active Infrastructure Support Channel</p>
                    </div>
                </div>
                <button onClick={onReturn} className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-purple-400 transition-colors group bg-black/60 px-6 py-3 rounded-2xl border border-zinc-800">
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
                    <span>Terminate_Sync</span>
                </button>
            </header>

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-black p-8 lg:p-12 gap-12">
                {/* Left: THE BROADCAST FEED PLAYER */}
                <section className="lg:col-span-8 flex flex-col space-y-8 min-h-[400px]">
                    <div className="relative flex-grow bg-zinc-950 border-4 border-zinc-900 rounded-[4rem] overflow-hidden group shadow-[inset_0_0_100px_rgba(0,0,0,1)]">
                        <div className="scanline"></div>
                        <div className="noise"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05),transparent_80%)]"></div>
                        
                        {status === 'TRANSMITTING' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-12 z-10 animate-fade-in">
                                <div className="relative">
                                    <div className="absolute -inset-20 bg-purple-500/10 blur-[80px] animate-pulse"></div>
                                    <div className="w-48 h-48 rounded-full border-4 border-purple-500/20 flex items-center justify-center relative">
                                         <Broadcast className="w-24 h-24 text-purple-500 animate-bounce" />
                                         <div className="absolute inset-0 border-t-4 border-purple-500 rounded-full animate-spin"></div>
                                    </div>
                                </div>
                                <div className="w-full max-w-md space-y-6">
                                    <div className="flex justify-between text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-2">
                                        <span>Decoding_Sustain_Stream</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                                        <div className="h-full bg-purple-500 shadow-[0_0_30px_purple] transition-all duration-300 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <div className="flex items-center justify-center space-x-6 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                                         <div className="flex items-center space-x-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping"></div><span>P2P_HANDSHAKE_STABLE</span></div>
                                         <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                                         <span>CHAN: {currentChannel}</span>
                                    </div>
                                </div>
                            </div>
                        ) : status === 'COMPLETE' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in space-y-10 z-10">
                                <div className="w-32 h-32 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.3)] border-4 border-emerald-400 relative">
                                    <CheckCircle className="w-16 h-16 text-black" />
                                    <div className="absolute -inset-4 border-2 border-emerald-500/30 rounded-[3rem] animate-ping"></div>
                                </div>
                                <div className="text-center space-y-4">
                                    <h3 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">Resource_Inbound</h3>
                                    <div className="flex items-center justify-center space-x-4 text-amber-500 font-black text-3xl">
                                        <span>+25</span><Coins className="w-10 h-10"/>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em]">Node_Steward_Incentive_Allocated</p>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-10 z-10">
                                <div className="relative group/play">
                                    <div className="absolute -inset-10 bg-purple-500/5 blur-[50px] opacity-0 group-hover/play:opacity-100 transition-opacity"></div>
                                    <div className="p-12 bg-zinc-900/60 rounded-[3rem] border-2 border-zinc-800 group-hover:border-purple-600 transition-all shadow-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <Play className="w-24 h-24 text-zinc-800 group-hover:text-purple-500 transition-all duration-500 group-hover:scale-110" />
                                    </div>
                                </div>
                                <div className="max-w-xl space-y-4">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">Neural_Broadcast_Buffer</h3>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed px-10">
                                        Support the global node network by watching brief structural data packages. Your connection generates revenue to power the Gemini Oracle.
                                    </p>
                                </div>
                                <button 
                                    onClick={handleStart}
                                    className="bg-white hover:bg-purple-50 text-black font-black py-7 px-20 rounded-3xl uppercase tracking-[0.4em] text-xs shadow-4xl active:scale-95 transition-all border-b-8 border-zinc-200"
                                >
                                    Initialize_Broadcast
                                </button>
                            </div>
                        )}

                        <div className="absolute bottom-10 left-10 flex items-center space-x-5 z-20">
                            <div className="flex flex-col items-start">
                                <div className="flex items-center space-x-3 mb-1">
                                    <div className={`w-2.5 h-2.5 rounded-full ${status === 'TRANSMITTING' ? 'bg-purple-500 animate-pulse shadow-[0_0_10px_purple]' : 'bg-zinc-800'}`}></div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Feed_Source: PROXY_ALPHA_NODE</span>
                                </div>
                                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">REDUNDANT_P2P_UPSTREAM_V2.4</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right: Info & Stats */}
                <aside className="lg:col-span-4 flex flex-col space-y-8">
                    <div className="bg-zinc-900 border-2 border-zinc-800 rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none"></div>
                        <h3 className="text-xs font-black uppercase text-white tracking-[0.3em] flex items-center space-x-4">
                            <Activity className="w-6 h-6 text-cyan-400"/>
                            <span>Infrastructure_Health</span>
                        </h3>
                        
                        <div className="space-y-10">
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                    <span>Global_Node_Stability</span>
                                    <span className="text-emerald-500">92.4%</span>
                                </div>
                                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-zinc-800 shadow-inner">
                                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_emerald]" style={{ width: '92.4%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                    <span>AI_Oracle_Credits</span>
                                    <span className="text-cyan-500">76% RESERVE</span>
                                </div>
                                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-zinc-800 shadow-inner">
                                    <div className="h-full bg-cyan-500 shadow-[0_0_10px_cyan]" style={{ width: '76%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-[3rem] p-10 flex-grow flex flex-col justify-center text-center space-y-6 shadow-inner relative">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2">Cycle_Support_Counter</p>
                        <div className="text-7xl font-black text-white tracking-tighter leading-none">{watchCount}</div>
                        <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">Supportive Shards Synced Today</p>
                        <div className="flex justify-center gap-3 mt-6">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={`w-4 h-5 rounded border-2 transition-all duration-700 ${i < watchCount ? 'bg-purple-600 border-purple-400 shadow-[0_0_12px_purple] scale-110' : 'bg-zinc-950 border-zinc-800'}`}></div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-purple-950/20 border-2 border-purple-500/30 p-10 rounded-[3rem] relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all"><Sparkles className="w-24 h-24 text-purple-400"/></div>
                        <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                             <Zap className="w-4 h-4"/> <span>Protocol: CIRCULAR_SUPPORT</span>
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-bold italic">
                            "By maintaining this data link, you provide the economic energy required to keep the Oracle responsive. Accountability has a compute cost; thank you for paying it."
                        </p>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default SustainmentCenter;
