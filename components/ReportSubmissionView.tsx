
import React from 'react';
import { Category, Report, EducationRole } from '../types';
import { CATEGORIES_WITH_ICONS, EDUCATION_ROLES } from '../constants';
import SubmissionPanel from './SubmissionPanel';
import { ArrowLeft, ShieldCheck, Database } from './icons';
import { useTranslations } from '../i18n';

interface ReportSubmissionViewProps {
    category: Category;
    role: EducationRole | null;
    onReturn: () => void;
    addReport: (report: Omit<Report, 'id' | 'timestamp' | 'hash' | 'blockchainRef' | 'status'>) => void;
    totalReports: number;
    prefilledDescription?: string;
}

const ReportSubmissionView: React.FC<ReportSubmissionViewProps> = ({ category, role, onReturn, addReport, totalReports, prefilledDescription }) => {
    const { t } = useTranslations();
    const categoryInfo = CATEGORIES_WITH_ICONS.find(c => c.value === category)!;
    const roleInfo = role ? EDUCATION_ROLES.find(r => r.value === role) : null;
    const imageUrl = `https://picsum.photos/seed/${categoryInfo.imageSeed}/1200/400`;

    return (
        <div className="animate-fade-in font-mono text-white max-w-7xl mx-auto pb-32 px-4">
             <style>{`
                .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .dispatch-gradient { background: linear-gradient(180deg, rgba(13, 13, 26, 0) 0%, rgba(13, 13, 26, 0.8) 100%); }
                .scanline-overlay {
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
                    background-size: 100% 4px, 3px 100%;
                    pointer-events: none;
                }
            `}</style>
            
            {/* Immersive Header */}
            <div className="relative h-[15rem] md:h-[20rem] rounded-[4rem] overflow-hidden mb-12 border-2 border-zinc-800 shadow-4xl group">
                <div 
                    className="absolute inset-0 bg-cover bg-center grayscale contrast-125 brightness-50 transition-all duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                ></div>
                <div className="absolute inset-0 bg-cyan-600/10 mix-blend-color opacity-30"></div>
                <div className="absolute inset-0 scanline-overlay"></div>
                <div className="absolute inset-0 dispatch-gradient"></div>
                
                <div className="relative h-full flex flex-col justify-between p-10 md:p-16">
                    <button
                        onClick={onReturn}
                        className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 hover:text-cyan-300 transition-colors group bg-black/60 w-fit px-8 py-2 rounded-full border border-cyan-500/20 backdrop-blur-md"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
                        <span>PROTOCOL_RESET</span>
                    </button>

                    <div className="flex items-end space-x-10">
                        <div className="p-6 bg-cyan-950/60 border-2 border-cyan-500/40 rounded-[2.5rem] text-6xl shadow-[0_0_60px_rgba(6,182,212,0.3)] flex-shrink-0 backdrop-blur-xl transition-transform group-hover:scale-110 duration-700">
                            {categoryInfo.icon}
                        </div>
                        <div className="pb-2">
                            <h2 className="text-xs font-black uppercase tracking-[0.6em] text-cyan-500 mb-3">Forensic_Intake_Protocol</h2>
                            <p className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-2xl">
                                {categoryInfo.headline}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Redesigned Submission Flow */}
            <SubmissionPanel 
                addReport={addReport} 
                preselectedCategory={category} 
                prefilledDescription={prefilledDescription} 
            />

            {/* Bottom Metadata Shards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-zinc-900/60 border-2 border-zinc-800 p-8 rounded-[3rem] shadow-xl backdrop-blur-sm flex items-center justify-between group">
                    <div className="flex items-center space-x-8">
                        <div className="w-20 h-20 bg-zinc-950 rounded-[2rem] flex items-center justify-center text-5xl border-2 border-zinc-800 flex-shrink-0 shadow-inner group-hover:border-cyan-500/30 transition-colors">
                            {roleInfo?.icon || '🛡️'}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Authorized_Role</p>
                            <p className="text-2xl font-black text-white uppercase tracking-tight">{roleInfo ? t(roleInfo.translationKey) : 'Standard_Citizen'}</p>
                        </div>
                    </div>
                    <ShieldCheck className="w-12 h-12 text-emerald-500/20 group-hover:text-emerald-500/50 transition-colors" />
                </div>

                <div className="bg-zinc-950 border-2 border-zinc-900 p-8 rounded-[3rem] shadow-inner flex items-center justify-between group">
                    <div className="flex items-end space-x-10">
                        <div className="min-w-0">
                            <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.4em] mb-3">Ledger_Volume</h3>
                            <div className="flex items-end space-x-4">
                                <span className="text-6xl font-black text-white tracking-tighter leading-none">{totalReports.toLocaleString()}</span>
                                <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest mb-1 group-hover:text-cyan-900 transition-colors">Total_Shards</span>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-3 text-emerald-500 text-[10px] font-black">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_emerald]"></div>
                                <span className="tracking-[0.2em]">P2P_SYNC_READY</span>
                            </div>
                            <p className="text-[9px] text-zinc-800 font-bold uppercase italic whitespace-nowrap">
                                "Awaiting cryptographic handshake..."
                            </p>
                        </div>
                    </div>
                    <Database className="w-12 h-12 text-zinc-900 group-hover:text-cyan-900 transition-colors" />
                </div>
            </div>
        </div>
    );
};

export default ReportSubmissionView;
