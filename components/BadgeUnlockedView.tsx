import React, { useEffect } from 'react';
import type { Report } from '../types';
import { useTranslations } from '../i18n';
import NftCard from './NftCard';
import { X } from './icons';

interface BadgeUnlockedViewProps {
    badgeReport: Report;
    onClose: () => void;
}

const BadgeUnlockedView: React.FC<BadgeUnlockedViewProps> = ({ badgeReport, onClose }) => {
    const { t } = useTranslations();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" 
            role="dialog" 
            aria-modal="true"
            aria-labelledby="badge-unlocked-title"
        >
            <div 
                className="relative bg-gray-800 text-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-700 overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-full sparkle-bg z-0"></div>
                <div className="relative z-10 text-center">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white" aria-label={t('badgeUnlocked.close')}>
                        <X className="w-6 h-6" />
                    </button>
                    
                    <h2 id="badge-unlocked-title" className="text-3xl font-extrabold text-yellow-300 tracking-tight">{t('badgeUnlocked.title')}</h2>
                    <p className="mt-2 text-gray-300">{t('badgeUnlocked.subtitle')}</p>

                    <div className="my-6 flex justify-center">
                        <div className="w-64">
                             <NftCard report={badgeReport} />
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    >
                        {t('badgeUnlocked.close')}
                    </button>
                </div>
            </div>
             <style>{`
                .sparkle-bg {
                    background-image:
                        radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
                        radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px);
                    background-size: 550px 550px, 350px 350px;
                    background-position: 0 0, 40px 60px;
                    animation: sparkle 5s linear infinite;
                }

                @keyframes sparkle {
                    from { background-position: 0 0, 40px 60px; }
                    to { background-position: -550px 0, -310px -310px; }
                }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

export default BadgeUnlockedView;
