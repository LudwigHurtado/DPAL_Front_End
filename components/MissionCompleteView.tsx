
import React from 'react';
import type { MissionCompletionSummary } from '../types';
import { useTranslations } from '../i18n';
import { HeroCreditCoin, Gem, Award, ArrowLeft, QrCode } from './icons';

interface MissionCompleteViewProps {
    mission: MissionCompletionSummary;
    onReturn: () => void;
}

const MissionCompleteView: React.FC<MissionCompleteViewProps> = ({ mission, onReturn }) => {
    const { t } = useTranslations();
    
    // In a real app, this would be a dynamic link to the mission completion details
    const baseUrl = window.location.origin;
    const deepLinkUrl = `${baseUrl}?missionId=${encodeURIComponent(mission.title)}`; // Using title since summary doesn't have ID in current props, ideally should be ID
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(deepLinkUrl)}&bgcolor=111827&color=34d399&margin=10`;

    return (
        <div className="flex items-center justify-center min-h-[70vh] bg-gray-900 text-white rounded-lg p-8 relative overflow-hidden animate-fade-in">
            {/* Background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 opacity-50"></div>
             <div className="absolute top-0 left-0 w-full h-full sparkle-bg"></div>

            <div className="relative z-10 text-center max-w-3xl">
                <Award className="w-24 h-24 text-yellow-400 mx-auto mb-4 animate-bounce-custom" />
                <h1 className="text-5xl font-extrabold tracking-tight">{t('missionComplete.title')}</h1>
                <p className="mt-4 text-lg text-gray-300">{t('missionComplete.subtitle')}</p>
                <p className="mt-2 text-xl font-semibold text-cyan-300">"{mission.title}"</p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <div className="bg-black/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 flex flex-col justify-center">
                        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">{t('missionComplete.rewardsClaimed')}</h2>
                        <div className="space-y-4">
                            {/* HeroCredits */}
                            <div className="flex items-center space-x-3 text-lg">
                                <HeroCreditCoin className="w-8 h-8 text-yellow-400" />
                                <span className="font-bold">{mission.rewardHeroCredits} {t('heroHub.heroCredits')}</span>
                            </div>
                            {/* Legend Tokens */}
                            {mission.rewardLegendTokens && (
                                <div className="flex items-center space-x-3 text-lg">
                                    <Gem className="w-8 h-8 text-purple-400" />
                                    <span className="font-bold">{mission.rewardLegendTokens} {t('heroHub.legendTokens')}</span>
                                </div>
                            )}
                            {/* NFT Item */}
                            <div className="flex items-center space-x-4 border-t border-gray-800 pt-4">
                                <div className="text-4xl">{mission.rewardNft.icon}</div>
                                <div className="text-left">
                                    <p className="font-bold text-white">{mission.rewardNft.name}</p>
                                    <p className="text-xs text-gray-400">{t('missionCard.completionReward')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-950/20 backdrop-blur-sm p-6 rounded-2xl border border-emerald-500/30 flex flex-col items-center justify-center text-center">
                        <div className="flex items-center space-x-2 text-emerald-400 mb-4 font-black uppercase text-[10px] tracking-[0.2em]">
                            <QrCode className="w-4 h-4" />
                            <span>Mission_Verification_Artifact</span>
                        </div>
                        <div className="bg-gray-900 p-2 rounded-xl border border-emerald-900 inline-block mb-4 shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                            <img src={qrImageUrl} alt="Mission QR" className="w-28 h-28" />
                        </div>
                        <p className="text-[10px] font-bold text-emerald-500/70 uppercase">Scan to verify completion in the public ledger.</p>
                        <p className="text-[9px] font-mono text-emerald-500/40 mt-2">BLOCK_REF: #6843055</p>
                    </div>
                </div>
                
                <button
                    onClick={onReturn}
                    className="mt-10 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{t('missionComplete.returnToHub')}</span>
                </button>
            </div>
             <style>{`
                .sparkle-bg {
                    background-image:
                        radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
                        radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
                        radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
                        radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px);
                    background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
                    background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
                    animation: sparkle 5s linear infinite;
                }

                @keyframes sparkle {
                    from { background-position: 0 0, 40px 60px, 130px 270px, 70px 100px; }
                    to { background-position: -550px 0, -310px -310px, -120px -400px, 0 -150px; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }

                @keyframes bounce-custom {
                    0%, 100% { transform: translateY(-10%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                    50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
                }
                .animate-bounce-custom { animation: bounce-custom 1s infinite; }
            `}</style>
        </div>
    );
};

export default MissionCompleteView;
