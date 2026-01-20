
import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, User, Coins, Gem, Globe, Maximize2, Search, Monitor, Broadcast, Store, List, Package, Database, Zap, Target, Award, ChevronLeft, ChevronRight, Activity, X, Home, Sparkles, AlertTriangle, Megaphone } from './icons';
import { useTranslations } from '../i18n';
import { type Hero, SubscriptionTier } from '../types';
import { TextScale, type View } from '../App';
import { isAiEnabled } from '../services/geminiService';

interface HeaderProps {
    onNavigateToHeroHub: () => void;
    onNavigateHome: () => void;
    onNavigateToReputationAndCurrency: () => void;
    onNavigateMissions: () => void;
    onNavigate: (view: View, category?: any, tab?: any) => void;
    hero: Hero;
    textScale: TextScale;
    setTextScale: (scale: TextScale) => void;
}

const AiStatusIndicator: React.FC = () => {
    const [status, setStatus] = useState<'ONLINE' | 'OFFLINE' | 'DEGRADED'>('OFFLINE');

    useEffect(() => {
        const check = () => {
            const enabled = isAiEnabled();
            setStatus(enabled ? 'ONLINE' : 'OFFLINE');
        };
        check();
        const interval = setInterval(check, 10000);
        return () => clearInterval(interval);
    }, []);

    const config = {
        ONLINE: { label: 'AI_ON', color: 'text-emerald-400', dot: 'bg-emerald-500', bg: 'bg-emerald-950/20', border: 'border-emerald-500/30' },
        OFFLINE: { label: 'AI_OFF', color: 'text-zinc-600', dot: 'bg-zinc-700', bg: 'bg-zinc-900', border: 'border-zinc-800' },
        DEGRADED: { label: 'AI_DEGRADED', color: 'text-rose-400', dot: 'bg-rose-500', bg: 'bg-rose-950/20', border: 'border-rose-500/30' }
    }[status];

    return (
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all duration-500 ${config.bg} ${config.border}`}>
            <div className="relative flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status !== 'OFFLINE' ? 'animate-pulse shadow-[0_0_8px_currentColor]' : ''}`}></div>
                {status === 'ONLINE' && <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>}
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest ${config.color}`}>
                {config.label}
            </span>
            {status === 'ONLINE' ? <Sparkles className="w-2.5 h-2.5 text-emerald-500" /> : <AlertTriangle className={`w-2.5 h-2.5 ${config.color}`} />}
        </div>
    );
};

const DualCometBorder: React.FC<{ color: string }> = ({ color }) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
        <rect 
            x="0" y="0" width="100%" height="100%" 
            rx="0.75rem" fill="none" 
            stroke={color} strokeWidth="2.5"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-border-trace-cw-fast"
            style={{ 
                filter: `drop-shadow(0 0 8px ${color})`,
                strokeDasharray: '40 250'
            }}
        />
        <rect 
            x="0" y="0" width="100%" height="100%" 
            rx="0.75rem" fill="none" 
            stroke={color} strokeWidth="1.5"
            className="opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-border-trace-ccw-fast"
            style={{ 
                filter: `drop-shadow(0 0 12px ${color})`,
                strokeDasharray: '60 300'
            }}
        />
    </svg>
);

const SystemTicker: React.FC = () => {
    const messages = [
        "DPAL_CREDIT (Utility): $0.005 // THE FUEL FOR ACCOUNTABILITY. USE TO FILE REPORTS AND INITIATE P2P AUDITS.",
        "IMPACT_TOKEN (Proof): VALUE_PRICELESS // NON-TRADABLE ACCREDITATION EARNED VIA VERIFIED FIELD RESOLUTIONS.",
        "IMPACT_SHARD (Consensus): MULTI-BLOCK AGGREGATION. REQUIRED FOR SENTINEL-CLASS PROMOTION AND VOTE WEIGHT.",
        "DPAL_COIN (Governance): NETWORK ANCHOR. VOTE ON PROTOCOL UPGRADES AND SECTOR FUNDING ALLOCATIONS.",
        "MARKET_SNAPSHOT: DPAL_CREDIT @ $0.005 (+0.12%) // NETWORK_STABILITY: 99.8% // ACTIVE_NODES: 12,405",
        "NEW_HERO_MILESTONE: SECTOR_7_INFRASTRUCTURE_RESTORED // POSITIVE_CIVIC_IMPACT: +12%",
        "OPERATIVE_XP_BONUS_ACTIVE: FIELD_REPORTING_IN_PROGRESS // DPAL_REWARD_POOL: +50,000 HC REFRESHED"
    ];

    return (
        <div className="flex-grow mx-2 md:mx-4 overflow-hidden relative group h-10 border-x border-zinc-800/30 flex items-center bg-black/80 rounded-xl px-4 min-w-0">
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent z-10"></div>
            
            <div className="whitespace-nowrap animate-ticker flex items-center space-x-12">
                {[...messages, ...messages].map((msg, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,1)] animate-pulse"></div>
                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em] transition-all duration-500 group-hover:text-white">
                            {msg}
                        </span>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: ticker 150s linear infinite;
                }
                .animate-ticker:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ 
    onNavigateToHeroHub, 
    onNavigateHome, 
    onNavigateToReputationAndCurrency, 
    onNavigateMissions,
    onNavigate,
    hero, 
    textScale, 
    setTextScale 
}) => {
  const { language, setLanguage } = useTranslations();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const toggleScale = () => {
    if (textScale === 'standard') setTextScale('large');
    else if (textScale === 'large') setTextScale('ultra');
    else if (textScale === 'ultra') setTextScale('magnified');
    else setTextScale('standard');
  };

  const handleScroll = () => {
    if (navScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
        setShowLeftArrow(scrollLeft > 10);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
        const scrollAmount = 250;
        navScrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const getTierColor = (tier: SubscriptionTier) => {
      switch(tier) {
          case SubscriptionTier.Oracle: return 'text-emerald-400 border-emerald-500/50';
          case SubscriptionTier.Sentinel: return 'text-amber-400 border-amber-500/50';
          case SubscriptionTier.Guardian: return 'text-cyan-400 border-cyan-500/50';
          default: return 'text-zinc-500 border-zinc-800';
      }
  };

  return (
    <header className="bg-black border-b border-zinc-900 sticky top-0 z-[100] font-mono w-full flex flex-col">
      <div className="w-full px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          
          <button onClick={onNavigateHome} className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/10 blur-lg group-hover:bg-cyan-400/20 transition-all"></div>
              <div className="relative p-2 bg-zinc-900 border border-cyan-500/30 rounded-xl group-hover:border-cyan-400 transition-all">
                  <ShieldCheck className="h-6 w-6 text-cyan-500" />
              </div>
            </div>
            <div className="text-left leading-none hidden xs:block">
              <h1 className="text-xl font-black text-white tracking-tighter uppercase">DPAL</h1>
              <p className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">CORE_V2.5</p>
            </div>
          </button>

          <SystemTicker />

          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
             <AiStatusIndicator />
             
             <div className="hidden lg:flex flex-col items-end mr-2 text-right">
                <span className="text-[9px] font-black text-white uppercase tracking-tighter leading-none">{hero.name}</span>
                <button 
                    onClick={() => onNavigate('subscription')}
                    className={`text-[7px] font-bold uppercase tracking-widest mt-1 px-2 py-0.5 rounded border bg-black/40 hover:bg-white/10 transition-colors ${getTierColor(hero.subscriptionTier)}`}
                >
                    {hero.subscriptionTier.replace('_', ' ')}
                </button>
             </div>

             <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 pr-2 md:pr-3 space-x-2 md:space-x-3 shadow-inner">
                <button 
                    onClick={onNavigateToHeroHub}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center hover:border-cyan-500 transition-colors"
                >
                    {hero.personas.find(p => p.id === hero.equippedPersonaId)?.imageUrl ? (
                        <img src={hero.personas.find(p => p.id === hero.equippedPersonaId)?.imageUrl} alt="P" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-4 h-4 text-zinc-600" />
                    )}
                </button>
                <button onClick={onNavigateToReputationAndCurrency} className="flex items-center space-x-2 outline-none group">
                    <Coins className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col items-start leading-none">
                        <span className="font-black text-white text-[9px] md:text-[10px]">{hero.heroCredits.toLocaleString()}</span>
                        <span className="text-[6px] font-bold text-zinc-500 uppercase tracking-tighter mt-0.5">$0.005/CREDIT</span>
                    </div>
                </button>
                <div className="hidden sm:block w-px h-5 bg-zinc-800 mx-1"></div>
                <button onClick={toggleScale} className="hidden sm:block text-zinc-600 hover:text-white transition-colors" title="Interface Scale">
                    <Maximize2 className="w-3.5 h-3.5" />
                </button>
             </div>
          </div>
      </div>

      <div className="w-full relative px-0 pb-3 pt-1 border-t border-zinc-900/50 flex items-center overflow-hidden group/nav">
        <div className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/30 via-black/5 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/30 via-black/5 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0'}`}></div>

        <div 
            ref={navScrollRef}
            onScroll={handleScroll}
            className="w-full overflow-x-auto no-scrollbar scroll-smooth flex justify-start md:justify-center"
        >
            <div className="flex items-center space-x-6 md:space-x-12 py-3 px-10 md:px-12 min-w-max mx-auto">
                <NavIcon label="TERMINAL_HOME" color="cyan" icon={<Home className="w-5 h-5"/>} onClick={onNavigateHome} />
                <NavIcon label="FILE_REPORT" color="rose" icon={<Megaphone className="w-5 h-5"/>} onClick={() => onNavigate('categorySelection')} />
                <NavIcon label="COMMUNITY_FEED" color="blue" icon={<List className="w-5 h-5"/>} onClick={() => onNavigate('hub')} />
                <NavIcon label="PUBLIC_LEDGER" color="emerald" icon={<Database className="w-5 h-5"/>} onClick={() => onNavigate('transparencyDatabase')} />
                <NavIcon label="FIELD_MISSIONS" color="amber" icon={<Target className="w-5 h-5"/>} onClick={onNavigateMissions} />
                <NavIcon label="HOLODECK" color="purple" icon={<Monitor className="w-5 h-5"/>} onClick={() => onNavigate('trainingHolodeck')} />
                <NavIcon label="ASSET_ARCHIVE" color="blue" icon={<Package className="w-5 h-5"/>} onClick={() => onNavigate('heroHub', undefined, 'collection')} />
                <NavIcon label="COIN_EXCHANGE" color="amber" icon={<Coins className="w-5 h-5"/>} onClick={() => onNavigate('heroHub', undefined, 'vault')} />
                <NavIcon label="BADGE_REGISTRY" color="cyan" icon={<Award className="w-5 h-5"/>} onClick={() => onNavigate('heroHub', undefined, 'profile')} />
            </div>
        </div>

        <div className={`absolute left-4 z-20 transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0'} pointer-events-auto`}>
             <button onClick={() => scrollNav('left')} className="p-2.5 bg-zinc-900/20 rounded-full border border-zinc-700/20 text-zinc-400/80 hover:text-cyan-400 shadow-2xl backdrop-blur-sm active:scale-90 transition-all"><ChevronLeft className="w-5 h-5"/></button>
        </div>
        <div className={`absolute right-4 z-20 transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0'} pointer-events-auto`}>
             <button onClick={() => scrollNav('right')} className="p-2.5 bg-zinc-900/20 rounded-full border border-zinc-700/20 text-zinc-400/80 hover:text-cyan-400 shadow-2xl backdrop-blur-sm active:scale-90 transition-all"><ChevronRight className="w-5 h-5"/></button>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes border-trace-cw-fast {
            0% { stroke-dashoffset: 250; }
            100% { stroke-dashoffset: 0; }
        }
        @keyframes border-trace-ccw-fast {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 320; }
        }
        .animate-border-trace-cw-fast {
            animation: border-trace-cw-fast 2.2s linear infinite;
        }
        .animate-border-trace-ccw-fast {
            animation: border-trace-ccw-fast 3.2s linear infinite;
        }
        @media (max-width: 400px) {
            .xs\\:block { display: block; }
            .hidden.xs\\:block { display: block; }
        }
      `}</style>
    </header>
  );
};

const NavIcon: React.FC<{ icon: React.ReactNode, label: string, color: string, onClick: () => void }> = ({ icon, label, color, onClick }) => {
    const colorHex: Record<string, string> = {
        cyan: '#22d3ee',
        emerald: '#10b981',
        amber: '#f59e0b',
        rose: '#f43f5e',
        purple: '#a855f7',
        blue: '#3b82f6'
    };

    return (
        <button 
            onClick={onClick}
            className="flex flex-col items-center justify-center space-y-2 group transition-all flex-shrink-0 relative px-1 md:px-2"
        >
            <div className="relative p-2.5 md:p-3 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:bg-zinc-800 transition-all shadow-lg overflow-hidden">
                <DualCometBorder color={colorHex[color]} />
                <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-all duration-700 pointer-events-none z-10 rotate-[35deg] translate-x-[-100%] group-hover:translate-x-[100%]"
                    style={{ 
                        background: `linear-gradient(90deg, transparent, ${colorHex[color]}88, transparent)`,
                        width: '200%'
                    }}
                />
                <div 
                    className="relative transition-all duration-300 transform group-hover:scale-110 z-20"
                    style={{ color: colorHex[color] }}
                >
                    <div style={{ filter: `drop-shadow(0 0 5px ${colorHex[color]}44)` }}>
                        {React.cloneElement(icon as React.ReactElement<any>, { className: `w-5 h-5` })}
                    </div>
                </div>
            </div>
            <span className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-500 group-hover:text-white transition-colors text-center w-max">
                {label}
            </span>
        </button>
    );
};

export default Header;
