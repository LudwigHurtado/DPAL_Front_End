import React from 'react';
import { EDUCATION_ROLES } from '../constants';
import { EducationRole } from '../types';
import { useTranslations } from '../i18n';
import { ArrowLeft } from './icons';

interface EducationRoleSelectionViewProps {
  onSelectRole: (role: EducationRole) => void;
  onReturnToMenu: () => void;
}

const EducationRoleSelectionView: React.FC<EducationRoleSelectionViewProps> = ({ onSelectRole, onReturnToMenu }) => {
    const { t } = useTranslations();

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">{t('educationRoleSelection.title')}</h1>
                <p className="mt-2 text-lg text-gray-600">{t('educationRoleSelection.subtitle')}</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {EDUCATION_ROLES.map((role) => (
                    <button
                        key={role.value}
                        onClick={() => onSelectRole(role.value)}
                        className="group flex flex-col items-center justify-start text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 hover:border-blue-500"
                    >
                        <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">
                            {role.icon}
                        </div>
                        <span className="font-bold text-xl text-gray-700 group-hover:text-blue-600 transition-colors">
                            {t(role.translationKey)}
                        </span>
                         <p className="text-sm text-gray-500 mt-2">{t(role.descriptionKey)}</p>
                    </button>
                ))}
            </div>

            <div className="mt-12 text-center">
                <button
                    onClick={onReturnToMenu}
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('educationRoleSelection.returnToMenu')}</span>
                </button>
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

export default EducationRoleSelectionView;
