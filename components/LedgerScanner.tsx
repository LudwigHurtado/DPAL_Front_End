
import React, { useState, useEffect } from 'react';
import { Hash, Loader, Zap, ShieldCheck, Activity, Search, ArrowRight, Sparkles } from './icons';
import { type Report } from '../types';

interface LedgerScannerProps {
    reports: Report[];
    onTargetFound: (report: Report) => void;
}

const BorderPulseEKG: React.FC<{ status: string }> = ({ status }) => {
    const color = status === 'SCANNING' ? '#22d3ee' : status === 'LOCKED' ? '#10b981' : status === 'ERROR' ? '#f43f5e' : '#22d3ee';
    const opacity = status === 'IDLE' ? 'opacity-20 group-hover:opacity-100' : 'opacity-100';
    
    return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible transition-opacity duration-500 ${opacity}`}>
            <rect 
                x="0" y="0" width="100%" height="100%" 
                rx="2rem" fill="none" 
                stroke={color} strokeWidth="3"
                className="animate-border-trace-ekg"
                style={{ 
                    filter: `drop-shadow(0 0 12px ${color})`,
                    strokeDasharray: '150 1200'
                }}
            />
        </svg>
    );
};

const LedgerScanner: React.FC<LedgerScannerProps> = ({ reports, onTargetFound }) => {
    const [inputId, setInputId] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'LOCKED' | 'ERROR'>('IDLE');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSync = () => {
        if (!inputId.trim() || isScanning) return;
        
        setIsScanning(true);
        setStatus('SCANNING');
        setErrorMsg('');

        // The "MRI" Scan Simulation
        setTimeout(() => {
            const found = reports.find(r => 
                r.id.toLowerCase() === inputId.toLowerCase() || 
                r.hash.toLowerCase().includes(inputId.toLowerCase())
            );

            if (found) {
                setStatus('LOCKED');
                onTargetFound(found);
                setInputId('');
                setTimeout(() => setStatus('IDLE'), 3000);
            } else {
                setStatus('ERROR');
                setErrorMsg('SHARD_NOT_FOUND_IN_BLOCKS');
                setTimeout(() => {
                    setStatus('IDLE');
                    setErrorMsg('');
                }, 3000);
            }
            setIsScanning(false);
        }, 1800);
    };

    return (
        <div className="w-full mb-10 font-mono relative group">
            {/* The Outer Shell with EKG Border Pulse */}
            <div className={`relative bg-zinc-900/80 border-2 rounded-[2rem] p-1 transition-all duration-700 shadow-2xl ${
                status === 'SCANNING' ? 'border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.2)] scale-[1.01]' :
                status === 'LOCKED' ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]' :
                status === 'ERROR' ? 'border-rose-500/50 animate-shake' :
                'border-zinc-800/50 hover:border-zinc-700/50'
            }`}>
                
                {/* Dynamic Border Light (EKG Pulse) */}
                <BorderPulseEKG status={status} />

                {/* Internal Scan Grid */}
                <div className="bg-black rounded-[1.8rem] overflow-hidden relative p-4 md:p-8 flex flex-col md:flex-row items-center gap-8">
                    
                    {/* MRI Status Sidecar */}
                    <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-6 md:border-r border-zinc-800 pr-0 md:pr-8 w-full md:w-auto">
                        <div className="relative">
                            <div className={`p-4 rounded-2xl bg-zinc-900 border transition-all duration-500 ${
                                status === 'SCANNING' ? 'border-cyan-500 text-cyan-400' :
                                status === 'LOCKED' ? 'border-emerald-500 text-emerald-400' :
                                'border-zinc-800 text-zinc-600'
                            }`}>
                                <Activity className={`w-8 h-8 ${status === 'SCANNING' ? 'animate-pulse' : ''}`} />
                            </div>
                            {status === 'SCANNING' && (
                                <div className="absolute inset-0 bg-cyan-500/20 blur-xl animate-ping rounded-full"></div>
                            )}
                        </div>
                        <div className="flex flex-col items-start md:items-center text-center">
                            <p className="text-[0.45rem] font-black uppercase text-zinc-500 tracking-[0.3em] mb-1">Scanner_Link</p>
                            <span className={`text-[0.625rem] font-black uppercase tracking-widest ${
                                status === 'SCANNING' ? 'text-cyan-500' :
                                status === 'LOCKED' ? 'text-emerald-500' :
                                'text-zinc-700'
                            }`}>{status}</span>
                        </div>
                    </div>

                    {/* Main Input Field Area */}
                    <div className="flex-grow w-full space-y-4">
                        <div className="flex items-center justify-between px-2">
                             <div className="flex items-center space-x-2">
                                <Hash className="w-4 h-4 text-cyan-500" />
                                <label className="text-[0.625rem] font-black uppercase text-zinc-500 tracking-[0.4em]">Find_A_Report_Protocol</label>
                             </div>
                             <div className="hidden sm:flex items-center space-x-4">
                                <span className="text-[0.45rem] font-black text-zinc-700 uppercase">Resonance: 99.8%</span>
                                <span className="text-[0.45rem] font-black text-zinc-700 uppercase">Link: AES-256</span>
                             </div>
                        </div>

                        <div className="relative">
                            <input 
                                type="text"
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSync()}
                                placeholder="INPUT_BLOCK_HASH_OR_SHARD_ID..."
                                className={`w-full bg-zinc-950 border-2 rounded-2xl px-6 py-5 text-lg font-black tracking-tighter outline-none transition-all placeholder:text-zinc-900 ${
                                    status === 'ERROR' ? 'border-rose-500/50 text-rose-500' :
                                    status === 'SCANNING' ? 'border-cyan-500/50 text-cyan-500' :
                                    'border-zinc-900 text-white focus:border-cyan-500/30'
                                } shadow-inner`}
                            />
                            
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                                {isScanning ? (
                                    <Loader className="w-6 h-6 text-cyan-500 animate-spin" />
                                ) : (
                                    <button 
                                        onClick={handleSync}
                                        disabled={!inputId.trim()}
                                        className="p-3 bg-zinc-900 hover:bg-zinc-800 text-cyan-500 rounded-xl transition-all active:scale-95 disabled:opacity-20 border border-zinc-800"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {/* The MRI "Scan Line" Overlay */}
                            {status === 'SCANNING' && (
                                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/30 shadow-[0_0_20px_cyan] animate-scan-x"></div>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex justify-between items-center px-2">
                            {errorMsg ? (
                                <p className="text-[0.5625rem] font-black text-rose-500 uppercase animate-pulse">{errorMsg}</p>
                            ) : (
                                <p className="text-[0.5rem] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                                    Target specific shards for evidence auditing or record retrieval.
                                </p>
                            )}
                            <div className="flex items-center space-x-1 opacity-20">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="w-1 h-3 bg-cyan-500 rounded-full"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scan-x {
                    0% { left: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
                .animate-scan-x { animation: scan-x 1.8s linear infinite; }
                
                @keyframes border-trace-ekg {
                    0% { stroke-dashoffset: 1350; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-border-trace-ekg {
                    animation: border-trace-ekg 2.5s linear infinite;
                }

                .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
            `}</style>
        </div>
    );
};

export default LedgerScanner;
