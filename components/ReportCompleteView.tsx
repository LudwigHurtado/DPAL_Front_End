
import React, { useState, useEffect, useRef } from 'react';
import type { Report } from '../types';
import { useTranslations } from '../i18n';
/* FIX: Added missing Star icon import */
import { ArrowLeft, Coins, Zap, Check, Loader, QrCode, ShieldCheck, Activity, Target, Database, Hash, Sparkles, Scale, Broadcast, Printer, FileText, Globe, User, Clock, ChevronDown, CheckCircle, Send, Package, ArrowRight, Mail, Monitor, FileCode, Star } from './icons';
import NftCard from './NftCard';

interface ReportCompleteViewProps {
    report: Report;
    onReturn: () => void;
    onEnterSituationRoom?: (report: Report) => void;
}

const ReportCompleteView: React.FC<ReportCompleteViewProps> = ({ report, onReturn, onEnterSituationRoom }) => {
    const { t } = useTranslations();
    const [verificationStep, setVerificationStep] = useState(0);
    const [showTechnical, setShowTechnical] = useState(false);
    const [dispatchStatus, setDispatchStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');
    const certificateRef = useRef<HTMLDivElement>(null);
    
    const logs = [
        "ESTABLISHING_P2P_HANDSHAKE...",
        "CHRONOLOGICAL_SYNC_STABLE",
        "TRUTHSCORE_CALCULATED: " + report.trustScore + "%",
        "BLOCK_INDEX_IDENTIFIED: #6843021",
        "MINTING_VISUAL_TELEMETRY...",
        "SHARD_SEALED_WITH_AUTHORITY_KEY"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setVerificationStep(prev => (prev < logs.length ? prev + 1 : prev));
        }, 600);
        return () => clearInterval(interval);
    }, [logs.length]);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        const shareData = {
            title: `DPAL Certified Report: ${report.title}`,
            text: `View this certified accountability record on the DPAL ledger: ${report.description}`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                handleCopyLink();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAgencyDispatch = () => {
        setDispatchStatus('SENDING');
        setTimeout(() => {
            setDispatchStatus('SUCCESS');
            setTimeout(() => setDispatchStatus('IDLE'), 3000);
        }, 2000);
    };

    const handleEmail = () => {
        const subject = encodeURIComponent(`DPAL_CERTIFIED_RECORD: ${report.title}`);
        const body = encodeURIComponent(`This is a cryptographically verified record from the Decentralized Public Accountability Ledger.\n\nRECORD_ID: ${report.id}\nBLOCK_HASH: ${report.hash}\n\nDESCRIPTION:\n${report.description}\n\nVerify authenticity at: ${window.location.origin}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    const handleCopyLink = () => {
        const baseUrl = window.location.origin;
        const link = `${baseUrl}?reportId=${report.id}`;
        navigator.clipboard.writeText(link);
        alert("Verification link copied to clipboard.");
    };

    const baseUrl = window.location.origin;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${baseUrl}?reportId=${report.id}`)}&bgcolor=ffffff&color=000000&margin=10`;

    if (report.isGeneratingNft) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-black text-white p-12 text-center space-y-8 animate-fade-in font-mono">
                <div className="relative">
                    <div className="absolute -inset-12 bg-cyan-500/10 blur-[80px] animate-pulse"></div>
                    <Loader className="w-24 h-24 text-cyan-400 animate-spin relative z-10" />
                </div>
                <div className="space-y-3">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">{t('reportComplete.certifying')}</h1>
                    <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.6em] animate-pulse">Encoding_Neural_Metadata</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black font-mono overflow-x-hidden pb-32">
            <style>{`
                @media print {
                    @page { size: A4; margin: 0; }
                    body { background: white !important; color: black !important; padding: 0 !important; margin: 0 !important; }
                    .no-print { display: none !important; }
                    .print-area { 
                        display: block !important; 
                        padding: 0 !important; 
                        margin: 0 !important; 
                        background: white !important; 
                        border: none !important; 
                        box-shadow: none !important; 
                    }
                    .certificate-frame { 
                        border: 3px solid #000 !important; 
                        color: black !important; 
                        margin: 0 !important; 
                        padding: 60px !important;
                        height: 100vh !important;
                        width: 100% !important;
                        display: flex !important;
                        flex-direction: column !important;
                    }
                    .bg-zinc-950, .bg-zinc-900, .bg-black, .bg-zinc-50 { background: white !important; color: black !important; }
                    .text-white, .text-zinc-400, .text-zinc-500, .text-zinc-900 { color: black !important; }
                    .shadow-2xl, .shadow-3xl, .shadow-4xl, .shadow-xl { box-shadow: none !important; }
                    .border-zinc-800, .border-zinc-900, .border-zinc-100 { border-color: #000 !important; }
                    .bg-emerald-100 { background: #f0fdf4 !important; border: 1px solid #166534 !important; }
                    .text-emerald-800 { color: #166534 !important; }
                    .grayscale, .opacity-40, .opacity-60, .opacity-5, .opacity-80 { filter: none !important; opacity: 1 !important; }
                }
                .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .shadow-4xl { box-shadow: 0 40px 100px rgba(0,0,0,0.8); }
                .seal-ripple { animation: ripple 4s ease-in-out infinite; }
                @keyframes ripple { 0% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.1); opacity: 0.2; } 100% { transform: scale(1); opacity: 0.1; } }
            `}</style>

            <div className="max-w-6xl mx-auto px-4 pt-12 no-print">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <button
                        onClick={onReturn}
                        className="inline-flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-cyan-400 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span>{t('reportComplete.returnToMenu')}</span>
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                            <ShieldCheck className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white uppercase tracking-tighter">{t('reportComplete.title')}</h1>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('reportComplete.subtitle')}</p>
                        </div>
                    </div>
                </header>

                <section className="mb-12 bg-zinc-900/40 border-2 border-zinc-800 p-10 rounded-[3rem] shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles className="w-32 h-32 text-cyan-500"/></div>
                    <div className="relative z-10 space-y-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="space-y-4 max-w-2xl">
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{t('reportComplete.successHeadline')}</h2>
                                <p className="text-zinc-400 text-lg leading-relaxed font-medium italic border-l-4 border-cyan-500 pl-6">
                                    "{t('reportComplete.successSubheadline')}"
                                </p>
                            </div>
                            {onEnterSituationRoom && (
                                <button 
                                    onClick={() => onEnterSituationRoom(report)}
                                    className="flex items-center space-x-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-6 px-12 rounded-[2rem] transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] active:scale-95 group/sit"
                                >
                                    <Monitor className="w-8 h-8 group-hover/sit:rotate-12 transition-transform" />
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Operational_Link</p>
                                        <p className="text-sm font-black uppercase tracking-[0.2em]">Enter Situation Room</p>
                                    </div>
                                </button>
                            )}
                        </div>

                        <div className="bg-black/60 border border-zinc-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
                            <div className="flex items-center space-x-4">
                                <Broadcast className="w-6 h-6 text-cyan-500" />
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Operational_Dispatch_Hub</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <button onClick={handlePrint} className="flex flex-col items-center justify-center p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-cyan-500 transition-all group active:scale-95">
                                    <Printer className="w-8 h-8 text-zinc-600 group-hover:text-white mb-3 transition-colors" />
                                    <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-white">Print_Hardcopy</span>
                                </button>
                                <button onClick={handlePrint} className="flex flex-col items-center justify-center p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-cyan-500 transition-all group active:scale-95">
                                    <FileCode className="w-8 h-8 text-cyan-600 group-hover:text-white mb-3 transition-colors" />
                                    <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-white">Download_PDF</span>
                                </button>
                                <button onClick={handleEmail} className="flex flex-col items-center justify-center p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-cyan-500 transition-all group active:scale-95">
                                    <Mail className="w-8 h-8 text-zinc-600 group-hover:text-white mb-3 transition-colors" />
                                    <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-white">Email_Dispatch</span>
                                </button>
                                <button 
                                    onClick={handleAgencyDispatch}
                                    disabled={dispatchStatus !== 'IDLE'}
                                    className={`flex flex-col items-center justify-center p-6 border rounded-3xl transition-all group active:scale-95 ${dispatchStatus === 'SUCCESS' ? 'bg-emerald-950/20 border-emerald-500 text-emerald-400' : 'bg-rose-950/20 border-rose-900 hover:border-rose-500 text-rose-500'}`}
                                >
                                    {dispatchStatus === 'SENDING' ? <Loader className="w-8 h-8 animate-spin mb-3" /> : dispatchStatus === 'SUCCESS' ? <CheckCircle className="w-8 h-8 mb-3" /> : <Scale className="w-8 h-8 mb-3" />}
                                    <span className="text-[10px] font-black uppercase">{dispatchStatus === 'SENDING' ? 'SYNCING...' : dispatchStatus === 'SUCCESS' ? 'AGENCY_RECEIVED' : 'Regulatory_Oracle'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* THE FORMAL CERTIFICATE - PRINT AREA */}
            <div className="print-area max-w-5xl mx-auto px-4 md:px-0">
                <div ref={certificateRef} className="certificate-frame bg-white text-zinc-950 border-[20px] border-double border-zinc-900 rounded-none shadow-4xl p-10 md:p-24 flex flex-col min-h-[1050px] relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:24px_24px] opacity-10 no-print"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-50 rounded-full -mr-48 -mt-48 opacity-20 no-print"></div>
                    
                    {/* A. Certificate Header */}
                    <header className="border-b-[6px] border-zinc-900 pb-12 mb-16 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                        <div className="flex items-center space-x-8">
                             <div className="w-24 h-24 bg-zinc-950 flex items-center justify-center rounded-[2rem] shadow-xl">
                                <ShieldCheck className="w-14 h-14 text-white" />
                             </div>
                             <div className="text-center md:text-left space-y-2">
                                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">{t('reportComplete.certTitle')}</h1>
                                <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em]">{t('reportComplete.certSubtext')}</p>
                             </div>
                        </div>
                        <div className="text-right flex flex-col items-center md:items-end space-y-3">
                             <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">VALIDATION_STATE</div>
                             <div className="bg-emerald-100 text-emerald-900 border-2 border-emerald-400 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                                 {t('reportComplete.statusValue')}
                             </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-20 flex-grow relative z-10">
                        <div className="md:col-span-8 space-y-16">
                            {/* B. Record Identification */}
                            <section>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-8 flex items-center gap-4">
                                    <Target className="w-5 h-5 text-zinc-950"/> <span>{t('reportComplete.recordId')}</span>
                                </h3>
                                <div className="grid grid-cols-2 gap-x-16 gap-y-8 bg-zinc-50/50 border border-zinc-100 p-10 rounded-[2.5rem]">
                                    <DataRow label={t('reportComplete.certIdLabel')} value={`DPAL-CERT-${report.hash.substring(2, 10).toUpperCase()}`} />
                                    <DataRow label={t('reportComplete.blockRefLabel')} value="#6843021" />
                                    <DataRow label={t('reportComplete.dateIssuedLabel')} value={report.timestamp.toLocaleString()} />
                                    <DataRow label={t('reportComplete.categoryLabel')} value={report.category.toUpperCase()} />
                                </div>
                            </section>

                            {/* C. Verification & Integrity */}
                            <section>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-8 flex items-center gap-4">
                                    <Hash className="w-5 h-5 text-zinc-950"/> <span>{t('reportComplete.integritySection')}</span>
                                </h3>
                                <div className="grid grid-cols-2 gap-x-16 gap-y-8 px-4">
                                    <DataRow label={t('reportComplete.ledgerStatus')} value={t('reportComplete.ledgerStatusValue')} />
                                    <DataRow label={t('reportComplete.integrityCheck')} value={t('reportComplete.integrityCheckValue')} />
                                    <DataRow label={t('reportComplete.protectionLabel')} value={t('reportComplete.protectionValue')} />
                                    <DataRow label={t('reportComplete.anonymityLabel')} value={t('reportComplete.anonymityValue')} />
                                </div>
                            </section>

                            {/* D. Signature Section */}
                            <section className="pt-8 grid grid-cols-2 gap-16">
                                <div className="space-y-4">
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">ORACLE_VERIFICATION_SIG</p>
                                    <div className="h-[2px] w-full bg-zinc-200 mt-12 relative">
                                        <div className="absolute -top-12 left-0 italic font-serif text-2xl text-zinc-800 opacity-60">DPAL_Network_Guardian</div>
                                    </div>
                                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Network Controller: RSA-4096</p>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">CERTIFIED_BY</p>
                                    <div className="h-[2px] w-full bg-zinc-200 mt-12 relative">
                                         <div className="absolute -top-12 left-0 italic font-serif text-2xl text-zinc-800 opacity-60">GEMINI_3_ORACLE</div>
                                    </div>
                                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Automated Consensus Node</p>
                                </div>
                            </section>
                        </div>

                        {/* E. Sidebar: QR & Official Seal */}
                        <div className="md:col-span-4 flex flex-col items-center justify-between py-4">
                            <div className="bg-white border-2 border-zinc-100 p-10 rounded-[3.5rem] text-center space-y-8 shadow-xl relative w-full overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-[length:12px_12px] opacity-[0.03]"></div>
                                <div className="space-y-4 relative z-10">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('reportComplete.qrLabel')}</p>
                                    <div className="bg-white p-6 rounded-[2rem] inline-block shadow-inner border border-zinc-100">
                                        <img src={qrImageUrl} alt="Entry QR" className="w-48 h-48" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed px-6 relative z-10">
                                    {t('reportComplete.qrSubtext')}
                                </p>
                            </div>

                            {/* OFFICIAL SEAL VISUAL */}
                            <div className="relative mt-20 no-print lg:block hidden">
                                <div className="absolute inset-0 seal-ripple bg-zinc-900/5 rounded-full scale-[2]"></div>
                                <div className="relative w-40 h-40 border-[8px] border-zinc-900 rounded-full flex flex-col items-center justify-center p-4">
                                     <Star className="w-12 h-12 text-zinc-950 mb-1" />
                                     <div className="text-[9px] font-black text-zinc-950 text-center leading-none uppercase">AUTHENTIC<br/>ACCOUNTABILITY<br/>SEAL</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="mt-20 pt-12 border-t-4 border-zinc-900 flex flex-col md:flex-row justify-between items-end gap-10 relative z-10">
                         <p className="text-[10px] text-zinc-500 font-bold uppercase max-w-2xl text-center md:text-left leading-relaxed tracking-wider">
                             {t('reportComplete.footerNote')}
                         </p>
                         <div className="flex flex-col items-center md:items-end space-y-2">
                            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-950 leading-none">{t('reportComplete.digitallyCertified')}</p>
                            <p className="text-[9px] font-mono text-zinc-400">LEDGER_ANCHOR: {report.hash.substring(0, 32).toUpperCase()}...</p>
                         </div>
                    </footer>
                </div>
            </div>

            {/* BUTTON SET - FOOTER */}
            <div className="no-print fixed bottom-0 left-0 w-full bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800 p-8 z-[100]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <button 
                            onClick={handlePrint}
                            className="flex-1 md:flex-none flex items-center justify-center space-x-4 bg-white hover:bg-zinc-100 text-black font-black py-5 px-12 rounded-[1.5rem] text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all border-b-4 border-zinc-200"
                        >
                            <Printer className="w-6 h-6" />
                            <span>{t('reportComplete.printCert')}</span>
                        </button>
                        <button 
                            onClick={handlePrint}
                            className="flex-1 md:flex-none flex items-center justify-center space-x-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 px-12 rounded-[1.5rem] text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all border-b-4 border-cyan-800"
                        >
                            <FileCode className="w-6 h-6" />
                            <span>Download_Secure_PDF</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                        <button onClick={handleEmail} className="flex-shrink-0 flex items-center space-x-3 text-[11px] font-black uppercase text-zinc-500 hover:text-white transition-colors bg-zinc-950 px-6 py-3 rounded-2xl border border-zinc-900">
                             <Mail className="w-4 h-4" /> <span>Email_Dispatch</span>
                        </button>
                        <button onClick={handleCopyLink} className="flex-shrink-0 flex items-center space-x-3 text-[11px] font-black uppercase text-zinc-500 hover:text-white transition-colors bg-zinc-950 px-6 py-3 rounded-2xl border border-zinc-900">
                             <Globe className="w-4 h-4" /> <span>Copy_Ledger_URL</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-16 px-4 no-print pb-32">
                <button 
                    onClick={() => setShowTechnical(!showTechnical)}
                    className="flex items-center space-x-3 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] hover:text-cyan-500 transition-colors mb-6"
                >
                    <ChevronDown className={`w-4 h-4 transition-transform ${showTechnical ? 'rotate-180' : ''}`} />
                    <span>{showTechnical ? t('reportComplete.hideTechnical') : t('reportComplete.viewTechnical')}</span>
                </button>
                
                {showTechnical && (
                    <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-10 space-y-8 animate-fade-in shadow-inner">
                         <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
                                <Activity className="w-4 h-4 text-emerald-500" /> <span>Verification_Stream</span>
                            </h3>
                            <div className="bg-black/40 rounded-3xl border border-zinc-900 p-6 font-mono text-[9px] space-y-2">
                                {logs.map((log, i) => (
                                    <div key={i} className="flex items-center space-x-3 text-emerald-500/80">
                                        <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' })}]</span>
                                        <span className="font-bold">{log}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-900">
                            <div className="space-y-2">
                                <p className="text-[8px] font-black text-zinc-600 uppercase">Ledger_Entry_Hash</p>
                                <p className="text-xs font-mono text-zinc-400 break-all">{report.hash}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[8px] font-black text-zinc-600 uppercase">Protocol_Version</p>
                                <p className="text-xs text-zinc-400">DPAL-X_CORE_v1.0.42_STABLE</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const NextStepItem: React.FC<{ num: string; text: string }> = ({ num, text }) => (
    <li className="flex items-start space-x-4 group">
        <span className="text-[10px] font-black text-cyan-500 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-800/40">{num}</span>
        <p className="text-xs text-zinc-400 font-bold uppercase leading-relaxed tracking-widest transition-colors group-hover:text-zinc-200">
            {text}
        </p>
    </li>
);

const DataRow: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = "text-zinc-950" }) => (
    <div className="flex flex-col gap-2">
        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">{label}</span>
        <span className={`text-sm md:text-base font-black uppercase tracking-tight ${color}`}>{value}</span>
    </div>
);

export default ReportCompleteView;
