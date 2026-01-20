import React from 'react';
import { Item } from '../types';
import { Briefcase, Home, Scale, Mask, ShieldCheck, Award } from './icons';
import { useTranslations } from '../i18n';

interface ItemCardProps {
    item: Item;
}

const getItemIcon = (item: Item) => {
    switch(item.icon) {
        case '🔬': return <ShieldCheck className="w-6 h-6 text-blue-300" />;
        case '📡': return <Home className="w-6 h-6 text-green-300" />;
        case '🛡️': return <ShieldCheck className="w-6 h-6 text-gray-300" />;
        case '🩹': return <Award className="w-6 h-6 text-yellow-300" />;
        default: return <Briefcase className="w-6 h-6 text-gray-400" />;
    }
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
    const { t } = useTranslations();

    const itemTypeKey = item.type.toLowerCase();

    return (
        <div className="bg-gray-700/50 p-3 rounded-lg text-center border border-gray-600">
            <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-gray-800 rounded-full">
                {getItemIcon(item)}
            </div>
            <p className="text-sm font-semibold text-white truncate" title={item.name}>{item.name}</p>
            <p className="text-xs text-gray-400">{t(`itemTypes.${itemTypeKey}`)}</p>
        </div>
    )
};

export default ItemCard;
