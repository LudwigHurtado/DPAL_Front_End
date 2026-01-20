
import React, { useRef, useEffect, useState } from 'react';
import { type Report, type CharacterNft } from '../types';
import { useTranslations } from '../i18n';
import { CATEGORIES_WITH_ICONS } from '../constants';
import { QrCode } from './icons';
import QrCodeDisplay from './QrCodeDisplay';

interface NftCardProps {
  report?: Report;
  characterNft?: CharacterNft;
}

const NftCard: React.FC<NftCardProps> = ({ report, characterNft }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [showQr, setShowQr] = useState(false);
    const { t } = useTranslations();

    const nft = report?.earnedNft;
    const isCharacter = !!characterNft;
    const displayData = isCharacter ? characterNft : nft;

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;
        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        };
        card.addEventListener('mousemove', handleMouseMove);
        return () => card.removeEventListener('mousemove', handleMouseMove);
    }, []);

    if (!displayData) return null;

    if (isCharacter) {
        return (
            <div ref={cardRef} className="nft-card-container group relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-gray-800 shadow-2xl transition-transform duration-300 hover:scale-105 p-2 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <img src={displayData.imageUrl} alt={displayData.title} className="w-full h-full object-cover aspect-[4/5]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-xl leading-tight drop-shadow-lg">{displayData.title}</h3>
                        <p className="text-sm text-gray-300 drop-shadow-md">{characterNft.collection}</p>
                    </div>
                </div>
                 <style>{`
                    .nft-card-container { --mouse-x: 50%; --mouse-y: 50%; }
                    .nft-card-container::before {
                        content: ''; position: absolute; left: 0; right: 0; top: 0; bottom: 0;
                        background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0, 255, 255, 0.2), transparent 40%);
                        border-radius: inherit; opacity: 0; transition: opacity 0.5s; z-index: 2; pointer-events: none;
                    }
                    .nft-card-container:hover::before { opacity: 1; }
                `}</style>
            </div>
        );
    }
    
    const categoryInfo = report ? CATEGORIES_WITH_ICONS.find(c => c.value === (nft?.mintCategory || report.category)) : null;
    const categoryName = categoryInfo ? t(categoryInfo.translationKey) : (nft?.mintCategory || report?.category);

    return (
        <div ref={cardRef} className="nft-card-container group relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-gray-800 shadow-2xl transition-transform duration-300 hover:scale-105 p-2 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
                <img src={displayData.imageUrl} alt={displayData.title} className="w-full h-full object-cover aspect-[4/5]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none"></div>

                <div className="absolute top-0 left-0 right-0 p-3 bg-black/40 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {categoryInfo && <span className="text-xl">{categoryInfo.icon}</span>}
                        <h3 className="font-bold text-lg text-white uppercase tracking-wider drop-shadow-lg">{categoryName}</h3>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setShowQr(true); }} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors" title="Prove Authenticity">
                        <QrCode className="w-5 h-5 text-cyan-400" />
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <div className="bg-black/40 backdrop-blur-sm rounded-md p-2 text-xs font-mono">
                        <div className="flex justify-between text-gray-300">
                            <span>Block #</span>
                            <span className="text-white">#{nft.blockNumber}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Tx Hash</span>
                            <span className="text-white truncate">{nft.txHash.substring(0, 10)}...</span>
                        </div>
                    </div>
                </div>
            </div>
            {showQr && report && <QrCodeDisplay type="report" id={report.id} onClose={() => setShowQr(false)} />}
            <style>{`
                .nft-card-container { --mouse-x: 50%; --mouse-y: 50%; }
                .nft-card-container::before {
                    content: ''; position: absolute; left: 0; right: 0; top: 0; bottom: 0;
                    background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0, 255, 255, 0.2), transparent 40%);
                    border-radius: inherit; opacity: 0; transition: opacity 0.5s; z-index: 2; pointer-events: none;
                }
                .nft-card-container:hover::before { opacity: 1; }
            `}</style>
        </div>
    );
};

export default NftCard;
