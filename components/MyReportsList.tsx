
import React, { useMemo } from 'react';
import type { Report } from '../types';
import MyReportCard from './MyReportCard';
import { useTranslations } from '../i18n';
import { ShieldCheck, Megaphone, Activity, Plus, Zap } from './icons';

interface MyReportsListProps {
  reports: Report[];
  onJoinReportChat: (report: Report) => void;
  onAddNewReport: () => void;
}

const BorderPulseEKG: React.FC = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible transition-opacity duration-500 opacity-30 group-hover/ledger:opacity-100">
        <rect 
            x="0" y="0" width="100%" height="100%" 
            rx="3rem" fill="none" 
            stroke="#22d3ee" strokeWidth="3"
            className="animate-border-trace-ekg"
            style={{ 
                filter: 'drop-shadow(0 0 12px #22d3ee)',
                strokeDasharray: '180 1400'
            }}
        />
    </svg>
);

const MyReportsList: React.FC<MyReportsListProps> = ({ reports, onJoinReportChat, onAddNewReport }) => {
  const { t } = useTranslations();

  const myReports = useMemo(() => 
    reports.filter(r => r.isAuthor).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()), 
    [reports]
  );

  return (
    <div className="group/ledger bg-zinc-900/40 border border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden animate-fade-in relative p-1">
      {/* Dynamic Border Light (EKG Pulse) */}
      <BorderPulseEKG />

      <div className="bg-zinc-900/60 border-b border-zinc-800 px-8 py-5 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
              </div>
              <h3 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Personal_History_Ledger</h3>
          </div>
          <div className="flex items-center space-x-4">
              <span className="text-[10px] font-black text-zinc-600">ID_REF: OPERATIVE_PRIME</span>
          </div>
      </div>

      <div className="p-8 relative z-10 space-y-6">
        {/* GENESIS INITIALIZER BUTTON - NEW ENTRY POINT */}
        <button 
            onClick={onAddNewReport}
            className="w-full group/new bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-[2rem] p-10 flex flex-col items-center justify-center space-y-6 hover:border-cyan-500/50 hover:bg-zinc-900 transition-all duration-500 shadow-inner group"
        >
            <div className="p-6 bg-zinc-900 rounded-[2rem] border border-zinc-800 group-hover/new:border-cyan-900 group-hover/new:scale-110 transition-all shadow-xl">
                <Plus className="w-12 h-12 text-zinc-700 group-hover/new:text-cyan-500 transition-colors" />
            </div>
            <div className="text-center">
                <h4 className="text-xl font-black uppercase tracking-tighter text-zinc-500 group-hover/new:text-white transition-colors">Initialize_Genesis_Shard</h4>
                <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest mt-2 group-hover/new:text-zinc-500 transition-colors">Sync new accountability evidence to the public ledger</p>
            </div>
        </button>

        {myReports.length > 0 ? (
          <div className="space-y-6">
            {myReports.map(report => <MyReportCard key={report.id} report={report} onJoinChat={() => onJoinReportChat(report)} />)}
          </div>
        ) : (
          <div className="text-center py-24 bg-zinc-950/30 border-2 border-zinc-900 rounded-[2.5rem]">
            <Megaphone className="w-16 h-16 text-zinc-900 mx-auto mb-6 opacity-30" />
            <h3 className="text-xl font-black text-zinc-800 uppercase tracking-tighter">{t('mainContent.noReports')}</h3>
            <p className="mt-2 text-xs font-bold text-zinc-800 uppercase tracking-widest">{t('mainContent.beTheFirst')}</p>
          </div>
        )}
      </div>

      <style>{`
          @keyframes border-trace-ekg {
              0% { stroke-dashoffset: 1580; }
              100% { stroke-dashoffset: 0; }
          }
          .animate-border-trace-ekg {
              animation: border-trace-ekg 3s linear infinite;
          }
      `}</style>
    </div>
  );
};

export default MyReportsList;
