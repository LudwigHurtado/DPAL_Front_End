
import React, { useState, useMemo } from 'react';
import { CATEGORIES_WITH_ICONS } from '../constants';
import { Search, MapPin, Loader, Target, Sparkles, Crosshair, ListFilter, Activity, ChevronRight, Hash, Maximize2, X, CheckCircle, Megaphone, Plus } from './icons';
import { Category, Hero, Report } from '../types';
import { useTranslations } from '../i18n';

interface FilterPanelProps {
  filters: {
    keyword: string;
    selectedCategories: Category[];
    location: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    keyword: string;
    selectedCategories: Category[];
    location: string;
  }>>;
  onAnalyzeFeed: () => void;
  isAnalyzing: boolean;
  reportCount: number;
  hero: Hero;
  reports: Report[];
  onJoinReportChat?: (report: Report) => void;
  onAddNewReport?: () => void;
}

const TargetingScanner: React.FC = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
        <rect 
            x="0" y="0" width="100%" height="100%" 
            rx="2rem" fill="none" 
            strokeWidth="3"
            className="animate-targeting-patrol"
            style={{ 
                strokeDasharray: '80 800',
            }}
        />
    </svg>
);

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, onAnalyzeFeed, isAnalyzing, reportCount, hero, reports, onJoinReportChat, onAddNewReport }) => {
  const { t } = useTranslations();
  const [isTriageExpanded, setIsTriageExpanded] = useState(false);
  
  const mapUrl = useMemo(() => {
    return filters.location 
        ? `https://maps.google.com/maps?q=${encodeURIComponent(filters.location)}&t=k&z=12&ie=UTF8&iwloc=&output=embed`
        : null;
  }, [filters.location]);

  const matchingSignals = useMemo(() => {
    if (filters.selectedCategories.length === 0) return [];
    return reports.filter(r => filters.selectedCategories.includes(r.category)).slice(0, 5);
  }, [reports, filters.selectedCategories]);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl font-mono relative group/target flex flex-col h-full max-h-[85vh]">
      <style>{`
        @keyframes targeting-patrol {
            0% { stroke-dashoffset: 1000; stroke: #22d3ee; filter: drop-shadow(0 0 12px #22d3ee); }
            33% { stroke: #22d3ee; filter: drop-shadow(0 0 12px #22d3ee); }
            33.1% { stroke: #ffffff; filter: drop-shadow(0 0 12px #ffffff); }
            66% { stroke: #ffffff; filter: drop-shadow(0 0 12px #ffffff); }
            66.1% { stroke: #3b82f6; filter: drop-shadow(0 0 12px #3b82f6); }
            100% { stroke-dashoffset: 0; stroke: #3b82f6; filter: drop-shadow(0 0 12px #3b82f6); }
        }
        .animate-targeting-patrol { animation: targeting-patrol 4s linear infinite; }
        @keyframes radar-sweep {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-radar-sweep {
            animation: radar-sweep 4s linear infinite;
            background: conic-gradient(from 0deg, rgba(6, 182, 212, 0.1), transparent 50%);
        }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .button-glow-cyan { box-shadow: 0 0 20px rgba(6, 182, 212, 0.2); }
        .button-glow-cyan:hover { box-shadow: 0 0 30px rgba(6, 182, 212, 0.4); }
      `}</style>

      <TargetingScanner />

      <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 relative z-10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
            <Plus className="w-6 h-6 text-cyan-500 animate-pulse" />
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Add_A_New_Report</h2>
        </div>
        <div className="flex items-center space-x-2 text-[9px] font-black text-zinc-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_emerald]"></div>
            <span>TERM_ACTIVE</span>
        </div>
      </div>

      <div className="p-6 space-y-8 relative z-10 flex-grow overflow-y-auto custom-scrollbar">
          
          {/* PRIMARY ACTION: ADD NEW REPORT */}
          {onAddNewReport && (
            <button 
                onClick={onAddNewReport}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-6 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all active:scale-95 shadow-2xl button-glow-cyan group/add"
            >
                <div className="flex items-center space-x-3">
                    <Megaphone className="w-6 h-6 group-hover/add:scale-110 transition-transform" />
                    <span className="uppercase text-xs tracking-[0.2em]">Initialize_Genesis_Protocol</span>
                </div>
                <p className="text-[8px] font-bold text-cyan-200 uppercase tracking-widest opacity-60">Sync new evidence to ledger</p>
            </button>
          )}

          <div className="relative w-full aspect-video rounded-3xl bg-black border border-zinc-800 overflow-hidden mb-2">
            {mapUrl ? (
                <iframe 
                    src={mapUrl}
                    className="w-full h-full grayscale opacity-40 group-hover/target:opacity-60 transition-opacity"
                    frameBorder="0"
                    scrolling="no"
                    title="Mini Target Map"
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-5">
                    <div className="w-28 h-28 rounded-full border border-zinc-800 relative overflow-hidden">
                        <div className="absolute inset-0 animate-radar-sweep rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Crosshair className="w-6 h-6 text-zinc-800" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] text-center px-4 leading-relaxed">Awaiting_Geospatial_Focus</p>
                </div>
            )}
            <div className="absolute top-4 left-4 flex items-center space-x-3 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/5 text-[9px] font-black uppercase text-cyan-400">
                <div className="w-1.5 h-1.5 bg-cyan-500 animate-ping rounded-full"></div>
                <span>Scanning Sector</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] pl-2">01_Query_String</label>
              <div className="relative group">
                <Search className="h-5 w-5 text-zinc-700 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-500 transition-colors" />
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                  placeholder="Search by keywords..."
                  className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:border-cyan-500 transition-all text-xs font-bold tracking-tight text-white outline-none shadow-inner"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] pl-2">02_Geospatial_Lock</label>
              <div className="relative">
                <MapPin className="h-5 w-5 text-rose-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Sector, or Zip..."
                  className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:border-cyan-500 transition-all text-xs font-bold tracking-tight text-white outline-none shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">03_Sector_Triage</label>
                <button onClick={() => setIsTriageExpanded(true)} className="text-zinc-700 hover:text-cyan-400 transition-colors">
                    <Maximize2 className="w-4 h-4" />
                </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {[...CATEGORIES_WITH_ICONS]
                .sort((a, b) => t(a.translationKey).localeCompare(t(b.translationKey)))
                .map((cat) => {
                const isSelected = filters.selectedCategories.includes(cat.value);
                return (
                  <button
                    key={cat.value}
                    onClick={() => setFilters(prev => ({
                        ...prev,
                        selectedCategories: isSelected ? prev.selectedCategories.filter(c => c !== cat.value) : [...prev.selectedCategories, cat.value]
                    }))}
                    className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-tighter rounded-xl border transition-all flex items-center space-x-2.5 ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    <span className="grayscale-0">{cat.icon}</span>
                    <span className="truncate max-w-[90px]">{t(cat.translationKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TRIAGE EXPANSION MODAL */}
          {isTriageExpanded && (
              <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 md:p-20 font-mono animate-fade-in">
                  <div className="bg-zinc-900 border-4 border-emerald-500/30 rounded-[3rem] w-full max-w-4xl p-12 relative shadow-[0_0_80px_rgba(16,185,129,0.15)] animate-scale-in">
                        <button onClick={() => setIsTriageExpanded(false)} className="absolute top-8 right-8 p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-all">
                            <X className="w-6 h-6" />
                        </button>
                        <div className="space-y-10">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                                    <ListFilter className="w-8 h-8 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Advanced_Sector_Triage</h2>
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mt-2">Filter Network Logs by Domain Node</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
                                {[...CATEGORIES_WITH_ICONS]
                                  .sort((a, b) => t(a.translationKey).localeCompare(t(b.translationKey)))
                                  .map((cat) => {
                                    const isSelected = filters.selectedCategories.includes(cat.value);
                                    return (
                                        <button
                                            key={cat.value}
                                            onClick={() => setFilters(prev => ({
                                                ...prev,
                                                selectedCategories: isSelected ? prev.selectedCategories.filter(c => c !== cat.value) : [...prev.selectedCategories, cat.value]
                                            }))}
                                            className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center space-y-4 text-center ${
                                                isSelected
                                                ? 'bg-emerald-600 border-emerald-400 text-white shadow-xl scale-105'
                                                : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                            }`}
                                        >
                                            <span className="text-4xl">{cat.icon}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{t(cat.translationKey)}</span>
                                            {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setFilters(prev => ({ ...prev, selectedCategories: [] }))} className="px-10 py-5 bg-zinc-800 rounded-2xl text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-all">Clear_All</button>
                                <button onClick={() => setIsTriageExpanded(false)} className="flex-grow bg-white text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Apply_Triage_Filters</button>
                            </div>
                        </div>
                  </div>
              </div>
          )}

          {filters.selectedCategories.length > 0 && (
            <div className="space-y-5 pt-6 border-t border-zinc-800 animate-fade-in">
                <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em]">Operational_Signals</label>
                    <span className="text-[9px] font-mono text-zinc-700">{matchingSignals.length} Active</span>
                </div>
                <div className="space-y-3">
                    {matchingSignals.length > 0 ? (
                        matchingSignals.map(sig => (
                            <button 
                                key={sig.id}
                                onClick={() => onJoinReportChat && onJoinReportChat(sig)}
                                className="w-full text-left bg-zinc-950 border border-zinc-800 p-4 rounded-2xl hover:border-emerald-500 transition-all group/sig relative overflow-hidden shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-black text-white truncate uppercase tracking-tighter">{sig.title}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_emerald]"></div>
                                             <p className="text-[9px] text-zinc-600 font-bold uppercase truncate">{sig.location}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-zinc-800 group-hover/sig:text-emerald-500 transition-colors" />
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="py-8 text-center bg-black/20 rounded-[2rem] border border-zinc-900 border-dashed">
                             <p className="text-[10px] text-zinc-800 font-black uppercase tracking-[0.4em] italic">Scanning_Empty_Sector...</p>
                        </div>
                    )}
                </div>
            </div>
          )}
          
          <div className="pt-6 border-t border-zinc-800 flex-shrink-0">
              <button
                onClick={onAnalyzeFeed}
                disabled={isAnalyzing || reportCount === 0}
                className="w-full flex items-center justify-center space-x-4 px-6 py-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-black uppercase text-zinc-400 hover:text-white hover:border-purple-500/50 transition-all shadow-xl group disabled:opacity-30 active:scale-95"
              >
                {isAnalyzing ? <Loader className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />}
                <span className="tracking-[0.2em]">{isAnalyzing ? 'SYNTHESIZING...' : 'ANALYZE_NODES'}</span>
              </button>
          </div>
      </div>
    </div>
  );
};

export default FilterPanel;
