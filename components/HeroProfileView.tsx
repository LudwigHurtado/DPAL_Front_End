import React, { useState, useMemo } from 'react';
// FIX: Changed import to correctly handle HeroPath enum as a value.
import { type Hero, HeroPath } from '../types';
import { useTranslations } from '../i18n';
import { Coins, Gem, Star, Award, Briefcase, Home, Pencil, User, Sun, Scale, Mask } from './icons';
import { RANKS } from '../constants';
import ItemCard from './ItemCard';

interface HeroProfileViewProps {
    hero: Hero;
    setHero: React.Dispatch<React.SetStateAction<Hero>>;
}

const getPathIcon = (path: HeroPath) => {
    switch(path) {
        case HeroPath.Sentinel: return <User className="w-5 h-5" />;
        case HeroPath.Steward: return <Sun className="w-5 h-5" />;
        case HeroPath.Seeker: return <Briefcase className="w-5 h-5" />;
        case HeroPath.Arbiter: return <Scale className="w-5 h-5" />;
        case HeroPath.Ghost: return <Mask className="w-5 h-5" />;
        default: return <User className="w-5 h-5" />;
    }
}

const HeroProfileView: React.FC<HeroProfileViewProps> = ({ hero, setHero }) => {
    const { t } = useTranslations();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(hero.name);
    const [editedPath, setEditedPath] = useState(hero.path);

    const currentRank = useMemo(() => RANKS.find(r => r.level === hero.rank) || RANKS[0], [hero.rank]);
    const nextRank = useMemo(() => RANKS.find(r => r.level === hero.rank + 1), [hero.rank]);
    const xpProgress = useMemo(() => nextRank ? (hero.xp / nextRank.xpNeeded) * 100 : 100, [hero.xp, nextRank]);
    
    const rankTitleKey = currentRank.title.toLowerCase().replace(/\s+/g, '');
    const rankPerkKey = `perk_${rankTitleKey}`;

    const handleSave = () => {
        setHero(prev => ({...prev, name: editedName, path: editedPath }));
        setIsEditing(false);
    }
    
    const heroPaths = Object.values(HeroPath);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Hero Summary & Stats */}
            <div className="lg:col-span-1 space-y-8">
                {/* Hero Summary */}
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                    <div className="w-24 h-24 rounded-full bg-blue-500 mx-auto mb-4 flex items-center justify-center text-4xl font-bold border-4 border-blue-400">
                        {hero.name.charAt(0)}
                    </div>
                     {isEditing ? (
                        <input 
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full bg-gray-700 text-white text-xl font-bold text-center border-b-2 border-blue-400 focus:outline-none"
                        />
                     ) : (
                        <div className="flex items-center justify-center space-x-2">
                             <h4 className="text-xl font-bold text-white">{hero.name}</h4>
                             <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white"><Pencil className="w-4 h-4" /></button>
                        </div>
                     )}
                    <p className="text-blue-300 font-semibold">{t(`ranks.${rankTitleKey}`)} - Rank {hero.rank}</p>
                </div>
                
                {/* Stats Panel */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">{t('heroProfile.stats')}</h3>
                     <div className="space-y-4 text-sm">
                        <div>
                            <div className="flex justify-between items-center mb-1 text-gray-300 font-semibold">
                                <span>Level {hero.level}</span>
                                <span>{hero.xp} / {nextRank ? nextRank.xpNeeded : hero.xp} XP</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${xpProgress}%` }}></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="bg-gray-700/50 p-3 rounded-lg text-center">
                                {/* FIX: Use correct translation key 'heroHub.heroCredits' instead of 'gameCenter.creds'. */}
                                <p className="text-xs text-gray-400">{t('heroHub.heroCredits')}</p>
                                <div className="flex items-center justify-center space-x-2 text-lg font-bold text-yellow-400">
                                    <Coins className="w-5 h-5" />
                                    {/* FIX: Use correct property 'hero.heroCredits' instead of 'hero.creds'. */}
                                    <span>{hero.heroCredits.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-lg text-center">
                                {/* FIX: Use correct translation key 'heroHub.legendTokens' instead of 'gameCenter.legendTokens'. */}
                                <p className="text-xs text-gray-400">{t('heroHub.legendTokens')}</p>
                                <div className="flex items-center justify-center space-x-2 text-lg font-bold text-purple-400">
                                    <Gem className="w-5 h-5" />
                                    <span>{hero.legendTokens.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <h5 className="font-bold text-gray-200 mb-2">{t('heroHub.perks')}</h5>
                            <div className="bg-gray-900/50 p-3 rounded-lg flex items-center space-x-3">
                                <Award className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-yellow-300">{t(`ranks.${rankTitleKey}`)} Perk</p>
                                    <p className="text-xs text-gray-300">{t(`ranks.${rankPerkKey}`)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Path, Armory, Base */}
            <div className="lg:col-span-2 space-y-8">
                 {/* Path Selection */}
                 <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">{t('heroProfile.heroPath')}</h3>
                    {isEditing ? (
                         <div className="space-y-2">
                             {heroPaths.map(path => {
                                 const pathKey = path.split(' ').pop()?.toLowerCase() || 'sentinel';
                                 return (
                                    <label key={path} className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${editedPath === path ? 'bg-blue-900/50 border-blue-500' : 'border-transparent hover:bg-gray-700/50'}`}>
                                        <input type="radio" name="heroPath" value={path} checked={editedPath === path} onChange={() => setEditedPath(path)} className="hidden" />
                                        <div className={`p-2 rounded-full ${editedPath === path ? 'bg-blue-500' : 'bg-gray-600'}`}>
                                            {getPathIcon(path)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{t(`paths.${pathKey}`)}</p>
                                            <p className="text-xs text-gray-400">{t(`paths.${pathKey}Desc`)}</p>
                                        </div>
                                    </label>
                                 )
                             })}
                         </div>
                    ): (
                        <div className="bg-gray-900/50 p-4 rounded-lg flex items-center space-x-4">
                            <div className="p-3 rounded-full bg-blue-500">{getPathIcon(hero.path)}</div>
                            <div>
                                <p className="text-lg font-bold text-white">{t(`paths.${hero.path.split(' ').pop()?.toLowerCase() || 'sentinel'}`)}</p>
                                <p className="text-sm text-gray-300">{t(`paths.${hero.path.split(' ').pop()?.toLowerCase() || 'sentinel'}Desc`)}</p>
                            </div>
                        </div>
                    )}
                 </div>

                 {isEditing && (
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => { setIsEditing(false); setEditedName(hero.name); setEditedPath(hero.path); }} className="px-4 py-2 text-sm font-semibold bg-gray-600 rounded-md hover:bg-gray-500">{t('reportCard.cancel')}</button>
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500">{t('reportCard.save')}</button>
                    </div>
                 )}
                 
                 {/* Armory */}
                 <div className="bg-gray-800 p-6 rounded-lg">
                     <div className="flex items-center space-x-3 mb-4">
                         <Briefcase className="w-6 h-6 text-gray-300" />
                         <h3 className="text-xl font-bold text-white">{t('heroProfile.armory')}</h3>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                         {hero.inventory.map(item => <ItemCard key={item.name} item={item} />)}
                     </div>
                 </div>

                 {/* Command Center */}
                  <div className="bg-gray-800 p-6 rounded-lg">
                     <div className="flex items-center space-x-3 mb-4">
                         <Home className="w-6 h-6 text-gray-300" />
                         <h3 className="text-xl font-bold text-white">{t('heroProfile.commandCenter')}</h3>
                     </div>
                     <div className="bg-gray-900/50 rounded-lg p-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-400">{t('heroProfile.baseStatus')}</p>
                            <p className="font-bold text-green-400">{hero.base.status}</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-400">{hero.base.name}</p>
                            <p className="font-bold text-white">HQ</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-400">{t('heroProfile.baseLevel')}</p>
                            <p className="font-bold text-white">{hero.base.level}</p>
                        </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default HeroProfileView;
