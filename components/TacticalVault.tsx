import React, { useState, useRef, useMemo } from 'react';
import { useTranslations } from '../i18n';
import type { Hero, Item, QrParcel, Report } from '../types';
import { ShieldCheck, Package, QrCode, Coins, Box, X, ArrowLeft, RefreshCw, Loader, Check, UserCircle, Gem, Zap, Info, FileText, Target, Send, Broadcast, ArrowRight, Award, Star, Hash } from './icons';
import QrScanner from './QrScanner';

interface TacticalVaultProps {
    hero: Hero;
    setHero: React.Dispatch<React.SetStateAction<Hero>>;
    onReturn: () => void;
    reports: Report[];
}

const TacticalVault: React.FC<TacticalVaultProps> = ({ hero, setHero, onReturn, reports }) => {
    const { t } = useTranslations();
    const [activeAction, setActiveAction] = useState<'scan' | 'pack' | 'tutorial' | null>(null);
    const [packType, setPackType] = useState<'credits' | 'item' | 'nft' | null>(null);
    const [hcToPack, setHcToPack] = useState(100);
    const [itemToPack, setItemToPack] = useState<Item | null>(null);
    const [nftToPack, setNftToPack] = useState<Report | null>(null);
    const [targetOperativeId, setTargetOperativeId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [syncMessage, setSyncMessage] = useState<string | null>(null);
    const [viewingParcel, setViewingParcel] = useState<QrParcel | null>(null);
    const processingTimeoutRef = useRef<number | null>(null);

    const nftReports = useMemo(() => reports.filter(r => r.isAuthor && r.earnedNft), [reports]);

    const handlePack = () => {
        if (packType === 'credits' && hero.heroCredits < hcToPack) return;
        if (packType === 'item' && !itemToPack) return;
        if (packType === 'nft' && !nftToPack) return;
        
        setIsProcessing(true);
        processingTimeoutRef.current = window.setTimeout(() => {
            const newParcel: QrParcel = {
                id: `PRCL-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                type: packType === 'nft' ? 'item' : packType!,
                amount: packType === 'credits' ? hcToPack : undefined,
                item: packType === 'item' ? itemToPack! : packType === 'nft' ? {
                    id: nftToPack!.id,
                    name: nftToPack!.earnedNft!.title,
                    type: 'Augmentation',
                    icon: '💎',
                    resonance: 5
                } : undefined,
                sender: hero.name,
                senderId: hero.operativeId,
                targetOperativeId: targetOperativeId.trim() || undefined,
                isClaimed: false,
                timestamp: Date.now()
            };
            
            setHero(prev => ({
                ...prev,
                heroCredits: packType === 'credits' ? prev.heroCredits - hcToPack : prev.heroCredits,
                inventory: packType === 'item' ? prev.inventory.filter(i => i.id !== itemToPack?.id) : prev.inventory,
                activeParcels: [newParcel, ...prev.activeParcels]
            }));
            
            setViewingParcel(newParcel); 
            setPackType(null);
            setTargetOperativeId('');
            setHcToPack(100);
            setItemToPack(null);
            setNftToPack(null);
            setActiveAction(null); 
            setIsProcessing(false);
        }, 2000);
    };

    const handleCancelProcessing = () => {
        if (processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
            setIsProcessing(false);
        }
    };

    const handleClaim = (parcelData: QrParcel) => {
        if (parcelData.targetOperativeId && parcelData.targetOperativeId !== hero.operativeId) {
            setSyncMessage(`ACCESS_DENIED: Shard locked to Operative #${parcelData.targetOperativeId}`);
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            if (parcelData.type === 'credits') {
                setHero(prev => ({ ...prev, heroCredits: prev.heroCredits + (parcelData.amount || 0) }));
                setSyncMessage(`CREDITS_SYNCED: +${parcelData.amount} HC from ${parcelData.sender}`);
            } else {
                setHero(prev => ({ ...prev, inventory: [...prev.inventory, parcelData.item!] }));
                setSyncMessage(`ARTIFACT_SYNCED: ${parcelData.item?.name} from ${parcelData.sender}`);
            }
            setIsProcessing(false);
            setActiveAction(null);
        }, 1500);
    };

    const getParcelQrUrl = (parcel: QrParcel) => {
        const baseUrl = window.location.origin;
        const parcelUrl = `${baseUrl}?parcelId=${encodeURIComponent(JSON.stringify(parcel))}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(parcelUrl)}&bgcolor=000000&color=06b6d4&margin=20`;
    };

    return (
        <div className="bg-zinc-950 text-white min-h-[85vh] rounded-[2.5rem] border border-zinc-800 shadow-2xl animate-fade-in font-mono overflow-hidden flex flex-col relative">
            <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 z-20">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                        <Package className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter">Tactical_Vault_v2.5</h1>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">P2P_Resource_Exchange</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="bg-black/60 px-6 py-3 rounded-2xl border border-cyan-500/30 text-center">
                        <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mb-1">Your_Operative_ID</p>
                        <p className="text-sm font-black text-cyan-400 tracking-tighter">#OP-{hero.operativeId}</p>
                    </div>
                    <button onClick={onReturn} className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span>Exit_Vault</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow p-8 md:p-12 relative z-10 overflow-y-auto custom-scrollbar">
                {activeAction === null ? (
                    <div className="space-y-12">
                        {syncMessage && (
                            <div className="animate-fade-in bg-cyan-950/40 border border-cyan-500/30 p-6 rounded-3xl flex items-center justify-between">
                                <p className="text-sm font-black uppercase text-cyan-400">{syncMessage}</p>
                                <button onClick={() => setSyncMessage(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-4 h-4"/></button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                            <button onClick={() => setActiveAction('pack')} className="group relative flex flex-col items-center justify-center p-12 bg-zinc-900/40 border-2 border-zinc-800 rounded-[3rem] hover:border-cyan-500/50 hover:bg-zinc-900 transition-all duration-500 overflow-hidden">
                                <div className="relative p-8 bg-zinc-950 rounded-[2rem] border border-zinc-800 group-hover:border-cyan-500/30 mb-8"><Package className="w-16 h-16 text-cyan-400 group-hover:scale-110 transition-transform" /></div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Materialize_Shard</h2>
                                <p className="text-xs text-zinc-500 font-bold uppercase text-center max-w-xs">Pack HeroCredits or NFTs into a cryptographic dispatch.</p>
                            </button>
                            <button onClick={() => setActiveAction('scan')} className="group relative flex flex-col items-center justify-center p-12 bg-zinc-900/40 border-2 border-zinc-800 rounded-[3rem] hover:border-emerald-500/50 hover:bg-zinc-900 transition-all duration-500 overflow-hidden">
                                <div className="relative p-8 bg-zinc-950 rounded-[2rem] border border-zinc-800 group-hover:border-emerald-500/30 mb-8"><QrCode className="w-16 h-16 text-emerald-400 group-hover:scale-110 transition-transform" /></div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Synchronize_Shard</h2>
                                <p className="text-xs text-zinc-500 font-bold uppercase text-center max-w-xs">Scan a team-member's shard to claim materials.</p>
                            </button>
                        </div>

                        <section className="pt-12 border-t border-zinc-900">
                             <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[0.4em] mb-8 flex items-center space-x-3">
                                <Hash className="w-4 h-4" />
                                <span>Active_Staged_Dispatches</span>
                             </h3>
                             
                             {hero.activeParcels.length === 0 ? (
                                 <div className="bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-[2rem] p-12 text-center">
                                     <p className="text-[10px] font-black uppercase text-zinc-700 tracking-[0.4em]">Dispatch_Archive_Empty</p>
                                 </div>
                             ) : (
                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                     {hero.activeParcels.map(parcel => (
                                         <button 
                                            key={parcel.id} 
                                            onClick={() => setViewingParcel(parcel)}
                                            className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-3xl hover:border-cyan-500/50 transition-all group text-left"
                                        >
                                             <div className="flex justify-between items-start mb-6">
                                                 <div className="p-3 bg-zinc-950 rounded-xl group-hover:bg-cyan-950/30 transition-colors">
                                                     {parcel.type === 'credits' ? <Coins className="w-5 h-5 text-amber-500"/> : <Box className="w-5 h-5 text-cyan-400"/>}
                                                 </div>
                                                 <QrCode className="w-4 h-4 text-zinc-700 group-hover:text-cyan-500 transition-colors" />
                                             </div>
                                             <p className="text-[10px] font-black text-white uppercase tracking-tight mb-1">
                                                 {parcel.type === 'credits' ? `${parcel.amount} HC` : parcel.item?.name}
                                             </p>
                                             <p className="text-[8px] font-bold text-zinc-600 uppercase mb-4">TO: {parcel.targetOperativeId ? `#OP-${parcel.targetOperativeId}` : 'ALL_MEMBER_NODES'}</p>
                                             <span className="text-[7px] font-mono text-zinc-800 uppercase bg-black px-2 py-0.5 rounded">REF: {parcel.id.split('-').pop()}</span>
                                         </button>
                                     ))}
                                 </div>
                             )}
                        </section>
                    </div>
                ) : activeAction === 'pack' ? (
                     <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
                        <button onClick={() => { setActiveAction(null); setPackType(null); }} className="flex items-center space-x-2 text-[10px] font-black uppercase text-zinc-500 hover:text-cyan-400 transition-colors">
                            <ArrowLeft className="w-3 h-3"/><span>Back_To_Index</span>
                        </button>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-7 space-y-8">
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Manifest_Shard</h3>
                                
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] pl-4">Resource_Selector</label>
                                    <div className="flex space-x-2">
                                        <button onClick={() => setPackType('credits')} className={`flex-1 p-6 rounded-2xl border-2 font-black uppercase text-xs transition-all flex flex-col items-center gap-3 ${packType === 'credits' ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}><Coins className="w-6 h-6"/>Credits</button>
                                        <button onClick={() => setPackType('nft')} className={`flex-1 p-6 rounded-2xl border-2 font-black uppercase text-xs transition-all flex flex-col items-center gap-3 ${packType === 'nft' ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}><Gem className="w-6 h-6"/>NFTs</button>
                                        <button onClick={() => setPackType('item')} className={`flex-1 p-6 rounded-2xl border-2 font-black uppercase text-xs transition-all flex flex-col items-center gap-3 ${packType === 'item' ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}><Box className="w-6 h-6"/>Inventory</button>
                                    </div>
                                </div>

                                {packType === 'credits' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] pl-4">HC_Amount [Available: {hero.heroCredits}]</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={hcToPack}
                                                onChange={e => setHcToPack(Math.max(1, parseInt(e.target.value) || 0))}
                                                className="w-full bg-black border-2 border-zinc-800 p-5 rounded-xl text-xl font-black text-amber-500 focus:border-cyan-500 outline-none"
                                            />
                                            <Coins className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-amber-600" />
                                        </div>
                                    </div>
                                )}

                                {packType === 'nft' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] pl-4">Select_Ledger_Artifact</label>
                                        {nftReports.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                {nftReports.map(report => (
                                                    <button 
                                                        key={report.id}
                                                        onClick={() => setNftToPack(report)}
                                                        className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${nftToPack?.id === report.id ? 'bg-amber-950/40 border-amber-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}
                                                    >
                                                        <div className="flex items-center space-x-4 truncate">
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-800 bg-black">
                                                                <img src={report.earnedNft?.imageUrl} alt="Artifact" className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="text-[10px] font-black uppercase truncate">{report.earnedNft?.title}</span>
                                                        </div>
                                                        {nftToPack?.id === report.id && <Check className="w-4 h-4 text-amber-500" />}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[10px] text-zinc-700 font-black uppercase text-center py-6 bg-black rounded-2xl border border-zinc-900">No NFTs found in collection</p>
                                        )}
                                    </div>
                                )}

                                {packType === 'item' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] pl-4">Select_Inventory_Gear</label>
                                        <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {hero.inventory.map(item => (
                                                <button 
                                                    key={item.id}
                                                    onClick={() => setItemToPack(item)}
                                                    className={`p-4 rounded-xl border-2 text-left transition-all ${itemToPack?.id === item.id ? 'bg-cyan-950/40 border-cyan-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}
                                                >
                                                    <span className="text-xl mr-3">{item.icon}</span>
                                                    <span className="text-[10px] font-black uppercase">{item.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4 border-t border-zinc-900 pt-8">
                                    <div className="flex items-center justify-between px-4">
                                        <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Target_Operative_ID (Optional)</label>
                                        {/* FIX: Wrapped Info icon in a span to handle tooltip title as standard IconProps doesn't include title attribute */}
                                        <span title="Lock this shard to a specific operative by entering their ID.">
                                            <Info className="w-4 h-4 text-zinc-700" />
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            placeholder="Enter target #OP-ID..."
                                            value={targetOperativeId}
                                            onChange={e => setTargetOperativeId(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="w-full bg-zinc-950 border-2 border-zinc-800 p-5 rounded-xl text-lg font-black text-white focus:border-rose-500 outline-none transition-all"
                                        />
                                        <Target className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-800" />
                                    </div>
                                </div>

                                <button 
                                    disabled={isProcessing || !packType} 
                                    onClick={handlePack} 
                                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-6 rounded-2xl uppercase tracking-[0.4em] text-xs shadow-3xl active:scale-95 disabled:opacity-20 flex items-center justify-center space-x-4"
                                >
                                    {isProcessing ? <Loader className="w-5 h-5 animate-spin"/> : <Zap className="w-5 h-5 text-white"/>}
                                    <span>{isProcessing ? 'SYNTHESIZING_BLOCK...' : 'Materialize_Data_Shard'}</span>
                                </button>
                                
                                {isProcessing && (
                                    <button 
                                        onClick={handleCancelProcessing}
                                        className="w-full text-zinc-500 hover:text-rose-500 font-black uppercase text-[9px] tracking-[0.3em] transition-colors"
                                    >
                                        Abort_Synthesis
                                    </button>
                                )}
                            </div>

                            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-zinc-950 border-4 border-zinc-900 rounded-[3.5rem] p-12 text-center shadow-inner relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02),transparent_70%)]"></div>
                                <Package className={`w-32 h-32 transition-all duration-700 ${packType ? 'text-cyan-500 scale-110 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-bounce' : 'text-zinc-900 opacity-20'}`} />
                                <div className="mt-12 space-y-4 relative z-10">
                                    <p className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.4em]">{packType ? 'Phase_02: Materialization' : 'Phase_01: Idle'}</p>
                                    <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase">Shard construction requires 500ms neural sync. Target ID locking provides end-to-end encryption.</p>
                                </div>
                            </div>
                        </div>
                     </div>
                ) : (
                    <div className="h-full flex flex-col animate-fade-in items-center justify-center">
                         <QrScanner onScan={(data) => {
                             try { 
                                 const url = new URL(data); 
                                 const parcelJson = url.searchParams.get('parcelId'); 
                                 if (parcelJson) handleClaim(JSON.parse(decodeURIComponent(parcelJson))); 
                             } catch(e) {
                                 setSyncMessage("SYNC_ERROR: Invalid Shard Data Signature.");
                             }
                         }} onClose={() => setActiveAction(null)} />
                    </div>
                )}
            </main>

            {/* MODAL: VIEWING PARCEL */}
            {viewingParcel && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
                    onClick={() => setViewingParcel(null)}
                >
                    <div 
                        className="bg-zinc-900 border-2 border-cyan-500 rounded-[3rem] p-10 max-w-sm w-full relative shadow-[0_0_80px_rgba(6,182,212,0.2)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={() => setViewingParcel(null)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
                            <X className="w-8 h-8" />
                        </button>

                        <div className="text-center space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Shard_Active</h3>
                                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Type: {viewingParcel.type.toUpperCase()}</p>
                            </div>

                            <div className="bg-white p-5 rounded-[2.5rem] shadow-3xl">
                                 <img src={getParcelQrUrl(viewingParcel)} alt="Dispatch QR" className="w-full aspect-square" />
                            </div>

                            <div className="space-y-4 text-left">
                                <div className="bg-black/60 p-5 rounded-2xl border border-zinc-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[8px] font-black text-zinc-500 uppercase">Dispatch_Source</span>
                                        <span className="text-[8px] font-black text-emerald-500">SIGNATURE_OK</span>
                                    </div>
                                    <p className="text-sm font-black text-white uppercase truncate">#OP-{viewingParcel.senderId}</p>
                                </div>
                                
                                {viewingParcel.targetOperativeId && (
                                    <div className="bg-rose-950/20 p-5 rounded-2xl border border-rose-900/30">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[8px] font-black text-rose-500 uppercase">Target_Restriction</span>
                                            <ShieldCheck className="w-3 h-3 text-rose-500" />
                                        </div>
                                        <p className="text-sm font-black text-rose-400 uppercase truncate">#OP-{viewingParcel.targetOperativeId}</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed tracking-widest">
                                    Member does not need to sync immediately. This shard remains valid in your <span className="text-cyan-400">Archive</span>.
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => setViewingParcel(null)}
                                className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-3"
                            >
                                <ArrowLeft className="w-4 h-4"/>
                                <span>Dismiss_to_Archive</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TacticalVault;