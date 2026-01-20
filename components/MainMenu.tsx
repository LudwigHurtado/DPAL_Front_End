
import React, { useState, useEffect } from 'react';
import { useTranslations } from '../i18n';
import { List, ArrowRight, Search, Mic, Loader, Megaphone, Sparkles, Monitor, Broadcast, Zap, Database, ShieldCheck, Target, Map, User, Activity, Award, Hash, Gem, FileText, Phone, Globe, Package, Scale, AlertTriangle, Heart, Coins, X } from './icons';
import { Category } from '../types';
import { CATEGORIES_WITH_ICONS } from '../constants';
import BlockchainStatusPanel from './BlockchainStatusPanel';

interface MainMenuProps {
    onNavigate: (view: any, category?: Category, extra?: any) => void;
    totalReports: number;
    onGenerateMissionForCategory: (category: Category) => void;
}

const PERIMETER_COLORS = ['#06b6d4', '#f43f5e', '#f59e0b', '#10b981', '#a855f7', '#3b82f6'];

const DualCometBorder: React.FC<{ 
    color: string; 
    radius?: string; 
    visible?: boolean; 
    hoverable?: boolean 
}> = ({ color, radius = "1.8rem", visible = false, hoverable = true }) => (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'} ${hoverable && !visible ? 'group-hover:opacity-100' : ''}`}>
        <rect 
            x="0" y="0" width="100%" height="100%" 
            rx={radius} fill="none" 
            stroke={color} strokeWidth="3"
            className="animate-border-trace-cw"
            style={{ 
                filter: `drop-shadow(0 0 10px ${color})`,
                strokeDasharray: '80 600'
            }}
        />
        <rect 
            x="0" y="0" width="100%" height="100%" 
            rx={radius} fill="none" 
            stroke={color} strokeWidth="2"
            className="opacity-60 animate-border-trace-ccw"
            style={{ 
                filter: `drop-shadow(0 0 12px ${color})`,
                strokeDasharray: '120 800'
            }}
        />
    </svg>
);

