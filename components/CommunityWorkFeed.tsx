
import React, { useMemo, useState } from 'react';
/* FIX: Removed non-existent 'Users' and 'Shield' imports, added missing 'FileText', 'Broadcast', 'Loader', 'Plus', 'Coins', and 'UserCircle' imports */
import { Activity, ShieldCheck, Zap, Target, MapPin, User, CheckCircle, Clock, X, Eye, ArrowRight, Award, Sparkles, FileText, Broadcast, Loader, Plus, Coins, UserCircle } from './icons';

interface WorkEntry {
    id: string;
    operative: string;
    action: string;
    location: string;
    sector: string;
    timestamp: number;
    reward: number;
    status: 'ACTIVE' | 'FINALIZED';
    description: string;
    proofImage: string;
    contributors: string[];
    trustScore: number;
}

const CommunityWorkFeed: React.FC = () => {
    const [selectedEntry, setSelectedEntry] = useState<WorkEntry | null>(null);
    const [isJoining, setIsJoining] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const initialWorkItems = useMemo((): WorkEntry[] => [
        { 
            id: 'W-902', 
            operative: 'Nova_Prime', 
            action: 'Storm Drain Desilting Audit', 
            location: 'London, UK', 
            sector: 'Infrastructure', 
            timestamp: Date.now() - 120000, 
            reward: 150, 
            status: 'FINALIZED',
            description: 'Identified significant blockage in Sector 7 storm drains. Coordinated with local maintenance node to clear 2 tons of debris. Verified flow capacity via acoustic sensors',
            proofImage: 'https://picsum.photos/seed/drain/800/450',
            contributors: ['Nova_Prime', 'Echo_Seven', 'Civic_Sentinel'],
            trustScore: 98
        },
        { 
            id: 'W-441', 
            operative: 'Ghost_Protocol', 
            action: 'Graffiti Abatement Log', 
            location: 'Los Angeles, CA', 
            sector: 'Environment', 
            timestamp: Date.now() - 300000, 
            reward: 80, 
            status: 'ACTIVE',
            description: 'Documenting high-frequency tagging patterns on historic preservation blocks. Mapping spray-paint chemical signatures to localized supply points',
            proofImage: 'https://picsum.photos/seed/graffiti/800/450',
            contributors: ['Ghost_Protocol'],
            trustScore: 72
        },
        { 
            id: 'W-112', 
            operative: 'Civic_Sentinel', 
            action: 'Sidewalk Safety Inspection', 
            location: 'Chicago, IL', 
            sector: 'Public Transport', 
            timestamp: Date.now() - 600000, 
            reward: 200, 
            status: 'FINALIZED',
            description: 'Full perimeter sweep of 4th Street bus hub. Marked 12 tripping hazards on the ledger and alerted transit authority. High pedestrian risk mitigated',
            proofImage: 'https://picsum.photos/seed/sidewalk/800/450',
            contributors: ['Civic_Sentinel', 'Nova_Prime'],
            trustScore: 94
        },
        { 
            id: 'W-883', 
            operative: 'Vanguard_Actual', 
            action: 'Pothole Pattern Recognition', 
            location: 'San Jose, CA', 
            sector: 'Infrastructure', 
            timestamp: Date.now() - 900000, 
            reward: 120, 
            status: 'FINALIZED',
            description: 'Synthesized 50 citizen reports into a high-priority repair directive. Correlated asphalt failure with underground utility leaks',
            proofImage: 'https://picsum.photos/seed/pothole/800/450',
            contributors: ['Vanguard_Actual', 'Analyst_Sigma', 'Ghost_Protocol', 'Civic_Sentinel'],
            trustScore: 99
        },
        { 
            id: 'W-556', 
            operative: 'Echo_Seven', 
            action: 'Park Bench Structural Scan', 
            location: 'New York, NY', 
            sector: 'Civic Duty', 
            timestamp: Date.now() - 1500000, 
            reward: 50, 
            status: 'ACTIVE',
            description: 'Analyzing decay on 15 public benches in Central Sector. Creating structural shards for replacement crowdfunding',
            proofImage: 'https://picsum.photos/seed/bench/800/450',
            contributors: ['Echo_Seven'],
            trustScore: 65
        },
    ], []);

    const [workItems, setWorkItems] = useState<WorkEntry[]>(initialWorkItems);

    const timeAgo = (ms: number) => {
        const mins = Math.floor((Date.now() - ms) / 60000);
        return mins === 0 ? 'Just now' : `${mins}m ago`;
    };

    const handleJoinProject = () => {
        if (!selectedEntry || selectedEntry.status === 'FINALIZED') return;
        setIsJoining(true);
        setTimeout(() => {
            const updated = {
                ...selectedEntry,
                contributors: [...selectedEntry.contributors, 'Operative_Prime'],
            };
            setWorkItems(prev => prev.map(w => w.id === selectedEntry.id ? updated : w));
            setSelectedEntry(updated);
            setIsJoining(false);
        }, 1500);
    };

    const handleVerify = () => {
        if (!selectedEntry) return;
        setIsVerifying(true);
        setTimeout(() => {
            const updated = {
                ...selectedEntry,
                trustScore: Math.min(100, selectedEntry.trustScore + 2),
            };
            setWorkItems(prev => prev.map(w => w.id === selectedEntry.id ? updated : w));
            setSelectedEntry(updated);
            setIsVerifying(false);
        }, 1000);
    };

    return (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden animate-fade-in relative p-1 font-mono">
            <div className="bg-zinc-900/60 border-b border-zinc-800 px-8 py-5 flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-4">
                    <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
                        <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Global_Directives_Feed</h3>
                        <p className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Community Contributions & Proof of Work</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] hidden sm:inline">"ROME WAS NOT BUILT BY ONE ROMAN"</span>
                    <div className="bg-black/40 px-4 py-1.5 rounded-full border border-zinc-800 flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                        <span className="text-[8px] font-black text-emerald-500 uppercase">SYNC_ACTIVE</span>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-4">
                {workItems.map((item) => (
                    <button 
                        key={item.id} 
                        onClick={() => setSelectedEntry(item)}
                        className="w-full text-left group bg-zinc-950 border-2 border-zinc-900 rounded-[2rem] p-6 hover:border-cyan-500/30 transition-all duration-500 shadow-xl relative overflow-hidden active:scale-[0.98]"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Activity className="w-20 h-20 text-cyan-500" />
                        </div>
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                            <div className="flex items-center space-x-5">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-cyan-400 group-hover:border-cyan-900/50 transition-all">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-3 mb-1">
                                        <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">OP_{item.operative}</span>
                                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                                        <span className="text-[8px] font-bold text-zinc-600 uppercase flex items-center space-x-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{timeAgo(item.timestamp)}</span>
                                        </span>
                                    </div>
                                    <h4 className="text-base font-black text-white uppercase tracking-tighter group-hover:text-cyan-100 transition-colors">
                                        {item.action}
                                    </h4>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto md:justify-end">
                                <div className="flex items-center space-x-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
                                    <Target className="w-3 h-3 text-zinc-500" />
                                    <span className="text-[8px] font-black text-zinc-400 uppercase truncate max-w-[80px]">{item.sector}</span>
                                </div>
                                <div className="flex -space-x-2 mr-2">
                                    {item.contributors.slice(0, 3).map((c, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-[8px] font-black text-zinc-500 uppercase" title={c}>
                                            {c.charAt(0)}
                                        </div>
                                    ))}
                                    {item.contributors.length > 3 && (
                                        <div className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center text-[8px] font-black text-cyan-500 uppercase">
                                            +{item.contributors.length - 3}
                                        </div>
                                    )}
                                </div>
                                <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-full border ${item.status === 'FINALIZED' ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400' : 'bg-cyan-950/20 border-cyan-900/50 text-cyan-400 animate-pulse'}`}>
                                    {item.status === 'FINALIZED' ? <CheckCircle className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                                    <span className="text-[8px] font-black uppercase tracking-widest">{item.status}</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                                    <span className="text-[9px] font-black text-amber-500">+{item.reward} HC</span>
                                </div>
                                <div className="p-2 text-zinc-700 group-hover:text-cyan-500 transition-colors">
                                    <Eye className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* DETAIL OVERLAY */}
            {selectedEntry && (
                <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in" onClick={() => setSelectedEntry(null)}>
                    <div className="bg-zinc-900 border-2 border-zinc-800 rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(6,182,212,0.15)] relative" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/30 animate-scan-y"></div>
                        
                        <header className="bg-zinc-950 border-b border-zinc-800 p-8 flex justify-between items-center">
                            <div className="flex items-center space-x-6">
                                <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                                    <FileText className="w-8 h-8 text-cyan-400" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-3 mb-1">
                                        <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Work_Audit: {selectedEntry.id}</h2>
                                        <span className={`px-3 py-0.5 rounded text-[8px] font-black border ${selectedEntry.status === 'FINALIZED' ? 'border-emerald-500 text-emerald-500' : 'border-cyan-500 text-cyan-500'}`}>{selectedEntry.status}</span>
                                    </div>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Shard_Hash: 0x{selectedEntry.id.replace('-', '')}{selectedEntry.timestamp.toString(16).slice(-8)}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedEntry(null)} className="p-4 bg-zinc-900 hover:bg-rose-950 text-zinc-500 hover:text-rose-500 rounded-2xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </header>

                        <div className="flex-grow overflow-y-auto custom-scrollbar p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Left: Content */}
                            <div className="lg:col-span-7 space-y-10">
                                <div className="rounded-[2rem] overflow-hidden border-4 border-zinc-800 relative group/img shadow-2xl">
                                    <img src={selectedEntry.proofImage} alt="Proof" className="w-full aspect-video object-cover grayscale opacity-80 group-hover/img:grayscale-0 group-hover/img:opacity-100 transition-all duration-700" />
                                    <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-cyan-400">
                                        P2P_Visual_Telemetry_Certified
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase text-zinc-600 tracking-[0.4em] flex items-center space-x-3">
                                        <Activity className="w-4 h-4" />
                                        <span>Action_Narrative</span>
                                    </h3>
                                    <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-[2.5rem] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5"><Broadcast className="w-20 h-20 text-cyan-500"/></div>
                                        <p className="text-zinc-200 leading-relaxed italic text-lg border-l-4 border-cyan-500 pl-8">
                                            "{selectedEntry.description}"
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl">
                                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Category</p>
                                        <div className="flex items-center space-x-3">
                                            <Target className="w-5 h-5 text-cyan-400" />
                                            <span className="text-white font-black uppercase">{selectedEntry.sector}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl">
                                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Space</p>
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="w-5 h-5 text-rose-500" />
                                            <span className="text-white font-black uppercase truncate">{selectedEntry.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Collaborative Nodes */}
                            <div className="lg:col-span-5 space-y-8">
                                <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-[3rem] space-y-8 shadow-inner">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] flex items-center space-x-3">
                                            <UserCircle className="w-5 h-5 text-emerald-500" />
                                            <span>Active_Collaborators</span>
                                        </h3>
                                        <span className="bg-emerald-500/10 text-emerald-500 px-3 py-0.5 rounded-full text-[9px] font-black border border-emerald-500/20">{selectedEntry.contributors.length} NODES</span>
                                    </div>

                                    <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                        {selectedEntry.contributors.map((c, i) => (
                                            <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${c === 'Operative_Prime' ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-zinc-900 border-zinc-800'} transition-all`}>
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xs font-black text-zinc-500 uppercase">
                                                        {c.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-white uppercase">{c}</p>
                                                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{i === 0 ? 'Lead_Node' : 'Collaborative_Node'}</p>
                                                    </div>
                                                </div>
                                                {c === 'Operative_Prime' && <Sparkles className="w-4 h-4 text-cyan-400" />}
                                            </div>
                                        ))}
                                    </div>

                                    {selectedEntry.status === 'ACTIVE' && (
                                        <button 
                                            onClick={handleJoinProject}
                                            disabled={isJoining || selectedEntry.contributors.includes('Operative_Prime')}
                                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[10px] shadow-2xl active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center space-x-3"
                                        >
                                            {isJoining ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                            <span>{selectedEntry.contributors.includes('Operative_Prime') ? 'ALREADY_SYNCED' : 'JOIN_COLLABORATION'}</span>
                                        </button>
                                    )}
                                </div>

                                <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[3rem] space-y-6">
                                    <div className="flex items-center justify-between">
                                         <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] flex items-center space-x-3">
                                            <ShieldCheck className="w-5 h-5 text-amber-500" />
                                            <span>Validation_Index</span>
                                        </h3>
                                        <span className="text-xl font-black text-amber-400">{selectedEntry.trustScore}%</span>
                                    </div>
                                    
                                    <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 shadow-inner">
                                        <div className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-1000" style={{ width: `${selectedEntry.trustScore}%` }}></div>
                                    </div>

                                    <button 
                                        onClick={handleVerify}
                                        disabled={isVerifying}
                                        className="w-full bg-white hover:bg-amber-50 text-black font-black py-4 rounded-2xl uppercase tracking-[0.3em] text-[9px] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3 border border-amber-900/30 shadow-xl"
                                    >
                                        {isVerifying ? <Loader className="w-3 h-3 animate-spin" /> : <Award className="w-3 h-3" />}
                                        <span>Verify_Field_Work</span>
                                    </button>
                                </div>

                                <div className="p-6 bg-emerald-950/10 border border-emerald-500/20 rounded-[2rem] text-center">
                                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">Reward_Allocation</p>
                                     <div className="flex items-center justify-center space-x-2 text-2xl font-black text-white tracking-tighter">
                                         <span>{selectedEntry.reward}</span>
                                         <Coins className="w-6 h-6 text-amber-500" />
                                     </div>
                                     <p className="text-[8px] text-zinc-600 font-bold uppercase mt-2 italic">Distributed across all active nodes.</p>
                                </div>
                            </div>
                        </div>

                        <footer className="bg-zinc-950 border-t border-zinc-800 p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="flex items-center space-x-3 text-zinc-600">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Block_Height_Sync: #6843{selectedEntry.timestamp.toString().slice(-3)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Protocol: V3.1_DISTRIBUTED_LABOR</span>
                            </div>
                        </footer>
                    </div>
                </div>
            )}

            <style>{`
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
            `}</style>
        </div>
    );
};

export default CommunityWorkFeed;
