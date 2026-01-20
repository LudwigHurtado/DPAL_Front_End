
import React from 'react';
import { QrCode, ShieldCheck, X, Broadcast } from './icons';

interface QrCodeDisplayProps {
    type: 'mission' | 'report' | 'nft';
    id: string;
    onClose: () => void;
    onJoinSitRep?: () => void;
}

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ type, id, onClose, onJoinSitRep }) => {
    const baseUrl = window.location.origin;
    const queryParam = type === 'mission' ? 'missionId' : 'reportId';
    const deepLinkUrl = `${baseUrl}?${queryParam}=${encodeURIComponent(id)}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(deepLinkUrl)}&bgcolor=000000&color=06b6d4&margin=20`;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-zinc-900 border-2 border-cyan-500 rounded-[2.5rem] p-10 max-w-sm w-full relative shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
                    <X className="w-8 h-8" />
                </button>

                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                        <QrCode className="w-6 h-6 text-cyan-400" />
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-cyan-500/80">Secure_Deep_Link</span>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-2 bg-cyan-500/20 blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-black rounded-3xl p-4 border border-zinc-800">
                             <img 
                                src={qrImageUrl} 
                                alt="QR Link" 
                                className="w-full aspect-square rounded-xl shadow-2xl"
                            />
                        </div>
                    </div>

                    {onJoinSitRep && (
                        <button 
                            onClick={onJoinSitRep}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-lg"
                        >
                            <Broadcast className="w-5 h-5" />
                            <span className="uppercase text-[10px] tracking-widest font-black">Join_Operational_Comms</span>
                        </button>
                    )}

                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-left">
                        <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-zinc-600 mb-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Ledger_Verification</span>
                        </div>
                        <p className="text-[10px] font-mono text-zinc-400 break-all leading-relaxed">
                            BLOCK_REF: {id.toUpperCase()}<br/>
                            DOMAIN: {baseUrl.replace('https://', '')}
                        </p>
                    </div>

                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed px-4">
                        Scan with DPAL scanner or system camera to synchronize terminal records.
                    </p>
                </div>
            </div>
            <style>{`
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

export default QrCodeDisplay;
