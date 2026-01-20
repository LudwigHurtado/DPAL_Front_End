
import React from 'react';
/* FIX: Added CheckCircle to imports */
import { ArrowLeft, Zap, ShieldCheck, Target, Broadcast, Database, Sparkles, Coins, Gem, Monitor, Scale, Activity, CheckCircle } from './icons';

interface EcosystemOverviewProps {
    onReturn: () => void;
}

const ProtocolCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; color: string }> = ({ title, desc, icon, color }) => (
    <div className={`p-8 bg-zinc-900/60 border-2 border-zinc-800 hover:border-${color}-500/50 rounded-[2.5rem] transition-all group overflow-hidden relative`}>
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 blur-2xl group-hover:bg-${color}-500/10 transition-colors`}></div>
        <div className={`p-4 bg-zinc-950 rounded-2xl border border-zinc-800 mb-6 group-hover:scale-110 transition-transform inline-block text-${color}-400`}>
            {icon}
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 leading-none">{title}</h3>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed italic">"{desc}"</p>
    </div>
);

const EcosystemOverview: React.FC<EcosystemOverviewProps> = ({ onReturn }) => {
    return (
        <div className="animate-fade-in font-mono text-white max-w-7xl mx-auto px-4 pb-20">
            <button
                onClick={onReturn}
                className="inline-flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-cyan-400 transition-colors mb-12 group"
            >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span>TERMINAL_RETURN</span>
            </button>

            <header className="mb-20 text-center">
                <div className="inline-flex items-center space-x-4 mb-6 bg-blue-500/10 border border-blue-500/30 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                    <span className="text-xs font-black text-blue-400 uppercase tracking-[0.4em]">SYSTEM_OVERVIEW_PROTOCOL</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 leading-none">The_DPAL_Economy</h1>
                <p className="text-zinc-500 text-sm font-bold tracking-[0.4em] uppercase max-w-3xl mx-auto">A gamified public-good generated economy powered by proof-of-impact</p>
            </header>

            {/* 1. Tokenomics Lexicon Section - THE COINS REQUESTED */}
            <section className="mb-32 space-y-16">
                 <div className="text-center">
                    <h2 className="text-4xl font-black tracking-tighter uppercase text-white mb-4">The_Ledger_Lexicon</h2>
                    <p className="text-zinc-500 text-xs font-bold tracking-[0.4em] uppercase">Understanding the primary value-transfer shards</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* IMPACT TOKEN */}
                     <div className="flex flex-col md:flex-row items-center p-10 bg-zinc-900 border-2 border-zinc-800 rounded-[3rem] gap-10 hover:border-emerald-500/40 transition-all group shadow-2xl relative overflow-hidden">
                         <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
                         <div className="w-56 h-56 flex-shrink-0 relative z-10">
                             <img src="/02d96460-018a-4d44-95b4-9d3758368b73.png" alt="Impact Token" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
                         </div>
                         <div className="relative z-10 space-y-4">
                             <div className="inline-flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/30 px-4 py-1 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                                 <CheckCircle className="w-3 h-3" />
                                 <span>Protocol: IMPACT</span>
                             </div>
                             <h3 className="text-3xl font-black text-white uppercase tracking-tighter">IMPACT_TOKEN</h3>
                             <p className="text-sm text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">Proof-of-Impact Reward</p>
                             <p className="text-xs text-zinc-500 font-medium leading-relaxed italic border-l-2 border-emerald-500 pl-4">
                                "The primary accreditation for field resolutions. Earned when a user successfully tracks an issue from submission to resolved status. Cannot be purchased; it is a permanent mark of civic contribution"
                             </p>
                         </div>
                     </div>

                     {/* DPAL CREDIT */}
                     <div className="flex flex-col md:flex-row items-center p-10 bg-zinc-900 border-2 border-zinc-800 rounded-[3rem] gap-10 hover:border-blue-500/40 transition-all group shadow-2xl relative overflow-hidden">
                         <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
                         <div className="w-56 h-56 flex-shrink-0 relative z-10">
                             <img src="/e2cb4b1a-c3fe-4eab-9ba5-e1aca2a0caa6.png" alt="DPAL Credit" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                         </div>
                         <div className="relative z-10 space-y-4">
                             <div className="inline-flex items-center space-x-2 bg-blue-950/40 border border-blue-500/30 px-4 py-1 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest">
                                 <Zap className="w-3 h-3" />
                                 <span>System: UTILITY</span>
                             </div>
                             <h3 className="text-3xl font-black text-white uppercase tracking-tighter">DPAL_CREDIT</h3>
                             <p className="text-sm text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">Sadle Accountability Unit</p>
                             <p className="text-xs text-zinc-500 font-medium leading-relaxed italic border-l-2 border-blue-500 pl-4">
                                "The 'Gas' of the accountability engine. Used to file reports, upvote evidence, and trigger tactical missions. Purchased via the store or earned through high-fidelity data dispatches"
                             </p>
                         </div>
                     </div>

                     {/* IMPT CONV */}
                     <div className="flex flex-col md:flex-row items-center p-10 bg-zinc-900 border-2 border-zinc-800 rounded-[3rem] gap-10 hover:border-amber-500/40 transition-all group shadow-2xl relative overflow-hidden">
                         <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
                         <div className="w-56 h-56 flex-shrink-0 relative z-10">
                             <img src="/3fe0f391-d51f-4afb-8048-dcf6ccd9259e.png" alt="IMPT Shard" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
                         </div>
                         <div className="relative z-10 space-y-4">
                             <div className="inline-flex items-center space-x-2 bg-amber-950/40 border border-amber-500/30 px-4 py-1 rounded-full text-[9px] font-black text-amber-400 uppercase tracking-widest">
                                 <Broadcast className="w-3 h-3" />
                                 <span>Level: CONSENSUS</span>
                             </div>
                             <h3 className="text-3xl font-black text-white uppercase tracking-tighter">IMPACT_SHARD</h3>
                             <p className="text-sm text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">Global Consensus Metric</p>
                             <p className="text-xs text-zinc-500 font-medium leading-relaxed italic border-l-2 border-amber-500 pl-4">
                                "A rare synthesis token that represents the aggregation of multiple IMPACT tokens within a specific sector (e.g. 10 Police Misconduct resolutions). Required for Sentinel-level promotions"
                             </p>
                         </div>
                     </div>

                     {/* MASTER DPAL */}
                     <div className="flex flex-col md:flex-row items-center p-10 bg-zinc-900 border-2 border-zinc-800 rounded-[3rem] gap-10 hover:border-cyan-500/40 transition-all group shadow-2xl relative overflow-hidden">
                         <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
                         <div className="w-56 h-56 flex-shrink-0 relative z-10">
                             <img src="/53771c0d-3d1d-4abd-bd64-bc8aa9f5ae9d.png" alt="DPAL Governance" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]" />
                         </div>
                         <div className="relative z-10 space-y-4">
                             <div className="inline-flex items-center space-x-2 bg-cyan-950/40 border border-cyan-500/30 px-4 py-1 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest">
                                 <Database className="w-3 h-3" />
                                 <span>Root: GOVERNANCE</span>
                             </div>
                             <h3 className="text-3xl font-black text-white uppercase tracking-tighter">DPAL_COIN</h3>
                             <p className="text-sm text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">Network Governance Protocol</p>
                             <p className="text-xs text-zinc-500 font-medium leading-relaxed italic border-l-2 border-cyan-500 pl-4">
                                "The foundational token of the entire network. Used to vote on system-wide upgrades, sector funding priorities, and final validation of the highest-stakes accountability blocks"
                             </p>
                         </div>
                     </div>
                 </div>
            </section>

            {/* 2. Core Purpose & Sustainability Section */}
            <section className="mb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-cyan-400 mb-6 flex items-center gap-4">
                                <Monitor className="w-8 h-8"/> 01. Core_Principles
                            </h2>
                            <p className="text-lg text-zinc-300 leading-relaxed font-medium italic border-l-4 border-cyan-500 pl-8">
                                "DPAL is more than a ledger; it is a self-sustaining organism where community oversight creates real-world value. We operate on three primary pillars: Decentralized Governance, Incentive Rewards, and Transparent Validation"
                            </p>
                        </div>
                        
                        <div className="bg-zinc-900/40 p-8 rounded-[3rem] border border-zinc-800 space-y-6">
                            <h4 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Network_Sustainability_Model</h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg"><Coins className="w-4 h-4 text-emerald-500"/></div>
                                    <p className="text-[11px] text-zinc-400 leading-relaxed uppercase">
                                        <span className="text-white font-black">USER_PURCHASES:</span> HeroCredit (HC) purchases directly fund the Gemini Oracle nodes and permanent ledger storage on IPFS.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-rose-500/10 rounded-lg"><Broadcast className="w-4 h-4 text-rose-500"/></div>
                                    <p className="text-[11px] text-zinc-400 leading-relaxed uppercase">
                                        <span className="text-white font-black">SPONSORED_BATTLES:</span> Optional targeted ads or "Sponsored Missions" allow organizations to offer HC rewards for specific environmental or civic tasks.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative group">
                         <div className="absolute -inset-4 bg-cyan-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <div className="relative rounded-[3rem] overflow-hidden border-4 border-zinc-800 bg-zinc-900/50 shadow-2xl">
                             <img 
                                src="/02d96460-018a-4d44-95b4-9d3758368b73.png" 
                                alt="Impact Visual" 
                                className="w-full h-auto object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
                             />
                             <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">Exhibit_Alpha: The Three Pillars</p>
                             </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* 3. Circular Economy Flow */}
            <section className="mb-32">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-7 relative group">
                        <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative rounded-[3rem] overflow-hidden border-4 border-zinc-800 bg-zinc-900/50 shadow-2xl">
                             <img 
                                src="/c1675b74-363c-4c42-92fd-2ca6e7335dc0.png" 
                                alt="Impact NFT Shard" 
                                className="w-full h-auto object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
                             />
                             <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Exhibit_Beta: Circular Token Power</p>
                             </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-12">
                         <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-emerald-400 mb-6">02. Network_Circulation</h2>
                            <p className="text-base text-zinc-400 font-bold leading-relaxed uppercase tracking-wider">
                                Sector modules consume and generate tokens to keep the system self-sustaining and community governed.
                            </p>
                         </div>

                         <div className="space-y-6">
                            <ProtocolCard 
                                title="Module_Ingest" 
                                desc="Reporting costs are subsidized by the community staking pool" 
                                icon={<Database className="w-5 h-5"/>} 
                                color="cyan" 
                            />
                            <ProtocolCard 
                                title="Verification_Loop" 
                                desc="High-rank guardians earn tokens for auditing raw field dispatches" 
                                icon={<Zap className="w-5 h-5"/>} 
                                color="amber" 
                            />
                            <ProtocolCard 
                                title="Public_Governance" 
                                desc="DPAL Coin holders vote on which sector modules receive funding" 
                                icon={<Scale className="w-5 h-5"/>} 
                                color="emerald" 
                            />
                         </div>
                    </div>
                 </div>
            </section>

            {/* 4. The Hero Hub Experience */}
            <section className="mb-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black tracking-tighter uppercase text-white mb-4">The_Operative_Interface</h2>
                    <p className="text-zinc-500 text-xs font-bold tracking-[0.4em] uppercase">Managing your personal accountability ledger</p>
                </div>

                <div className="relative group max-w-5xl mx-auto">
                    <div className="absolute -inset-10 bg-purple-500/10 blur-[100px] opacity-30 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative rounded-[4rem] overflow-hidden border-[12px] border-zinc-900 bg-zinc-950 shadow-4xl">
                         <img 
                            src="/53771c0d-3d1d-4abd-bd64-bc8aa9f5ae9d.png" 
                            alt="Hero Hub UI Background" 
                            className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                         
                         <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-10">
                             <div className="max-w-xl">
                                <h3 className="text-3xl font-black uppercase text-white mb-4 leading-none">Hero_Hub_Protocol</h3>
                                <p className="text-sm text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
                                    Your central terminal for tracking Civic Integrity NFTs, Lifetime Badges, and Token Boosts. Solve AI missions to improve the global decentralised ledger.
                                </p>
                             </div>
                             <button onClick={onReturn} className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 px-12 rounded-2xl uppercase tracking-[0.3em] text-xs shadow-3xl active:scale-95 transition-all">Enter_Hub_Now</button>
                         </div>
                    </div>
                </div>
            </section>

            <footer className="mt-40 pt-20 border-t border-zinc-900 text-center space-y-8">
                 <div className="flex justify-center space-x-12 opacity-30 grayscale group-hover:grayscale-0 transition-all">
                     <ShieldCheck className="w-12 h-12"/>
                     <Activity className="w-12 h-12"/>
                     <Target className="w-12 h-12"/>
                     <Database className="w-12 h-12"/>
                 </div>
                 <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em]">Network_Code: DPAL-X_CORE_v1.0.42_STABLE</p>
            </footer>

            <style>{`
                .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .shadow-4xl { box-shadow: 0 40px 100px rgba(0,0,0,0.8); }
            `}</style>
        </div>
    );
};

export default EcosystemOverview;
