

import React, { useState } from 'react';
import { useTranslations } from '../i18n';
import type { Hero, IapPack, StoreItem } from '../types';
import { ArrowLeft, Coins, Gem, Store, Check } from './icons';

interface StoreViewProps {
  hero: Hero;
  iapPacks: IapPack[];
  storeItems: StoreItem[];
  onInitiateHCPurchase: (pack: IapPack) => void;
  onInitiateStoreItemPurchase: (item: StoreItem) => void;
  onReturn: () => void;
  isEmbedded?: boolean;
}

const StoreView: React.FC<StoreViewProps> = ({ hero, iapPacks, storeItems, onInitiateHCPurchase, onInitiateStoreItemPurchase, onReturn, isEmbedded = false }) => {
    const { t } = useTranslations();
    const [activeTab, setActiveTab] = useState<'buy' | 'spend'>('buy');
    
    const getTypeStyles = (type: StoreItem['type']) => {
        switch(type) {
            case 'Gear': return 'bg-gray-600 text-gray-200';
            case 'Consumable': return 'bg-green-500/20 text-green-300';
            case 'Frame': return 'bg-blue-500/20 text-blue-300';
            case 'Badge': return 'bg-yellow-500/20 text-yellow-300';
            default: return 'bg-gray-700 text-gray-300';
        }
    }

    return (
        <div className={`animate-fade-in ${!isEmbedded ? 'max-w-6xl mx-auto' : ''}`}>
             {!isEmbedded && (
                 <>
                    <button
                        onClick={onReturn}
                        className="inline-flex items-center space-x-2 text-sm font-semibold text-skin-muted hover:text-skin-base transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t('store.returnToMainMenu')}</span>
                    </button>
                    <header className="mb-8 text-center">
                        <h1 className="text-4xl font-extrabold text-skin-base tracking-tight">{t('store.title')}</h1>
                        <p className="mt-2 text-lg text-skin-muted">{t('store.subtitle')}</p>
                    </header>
                 </>
             )}
            
            <div className="bg-skin-panel border border-skin-panel rounded-lg">
                <div className="p-4 border-b border-skin-panel">
                     <div className="flex justify-between items-center">
                        <div className="flex -mb-px" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('buy')}
                                className={`flex items-center space-x-2 whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'buy'
                                    ? 'border-skin-primary text-skin-primary'
                                    : 'border-transparent text-skin-muted hover:text-skin-base hover:border-gray-600'
                                }`}
                            >
                                <Coins className="w-5 h-5"/>
                                <span>{t('store.tabs.buy')}</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('spend')}
                                className={`flex items-center space-x-2 whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'spend'
                                    ? 'border-skin-primary text-skin-primary'
                                    : 'border-transparent text-skin-muted hover:text-skin-base hover:border-gray-600'
                                }`}
                            >
                                <Store className="w-5 h-5"/>
                                <span>{t('store.tabs.spend')}</span>
                            </button>
                        </div>
                        <div className="text-right">
                             <p className="text-xs font-medium text-skin-muted">{t('store.balance')}</p>
                             <div className="flex items-center space-x-2 text-lg font-bold text-skin-base">
                                <Coins className="w-5 h-5 text-yellow-400"/>
                                <span>{hero.heroCredits.toLocaleString()}</span>
                            </div>
                        </div>
                     </div>
                </div>

                <div className="p-6">
                    {activeTab === 'buy' && (
                        <div>
                            {!hero.hasMadeFirstPurchase && (
                                <div className="bg-green-500/20 border-l-4 border-green-400 text-green-200 p-4 rounded-md mb-6" role="alert">
                                    <p className="font-bold">{t('store.firstBonus')}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {iapPacks.map(pack => (
                                    <div key={pack.sku} className={`bg-gray-800 rounded-lg p-5 text-center border-2 transition-all ${pack.isBestValue ? 'border-yellow-400 shadow-lg shadow-yellow-500/10' : 'border-gray-700'}`}>
                                        <h3 className="text-xl font-bold text-skin-base">{t(`iapPacks.${pack.sku}`)}</h3>
                                        <div className="my-4">
                                            <span className="text-5xl font-extrabold text-skin-primary">{pack.hcAmount.toLocaleString()}</span>
                                            <span className="text-lg font-bold text-skin-muted"> HC</span>
                                        </div>
                                        <button 
                                            onClick={() => onInitiateHCPurchase(pack)}
                                            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                                        >
                                            ${pack.price.toFixed(2)}
                                        </button>
                                        {pack.isBestValue && (
                                            <div className="mt-3 text-xs font-semibold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full inline-block">
                                                {t('store.bestValue')}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'spend' && (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                             {storeItems.map(item => {
                                const isOwned = hero.unlockedItemSkus.includes(item.sku);
                                const canAfford = hero.heroCredits >= item.price;
                                return (
                                    <div key={item.sku} className="bg-gray-800 rounded-lg p-4 flex flex-col text-center border border-gray-700">
                                        <div className="relative w-full">
                                            <div className="text-5xl mb-3">{item.icon}</div>
                                            <div className={`absolute top-0 right-0 text-xs font-semibold px-2 py-0.5 rounded-full ${getTypeStyles(item.type)}`}>{t(`itemTypes.${item.type.toLowerCase()}`)}</div>
                                        </div>
                                        <h4 className="font-bold text-skin-base">{t(`storeItems.${item.sku}`)}</h4>
                                        <p className="text-xs text-skin-muted mt-1 flex-grow">{t(`storeItems.${item.sku}_desc`)}</p>
                                        <div className="w-full mt-4">
                                            {isOwned ? (
                                                 <button disabled className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-md cursor-default">
                                                     <Check className="w-5 h-5"/>
                                                     <span>{t('store.owned')}</span>
                                                 </button>
                                            ) : (
                                                <button 
                                                    onClick={() => onInitiateStoreItemPurchase(item)}
                                                    disabled={!canAfford}
                                                    className="w-full flex items-center justify-center space-x-2 bg-transparent text-skin-primary border-2 border-skin-primary font-bold py-2 px-4 rounded-md hover:bg-cyan-500/10 transition-colors disabled:border-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed"
                                                >
                                                     <Coins className="w-5 h-5"/>
                                                     <span>{item.price.toLocaleString()}</span>
                                                </button>
                                            )}
                                            {!isOwned && !canAfford && <p className="text-xs text-red-500 mt-1">{t('store.insufficient')}</p>}
                                        </div>
                                    </div>
                                )
                             })}
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoreView;