const PrimaryNavModule: React.FC<{
    icon: React.ReactNode;
    label: string;
    subLabel: string;
    onClick: () => void;
    colorClass: string;
    status: string;
}> = ({ icon, label, subLabel, onClick, colorClass, status }) => {
    const hexMap: Record<string, string> = {
        rose: '#f43f5e',
        cyan: '#22d3ee',
        amber: '#f59e0b',
        emerald: '#10b981',
        blue: '#3b82f6',
        purple: '#a855f7'
    };

    return (
        <button 
            onClick={onClick}
            className={`relative flex flex-col items-start p-6 rounded-[1.8rem] bg-zinc-900 border-2 border-zinc-700 hover:border-zinc-500 transition-all group overflow-hidden h-full text-left shadow-xl ${colorClass === 'rose' ? 'bg-rose-950/20 border-rose-500/40' : ''}`}
        >
            <DualCometBorder color={hexMap[colorClass] || '#22d3ee'} hoverable={true} />
            
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${colorClass}-500/10 blur-3xl group-hover:bg-${colorClass}-500/20 transition-colors`}></div>
            
            <div className="relative w-full flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-zinc-950 border border-zinc-700 group-hover:border-${colorClass}-500/50 transition-all shadow-lg`}>
                    <div className={`text-${colorClass}-400 group-hover:scale-110 transition-transform`}>{icon}</div>
                </div>
                <div className="flex items-center space-x-2 bg-black/60 px-3 py-1 rounded-lg border border-zinc-800">
                    <div className={`w-1.5 h-1.5 rounded-full bg-${colorClass}-500 animate-pulse shadow-[0_0_8px_${colorClass}]`}></div>
                    <span className={`text-[8px] font-black uppercase tracking-widest text-${colorClass}-500`}>{status}</span>
                </div>
            </div>

            <div className="relative mt-auto w-full">
                <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-none mb-2 break-words">{label}</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-tight line-clamp-2">{subLabel}</p>
            </div>

            <div className={`absolute bottom-6 right-6 text-${colorClass}-500 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-500`}>
                <ArrowRight className="w-5 h-5" />
            </div>
        </button>
    );
};

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate, totalReports, onGenerateMissionForCategory }) => {
    const { t } = useTranslations();
    const [categorySearch, setCategorySearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    
    const [colorIndex, setColorIndex] = useState(0);
    const [showPerimeter, setShowPerimeter] = useState(false);

    useEffect(() => {
        const triggerCycle = () => {
            setShowPerimeter(true);
            setColorIndex(prev => (prev + 1) % PERIMETER_COLORS.length);
            setTimeout(() => {
                setShowPerimeter(false);
            }, 3000);
        };
        triggerCycle();
        const interval = setInterval(triggerCycle, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="animate-fade-in max-w-[1400px] mx-auto px-4 pb-24 font-mono">
            <header className="mb-12 text-center flex flex-col items-center relative pt-8">
                
                <div className="relative z-10 space-y-8 flex flex-col items-center">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase neon-glimmer max-w-5xl leading-[0.9] md:leading-none px-4">
                        Decentralized Public Accountability Ledger
                    </h1>
                    
                    <button 
                        onClick={() => onNavigate('ecosystem')}
                        className="relative group p-1 rounded-3xl overflow-hidden transition-all active:scale-95"
                    >
                        <div className="absolute inset-0 bg-emerald-500/20 blur-[30px] animate-pulse group-hover:bg-emerald-500/40 transition-colors"></div>
                        <div className="relative bg-zinc-950 border-2 border-emerald-500/40 px-10 py-4 rounded-2xl shadow-2xl backdrop-blur-xl group-hover:border-emerald-400 transition-all">
                            <div className="flex items-center space-x-4">
                                <Globe className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform" />
                                <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em]">GOVERNANCE_PROTOCOL</p>
                            </div>
                        </div>
                    </button>

                    <div className="w-full max-w-2xl h-10 relative overflow-hidden mt-4">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 20" preserveAspectRatio="none">
                            <path 
                                className="ekg-path"
                                d="M0 10 L20 10 L22 2 L24 18 L26 10 L50 10 L52 5 L54 15 L56 10 L80 10 L82 0 L85 20 L88 10 L110 10 L112 2 L114 18 L116 10 L140 10 L142 5 L144 15 L146 10 L170 10 L172 0 L175 20 L178 10 L200 10" 
                                fill="none" 
                                stroke="#22d3ee" 
                                strokeWidth="1.2" 
                            />
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none"></div>
                    </div>

                    <p className="text-sm text-zinc-400 font-bold uppercase tracking-[0.5em] mt-2">Global Oversight & P2P Accountability Engine</p>
                </div>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-20">
                <PrimaryNavModule 
                    icon={<Megaphone className="w-8 h-8" />}
                    label="FILE_A_REPORT"
                    subLabel="Initialize Genesis Accountability Shard"
                    status="READY"
                    colorClass="rose"
                    onClick={() => onNavigate('categorySelection')}
                />

                <PrimaryNavModule 
                    icon={<Database className="w-8 h-8" />}
                    label="PUBLIC_LEDGER"
                    subLabel="View All Peer-Verified Shards"
                    status="LIVE_SYNC"
                    colorClass="emerald"
                    onClick={() => onNavigate('transparencyDatabase')}
                />

                <PrimaryNavModule 
                    icon={<Activity className="w-8 h-8" />}
                    label="MY_REPORTS"
                    subLabel="Your Personal History & Impact Logs"
                    status="SECURE"
                    colorClass="cyan"
                    onClick={() => onNavigate('hub', undefined, 'my_reports')}
                />

                <PrimaryNavModule 
                    icon={<Target className="w-8 h-8" />}
                    label="FIELD_MISSIONS"
                    subLabel="Active Regional Tasks & Directives"
                    status="ACTIVE"
                    colorClass="amber"
                    onClick={() => onNavigate('liveIntelligence')}
                />

                <PrimaryNavModule 
                    icon={<Package className="w-8 h-8" />}
                    label="ASSET_ARCHIVE"
                    subLabel="View Shard Evidence & Milestone Badges"
                    status="SECURE"
                    colorClass="emerald"
                    onClick={() => onNavigate('heroHub', undefined, 'collection')}
                />

                <PrimaryNavModule 
                    icon={<Coins className="w-8 h-8" />}
                    label="COIN_EXCHANGE"
                    subLabel="Manage P2P Resource & Token Transfers"
                    status="ACTIVE"
                    colorClass="amber"
                    onClick={() => onNavigate('heroHub', undefined, 'vault')}
                />

                <PrimaryNavModule 
                    icon={<Award className="w-8 h-8" />}
                    label="BADGE_REGISTRY"
                    subLabel="Monitor Accreditation & Rank Progress"
                    status="SYNCED"
                    colorClass="cyan"
                    onClick={() => onNavigate('heroHub', undefined, 'profile')}
                />

                <PrimaryNavModule 
                    icon={<Globe className="w-8 h-8" />}
                    label="ECOSYSTEM"
                    subLabel="Circular Economy & Token Governance"
                    status="VERIFIED"
                    colorClass="blue"
                    onClick={() => onNavigate('ecosystem')}
                />

                <PrimaryNavModule 
                    icon={<Phone className="w-8 h-8" />}
                    label="ESCALATION_HUB"
                    subLabel="Automated AI Vox & Live Field Queue"
                    status="ALERT"
                    colorClass="rose"
                    onClick={() => onNavigate('outreachEscalation')}
                />

                <PrimaryNavModule 
                    icon={<Gem className="w-8 h-8" />}
                    label="MINT_STATION"
                    subLabel="Forge Permanent Truth Artifacts"
                    status="ACTIVE"
                    colorClass="amber"
                    onClick={() => onNavigate('heroHub', undefined, 'mint')}
                />

                <PrimaryNavModule 
                    icon={<Award className="w-8 h-8" />}
                    label="ACADEMY"
                    subLabel="Accreditation & Logic Training"
                    status="OPEN"
                    colorClass="emerald"
                    onClick={() => onNavigate('academy')}
                />

                <PrimaryNavModule 
                    icon={<Activity className="w-8 h-8" />}
                    label="QR_LIVE_SAVER"
                    subLabel="Sync Life-Line Medical Shards"
                    status="HEALTH"
                    colorClass="rose"
                    onClick={() => onNavigate('medicalOutpost')}
                />

                <PrimaryNavModule 
                    icon={<Map className="w-8 h-8" />}
                    label="THREAT_MAP"
                    subLabel="Visual Heatmap of Global Incidents"
                    status="SYNCED"
                    colorClass="cyan"
                    onClick={() => onNavigate('threatMap')}
                />

                <PrimaryNavModule 
                    icon={<Scale className="w-8 h-8" />}
                    label="AI_REGULATION"
                    subLabel="Oversight Protocols for Rogue Nodes"
                    status="OVERSIGHT"
                    colorClass="purple"
                    onClick={() => onNavigate('aiRegulationHub')}
                />

                <PrimaryNavModule 
                    icon={<Activity className="w-8 h-8" />}
                    label="WORK_LOG"
                    subLabel="Community Contribution Feed"
                    status="LOGGING"
                    colorClass="blue"
                    onClick={() => onNavigate('hub', undefined, 'work_feed')}
                />

                <PrimaryNavModule 
                    icon={<Heart className="w-8 h-8" />}
                    label="SUPPORT_NODE"
                    subLabel="Watch Ads or Donate to Sustain Nodes"
                    status="SUSTAIN"
                    colorClass="purple"
                    onClick={() => onNavigate('sustainmentCenter')}
                />
            </div>

            <BlockchainStatusPanel totalReports={totalReports} />
            
            <div className="my-20 border-t border-zinc-900"></div>
            
            <div className="flex flex-col items-center gap-8 mb-16 max-w-4xl mx-auto relative z-20">
                <h2 className="text-3xl font-black text-white tracking-tighter text-center uppercase leading-none">Dispatch_Directory</h2>
                <div className="w-full">
                     <div className="relative group">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-8">
                            <Search className="h-6 w-6 text-zinc-600 group-focus-within:text-cyan-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          placeholder="Filter targets by domain..."
                          className="w-full pl-20 pr-20 py-6 bg-zinc-950 border-2 border-zinc-800 rounded-[2.5rem] focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all text-white font-bold tracking-tight text-xl shadow-inner uppercase placeholder:text-zinc-900"
                        />
                    </div>
                </div>
            </div>
            
            <div className="relative p-1 rounded-[3.5rem] group/grid overflow-visible z-20">
                <DualCometBorder 
                    color={PERIMETER_COLORS[colorIndex]} 
                    radius="3.5rem" 
                    visible={showPerimeter} 
                    hoverable={false}
                />
                
                <div className="bg-black/40 rounded-[3.4rem] p-8 md:p-12 border border-zinc-900 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...CATEGORIES_WITH_ICONS]
                          .sort((a, b) => t(a.translationKey).localeCompare(t(b.translationKey)))
                          .filter(cat => t(cat.translationKey).toLowerCase().includes(categorySearch.toLowerCase()))
                          .map((cat) => (
                            <div
                                key={cat.value}
                                className={`group/card relative rounded-[2.5rem] overflow-hidden transition-all duration-300 border-2 ${activeCategory === cat.value ? 'bg-zinc-900 border-cyan-500 shadow-2xl scale-[1.03] z-20' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 shadow-lg'}`}
                            >
                                <DualCometBorder color="#06b6d4" radius="2.5rem" hoverable={true} />
                                <button
                                    onClick={() => setActiveCategory(activeCategory === cat.value ? null : cat.value)}
                                    className="w-full flex flex-col items-center justify-center text-center p-10 min-h-[200px]"
                                >
                                    <div className="text-6xl mb-6 transition-transform duration-500 group-hover/card:scale-110">
                                    {cat.icon}
                                    </div>
                                    <span className="font-black text-lg text-white transition-colors tracking-tight uppercase">
                                    {t(cat.translationKey)}
                                    </span>
                                </button>
                                {activeCategory === cat.value && (
                                    <div className="p-8 border-t border-zinc-800 animate-fade-in-fast flex flex-col gap-4 bg-zinc-950">
                                        <button
                                            onClick={() => onNavigate('reportSubmission', cat.value)}
                                            className="group/btn relative w-full flex items-center justify-center space-x-4 bg-white text-black font-black py-5 px-6 rounded-2xl hover:bg-rose-50 transition-all uppercase text-xs tracking-widest shadow-xl active:scale-95 overflow-hidden border-2 border-transparent hover:border-rose-500/50"
                                        >
                                            <DualCometBorder color="#f43f5e" radius="1rem" hoverable={true} />
                                            <Megaphone className="w-5 h-5 relative z-10 text-rose-600" />
                                            <span className="relative z-10">File_A_Report</span>
                                        </button>
                                        <button
                                            onClick={() => onGenerateMissionForCategory(cat.value)}
                                            className="group/btn relative w-full flex items-center justify-center space-x-4 bg-cyan-600 text-white font-black py-5 px-6 rounded-2xl hover:bg-cyan-500 transition-all uppercase text-xs tracking-widest shadow-xl active:scale-95 overflow-hidden border-2 border-transparent hover:border-cyan-300/50"
                                        >
                                            <DualCometBorder color="#ffffff" radius="1rem" hoverable={true} />
                                            <Zap className="w-5 h-5 fill-current relative z-10" />
                                            <span className="relative z-10">Tactical_Missions</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

             <style>{`
                .neon-glimmer {
                    color: #fff;
                    text-shadow: 0 0 7px #fff, 0 0 10px #06b6d4, 0 0 21px #06b6d4;
                    animation: glimmer 3s infinite alternate;
                }
                @keyframes glimmer {
                    from { opacity: 1; text-shadow: 0 0 7px #fff, 0 0 10px #06b6d4, 0 0 21px #06b6d4; }
                    to { opacity: 0.7; text-shadow: 0 0 4px #fff, 0 0 7px #06b6d4, 0 0 15px #06b6d4; }
                }
                .ekg-path {
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                    animation: ekg-flow 4s linear infinite;
                }
                @keyframes ekg-flow {
                    0% { stroke-dashoffset: 200; }
                    100% { stroke-dashoffset: -200; }
                }
                
                @keyframes border-trace-cw {
                    0% { stroke-dashoffset: 1100; }
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes border-trace-ccw {
                    0% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: 1350; }
                }
                .animate-border-trace-cw {
                    animation: border-trace-cw 3s linear infinite;
                }
                .animate-border-trace-ccw {
                    animation: border-trace-ccw 2.5s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default MainMenu;
