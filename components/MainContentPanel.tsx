
import React, { useState, useEffect } from 'react';
import type { Report, FeedAnalysis } from '../types';
import FeedPanel from './FeedPanel';
import MyReportsList from './MyReportsList';
import CommunityWorkFeed from './CommunityWorkFeed';
import { useTranslations } from '../i18n';
import { User, List, ArrowLeft, Zap, ShieldCheck, Activity } from './icons';

interface MainContentPanelProps {
  reports: Report[];
  filteredReports: Report[];
  analysis: FeedAnalysis | null;
  analysisError: string | null;
  onCloseAnalysis: () => void;
  onAddReportImage: (reportId: string, imageUrl: string) => void;
  onReturnToMainMenu: () => void;
  onJoinReportChat: (report: Report) => void;
  activeTab: 'my_reports' | 'community' | 'work_feed';
  setActiveTab: (tab: 'my_reports' | 'community' | 'work_feed') => void;
  onAddNewReport: () => void;
}

const MainContentPanel: React.FC<MainContentPanelProps> = ({ reports, filteredReports, onReturnToMainMenu, onJoinReportChat, activeTab, setActiveTab, onAddNewReport, ...rest }) => {
  const { t } = useTranslations();
  
  const tabs = [
    { id: 'my_reports', label: t('mainContent.myReports'), icon: User },
    { id: 'community', label: t('mainContent.communityFeed'), icon: List },
    { id: 'work_feed', label: 'WORK_LOG', icon: Activity },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'my_reports':
        return <MyReportsList reports={reports} onJoinReportChat={onJoinReportChat} onAddNewReport={onAddNewReport} />;
      case 'community':
        return <FeedPanel reports={filteredReports} onJoinReportChat={onJoinReportChat} {...rest} />;
      case 'work_feed':
        return <CommunityWorkFeed />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 font-mono animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <button
            onClick={onReturnToMainMenu}
            className="inline-flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-cyan-400 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>TERMINAL_EXIT</span>
          </button>
          
          <div className="flex items-center space-x-2 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
              <span>Network_Search_Active</span>
          </div>
       </div>

      <div className="bg-zinc-900/60 border border-zinc-800 p-1.5 rounded-[2.5rem] flex items-center justify-start space-x-1.5 shadow-2xl backdrop-blur-md overflow-x-auto no-scrollbar">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 min-w-max flex items-center justify-center space-x-3 py-2.5 px-4 md:px-6 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                isActive
                ? 'bg-cyan-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.3)] border-t border-cyan-400/30'
                : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="animate-fade-in relative min-h-[60vh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.05),transparent_50%)] pointer-events-none"></div>
        {renderContent()}
      </div>
       <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MainContentPanel;
