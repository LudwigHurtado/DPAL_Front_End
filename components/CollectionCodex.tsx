

import React, { useMemo, useState } from 'react';
import type { Report, CharacterNft, Hero } from '../types';
import { useTranslations } from '../i18n';
import NftCard from './NftCard';
import { ArrowLeft, Award, Coins, Gem } from './icons';
import { LEGENDS_OF_THE_LEDGER_NFTS } from '../constants';

interface CollectionCodexProps {
  reports: Report[];
  hero: Hero;
  onReturn: () => void;
}

const CollectionCodex: React.FC<CollectionCodexProps> = ({ reports, hero, onReturn }) => {
    const { t } = useTranslations();
    const [activeTab, setActiveTab] = useState<'rewards' | 'badges' | 'legends'>('rewards');

    const earnedNfts = useMemo(() =>
        reports
            .filter(r => r.isAuthor && r.earnedNft && (r.earnedNft.source === 'report' || r.earnedNft.source === 'minted'))
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
        [reports]
    );

    const badgeNfts = useMemo(() =>
        reports
            .filter(r => r.isAuthor && r.earnedNft && r.earnedNft.source === 'badge')
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
        [reports]
    );

    return (
        <div className="animate-fade-in">
            <button
                onClick={onReturn}
                className="inline-flex items-center space-x-2 text-sm font-semibold text-skin-muted hover:text-skin-base transition-colors mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('collectionCodex.returnToHeroHub')}</span>
            </button>

            <header className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-skin-base tracking-tight">{t('collectionCodex.title')}</h1>
                <p className="mt-2 text-lg text-skin-muted">{t('collectionCodex.subtitle')}</p>
            </header>
            
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-skin-panel border border-skin-panel p-4 rounded-lg flex items-center space-x-3">
                    <div className="p-2 bg-yellow-500/10 rounded-full">
                         <Coins className="w-6 h-6 text-yellow-400"/>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-skin-muted">{t('heroHub.heroCredits')}</p>
                        <p className="text-xl font-bold text-skin-base">{hero.heroCredits.toLocaleString()}</p>
                    </div>
                </div>
                 <div className="bg-skin-panel border border-skin-panel p-4 rounded-lg flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/10 rounded-full">
                         <Gem className="w-6 h-6 text-purple-400"/>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-skin-muted">{t('heroHub.legendTokens')}</p>
                        <p className="text-xl font-bold text-skin-base">{hero.legendTokens.toLocaleString()}</p>
                    </div>
                </div>
            </div>

             <div className="mb-6 border-b border-skin-panel flex justify-center">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('rewards')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'rewards'
                            ? 'border-skin-primary text-skin-primary'
                            : 'border-transparent text-skin-muted hover:text-skin-base hover:border-gray-600'
                        }`}
                    >
                        {t('collectionCodex.tabs.rewards')}
                    </button>
                     <button
                        onClick={() => setActiveTab('badges')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'badges'
                            ? 'border-skin-primary text-skin-primary'
                            : 'border-transparent text-skin-muted hover:text-skin-base hover:border-gray-600'
                        }`}
                    >
                        {t('collectionCodex.tabs.badges')}
                    </button>
                    <button
                        onClick={() => setActiveTab('legends')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'legends'
                            ? 'border-skin-primary text-skin-primary'
                            : 'border-transparent text-skin-muted hover:text-skin-base hover:border-gray-600'
                        }`}
                    >
                        {t('collectionCodex.tabs.legends')}
                    </button>
                </nav>
            </div>


            {activeTab === 'rewards' && (
                earnedNfts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {earnedNfts.map((report) => (
                            <NftCard key={report.id} report={report} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-skin-muted py-20 bg-skin-panel border border-skin-panel rounded-lg">
                        <Award className="w-20 h-20 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-skin-base">{t('collectionCodex.noNftsTitle')}</h3>
                        <p className="mt-2 max-w-sm mx-auto">{t('collectionCodex.noNftsSubtitle')}</p>
                    </div>
                )
            )}
            
             {activeTab === 'badges' && (
                badgeNfts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {badgeNfts.map((report) => (
                            <NftCard key={report.id} report={report} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-skin-muted py-20 bg-skin-panel border border-skin-panel rounded-lg">
                        <Award className="w-20 h-20 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-skin-base">{t('collectionCodex.noBadgesTitle')}</h3>
                        <p className="mt-2 max-w-sm mx-auto">{t('collectionCodex.noBadgesSubtitle')}</p>
                    </div>
                )
            )}

            {activeTab === 'legends' && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {LEGENDS_OF_THE_LEDGER_NFTS.map((nft) => (
                        <NftCard key={nft.title} characterNft={nft} />
                    ))}
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
            `}</style>
        </div>
    );
};

export default CollectionCodex;
