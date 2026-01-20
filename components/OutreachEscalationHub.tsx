
import React, { useState, useEffect } from 'react';
import { type Report } from '../types';
// FIX: Changed 'Users' to 'User' as 'Users' is not exported from ./icons
import { Phone, Mail, ArrowLeft, Loader, Zap, ShieldCheck, Target, Activity, User, Send, CheckCircle, RefreshCw, Hash, Broadcast } from './icons';

interface OutreachEscalationHubProps {
    reports: Report[];
    onReturn: () => void;
}

const BorderPulseEKG: React.FC<{ color: string; active?: boolean }> = ({ color, active }) => (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'}`}>
        <rect 
            x="0" y="0" width="100%" height="100%" 
            rx="2.5rem" fill="none" 
            stroke={color} strokeWidth="3"
            className="animate-border-trace-ekg"
            style={{ 
                filter: `drop-shadow(0 0 12px ${color})`,
                strokeDasharray: '150 1200'
            }}
        />
    </svg>
);

const OutreachEscalationHub: React.FC<OutreachEscalationHubProps> = ({ reports, onReturn }) => {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [actionStatus, setActionStatus] = useState<'IDLE' | 'SYNTHESIZING' | 'DISPATCHING' | 'SUCCESS'>('IDLE');
    const [queue, setQueue] = useState<{ id: string; target: string; type: string; status: string }[]>([
        { id: 'Q-901', target: 'RM-A92 Oversight', type: 'LIVE_AGENT_CALL', status: 'PENDING' },
        { id: 'Q-442', target: 'Industrial Zone 4 Leak', type: 'AI_SMTP_DISPATCH', status: 'IN_QUEUE' }
    ]);

    const handleAutomate = (type: 'VOX' | 'SMTP') => {
        if (!selectedReport) return;
        setActionStatus('SYNTHESIZING');
        setTimeout(() => {
            setActionStatus('DISPATCHING');
            setTimeout(() => {
                setActionStatus('SUCCESS');
                setTimeout(() => {
                    setActionStatus('IDLE');
                    setSelectedReport(null);
                    // Add to local visual queue for flavor
                    setQueue(prev => [{
                        id: `Q-${Math.floor(Math.random()*900)+100}`,
                        target: selectedReport.title,
                        type: type === 'VOX' ? 'AI_VOX_RELAY' : 'AI_SMTP_DISPATCH',
                        status: 'COMPLETED'
                    }, ...prev]);
                }, 3000);
            }, 2500);
        }, 2000);
    };

    const handleQueueLive = () => {
        if (!selectedReport) return;
        setActionStatus('SUCCESS');
        setQueue(prev => [{
            id: `Q-${Math.floor(Math.random()*900)+100}`,
            target: selectedReport.title,
            type: 'LIVE_AGENT_QUEUED',
            status: 'WAITING'
        }, ...prev]);
        setTimeout(() => {
            setActionStatus('IDLE');
            setSelectedReport(null);
        }, 2000);
    };

    return (
        <div className="bg-zinc-950 text-white min-h-[85vh] rounded-[3rem] border border-zinc-800 shadow-2xl animate-fade-in font-mono overflow-hidden flex flex-col relative">
            <style>{`
                @keyframes border-trace-ekg {
                    0% { stroke-dashoffset: 1350; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-border-trace-ekg { animation: border-trace-ekg 2.5s linear infinite; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
            `}</style>

            <header className="bg-zinc-900 border-b border-zinc-800 px-10 py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 z-30">
                <div className="flex items-center space-x-6">
                    <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/30">
                        <Phone className="w-8 h-8 text-rose-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">Threat_Escalation_Hub</h1>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">Automated Outreach & Live Response Queue</p>
                    </div>
                </div>
                <button onClick={onReturn} className="flex items-center space-x-3 text-sm font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span>Terminal_Exit</span>
                </button>
            </header>

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-black">
                {/* Threat Selection Area */}
                <aside className="lg:col-span-3 border-r border-zinc-800 bg-zinc-900/40 p-8 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-8">
                         <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em]">Active_Targets</h3>
                         <span className="text-[9px] font-black bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded border border-rose-500/20">{reports.length} Records</span>
                    </div>

                    <div className="space-y-4">
                        {reports.map(rep => (
                            <button 
                                key={rep.id}
                                onClick={() => setSelectedReport(rep)}
                                className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${
                                    selectedReport?.id === rep.id ? 'bg-rose-500/10 border-rose-500' : 'bg-black border-zinc-800 hover:border-zinc-700'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">#{rep.id.split('-').pop()}</span>
                                    <Activity className={`w-4 h-4 ${selectedReport?.id === rep.id ? 'text-rose-500 animate-pulse' : 'text-zinc-800'}`} />
                                </div>
                                <h4 className="font-black text-sm text-white mb-1 uppercase tracking-tight truncate">{rep.title}</h4>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase">{rep.category}</p>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Execution Terminal */}
                <section className="lg:col-span-6 p-10 flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.03),transparent)] pointer-events-none"></div>
                    
                    {selectedReport ? (
                        <div className="h-full flex flex-col animate-fade-in relative z-10">
                            <div className="mb-12">
                                <div className="flex items-center space-x-4 mb-4">
                                    <span className="bg-rose-500/20 text-rose-500 border border-rose-500/30 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">THREAT_IDENTIFIED</span>
                                    <span className="text-zinc-600 text-[10px] font-black uppercase">Ref: {selectedReport.hash.substring(0,10)}</span>
                                </div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">{selectedReport.title}</h2>
                                <p className="text-zinc-500 text-sm mt-4 italic">"{selectedReport.description.substring(0, 150)}..."</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                                {/* Automated AI Outreach Box */}
                                <div className="group relative bg-zinc-900 border-2 border-zinc-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-between shadow-2xl">
                                    <BorderPulseEKG color="#f43f5e" />
                                    <div className="text-center space-y-4 relative z-10">
                                        <div className="p-5 bg-rose-500/10 rounded-2xl border border-rose-500/20 inline-block mb-2">
                                            <Zap className="w-8 h-8 text-rose-500" />
                                        </div>
                                        <h3 className="text-lg font-black uppercase text-white tracking-tighter">AI_VOX_SMTP_RELAY</h3>
                                        <p className="text-[10px] text-zinc-600 font-bold leading-relaxed max-w-[20ch] mx-auto uppercase">Initialize fully automated AI-driven calls or encrypted emails to responsible entities.</p>
                                    </div>
                                    <div className="w-full space-y-3 relative z-10">
                                        <button 
                                            onClick={() => handleAutomate('VOX')}
                                            disabled={actionStatus !== 'IDLE'}
                                            className="w-full bg-white hover:bg-zinc-100 text-black font-black py-4 rounded-xl uppercase text-[10px] tracking-widest transition-all active:scale-95 disabled:opacity-20"
                                        >
                                            Launch AI Call Relay
                                        </button>
                                        <button 
                                            onClick={() => handleAutomate('SMTP')}
                                            disabled={actionStatus !== 'IDLE'}
                                            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black py-4 rounded-xl uppercase text-[10px] tracking-widest transition-all active:scale-95 disabled:opacity-20"
                                        >
                                            Send AI SMTP Dispatch
                                        </button>
                                    </div>
                                </div>

                                {/* Live Field Support Box */}
                                <div className="group relative bg-zinc-900 border-2 border-zinc-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-between shadow-2xl">
                                    <BorderPulseEKG color="#22d3ee" />
                                    <div className="text-center space-y-4 relative z-10">
                                        <div className="p-5 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 inline-block mb-2">
                                            {/* FIX: Changed 'Users' to 'User' as 'Users' is not exported from ./icons */}
                                            <User className="w-8 h-8 text-cyan-500" />
                                        </div>
                                        <h3 className="text-lg font-black uppercase text-white tracking-tighter">Live_Support_Queue</h3>
                                        <p className="text-[10px] text-zinc-600 font-bold leading-relaxed max-w-[20ch] mx-auto uppercase">Queue this threat for a verified human operative to conduct manual high-impact outreach.</p>
                                    </div>
                                    <button 
                                        onClick={handleQueueLive}
                                        disabled={actionStatus !== 'IDLE'}
                                        className="w-full relative z-10 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-xl uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-xl disabled:opacity-20"
                                    >
                                        Queue For Field Agent
                                    </button>
                                </div>
                            </div>

                            {/* Execution Overlay */}
                            {actionStatus !== 'IDLE' && (
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center animate-fade-in">
                                    {actionStatus === 'SUCCESS' ? (
                                        <div className="animate-fade-in flex flex-col items-center">
                                            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                                                <ShieldCheck className="w-12 h-12 text-black" />
                                            </div>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Transmission_Secured</h3>
                                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Action record committed to the ledger.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="relative mb-8">
                                                <div className="absolute inset-0 bg-rose-500/20 blur-3xl animate-pulse"></div>
                                                <Loader className="w-16 h-16 animate-spin text-rose-500 relative z-10" />
                                            </div>
                                            <h3 className="text-xl font-black uppercase tracking-widest text-rose-500 animate-pulse">{actionStatus === 'SYNTHESIZING' ? 'Synthesizing_AI_Vox_Tone...' : 'Establishing_SMTP_Handshake...'}</h3>
                                            <div className="w-64 h-1 bg-zinc-900 rounded-full mt-10 overflow-hidden">
                                                <div className="h-full bg-rose-500 animate-loading-bar"></div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-10 opacity-40">
                            <div className="p-10 bg-zinc-900 rounded-[4rem] border-2 border-zinc-800">
                                <Target className="w-20 h-20 text-zinc-700" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-600">No_Active_Target</h3>
                                <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest mt-2 max-w-xs mx-auto leading-relaxed">
                                    Select a record from the tactical sidebar to initialize escalation protocols.
                                </p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Queue Monitoring Sidebar */}
                <aside className="lg:col-span-3 bg-zinc-950 border-l border-zinc-800 p-8 flex flex-col overflow-hidden">
                    <div className="flex items-center space-x-3 mb-8">
                        <Broadcast className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.4em]">Dispatch_Monitor</h3>
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar space-y-6 pr-2">
                        {queue.map(item => (
                            <div key={item.id} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-1 bg-emerald-500/20 group-hover:bg-emerald-500/50 transition-colors"></div>
                                <div className="flex justify-between items-start">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">#{item.id}</span>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${
                                        item.status === 'COMPLETED' ? 'text-emerald-500 border-emerald-900/50 bg-emerald-950/20' : 'text-amber-500 border-amber-900/50 bg-amber-950/20'
                                    }`}>{item.status}</span>
                                </div>
                                <p className="text-[10px] font-black text-white uppercase tracking-tight truncate" title={item.target}>{item.target}</p>
                                <div className="flex items-center space-x-2 text-[9px] font-bold text-zinc-600 uppercase">
                                    {item.type.includes('CALL') || item.type.includes('VOX') ? <Phone className="w-3 h-3"/> : <Mail className="w-3 h-3"/>}
                                    <span>{item.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-6 bg-zinc-900/60 border border-zinc-800 border-dashed rounded-[2rem]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Network_Resonance</span>
                            <span className="text-emerald-500 text-[8px] font-black">STABLE</span>
                        </div>
                        <div className="flex items-center space-x-1">
                             {[...Array(12)].map((_, i) => (
                                <div key={i} className={`h-3 w-1.5 rounded-sm ${i < 10 ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
                             ))}
                        </div>
                        <p className="text-[8px] text-zinc-700 font-bold uppercase mt-4 leading-relaxed">System cost fully offset by community staked credits.</p>
                    </div>
                </aside>
            </main>
        </div>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center space-x-5 px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
            active ? 'bg-rose-600 text-white shadow-2xl shadow-rose-950/50 border-t border-rose-400/50' : 'bg-transparent text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300'
        }`}
    >
        <div className={`transition-transform duration-500 ${active ? 'scale-110' : ''}`}>{icon}</div>
        <span>{label}</span>
    </button>
);

export default OutreachEscalationHub;
