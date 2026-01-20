
import React from 'react';
import type { Mission } from '../types';
import { useTranslations } from '../i18n';
import { Coins, Gem, Check, Play, Zap } from './icons';

interface MissionCardProps {
  mission: Mission;
  onCompleteStep: (mission: Mission) => void;
}

const MissionStepCard: React.FC<{
    step: Mission['steps'][0], 
    isActive: boolean, 
    isCompleted: boolean, 
    onComplete: () => void,
}> = ({ step, isActive, isCompleted, onComplete }) => {
    const { t } = useTranslations();
    
    let button;
    if (isCompleted) {
        button = <button disabled className="flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white cursor-default"><Check className="w-5 h-5" /><span>{t('missionCard.completed')}</span></button>;
    } else if (isActive) {
        button = <button onClick={onComplete} className="flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition transform hover:scale-105"><Zap className="w-5 h-5" /><span>{t('missionCard.start')}</span></button>;
    } else { // Locked
        button = <button disabled className="w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-lg bg-gray-700 text-gray-500 cursor-not-allowed">{t('missionCard.locked')}</button>;
    }

    const stateClasses = isCompleted 
        ? 'bg-green-900/20 border-green-800/30 opacity-70' 
        : isActive 
        ? 'bg-blue-900/50 border-blue-500 shadow-lg shadow-blue-500/10' 
        : 'bg-gray-800/50 border-gray-700';
    
    return (
        <div className={`border p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 ${stateClasses}`}>
            <div className="flex items-center space-x-4">
                <div className="text-3xl">{step.icon}</div>
                <div>
                    <h4 className={`font-bold ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>{step.name}</h4>
                    <p className="text-sm text-gray-300">{step.task}</p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                 <div className="bg-gray-900/50 p-2 rounded-md text-center">
                    <p className="text-xs font-semibold text-yellow-400">+{step.reward?.hc || 0} HC</p>
                    <p className="text-xs font-semibold text-green-400">+{step.reward?.xp || 0} XP</p>
                </div>
                {button}
            </div>
        </div>
    );
};


const MissionCard: React.FC<MissionCardProps> = ({ mission, onCompleteStep }) => {
    const { t } = useTranslations();
    const progress = ((mission.currentStepIndex) / mission.steps.length) * 100;

    const handleCompleteStep = () => {
        onCompleteStep(mission);
    }
    
    return (
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            {/* Mission Header */}
            <header className="text-center mb-6">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">🔥 {mission.title} 🔥</h3>
                <p className="mt-2 text-gray-300 max-w-2xl mx-auto">{mission.backstory}</p>
                 <div className="mt-4 max-w-lg mx-auto">
                    <div className="flex justify-between items-center mb-1 text-xs text-gray-300 font-semibold">
                        <span>{t('missionCard.progress')}</span>
                        <span>{t('missionCard.step', { current: mission.currentStepIndex, total: mission.steps.length })}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 ring-1 ring-gray-900/50">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </header>

            {/* Steps List */}
            <div className="space-y-3 mb-8">
                {mission.steps.map((step, index) => (
                    <MissionStepCard
                        key={index}
                        step={step}
                        isActive={index === mission.currentStepIndex}
                        isCompleted={index < mission.currentStepIndex}
                        onComplete={handleCompleteStep}
                    />
                ))}
            </div>
            
            {/* Final Reward */}
            <div className="bg-gray-900/50 p-4 rounded-lg border border-yellow-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                     <p className="text-sm font-semibold text-yellow-300 mb-2">{t('missionCard.finalReward')}</p>
                     <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 font-bold text-yellow-400" title={`${mission.finalReward.hc} ${t('heroHub.heroCredits')}`}>
                            <Coins className="w-5 h-5" />
                            <span>{mission.finalReward.hc}</span>
                        </div>
                        {mission.finalReward.legendTokens && (
                             <div className="flex items-center space-x-1 font-bold text-purple-400" title={`${mission.finalReward.legendTokens} ${t('heroHub.legendTokens')}`}>
                                <Gem className="w-5 h-5" />
                                <span>{mission.finalReward.legendTokens}</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-2" title={mission.finalReward.nft.name}>
                            <div className="font-bold text-cyan-300 bg-gray-700 w-8 h-8 rounded-md flex items-center justify-center">
                                <span className="text-xl">{mission.finalReward.nft.icon}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-300">{mission.finalReward.nft.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionCard;