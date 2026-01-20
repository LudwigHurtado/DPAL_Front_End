
import React, { useState } from 'react';
import { SubscriptionTier, type Hero } from '../types';
// Added missing Activity icon import
import { ArrowLeft, ShieldCheck, Zap, Sparkles, Target, Coins, Broadcast, Database, Star, Loader, Check, Monitor, Activity } from './icons';

interface SubscriptionViewProps {
    hero: Hero;
    onReturn: () => void;
    onUpgrade: (tier: SubscriptionTier) => void;
}

const TIER_DATA = [
    {
        id: SubscriptionTier.Scout,
        label: 'Scout_Base',
        price: '0.00',
        color: 'zinc',
        accent: '#52525b',
        features: [
            'Standard Reporting Access',
            'Basic Community Feed',
            '1x HeroCredit Multiplier',
            'Community Support Node'
        ]
    },
    {
        id: SubscriptionTier.Guardian,
        label: 'Guardian_Pro',
        price: '9.99',
        color: 'cyan',
        accent: '#06b6d4',
        features: [
            'Deep Forensic Neural Scans',
            '1.5x HC Multiplier',
            'Priority Report Indexing',
            'Exclusive Profile Aura'
        ]
    },
    {
        id: SubscriptionTier.Sentinel,
        label: 'Sentinel_Elite',
        price: '24.99',
        color: 'amber',
        accent: '#f59e0b',
        features: [
            'Real-time Threat Mapping',
            '2x HC Multiplier',
            'Priority Manual Audits',
            'Advanced Tactical Dossiers'
        ]
    },
    {
        id: SubscriptionTier.Oracle,
        label: 'Oracle_Genesis',
        price: '49.99',
        color: 'emerald',
        accent: '#10b981',
        features: [
            'Unlimited AI Neural Analysis',
            'Ledger Governance Rights (+5)',
            'Network-wide Broadcast Access',
            'Custom Genesis Shard Minting'
        ]
    }
];

const DualCometBorder: React.FC<{ color: string; visible: boolean }> = ({ color, visible }) => (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-20'}`}>
        <rect 
            x="0" y="0" width="100%" height="100%" 
            rx="2rem" fill="none" 
            stroke={color} strokeWidth="2"
            className="animate-border-trace-cw"
            style={{ 
                filter: `drop-shadow(0 0 10px ${color})`,
                strokeDasharray: '60 600'
            }}
        />
    </svg>
);

