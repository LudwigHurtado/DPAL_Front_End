
import React, { useState, useEffect } from 'react';
import type { Report } from '../types';
import { MapPin, Tag, Clock, Hash, Link, Pencil, Camera, Loader, ChevronLeft, ChevronRight, QrCode, ShieldCheck, Zap, Broadcast, Target, Scale, AlertTriangle, FileText, Fingerprint, Activity } from './icons';
import { CATEGORIES_WITH_ICONS } from '../constants';
import { useTranslations } from '../i18n';
import QrCodeDisplay from './QrCodeDisplay';

interface ReportCardProps {
  report: Report;
  onAddImage: (imageUrl: string) => void;
  onJoinChat?: (report: Report) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onAddImage, onJoinChat }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrlsToDisplay, setImageUrlsToDisplay] = useState<string[]>([]);
  const [showQr, setShowQr] = useState(false);
  const [showForensics, setShowForensics] = useState(false);
  const { t } = useTranslations();

  useEffect(() => {
    let objectUrls: string[] = [];
    if ((!report.imageUrls || report.imageUrls.length === 0) && report.attachments) {
        const imageFiles = report.attachments.filter(f => f.type.startsWith('image/'));
        if (imageFiles.length > 0) {
            objectUrls = imageFiles.map(file => URL.createObjectURL(file));
            setImageUrlsToDisplay(objectUrls);
        }
    } else {
        setImageUrlsToDisplay(report.imageUrls || []);
    }
    return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
  }, [report.attachments, report.imageUrls]);

  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 3600) return "RECENT_SYNC";
    const intervalDays = Math.floor(seconds / 86400);
    if (intervalDays > 0) return `${intervalDays}D_AGO`;
    return `${Math.floor(seconds / 3600)}H_AGO`;
  };

  const categoryInfo = CATEGORIES_WITH_ICONS.find(c => c.value === report.category);

  return (
    <div className={`group bg-zinc-900/40 border-2 rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-2xl relative font-mono flex flex-col ${report.isActionable ? 'border-rose-500/50' : 'border-zinc-800 hover:border-cyan-500/50'}`}>
      
      {/* ACTIONABLE BADGE */}
      {report.isActionable && (
          <div className="absolute top-0 right-0 z-40 bg-rose-600 text-white px-8 py-2 rounded-bl-3xl border-b-2 border-l-2 border-rose-400 font-black text-[10px] uppercase tracking-[0.2em] flex items-center space-x-3 shadow-2xl animate-pulse">
              <Scale className="w-4 h-4" />
              <span>Authority_Audit_Requested</span>
          </div>
      )}

      {/* Ledger Fragment Header */}
      <div className="bg-zinc-900/80 border-b border-zinc-800 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
              <div className={`w-2 h-2 rounded-full animate-ping ${report.severity === 'Critical' || report.severity === 'Catastrophic' ? 'bg-rose-500 shadow-[0_0_10px_rose]' : 'bg-cyan-500'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Shard_#{report.id.split('-').pop()}</span>
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${report.severity === 'Critical' || report.severity === 'Catastrophic' ? 'text-rose-500 border-rose-900/50 bg-rose-950/20' : 'text-zinc-500 border-zinc-800'}`}>SEV: {report.severity.toUpperCase()}</span>
          </div>
          <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-[10px] font-black text-zinc-500 uppercase bg-black/40 px-3 py-1 rounded-lg border border-zinc-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeAgo(report.timestamp)}</span>
              </div>
          </div>
      </div>

      {/* TOP IMAGE VIEWER */}
      <div className="relative w-full aspect-[21/8] bg-black border-b border-zinc-800 overflow-hidden">
          {imageUrlsToDisplay.length > 0 ? (
              <img src={imageUrlsToDisplay[currentImageIndex]} alt={report.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 grayscale group-hover:grayscale-0" />
          ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-800 opacity-20">
                  <div className="text-6xl mb-4">{categoryInfo?.icon || '📄'}</div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em]">Forensic_Telemetry_Missing</p>
              </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          {/* HUD scan overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(34,211,238,0.1)_1px,transparent_0)] bg-[length:30px_30px] opacity-20"></div>
      </div>

      <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4 flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-4">
                      <div className="bg-cyan-950/40 text-cyan-400 px-4 py-1.5 rounded-full border border-cyan-800/50 flex items-center space-x-2">
                          <span className="text-lg">{categoryInfo?.icon}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest">{report.category.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] font-black text-zinc-500 uppercase">
                          <MapPin className="w-4 h-4 text-rose-500" />
                          <span className="truncate max-w-[200px]">{report.location}</span>
                      </div>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-black text-white leading-none tracking-tighter uppercase group-hover:text-cyan-100 transition-colors truncate">
                    {report.title}
                  </h3>
              </div>

              <div className="flex items-center space-x-6 flex-shrink-0 bg-black/40 p-4 rounded-3xl border border-zinc-800 shadow-inner">
                  <div className="text-center">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Trust_Index</p>
                      <p className={`text-xl font-black ${report.trustScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{report.trustScore}%</p>
                  </div>
                  <div className="w-px h-10 bg-zinc-800"></div>
                  <ShieldCheck className={`w-8 h-8 ${report.trustScore > 90 ? 'text-emerald-500' : 'text-zinc-700'}`} />
              </div>
          </div>

          {/* FORENSIC DOSSIER TOGGLE */}
          <div className="space-y-4">
               <button 
                onClick={() => setShowForensics(!showForensics)}
                className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-cyan-500/80 hover:text-cyan-400 transition-colors"
               >
                   <FileText className="w-4 h-4" />
                   <span>{showForensics ? 'Hide_Forensic_Data' : 'View_Forensic_Dossier'}</span>
               </button>
               
               {showForensics && report.structuredData && (
                   <div className="bg-black/60 border-2 border-zinc-800 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in shadow-inner">
                       {Object.entries(report.structuredData).map(([key, val]: [string, any]) => {
                           if (key === 'diagnosticTools' && Array.isArray(val)) return null;
                           return (
                               <div key={key} className="space-y-1">
                                   <p className="text-[8px] font-black text-cyan-600/80 uppercase tracking-[0.2em]">{key.replace(/([A-Z])/g, '_$1').toUpperCase()}</p>
                                   <p className="text-[11px] font-bold text-white uppercase truncate">{Array.isArray(val) ? val.join(', ') : String(val)}</p>
                               </div>
                           );
                       })}
                       
                       {report.structuredData.diagnosticTools && (
                           <div className="col-span-full pt-4 border-t border-zinc-800/40 mt-2">
                               <p className="text-[8px] font-black text-cyan-500/80 uppercase tracking-[0.2em] mb-2">Applied_Diagnostic_Toolkit</p>
                               <div className="flex flex-wrap gap-2">
                                   {report.structuredData.diagnosticTools.map((tool: string) => (
                                       <span key={tool} className="bg-cyan-950/20 border border-cyan-900/50 text-cyan-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase">{tool}</span>
                                   ))}
                               </div>
                           </div>
                       )}

                       <div className="col-span-full pt-4 border-t border-zinc-800 mt-2 flex items-center justify-between">
                           <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Metadata_Validation: STABLE</p>
                           <div className="flex items-center space-x-2 text-emerald-500/50">
                               <ShieldCheck className="w-3 h-3"/>
                               <span className="text-[7px] font-black uppercase tracking-tighter">SECURE_ID_LOCKED</span>
                           </div>
                       </div>
                   </div>
               )}
          </div>

          <div className="bg-zinc-950/50 border-l-4 border-zinc-800 pl-8 py-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Broadcast className="w-20 h-20 text-white"/></div>
              <p className="text-zinc-400 text-sm leading-relaxed italic line-clamp-3 group-hover:line-clamp-none transition-all duration-300 relative z-10">
                "{report.description}"
              </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-zinc-800/50">
              <div className="flex items-center space-x-8">
                  <button onClick={() => setShowQr(true)} className="flex items-center space-x-3 text-[10px] font-black uppercase text-zinc-500 hover:text-cyan-400 transition-colors">
                      <QrCode className="w-5 h-5" />
                      <span>Link_Shard</span>
                  </button>
                  <div className="hidden xl:flex items-center space-x-3 text-[10px] font-mono text-zinc-700">
                      <Hash className="w-4 h-4" />
                      <span className="truncate max-w-[150px]">{report.blockchainRef}</span>
                  </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                   {onJoinChat && (
                      <button 
                        onClick={() => onJoinChat(report)} 
                        className={`flex items-center justify-center space-x-4 font-black py-4 px-12 rounded-2xl transition-all shadow-3xl active:scale-95 group/join border w-full sm:w-auto ${report.isActionable ? 'bg-rose-600 border-rose-400 text-white hover:bg-rose-500' : 'bg-emerald-600 border-emerald-400 text-white hover:bg-emerald-500'}`}
                      >
                        <Broadcast className="w-6 h-6" />
                        <span className="uppercase text-xs tracking-[0.2em]">{report.isActionable ? 'ENTER_AUDIT_ROOM' : 'ENTER_OVERSIGHT'}</span>
                      </button>
                   )}
              </div>
          </div>
      </div>
      {showQr && <QrCodeDisplay type="report" id={report.id} onClose={() => setShowQr(false)} />}
    </div>
  );
};

export default ReportCard;
