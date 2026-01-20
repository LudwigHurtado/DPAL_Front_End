
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Report, FeedAnalysis } from '../types';
import ReportCard from './ReportCard';
import { X, ChevronDown, ListFilter, Sparkles, Loader, ShieldCheck } from './icons';
import { useTranslations } from '../i18n';
import { CATEGORIES_WITH_ICONS } from '../constants';

interface FeedPanelProps {
  reports: Report[];
  analysis: FeedAnalysis | null;
  analysisError: string | null;
  onCloseAnalysis: () => void;
  onAddReportImage: (reportId: string, imageUrl: string) => void;
  onJoinReportChat: (report: Report) => void;
}

type SortByType = 'recent' | 'oldest' | 'category';

const TopicButton: React.FC<{ topic: string | null, activeTopic: string | null, setActiveTopic: (topic: string | null) => void }> = ({ topic, activeTopic, setActiveTopic }) => {
    const { t } = useTranslations();
    const topicName = topic || t('feedPanel.allTopics');
    const isActive = activeTopic === topic;
    return (
      <button
        onClick={() => setActiveTopic(topic)}
        className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full border-2 transition-all duration-300 ${
          isActive
            ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
            : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
        }`}
      >
        {topicName}
      </button>
    );
};

const FeedPanel: React.FC<FeedPanelProps> = ({ reports, analysis, analysisError, onCloseAnalysis, onAddReportImage, onJoinReportChat }) => {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortByType>('recent');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslations();
  
  const sortOptions: { key: SortByType, label: string }[] = [
    { key: 'recent', label: t('feedPanel.sortOptions.recent') },
    { key: 'oldest', label: t('feedPanel.sortOptions.oldest') },
    { key: 'category', label: t('feedPanel.sortOptions.category') },
  ];

  useEffect(() => {
    if (!analysis) setActiveTopic(null);
  }, [analysis]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayedReports = useMemo(() => {
    let reportsToDisplay = reports;
    if (activeTopic && analysis) {
      const topicData = analysis.hot_topics.find(t => t.topic === activeTopic);
      if (topicData) {
        const reportIdSet = new Set(topicData.report_ids);
        reportsToDisplay = reports.filter(r => reportIdSet.has(r.id));
      }
    }

    const sortedReports = [...reportsToDisplay];
    switch (sortBy) {
        case 'oldest':
            sortedReports.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
            break;
        case 'category':
            sortedReports.sort((a, b) => {
                const catAInfo = CATEGORIES_WITH_ICONS.find(c => c.value === a.category);
                const catBInfo = CATEGORIES_WITH_ICONS.find(c => c.value === b.category);
                const nameA = catAInfo ? t(catAInfo.translationKey) : a.category;
                const nameB = catBInfo ? t(catBInfo.translationKey) : b.category;
                return nameA.localeCompare(nameB);
            });
            break;
        case 'recent':
        default:
            sortedReports.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            break;
    }
    return sortedReports;
  }, [reports, analysis, activeTopic, sortBy, t]);

  const showAnalysisCard = analysis || analysisError;
  const currentSortLabel = sortOptions.find(opt => opt.key === sortBy)?.label;

  return (
    <div className="space-y-8 font-mono animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t('feedPanel.title')}</h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] mt-1">Live_Ledger_Streaming</p>
        </div>
        
        <div className="relative" ref={sortMenuRef}>
             <button 
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className="flex items-center space-x-3 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-xl"
            >
                <ListFilter className="h-4 w-4" />
                <span className="tracking-widest">{currentSortLabel}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSortMenuOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 z-50 overflow-hidden">
                    {sortOptions.map(option => (
                         <button
                            key={option.key}
                            onClick={() => { setSortBy(option.key); setIsSortMenuOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest transition-colors ${sortBy === option.key ? 'bg-cyan-600 text-white' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>
      
      {showAnalysisCard && (
        <div className="bg-zinc-900/40 border border-purple-500/30 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl animate-fade-in" role="region">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl animate-pulse"></div>
          <button onClick={onCloseAnalysis} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors" aria-label={t('feedPanel.closeAnalysisAria')}>
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3 mb-6">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">{t('feedPanel.analysisTitle')}</h3>
                  <p className="text-[8px] font-black text-purple-500 uppercase tracking-widest">Neural_Processor_Output</p>
              </div>
          </div>

          {analysisError ? (
            <p className="text-rose-500 text-sm font-bold uppercase italic">{analysisError}</p>
          ) : analysis && (
            <>
              <p className="text-zinc-300 text-sm leading-relaxed mb-8 border-l-2 border-purple-500/50 pl-6 italic">
                "{analysis.summary}"
              </p>
              {analysis.hot_topics.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('feedPanel.hotTopics')}</h4>
                  <div className="flex flex-wrap gap-2">
                    <TopicButton topic={null} activeTopic={activeTopic} setActiveTopic={setActiveTopic} />
                    {analysis.hot_topics.map((t) => (
                      <TopicButton key={t.topic} topic={t.topic} activeTopic={activeTopic} setActiveTopic={setActiveTopic} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {displayedReports.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {displayedReports.map((report) => (
            <ReportCard 
              key={report.id} 
              report={report} 
              onAddImage={(imageUrl) => onAddReportImage(report.id, imageUrl)}
              onJoinChat={onJoinReportChat}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-[3rem]">
          <ShieldCheck className="w-20 h-20 text-zinc-800 mx-auto mb-6 opacity-30" />
          <h3 className="text-2xl font-black text-zinc-700 uppercase tracking-tighter">{t('feedPanel.noReportsTitle')}</h3>
          <p className="mt-4 text-xs font-bold text-zinc-600 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
            {activeTopic
              ? t('feedPanel.noReportsForTopic', { topic: activeTopic })
              : t('feedPanel.noReportsGeneral')}
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedPanel;
