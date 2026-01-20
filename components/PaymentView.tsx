
import React, { useState, useEffect } from 'react';
import { useTranslations } from '../i18n';
import type { Hero, IapPack, StoreItem } from '../types';
import { X, Loader, Coins, CreditCard, Check } from './icons';

interface PaymentViewProps {
    item: IapPack | StoreItem;
    hero: Hero;
    onClose: () => void;
    onConfirmPurchase: () => void;
}

const PaymentView: React.FC<PaymentViewProps> = ({ item, hero, onClose, onConfirmPurchase }) => {
    const { t } = useTranslations();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formState, setFormState] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvc: ''
    });

    const isIapPack = 'hcAmount' in item;
    const isFormValid = isIapPack ? formState.cardNumber.length === 19 && formState.cardName && formState.expiry.length === 5 && formState.cvc.length === 3 : true;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'cardNumber') {
            formattedValue = value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
        } else if (name === 'expiry') {
            formattedValue = value.replace(/[^\d]/g, '').replace(/(.{2})/, '$1/').trim().slice(0, 5);
        } else if (name === 'cvc') {
            formattedValue = value.replace(/[^\d]/g, '').slice(0, 3);
        }
        setFormState(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            onConfirmPurchase();
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500); // Close after success message
        }, 1500);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const renderIapContent = () => {
        const pack = item as IapPack;
        return (
            <>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{t(`iapPacks.${pack.sku}`)}</h2>
                    <p className="text-gray-500">+{pack.hcAmount.toLocaleString()} HC</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="cardName">{t('paymentView.cardName')}</label>
                        <input type="text" id="cardName" name="cardName" value={formState.cardName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="cardNumber">{t('paymentView.cardNumber')}</label>
                        <input type="text" id="cardNumber" name="cardNumber" value={formState.cardNumber} onChange={handleInputChange} placeholder="0000 0000 0000 0000" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="expiry">{t('paymentView.expiry')}</label>
                            <input type="text" id="expiry" name="expiry" value={formState.expiry} onChange={handleInputChange} placeholder="MM/YY" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="cvc">{t('paymentView.cvc')}</label>
                            <input type="text" id="cvc" name="cvc" value={formState.cvc} onChange={handleInputChange} placeholder="123" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                    </div>
                    <div className="pt-4 flex flex-col items-center">
                        <button type="submit" disabled={!isFormValid || isProcessing} className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-blue-300">
                           {isProcessing ? <Loader className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                           <span>{isProcessing ? t('paymentView.processing') : `${t('paymentView.pay')} $${pack.price.toFixed(2)}`}</span>
                        </button>
                        <button type="button" onClick={onClose} className="mt-2 text-sm text-gray-500 hover:text-gray-700">{t('paymentView.cancel')}</button>
                    </div>
                </form>
            </>
        );
    };

    const renderStoreItemContent = () => {
        const storeItem = item as StoreItem;
        const remainingBalance = hero.heroCredits - storeItem.price;
        return (
            <div className="text-center">
                <div className="text-6xl mx-auto mb-4">{storeItem.icon}</div>
                <h2 className="text-2xl font-bold text-gray-800">{t(`storeItems.${storeItem.sku}`)}</h2>
                <p className="text-gray-500 mb-6">{t(`storeItems.${storeItem.sku}_desc`)}</p>
                <div className="bg-gray-100 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{t('paymentView.currentBalance')}</span>
                        <span className="font-semibold text-gray-800">{hero.heroCredits.toLocaleString()} HC</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{t('paymentView.itemCost')}</span>
                        <span className="font-semibold text-red-600">- {storeItem.price.toLocaleString()} HC</span>
                    </div>
                    <div className="border-t border-gray-300 my-2"></div>
                    <div className="flex justify-between items-center font-bold">
                        <span className="text-gray-600">{t('paymentView.remainingBalance')}</span>
                        <span className="text-green-600">{remainingBalance.toLocaleString()} HC</span>
                    </div>
                </div>
                 <div className="pt-6 flex flex-col items-center">
                    <button onClick={handleSubmit} disabled={isProcessing} className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-blue-300">
                        {isProcessing ? <Loader className="w-5 h-5 animate-spin" /> : <Coins className="w-5 h-5" />}
                        <span>{isProcessing ? t('paymentView.processing') : t('paymentView.confirmPurchase')}</span>
                    </button>
                    <button type="button" onClick={onClose} className="mt-2 text-sm text-gray-500 hover:text-gray-700">{t('paymentView.cancel')}</button>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transition-all duration-300" style={{ transform: isSuccess ? 'scale(1.05)' : 'scale(1)'}}>
                {isSuccess ? (
                    <div className="p-10 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <Check className="w-12 h-12 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{t('paymentView.successTitle')}</h2>
                        <p className="text-gray-600 mt-2">{t('paymentView.successMessage')}</p>
                    </div>
                ) : (
                    <>
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label={t('paymentView.closeAria')}>
                            <X className="w-6 h-6" />
                        </button>
                        <div className="p-8">
                            {isIapPack ? renderIapContent() : renderStoreItemContent()}
                        </div>
                    </>
                )}
            </div>
            <style>{`
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default PaymentView;
