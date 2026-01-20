
import React, { useState, useEffect } from 'react';
import type { Report, ReportStatus, NftRarity } from '../types';
import { CATEGORIES_WITH_ICONS } from '../constants';
import { useTranslations } from '../i18n';
import { Clock, Award, Coins, Gem, Loader, ShieldCheck, Zap, Broadcast } from './icons';

interface MyReportCardProps {
  report: Report;
  onJoinChat?: () => void;
}

const StatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
  const { t } = useTranslations();
  const statusStyles = {
    Submitted: { text: "text-blue-400", border: "border-blue-900/50", label: t('status.submitted') },
    'In Review': { text: "text-amber-400", border: "border-amber-900/50", label: t('status.inReview') },
    Resolved: { text: "text-emerald-400", border: "border-emerald-900/50", label: t('status.resolved') },
  };
  const style = statusStyles[status] || statusStyles.Submitted;

  return (
    <span className={`px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em] rounded-full border ${style.border} ${style.text} bg-black/40`}>
      {style.label}
    </span>
  );
};

const RarityBadge: React.FC<{ rarity: NftRarity }> = ({ rarity }) => {
    const rarityStyles = {
        Common: "border-zinc-700 text-zinc-500",
        Rare: "border-cyan-800 text-cyan-400",
        Epic: "border-purple-800 text-purple-400",
        Legendary: "border-amber-700 text-amber-500",
    };
    return (
      <span className={`px-2 py-0.5 text-[8px] font-black border rounded-md uppercase tracking-tighter ${rarityStyles[rarity]}`}>
        {rarity}
      </span>
    );
};


const MyReportCard: React.FC<MyReportCardProps> = ({ report, onJoinChat }) => {
  const { t } = useTranslations();
  const categoryInfo = CATEGORIES_WITH_ICONS.find(c => c.value === report.category);
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (report.imageUrls && report.imageUrls.length > 0) {
        setPrimaryImageUrl(report.imageUrls[0]);
    } else if (report.attachments && report.attachments.length > 0) {
        const imageFile = report.attachments.find(f => f.type.startsWith('image/'));
        if (imageFile) {
            objectUrl = URL.createObjectURL(imageFile);
            setPrimaryImageUrl(objectUrl);
        }
    } else {
        setPrimaryImageUrl(null);
    }
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [report.attachments, report.imageUrls]);

  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `INIT_${Math.floor(seconds)}S`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}M_AGO`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}H_AGO`;
    return `${Math.floor(hours / 24)}D_AGO`;
  };
  
  const hasReward = report.earnedNft || report.credsEarned || report.isGeneratingNft;

  return (
    <div className={`bg-zinc-950 border-2 border-zinc-900 rounded-[2rem] p-8 transition-all hover:border-cyan-500/30 font-mono group shadow-xl ${report.isGeneratingNft ? 'animate-pulse' : ''}`}>
        <style>{`
            .personal-evidence {
                filter: grayscale(1) brightness(0.8) contrast(1.2);
                mix-blend-mode: luminosity;
            }
            .group:hover .personal-evidence {
                filter: grayscale(0) brightness(1) contrast(1);
            }
        `}</style>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="w-32 h-32 bg-zinc-900 rounded-3xl overflow-hidden flex-shrink-0 shadow-inner border border-zinc-800 relative">
                <div className="absolute inset-0 bg-cyan-500/10 z-10 pointer-events-none opacity-40"></div>
                {primaryImageUrl ? (
                <img src={primaryImageUrl} alt={report.title} className="w-full h-full object-cover personal-evidence opacity-60 group-hover:opacity-100 transition-all duration-700" />
                ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl grayscale opacity-30">{categoryInfo?.icon || '📄'}</div>
                )}
            </div>
            <div className="flex-grow min-w-0 w-full">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <div className="flex items-center space-x-3">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{categoryInfo ? t(categoryInfo.translationKey) : report.category}</span>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                        <div className="flex items-center space-x-2 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                            <Clock className="w-3 h-3" />
                            <span>{timeAgo(report.timestamp)}</span>
                        </div>
                    </div>
                    <StatusBadge status={report.status} />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="min-w-0 flex-grow">
                        <h4 className="text-2xl font-black text-white truncate uppercase tracking-tighter group-hover:text-cyan-100 transition-colors" title={report.title}>{report.title}</h4>
                        <p className="text-[10px] font-mono text-zinc-600 mt-2 truncate">TX_HASH: {report.hash}</p>
                    </div>

                    {onJoinChat && (
                        <button 
                            onClick={onJoinChat} 
                            className="flex items-center space-x-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95 border border-emerald-400/30 whitespace-nowrap"
                        >
                            <Broadcast className="w-5 h-5" />
                            <span className="uppercase text-[11px] tracking-widest">JOIN_OVERSIGHT_ROOM</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
        
        {hasReward && (
            <div className="mt-8 pt-8 border-t border-zinc-900">
                {report.isGeneratingNft ? (
                    <div className="flex flex-col items-center justify-center text-center p-8 bg-cyan-950/20 rounded-3xl border border-cyan-800/30">
                        <Loader className="w-10 h-10 text-cyan-500 animate-spin" />
                        <p className="mt-4 text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">{t('myReportCard.generatingArtwork')}</p>
                    </div>
                ) : report.earnedNft && (
                    <div className="space-y-6">
                        <h5 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">Verification_Artifact</h5>
                        <div className="flex items-center space-x-8 bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800 group-hover:border-cyan-500/20 transition-all">
                            <div className="w-16 h-24 bg-black rounded-xl overflow-hidden flex-shrink-0 shadow-2xl border border-zinc-800">
                                <img src={report.earnedNft.imageUrl} alt={report.earnedNft.title} className="w-full h-full object-cover opacity-80"/>
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center justify-between gap-4 mb-3">
                                    <h6 className="text-lg font-black text-white uppercase tracking-tighter truncate" title={report.earnedNft.title}>{report.earnedNft.title}</h6>
                                    <span className="text-xl font-black text-amber-500 bg-amber-950/30 px-3 py-1 rounded-lg border border-amber-900/50">{report.earnedNft.grade}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                    <RarityBadge rarity={report.earnedNft.rarity} />
                                    {report.credsEarned && (
                                        <div className="flex items-center space-x-2 text-[10px] font-black text-amber-500 bg-black/60 px-4 py-1.5 rounded-full border border-amber-900/30 shadow-inner">
                                            <Coins className="w-4 h-4" />
                                            <span>+{report.credsEarned} HC</span>
                                        </div>
                                    )}
                                     <div className="flex items-center space-x-2 text-[8px] font-black text-zinc-700">
                                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                        <span>CERTIFIED</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default MyReportCard;
