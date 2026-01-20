
import React, { useState, useEffect } from 'react';
import { Map, Zap, Target, Search, Broadcast, ShieldCheck, ArrowLeft, Loader, Clock, RefreshCw, Activity } from './icons';

interface TacticalHeatmapProps {
    onReturn: () => void;
}

const TacticalHeatmap: React.FC<TacticalHeatmapProps> = ({ onReturn }) => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [nextScanTime, setNextScanTime] = useState<string>('04:12:08');

    // Simulate a countdown for the next global scan (3 times a day logic)
    useEffect(() => {
        const interval = setInterval(() => {
            setNextScanTime(prev => {
                const parts = prev.split(':').map(Number);
                let [h, m, s] = parts;
                if (s > 0) s--;
                else {
                    s = 59;
                    if (m > 0) m--;
                    else {
                        m = 59;
                        if (h > 0) h--;
                        else h = 7; // Reset to 8 hours cycle
                    }
                }
                return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSync = (sector?: string) => {
        if (sector) setSelectedSector(sector);
        setIsSyncing(true);
        // This simulates pulling data from the shared global cache
        setTimeout(() => setIsSyncing(false), 2500);
    };

    const hotspots = [
        { id: 'SEC-01', name: 'Metro North', threat: 82, reports: 412, x: '25%', y: '30%' },
        { id: 'SEC-02', name: 'Industrial East', threat: 45, reports: 128, x: '65%', y: '45%' },
        { id: 'SEC-03', name: 'Riverside South', threat: 12, reports: 34, x: '40%', y: '75%' },
        { id: 'SEC-04', name: 'West Ridge', threat: 68, reports: 290, x: '15%', y: '60%' },
    ];

    return (
        <div className="bg-zinc-950 text-white min-h-[85vh] rounded-[2.5rem] border border-zinc-800 shadow-2xl animate-fade-in font-mono overflow-hidden flex flex-col relative">
            <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20"></div>
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                        <Map className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter">Global_Shared_Heatmap</h1>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Collective_Intelligence_Grid [v.3.1]</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-zinc-950 px-4 py-2 rounded-2xl border border-zinc-800 flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-cyan-500" />
                        <div>
                            <p className="text-[7px] font-black text-zinc-600 uppercase">Next_Global_Scan</p>
                            <p className="text-xs font-black text-white">{nextScanTime}</p>
                        </div>
                    </div>
                    <button onClick={onReturn} className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span>Terminal_Exit</span>
                    </button>
                </div>
            </header>

            <div className="bg-emerald-950/10 border-b border-emerald-500/20 px-8 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">SHARED_P2P_INTEL_ACTIVE // NETWORK_COST_SUPPRESSED</span>
                </div>
                <span className="text-[8px] font-bold text-zinc-600 uppercase">Member_Synced: {12402 + Math.floor(Math.random() * 50)} Nodes</span>
            </div>

            <main className="flex-grow flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                
                {/* Interactive Map Visualizer */}
                <div className="relative w-full max-w-5xl aspect-video bg-zinc-900/40 rounded-[3rem] border-2 border-zinc-800 overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    
                    {/* Pulsing Hotspots */}
                    {hotspots.map(spot => (
                        <button 
                            key={spot.id}
                            onClick={() => handleSync(spot.name)}
                            style={{ left: spot.x, top: spot.y }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group"
                        >
                            <div className={`relative w-10 h-10 rounded-full border-2 transition-all duration-700 ${
                                spot.threat > 75 ? 'border-rose-500 bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.3)]' :
                                spot.threat > 40 ? 'border-amber-500 bg-amber-500/20' :
                                'border-emerald-500 bg-emerald-500/20'
                            }`}>
                                <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
                                    spot.threat > 75 ? 'bg-rose-500' :
                                    spot.threat > 40 ? 'bg-amber-500' :
                                    'bg-emerald-500'
                                }`}></div>
                            </div>
                            
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-zinc-950 border border-zinc-800 p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 whitespace-nowrap shadow-2xl z-50">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <p className="text-xs font-black text-white uppercase">{spot.name}</p>
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                                        spot.threat > 75 ? 'border-rose-500 text-rose-500' : 'border-emerald-500 text-emerald-500'
                                    }`}>{spot.threat}% THREAT</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase">Collective Reports: {spot.reports}</p>
                                    <p className="text-[9px] font-bold text-cyan-500 uppercase">Status: Shared_Node</p>
                                </div>
                            </div>
                        </button>
                    ))}

                    {/* Scan UI */}
                    {isSyncing && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/60 backdrop-blur-md">
                            <Loader className="w-16 h-16 animate-spin text-emerald-500 mb-6" />
                            <p className="text-xl font-black uppercase tracking-tighter">Syncing Sector Archive: {selectedSector}</p>
                            <p className="text-[10px] font-black text-emerald-500 uppercase animate-pulse tracking-[0.4em] mt-2">Connecting_To_Collective_Buffer...</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
                    <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Activity className="w-16 h-16 text-rose-500"/></div>
                        <div className="flex items-center space-x-3 mb-4">
                            <Target className="w-5 h-5 text-rose-500" />
                            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Global_Priority</span>
                        </div>
                        <p className="text-3xl font-black text-white tracking-tighter">METRO_NORTH</p>
                        <p className="text-xs text-rose-500 font-black uppercase mt-1">Hazard_Sync: CRITICAL (82%)</p>
                    </div>

                    <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><RefreshCw className="w-16 h-16 text-cyan-500"/></div>
                        <div className="flex items-center space-x-3 mb-4">
                            <Broadcast className="w-5 h-5 text-cyan-500" />
                            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Collective_Sync</span>
                        </div>
                        <p className="text-3xl font-black text-white tracking-tighter">6,843,212</p>
                        <p className="text-xs text-zinc-500 font-black uppercase mt-1">Total_Ledger_Records</p>
                    </div>

                    <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck className="w-16 h-16 text-emerald-500"/></div>
                        <div className="flex items-center space-x-3 mb-4">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Accreditation_Purity</span>
                        </div>
                        <p className="text-3xl font-black text-emerald-500 tracking-tighter">99.8%</p>
                        <p className="text-xs text-zinc-500 font-black uppercase mt-1">Peer_Verified_Accuracy</p>
                    </div>
                </div>

                <div className="mt-12 text-center max-w-2xl px-6 bg-zinc-900/40 p-8 rounded-[3rem] border border-dashed border-zinc-800">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-4">Network_Conservation_Protocol</p>
                    <p className="text-xs text-zinc-400 leading-relaxed italic">
                        "The Threat Heatmap is scanned globaly <span className="text-emerald-500 font-black">3 times a day</span>. Results are cached and shared across all terminal nodes to minimize API credit consumption. Syncing doesn't cost you energy; it strengthens the collective."
                    </p>
                    <button 
                        onClick={() => handleSync()}
                        className="mt-8 bg-white text-black font-black py-4 px-12 rounded-2xl uppercase tracking-[0.3em] text-[10px] shadow-2xl active:scale-95 transition-all hover:bg-emerald-50 flex items-center justify-center space-x-3 mx-auto"
                    >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>Force_Peer_Sync</span>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default TacticalHeatmap;
