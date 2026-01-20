
import React, { useState, useMemo } from 'react';
import { CATEGORIES_WITH_ICONS } from '../constants';
import { Category } from '../types';
import { useTranslations } from '../i18n';
import { ArrowLeft, ShieldCheck, Megaphone, Zap, Search, X, AlertTriangle } from './icons';

interface CategorySelectionViewProps {
  onSelectCategory: (category: Category) => void;
  onSelectMissions: (category: Category) => void;
  onReturnToHub: () => void;
}

const BorderPulse: React.FC<{ color: string }> = ({ color }) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
        <rect 
            x="0" y="0" width="100%" height="100%" 
            rx="2.5rem" fill="none" 
            stroke={color} strokeWidth="3"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-border-trace"
            style={{ 
                filter: `drop-shadow(0 0 10px ${color})`,
                strokeDasharray: '120 1200'
            }}
        />
    </svg>
);

const CategorySelectionView: React.FC<CategorySelectionViewProps> = ({ onSelectCategory, onSelectMissions, onReturnToHub }) => {
    const { t } = useTranslations();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = useMemo(() => {
        const sorted = [...CATEGORIES_WITH_ICONS].sort((a, b) => t(a.translationKey).localeCompare(t(b.translationKey)));
        if (!searchQuery.trim()) return sorted;
        
        const query = searchQuery.toLowerCase();
        return sorted.filter(cat => 
            t(cat.translationKey).toLowerCase().includes(query) ||
            cat.value.toLowerCase().includes(query)
        );
    }, [searchQuery, t]);

    return (
        <div className="animate-fade-in font-mono text-white max-w-7xl mx-auto px-4 pb-20">
            <button
                onClick={onReturnToHub}
                className="inline-flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-cyan-400 transition-colors mb-12 group"
            >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span>TERMINAL_RETURN</span>
            </button>

            <header className="mb-12 text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                    <ShieldCheck className="w-10 h-10 text-cyan-500" />
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">Category_Picker</h1>
                </div>
                <p className="text-zinc-500 text-xs font-bold tracking-[0.4em] uppercase mb-10">Select target domain for field reporting or tactical missions</p>

                {/* Tactical Search Field */}
                <div className="max-w-2xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className={`w-6 h-6 transition-colors ${searchQuery ? 'text-cyan-500' : 'text-zinc-700'}`} />
                    </div>
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="FILTER_DOMAINS_BY_KEYWORD..."
                        className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-[2rem] pl-16 pr-16 py-6 text-lg font-black uppercase tracking-widest text-white outline-none focus:border-cyan-500 focus:ring-8 focus:ring-cyan-500/5 transition-all shadow-inner placeholder:text-zinc-800"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-6 flex items-center text-zinc-600 hover:text-rose-500 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </header>

            {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredCategories.map((cat) => (
                        <div
                            key={cat.value}
                            className="group flex flex-col bg-zinc-900/40 rounded-[2.5rem] border-2 border-zinc-800 hover:border-zinc-600 transition-all duration-500 relative overflow-hidden shadow-2xl p-8"
                        >
                            <BorderPulse color="#06b6d4" />
                            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity"></div>
                            
                            <div className="flex flex-col items-center text-center mb-8 relative z-10">
                                <div className="text-6xl mb-6 transition-transform duration-500 group-hover:scale-110">
                                    {cat.icon}
                                </div>
                                <span className="text-lg font-black text-white transition-colors uppercase tracking-tight">
                                    {t(cat.translationKey)}
                                </span>
                            </div>

                            <div className="mt-auto space-y-3 relative z-10">
                                 <button
                                    onClick={() => onSelectCategory(cat.value)}
                                    className="w-full flex items-center justify-center space-x-3 bg-white text-black font-black py-4 px-4 rounded-2xl hover:bg-zinc-200 transition-all uppercase text-[10px] tracking-widest shadow-lg"
                                >
                                    <Megaphone className="w-4 h-4" />
                                    <span>File_Report</span>
                                </button>
                                <button
                                    onClick={() => onSelectMissions(cat.value)}
                                    className="w-full flex items-center justify-center space-x-3 bg-cyan-600 text-white font-black py-4 px-4 rounded-2xl hover:bg-cyan-500 transition-all uppercase text-[10px] tracking-widest shadow-lg"
                                >
                                    <Zap className="w-4 h-4 fill-current" />
                                    <span>Tactical_Missions</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center space-y-8 animate-fade-in">
                    <div className="p-8 bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-[3rem] inline-block">
                        <AlertTriangle className="w-16 h-16 text-zinc-800" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black uppercase text-zinc-700 tracking-tighter">Null_Set_Detected</h3>
                        <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mt-2">No categories matching "{searchQuery}" in local blocks.</p>
                    </div>
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="px-10 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                        Clear Search Query
                    </button>
                </div>
            )}

            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes border-trace {
                    0% { stroke-dashoffset: 1320; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-border-trace {
                    animation: border-trace 3s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default CategorySelectionView;
