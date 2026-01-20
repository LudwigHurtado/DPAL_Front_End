
import React, { useState, useEffect } from 'react';
import { type Hero, type ChatMessage } from '../types';
import { ShieldCheck, Target, Zap, Loader, ArrowLeft, Broadcast, AlertTriangle, Check, RefreshCw, Box } from './icons';

interface AiRegulationHubProps {
    onReturn: () => void;
    hero: Hero;
}

interface RegulationTask {
    id: string;
    title: string;
    description: string;
    targetNode: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'CRITICAL';
    humanCheck: string;
    isResolved: boolean;
}

const AiRegulationHub: React.FC<AiRegulationHubProps> = ({ onReturn, hero }) => {
    const [tasks, setTasks] = useState<RegulationTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTask, setActiveTask] = useState<RegulationTask | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [verificationLog, setVerificationLog] = useState<string[]>([]);

    useEffect(() => {
        // Initializing Oversight Link
        setTimeout(() => {
            setTasks([
                { id: 'REG-001', title: 'Sentiment Infiltration', description: 'Rogue node is synthesizing fake housing crisis reports to destabilize local confidence.', targetNode: 'ALG-V4-NORTH', riskLevel: 'CRITICAL', humanCheck: 'Verify the authenticity of the attached visual telemetry.', isResolved: false },
                { id: 'REG-002', title: 'Resource Bias Shift', description: 'Infrastructure prioritization model is systematically ignoring low-income sectors.', targetNode: 'OPT-GRID-CENTRAL', riskLevel: 'MEDIUM', humanCheck: 'Force recalibration of parity weightings.', isResolved: false },
                { id: 'REG-003', title: 'Truth Leakage', description: 'Encrypted accountability records are being flagged as "junk data" by standard scrubbers.', targetNode: 'SCRUB-PRIME-01', riskLevel: 'MEDIUM', humanCheck: 'Whitelist block range #6.8M - #6.9M.', isResolved: false },
            ]);
            setIsLoading(false);
        }, 1500);
    }, []);

    const handleResolve = (taskId: string) => {
        setIsProcessing(true);
        const task = tasks.find(t => t.id === taskId);
        setVerificationLog(prev => [`SYST_INIT: Dispatching Human Oversight to ${task?.targetNode}...`, ...prev]);
        
        setTimeout(() => {
            setVerificationLog(prev => [`SUCCESS: Infiltration suppressed. Rogue node ${task?.targetNode} forced into compliance.`, ...prev]);
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isResolved: true } : t));
            setIsProcessing(false);
            setActiveTask(null);
        }, 2000);
    };

    return (
        <div className="bg-zinc-950 text-white min-h-[85vh] rounded-[2.5rem] border border-zinc-800 shadow-2xl animate-fade-in font-mono overflow-hidden flex flex-col">
            <style>{`
                .glitch-red { color: #f43f5e; text-shadow: 2px 2px #000; animation: glitch 2s infinite; }
                @keyframes glitch {
                    0% { transform: translate(0); }
                    10% { transform: translate(-2px, 2px); }
                    20% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
                .scan-line {
                    position: absolute; top: 0; left: 0; width: 100%; height: 2px;
                    background: rgba(244, 63, 94, 0.1); animation: scan 3s linear infinite;
                }
                @keyframes scan { from { top: 0; } to { top: 100%; } }
            `}</style>

            <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative">
                <div className="scan-line"></div>
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/30">
                        <ShieldCheck className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter glitch-red">Oversight_Node_Alpha</h1>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Rogue_AI_Regulation_Terminal</p>
                    </div>
                </div>
                <button onClick={onReturn} className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Return_To_Safe_Node</span>
                </button>
            </header>

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                {/* Task List */}
                <div className="lg:col-span-4 xl:col-span-3 border-r border-zinc-800 bg-zinc-900/40 p-6 overflow-y-auto custom-scrollbar">
                    <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-6 flex items-center justify-between">
                        <span>Infiltration_Nodes</span>
                        <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                    </h3>
                    
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader className="w-8 h-8 animate-spin text-rose-500" />
                            <p className="text-[9px] font-black uppercase text-zinc-600">Syncing_Oversight_Link...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tasks.map(task => (
                                <button 
                                    key={task.id}
                                    onClick={() => !task.isResolved && setActiveTask(task)}
                                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all group ${
                                        task.isResolved ? 'bg-zinc-950 border-emerald-900/30 opacity-40 grayscale' :
                                        activeTask?.id === task.id ? 'bg-rose-500/10 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.1)]' :
                                        'bg-black border-zinc-800 hover:border-rose-900'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${task.isResolved ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {task.isResolved ? 'SUPPRESSED' : task.riskLevel}
                                        </span>
                                        {task.isResolved && <Check className="w-3 h-3 text-emerald-500" />}
                                    </div>
                                    <h4 className="font-bold text-sm text-white mb-1 uppercase tracking-tight">{task.title}</h4>
                                    <p className="text-[9px] text-zinc-500 font-medium">Node: {task.targetNode}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tactical Detail */}
                <div className="lg:col-span-5 p-8 bg-black relative flex flex-col">
                    {activeTask ? (
                        <div className="space-y-8 animate-fade-in flex flex-col h-full">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                     <h2 className="text-2xl font-black uppercase tracking-tighter glitch-red">{activeTask.title}</h2>
                                     <span className="text-[9px] font-black text-zinc-600">ID: {activeTask.id}</span>
                                </div>
                                <div className="bg-zinc-900/60 p-6 rounded-[2rem] border border-zinc-800">
                                    <p className="text-zinc-400 text-sm leading-relaxed italic">"{activeTask.description}"</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Oversight_Directive</label>
                                <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-3xl">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-rose-500/20 rounded-xl">
                                            <Target className="w-6 h-6 text-rose-400" />
                                        </div>
                                        <p className="text-white font-bold leading-relaxed">{activeTask.humanCheck}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-center">
                                        <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Human_Certainty</p>
                                        <p className="text-lg font-black text-white">94.2%</p>
                                    </div>
                                    <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-center">
                                        <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Dominance_Risk</p>
                                        <p className="text-lg font-black text-rose-500">{activeTask.riskLevel === 'CRITICAL' ? 'SEVERE' : 'STABLE'}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleResolve(activeTask.id)}
                                    disabled={isProcessing}
                                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-6 rounded-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-[0.3em] text-xs flex items-center justify-center space-x-3"
                                >
                                    {isProcessing ? <Loader className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                    <span>{isProcessing ? 'SYNCHRONIZING_OVERRIDE...' : 'EXECUTE_HUMAN_OVERRIDE'}</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
                            <div className="w-32 h-32 bg-zinc-950 rounded-[3rem] border border-zinc-800 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-rose-500/5 blur-3xl animate-pulse"></div>
                                <Target className="w-12 h-12 text-zinc-800" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase text-zinc-700 tracking-tighter">No_Active_Target</h3>
                                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2 max-w-xs leading-relaxed">
                                    Select a Dominance Node from the sidebar to initialize human oversight protocols.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* System Feedback */}
                <div className="lg:col-span-3 bg-zinc-950 p-6 flex flex-col border-l border-zinc-800">
                    <div className="flex items-center space-x-3 mb-6">
                        <Broadcast className="w-5 h-5 text-cyan-500" />
                        <h2 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Oversight_Stream</h2>
                    </div>
                    
                    <div className="flex-grow space-y-4 overflow-y-auto custom-scrollbar pr-2">
                        {verificationLog.map((log, i) => (
                            <div key={i} className={`p-3 rounded-xl text-[10px] font-bold leading-relaxed border ${
                                log.startsWith('SUCCESS') ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                            }`}>
                                {log}
                            </div>
                        ))}
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-600 leading-relaxed italic">
                            Awaiting new telemetric data from field operatives...
                        </div>
                    </div>
                    
                    <div className="mt-8 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800 border-dashed">
                        <div className="flex items-center justify-between text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">
                            <span>Human_Oversight_Quota</span>
                            <span className="text-cyan-500">88%</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-600" style={{ width: '88%' }}></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AiRegulationHub;
