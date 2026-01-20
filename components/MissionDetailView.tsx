
import React, { useState, useMemo } from 'react';
import type { Mission, ActionOutcome, ChatMessage, Hero, FieldPrompt } from '../types';
import { useTranslations } from '../i18n';
import { 
    ArrowLeft, Target, ShieldCheck, Zap, Clock, Camera, Loader, 
    CheckCircle, X, ChevronRight, MapPin, Broadcast, FileText, 
    Activity, AlertTriangle, QrCode, Play, Volume2, Send, List, 
    MessageSquare, Map as MapIcon, Database 
} from './icons';
import QrCodeDisplay from './QrCodeDisplay';
import WorkspaceManager from './Workspace/WorkspaceManager';
import PanelShell from './Workspace/PanelShell';

interface MissionDetailViewProps {
  mission: Mission;
  onReturn: () => void;
  onCompleteMissionStep: (mission: Mission) => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, imageUrl?: string, audioUrl?: string) => void;
  hero: Hero;
}

const MissionDetailView: React.FC<MissionDetailViewProps> = ({ mission, onReturn, onCompleteMissionStep, messages, onSendMessage, hero }) => {
    const { t } = useTranslations();
    const [showQr, setShowQr] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // UI Local State
    const [selectedActionIndex, setSelectedActionIndex] = useState(mission.currentActionIndex);
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [evidenceFiles, setEvidenceFiles] = useState<Record<string, string[]>>({});
    
    const [operationLog, setOperationLog] = useState<{msg: string, time: string, type: 'info' | 'success' | 'warning'}[]>(() => [
        { msg: `OPERATION_INITIALIZED: ${mission.title}`, time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit' }), type: 'info' },
        { msg: `PHASE_GATE: ${mission.phase}`, time: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit' }), type: 'info' }
    ]);

    const actions = mission.phase === 'RECON' ? mission.reconActions : mission.mainActions;
    const activeAction = actions[mission.currentActionIndex];

    const currentDisplayAction = actions[selectedActionIndex];
    const isViewingActiveAction = selectedActionIndex === mission.currentActionIndex;

    const handleActionComplete = () => {
        if (isProcessing || !isViewingActiveAction) return;
        const missingRequired = activeAction.prompts.some(p => p.required && !responses[p.id] && (!evidenceFiles[p.id] || evidenceFiles[p.id].length === 0));
        if (missingRequired) {
            alert("Protocol Violation: Required field prompts not satisfied.");
            return;
        }
        setIsProcessing(true);
        const safetyPrompts = activeAction.prompts.filter(p => p.type === 'safety');
        const allSafetyChecked = safetyPrompts.every(p => responses[p.id] === true);
        const evidencePrompts = activeAction.prompts.filter(p => p.type === 'evidence');
        const hasEvidence = evidencePrompts.some(p => (evidenceFiles[p.id]?.length || 0) > 0 || (responses[p.id]?.length || 0) > 0);

        let calculatedOutcome: ActionOutcome = 'CLEAN_SUCCESS';
        if (!allSafetyChecked) calculatedOutcome = 'RISKY_SUCCESS';
        else if (!hasEvidence) calculatedOutcome = 'PARTIAL_CONFIRMATION';

        setTimeout(() => {
            const timeStr = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
            setOperationLog(prev => [...prev, {
                msg: `ACTION_LOG: ${activeAction.name} completed. Outcome: ${calculatedOutcome.replace('_', ' ')}`,
                time: timeStr,
                type: calculatedOutcome === 'CLEAN_SUCCESS' ? 'success' : 'warning'
            }]);
            onCompleteMissionStep({ ...mission, status: 'active', currentActionIndex: mission.currentActionIndex });
            setIsProcessing(false);
            setResponses({});
            setEvidenceFiles({});
            setSelectedActionIndex(mission.currentActionIndex + 1);
        }, 1800);
    };

    const handleFileSelection = (promptId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEvidenceFiles(prev => ({
                    ...prev,
                    [promptId]: [...(prev[promptId] || []), reader.result as string]
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const renderPrompt = (prompt: FieldPrompt) => {
        const value = responses[prompt.id];
        const files = evidenceFiles[prompt.id] || [];

        switch (prompt.responseType) {
            case 'checkbox':
                return (
                    <button 
                        key={prompt.id}
                        onClick={() => setResponses(prev => ({ ...prev, [prompt.id]: !value }))}
                        className={`w-full flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all ${value ? 'bg-emerald-950/20 border-emerald-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                    >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${value ? 'bg-emerald-500 border-emerald-400' : 'bg-black border-zinc-900'}`}>
                            {value && <CheckCircle className="w-4 h-4 text-black" />}
                        </div>
                        <span className="text-xs font-black uppercase text-left">{prompt.promptText}</span>
                    </button>
                );
            case 'photo':
            case 'video':
                return (
                    <div key={prompt.id} className="space-y-4">
                        <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-2">{prompt.promptText}</label>
                        <div className="grid grid-cols-1 gap-4">
                            <div 
                                onClick={() => document.getElementById(`file-${prompt.id}`)?.click()}
                                className="aspect-video rounded-3xl bg-zinc-950 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 transition-all group shadow-inner relative overflow-hidden"
                            >
                                <input id={`file-${prompt.id}`} type="file" accept={prompt.responseType === 'photo' ? 'image/*' : 'video/*'} className="hidden" onChange={(e) => handleFileSelection(prompt.id, e)} />
                                <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 group-hover:border-cyan-500 transition-colors">
                                    <Camera className="w-8 h-8 text-zinc-700 group-hover:text-cyan-400" />
                                </div>
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-4">Capture {prompt.responseType}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {files.map((f, i) => (
                                    <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-zinc-800 bg-black">
                                        <img src={f} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'text':
                return (
                    <div key={prompt.id} className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">{prompt.promptText}</label>
                        <textarea 
                            value={value || ''}
                            onChange={e => setResponses(prev => ({ ...prev, [prompt.id]: e.target.value }))}
                            className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-5 text-xs font-bold text-white outline-none focus:border-cyan-500 transition-all placeholder:text-zinc-900 min-h-[100px] resize-none"
                            placeholder="Input factual observation..."
                            maxLength={280}
                        />
                    </div>
                );
            default: return null;
        }
    };

    const missionPanels = [
        {
            id: 'missionRail',
            title: 'Operation_Path',
            component: (
                <PanelShell id="missionRail" title="Operation_Path">
                    <div className="p-6 space-y-10 relative">
                        <div className="absolute left-[43px] top-10 bottom-10 w-0.5 bg-zinc-800"></div>
                        {actions.map((action, idx) => {
                            const isCurrent = idx === mission.currentActionIndex;
                            const isPast = idx < mission.currentActionIndex;
                            const isFuture = idx > mission.currentActionIndex;
                            return (
                                <button 
                                    key={action.id}
                                    onClick={() => setSelectedActionIndex(idx)}
                                    disabled={isFuture}
                                    className={`relative w-full flex items-start gap-5 text-left transition-all ${isFuture ? 'opacity-30' : 'opacity-100'}`}
                                >
                                    <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${
                                        isPast ? 'bg-emerald-950/20 border-emerald-500 text-emerald-500' : 
                                        isCurrent ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_cyan]' : 
                                        'bg-zinc-900 border-zinc-800 text-zinc-600'
                                    }`}>
                                        {isPast ? <CheckCircle className="w-5 h-5" /> : <span className="text-lg">{action.icon}</span>}
                                    </div>
                                    <div className="pt-1 min-w-0">
                                        <h4 className={`text-[9px] font-black uppercase tracking-widest ${isCurrent ? 'text-white' : 'text-zinc-500'}`}>{action.name}</h4>
                                        <p className="text-[7px] text-zinc-700 font-bold uppercase mt-0.5 truncate">{action.task}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </PanelShell>
            )
        },
        {
            id: 'actionPanel',
            title: 'Field_Operator_Directive',
            component: (
                <PanelShell id="actionPanel" title="Field_Operator_Directive">
                    <div className="p-8 space-y-8">
                        <div className="flex items-center space-x-4">
                            <div className={`p-4 rounded-2xl border-2 ${isViewingActiveAction ? 'bg-cyan-500/10 border-cyan-500' : 'bg-zinc-900 border-zinc-800'}`}>
                                <span className="text-3xl">{currentDisplayAction.icon}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter">{currentDisplayAction.name}</h2>
                                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Objective: {currentDisplayAction.task}</p>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-400 font-bold leading-relaxed italic border-l-4 border-cyan-500 pl-6">
                            "{currentDisplayAction.whyItMatters}"
                        </p>
                        <div className="space-y-6">
                            {isViewingActiveAction ? (
                                <>
                                    {currentDisplayAction.prompts.map(prompt => renderPrompt(prompt))}
                                    <button 
                                        onClick={handleActionComplete}
                                        disabled={isProcessing}
                                        className="w-full bg-white text-black font-black py-6 rounded-2xl uppercase tracking-[0.3em] text-xs shadow-xl active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center space-x-4"
                                    >
                                        {isProcessing ? <Loader className="w-6 h-6 animate-spin"/> : <Zap className="w-6 h-6 text-cyan-600"/>}
                                        <span>Finalize_Block</span>
                                    </button>
                                </>
                            ) : (
                                <div className="p-10 text-center bg-zinc-900/60 rounded-[2rem] border border-zinc-800 space-y-4">
                                    <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
                                    <p className="text-xs font-black uppercase text-white tracking-tighter">Shard_Synchronized</p>
                                </div>
                            )}
                        </div>
                    </div>
                </PanelShell>
            )
        },
        {
            id: 'evidencePanel',
            title: 'Evidence_Locker',
            component: (
                <PanelShell id="evidencePanel" title="Evidence_Locker">
                    <div className="p-6 space-y-6">
                         <div className="aspect-square bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center group hover:border-cyan-500 transition-all cursor-pointer">
                            <Camera className="w-10 h-10 text-zinc-800 group-hover:text-cyan-500 mb-4 transition-colors" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">Awaiting_Visual_Telemetry</p>
                         </div>
                         <div className="grid grid-cols-3 gap-2">
                             {[...Array(6)].map((_, i) => (
                                 <div key={i} className="aspect-square bg-zinc-900 rounded-xl border border-zinc-800 opacity-20"></div>
                             ))}
                         </div>
                    </div>
                </PanelShell>
            )
        },
        {
            id: 'chroniclePanel',
            title: 'Mission_Chronicle',
            component: (
                <PanelShell id="chroniclePanel" title="Mission_Chronicle">
                    <div className="p-6 space-y-4">
                        {operationLog.map((log, i) => (
                            <div key={i} className={`p-4 rounded-xl border-l-2 text-[9px] font-bold leading-relaxed ${
                                log.type === 'success' ? 'bg-emerald-950/20 border-emerald-500 text-emerald-300' :
                                'bg-zinc-900 border-zinc-700 text-zinc-500'
                            }`}>
                                <div className="flex justify-between items-center mb-1 text-[7px] font-black opacity-40">
                                    <span>[{log.time}]</span>
                                    <span>BLOCK_{1000+i}</span>
                                </div>
                                <p className="uppercase tracking-widest">{log.msg}</p>
                            </div>
                        ))}
                    </div>
                </PanelShell>
            )
        },
        {
            id: 'mapPanel',
            title: 'Geospatial_Overlay',
            component: (
                <PanelShell id="mapPanel" title="Geospatial_Overlay">
                    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center text-zinc-800">
                        <MapIcon className="w-12 h-12 mb-4 animate-pulse opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">Scanning_Local_Node...</p>
                    </div>
                </PanelShell>
            )
        }
    ];

    const defaultLayouts = {
        lg: [
            { i: 'missionRail', x: 0, y: 0, w: 2, h: 30, minW: 2, minH: 10 },
            { i: 'actionPanel', x: 2, y: 0, w: 6, h: 20, minW: 5, minH: 14 },
            { i: 'evidencePanel', x: 8, y: 0, w: 4, h: 12, minW: 3, minH: 10 },
            { i: 'chroniclePanel', x: 8, y: 12, w: 4, h: 18, minW: 3, minH: 12 },
            { i: 'mapPanel', x: 2, y: 20, w: 6, h: 10, minW: 4, minH: 10 }
        ],
        md: [
            { i: 'missionRail', x: 0, y: 0, w: 1, h: 28, minW: 1, minH: 10 },
            { i: 'actionPanel', x: 1, y: 0, w: 5, h: 16, minW: 3, minH: 10 },
            { i: 'evidencePanel', x: 1, y: 16, w: 3, h: 12, minW: 2, minH: 10 },
            { i: 'chroniclePanel', x: 4, y: 16, w: 2, h: 12, minW: 2, minH: 10 },
            { i: 'mapPanel', x: 1, y: 28, w: 5, h: 12, minW: 3, minH: 10 }
        ]
    };

    const mobileTabs = [
        { id: 'actionPanel', label: 'Action', icon: <Zap /> },
        { id: 'evidencePanel', label: 'Evidence', icon: <Camera /> },
        { id: 'chroniclePanel', label: 'Chronicle', icon: <List /> },
        { id: 'mapPanel', label: 'Map', icon: <MapIcon /> }
    ];

    return (
        <div className="flex flex-col h-[90vh] bg-black">
            {/* Mission Utility Header */}
            <div className="flex items-center justify-between px-8 py-4 bg-zinc-950 border-b border-zinc-900 no-print">
                <div className="flex items-center space-x-6">
                    <button onClick={onReturn} className="p-3 hover:bg-zinc-900 rounded-xl transition-colors text-zinc-600 hover:text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter text-white leading-none">{mission.title}</h1>
                        <div className="flex items-center space-x-3 mt-1.5">
                            <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-800/40">{mission.phase}</span>
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">RM_#{mission.id.split('-').pop()?.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => setShowQr(true)} className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800">
                    <QrCode className="w-5 h-5 text-cyan-500" />
                </button>
            </div>

            <div className="flex-grow p-4 md:p-6 overflow-hidden">
                <WorkspaceManager 
                    screenId={`mission-${mission.id}`}
                    panels={missionPanels}
                    defaultLayouts={defaultLayouts}
                    mobileTabs={mobileTabs}
                />
            </div>

            {showQr && <QrCodeDisplay type="report" id={mission.id} onClose={() => setShowQr(false)} />}
        </div>
    );
};

export default MissionDetailView;