const SubscriptionView: React.FC<SubscriptionViewProps> = ({ hero, onReturn, onUpgrade }) => {
    const [hoveredTier, setHoveredTier] = useState<SubscriptionTier | null>(null);
    const [isProcessing, setIsProcessing] = useState<SubscriptionTier | null>(null);

    const handleUpgrade = (tier: SubscriptionTier) => {
        if (hero.subscriptionTier === tier) return;
        setIsProcessing(tier);
        setTimeout(() => {
            onUpgrade(tier);
            setIsProcessing(null);
        }, 2000);
    };

    return (
        <div className="animate-fade-in font-mono text-white max-w-7xl mx-auto px-4 pb-20">
            <button
                onClick={onReturn}
                className="inline-flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-cyan-400 transition-colors mb-12 group"
            >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span>TERMINAL_RETURN</span>
            </button>

            <header className="mb-20 text-center relative">
                 <div className="absolute inset-x-0 -top-20 h-40 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)] animate-pulse"></div>
                 
                 <div className="inline-flex items-center space-x-4 mb-6 bg-cyan-500/10 border border-cyan-500/30 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2)] relative z-10">
                    <Monitor className="w-6 h-6 text-cyan-400" />
                    <span className="text-xs font-black text-cyan-400 uppercase tracking-[0.4em]">NODE_TIER_CALIBRATION</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 leading-none relative z-10">Upgrade_Clearance</h1>
                <p className="text-zinc-500 text-sm font-bold tracking-[0.4em] uppercase max-w-3xl mx-auto relative z-10">Enhance your neural link to the ledger for superior oversight capabilities</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {TIER_DATA.map((tier) => {
                    const isActive = hero.subscriptionTier === tier.id;
                    const isProcessingThis = isProcessing === tier.id;
                    
                    return (
                        <div
                            key={tier.id}
                            onMouseEnter={() => setHoveredTier(tier.id)}
                            onMouseLeave={() => setHoveredTier(null)}
                            className={`flex flex-col p-10 rounded-[2.5rem] bg-zinc-900 border-2 transition-all duration-500 group relative overflow-hidden h-full ${isActive ? `border-${tier.color}-500 shadow-[0_0_40px_rgba(0,0,0,0.5)] scale-[1.02] z-10` : 'border-zinc-800 hover:border-zinc-600 shadow-xl'}`}
                        >
                            <DualCometBorder color={tier.accent} visible={isActive || hoveredTier === tier.id} />
                            
                            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity bg-${tier.color}-500`}></div>

                            <div className="relative z-10 mb-8">
                                <div className={`inline-flex p-3 rounded-2xl mb-6 ${isActive ? `bg-${tier.color}-500 text-white` : `bg-zinc-950 text-zinc-600 border border-zinc-800 group-hover:text-${tier.color}-400 group-hover:border-${tier.color}-900`}`}>
                                    {/* Added Activity icon to imports to resolve the "Cannot find name 'Activity'" error */}
                                    {tier.id === SubscriptionTier.Oracle ? <Sparkles className="w-6 h-6"/> : tier.id === SubscriptionTier.Sentinel ? <Target className="w-6 h-6"/> : tier.id === SubscriptionTier.Guardian ? <ShieldCheck className="w-6 h-6"/> : <Activity className="w-6 h-6"/>}
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-1 text-white">{tier.label}</h3>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-4xl font-black tracking-tighter">${tier.price}</span>
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">/ Month</span>
                                </div>
                            </div>

                            <div className="relative z-10 flex-grow space-y-4 mb-10">
                                {tier.features.map((feature, i) => (
                                    <div key={i} className="flex items-start space-x-3 group/feat">
                                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? `text-${tier.color}-400` : 'text-zinc-700 group-hover:text-cyan-500'}`} />
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 leading-relaxed group-hover/feat:text-white transition-colors">{feature}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleUpgrade(tier.id)}
                                disabled={isActive || isProcessingThis}
                                className={`relative z-10 w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all active:scale-95 shadow-2xl ${
                                    isActive 
                                    ? `bg-${tier.color}-600/20 text-${tier.color}-400 border border-${tier.color}-500/50 cursor-default`
                                    : `bg-white text-black hover:bg-zinc-200 disabled:opacity-50`
                                }`}
                            >
                                {isProcessingThis ? (
                                    <div className="flex items-center justify-center space-x-3">
                                        <Loader className="w-4 h-4 animate-spin"/>
                                        <span>CALIBRATING...</span>
                                    </div>
                                ) : isActive ? (
                                    'ACTIVE_CLEARANCE'
                                ) : (
                                    'SYNC_PROTOCOL'
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            <footer className="mt-20 pt-12 border-t border-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-cyan-500 flex items-center gap-3">
                        <Database className="w-4 h-4"/> 01. P2P Sustainability
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed">Subscriptions provide the bandwidth and compute credits required for the decentralized Gemini Oracle network nodes.</p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 flex items-center gap-3">
                        <Broadcast className="w-4 h-4"/> 02. Data Purity
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed">Higher tiers enable deeper forensic validation checks, increasing the permanent TruthScore of your submitted field dispatches.</p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-3">
                        <Star className="w-4 h-4"/> 03. Legend Status
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed">Elite status holders participate in Protocol Governance, voting on network updates and sectoral funding allocations.</p>
                </div>
            </footer>

            <style>{`
                @keyframes border-trace-cw {
                    0% { stroke-dashoffset: 660; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-border-trace-cw {
                    animation: border-trace-cw 3s linear infinite;
                }
                .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default SubscriptionView;
