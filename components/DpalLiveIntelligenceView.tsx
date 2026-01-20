import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from '../i18n';
import type { Category, LiveMissionState, LiveIntelligenceUI, EvidenceItem, Report } from '../types';
import { getLiveIntelligenceUpdate } from '../services/geminiService';
import { ArrowLeft, Loader, Zap, Clock, ShieldCheck, CheckCircle, Circle, MapPin, Camera, Mic, Send, Paperclip } from './icons';

interface DpalLiveIntelligenceViewProps {
  category: Category;
  onReturn: () => void;
  onReportSubmit: (report: Omit<Report, 'id' | 'timestamp' | 'hash' | 'blockchainRef' | 'status'>) => void;
}

const DpalLiveIntelligenceView: React.FC<DpalLiveIntelligenceViewProps> = ({ category, onReturn, onReportSubmit }) => {
  const { t } = useTranslations();
  const [mission, setMission] = useState<LiveMissionState | null>(null);
  const [ui, setUi] = useState<LiveIntelligenceUI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initialMissionState: LiveMissionState = {
      id: `MSN-${Date.now()}`,
      title: `Incident Report: ${category}`,
      category: category,
      checklist: [
        { id: 'geo', s: 'todo', label: t('liveIntelligence.checklist.geo') },
        { id: 'photos', s: 'todo', label: t('liveIntelligence.checklist.photos') },
        { id: 'witness', s: 'todo', label: t('liveIntelligence.checklist.witness') },
        { id: 'submit', s: 'todo', label: t('liveIntelligence.checklist.submit') },
      ],
      score: 0,
      risk: 'Low',
      evidence: [],
    };
    setMission(initialMissionState);

    getLiveIntelligenceUpdate(initialMissionState)
      .then(response => {
        setUi(response.ui);
        // Apply initial patch if any
        setMission(prev => prev ? { ...prev, ...response.patch } : null);
      })
      .catch(() => setError(t('liveIntelligence.error')))
      .finally(() => setIsLoading(false));
  }, [category, t]);
  
  const fetchUpdate = (currentMission: LiveMissionState) => {
      setIsLoading(true);
      setError(null);
      getLiveIntelligenceUpdate(currentMission)
          .then(response => {
              setUi(response.ui);
              setMission(prev => prev ? { ...prev, ...response.patch } : null);
          })
          .catch(() => setError(t('liveIntelligence.error')))
          .finally(() => setIsLoading(false));
  };
  
  const handleAction = (action: () => Promise<Partial<LiveMissionState>>) => {
      if (!mission) return;
      
      setIsLoading(true);
      action()
          .then(update => {
              const nextState = { ...mission, ...update };
              setMission(nextState);
              fetchUpdate(nextState);
          })
          .catch(err => {
              setError(err.message);
              setIsLoading(false);
          });
  };
  
  const handleGetGeo = () => {
    handleAction(() => new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject(new Error(t('submissionPanel.locationNotSupported')));
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const locString = `Lat: ${position.coords.latitude.toFixed(5)}, Lng: ${position.coords.longitude.toFixed(5)}`;
                const newEvidence: EvidenceItem = { id: `geo-${Date.now()}`, name: 'Geolocation', type: 'geo', status: 'Strong', content: locString };
                resolve({ evidence: [...(mission?.evidence || []), newEvidence] });
            },
            () => reject(new Error(t('liveIntelligence.locationError'))),
            { timeout: 10000 }
        );
    }));
  };

  const handlePhotoUpload = (files: FileList | null) => {
      if (!files || files.length === 0 || !mission) return;
      const newEvidenceItems: EvidenceItem[] = Array.from(files).map(file => ({
          id: `photo-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: 'photo',
          status: 'Strong',
          previewUrl: URL.createObjectURL(file)
      }));
      const nextState = { ...mission, evidence: [...mission.evidence, ...newEvidenceItems] };
      setMission(nextState);
      fetchUpdate(nextState);
  };

  const handleWitnessStatement = () => {
      handleAction(async () => {
          const statement = prompt("Please enter the witness statement or a summary of your observation:");
          if (statement && mission) {
              const newEvidence: EvidenceItem = { id: `text-${Date.now()}`, name: 'Witness Statement', type: 'text', status: 'Fair', content: statement };
              return { evidence: [...mission.evidence, newEvidence] };
          }
          return {};
      });
  };
  
  const handleSubmit = () => {
    handleAction(async () => {
      if (mission) {
        const finalReport = {
          title: mission.title,
          description: mission.evidence.map(e => `${e.name}:\n${e.content || e.previewUrl || ''}`).join('\n\n'),
          category: mission.category,
          location: mission.evidence.find(e => e.type === 'geo')?.content || 'Unknown',
          attachments: [], // A real implementation would handle files
          trustScore: 50,
          /* FIX: Added missing required Report properties to satisfy the Omit<Report, "id" | "timestamp" | "hash" | "blockchainRef" | "status"> type requirement */
          severity: 'Standard' as const,
          isActionable: false,
        };
        onReportSubmit(finalReport);
      }
      return {};
    });
  };

  const isGeoDone = mission?.checklist.find(c => c.id === 'geo')?.s === 'done';
  const isPhotosDone = mission?.checklist.find(c => c.id === 'photos')?.s === 'done';
  const isWitnessDone = mission?.checklist.find(c => c.id === 'witness')?.s === 'done';

  const renderActionButtons = () => {
    if (!isGeoDone) {
        return <button onClick={handleGetGeo} disabled={isLoading} className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition"><MapPin className="w-5 h-5"/><span>{t('liveIntelligence.addGeo')}</span></button>;
    }
    if (!isPhotosDone) {
        return <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition"><div className="flex items-center space-x-1"><Camera className="w-5 h-5"/><Paperclip className="w-5 h-5"/></div><span>{t('liveIntelligence.addPhotos')}</span></button>;
    }
    if (!isWitnessDone) {
        return <button onClick={handleWitnessStatement} disabled={isLoading} className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition"><Mic className="w-5 h-5"/><span>{t('liveIntelligence.addWitness')}</span></button>;
    }
    return <button onClick={handleSubmit} disabled={isLoading} className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-green-400 transition"><Send className="w-5 h-5"/><span>{t('liveIntelligence.submitReport')}</span></button>;
  }

  return (
    <div className="bg-gray-800 text-white p-4 sm:p-6 md:p-8 rounded-lg animate-fade-in">
      <button onClick={onReturn} className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" />
        <span>{t('liveIntelligence.returnToMenu')}</span>
      </button>

      <header className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('liveIntelligence.title')}</h1>
        <p className="mt-2 text-lg text-gray-400">{mission?.title || t('liveIntelligence.subtitle')}</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Checklist & Evidence */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900/50 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-3">{t('liveIntelligence.checklistTitle')}</h2>
                <ul className="space-y-2">
                    {mission?.checklist.map(item => (
                        <li key={item.id} className="flex items-center space-x-3 text-sm">
                            {item.s === 'done' ? <CheckCircle className="w-5 h-5 text-green-400"/> : <Circle className="w-5 h-5 text-gray-500"/>}
                            <span className={item.s === 'done' ? 'text-gray-400 line-through' : 'text-gray-200'}>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-3">{t('liveIntelligence.evidenceTitle')}</h2>
                {mission?.evidence.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No evidence collected yet.</p>
                ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {mission.evidence.map(item => (
                            <div key={item.id} className="bg-gray-800 p-2 rounded-md flex items-center justify-between">
                                <span className="text-sm truncate">{item.name}</span>
                                <span className="text-xs font-semibold px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full">{item.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: AI Co-pilot */}
        <div className="lg:col-span-2 bg-gray-900/50 p-6 rounded-lg">
          {isLoading && !ui ? (
            <div className="flex items-center justify-center h-full"><Loader className="w-10 h-10 animate-spin text-blue-400"/></div>
          ) : ui ? (
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                {/* KITT Card */}
                <div className="mb-6">
                    <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider">{t('liveIntelligence.kittCard.nextMove')}</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{ui.next}</p>
                </div>
                <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t('liveIntelligence.kittCard.rationale')}</p>
                    <p className="text-gray-300">{ui.why}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center border-t border-b border-gray-700 py-4 mb-6">
                    <div>
                        <p className="text-xs text-gray-400 uppercase">{t('liveIntelligence.kittCard.eta')}</p>
                        <p className="text-2xl font-bold text-white">{ui.eta} <span className="text-base font-medium">{t('liveIntelligence.kittCard.etaUnit')}</span></p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase">{t('liveIntelligence.kittCard.reportScore')}</p>
                        <p className="text-2xl font-bold text-green-400">{ui.score}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <p className="text-xs text-gray-400 uppercase">{t('liveIntelligence.kittCard.riskLevel')}</p>
                        <p className="text-2xl font-bold text-yellow-400">{ui.risk}</p>
                    </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-auto">
                {error && <p className="text-red-400 text-center mb-4 text-sm">{error}</p>}
                {renderActionButtons()}
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e.target.files)} />
              </div>
            </div>
          ) : (
             <div className="flex items-center justify-center h-full"><p className="text-gray-500">{t('liveIntelligence.error')}</p></div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DpalLiveIntelligenceView;