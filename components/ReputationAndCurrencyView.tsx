import React from 'react';
import { useTranslations } from '../i18n';
import { ArrowLeft, Zap, HeroCreditCoin } from './icons';

interface ReputationAndCurrencyViewProps {
  onReturn: () => void;
}

const ReputationAndCurrencyView: React.FC<ReputationAndCurrencyViewProps> = ({ onReturn }) => {
    const { t } = useTranslations();

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <button
                onClick={onReturn}
                className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('reputationAndCurrency.return')}</span>
            </button>

            <header className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">{t('reputationAndCurrency.title')}</h1>
                <p className="mt-2 text-lg text-gray-600">{t('reputationAndCurrency.subtitle')}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Reputation Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-cyan-500">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-cyan-100 rounded-full">
                            <Zap className="w-8 h-8 text-cyan-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{t('reputationAndCurrency.reputation.title')}</h2>
                            <p className="text-sm font-semibold text-cyan-700">{t('reputationAndCurrency.reputation.tagline')}</p>
                        </div>
                    </div>
                    <p className="text-gray-600">{t('reputationAndCurrency.reputation.description')}</p>
                </div>

                {/* HeroCredits Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-yellow-500">
                     <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <HeroCreditCoin className="w-8 h-8 text-yellow-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{t('reputationAndCurrency.heroCredits.title')}</h2>
                            <p className="text-sm font-semibold text-yellow-700">{t('reputationAndCurrency.heroCredits.tagline')}</p>
                        </div>
                    </div>
                    <p className="text-gray-600">{t('reputationAndCurrency.heroCredits.description')}</p>
                </div>
            </div>
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

export default ReputationAndCurrencyView;