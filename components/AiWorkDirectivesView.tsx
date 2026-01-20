
import React, { useMemo, useRef, useState } from 'react';
import { type Hero, type AiDirective, Category, type Report } from '../types';
import {
  Activity, AlertTriangle, ArrowLeft, Broadcast, Camera, Loader, 
  MapPin, Search, ShieldCheck, Sparkles, Target, X, Zap, 
  Database, FileText, CheckCircle, Plus, Layout as LayoutIcon, 
  Monitor, List, Package
} from './icons';
import { generateAiDirectives, isAiEnabled, AiError } from '../services/geminiService';
import { buildDirectiveAuditHash } from '../services/directivePacket';
import { useTranslations } from '../i18n';
import { CATEGORIES_WITH_ICONS } from '../constants';
import WorkspaceManager from './Workspace/WorkspaceManager';
import PanelShell from './Workspace/PanelShell';

interface AiWorkDirectivesViewProps {
  onReturn: () => void;
  hero: Hero;
  heroLocation: string;
  setHeroLocation: (loc: string) => void;
  directives: AiDirective[];
  setDirectives: React.Dispatch<React.SetStateAction<AiDirective[]>>;
  onCompleteDirective: (dir: AiDirective) => Report;
}

const AiWorkDirectivesView: React.FC<AiWorkDirectivesViewProps> = ({
  onReturn,
  hero,
  heroLocation,
  setHeroLocation,
  directives,
  setDirectives,
  onCompleteDirective,
}) => {
  const { t } = useTranslations();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDirective, setActiveDirective] = useState<AiDirective | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [error, setError] = useState<AiError | null>(null);
  const [showCreatedState, setShowCreatedState] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRefresh = async () => {
    if (!selectedCategory || !heroLocation.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const data = await generateAiDirectives(heroLocation, selectedCategory, 3);
      setDirectives(data);
    } catch (e: any) {
      setError(e instanceof AiError ? e : new AiError('TEMPORARY_FAILURE', 'Link unstable.'));
    } finally { setIsGenerating(false); }
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = async () => {
    if (!proofPreview || !activeDirective) return;
    setIsSubmittingProof(true);
    try {
      const auditHash = await buildDirectiveAuditHash({ ...activeDirective, proofImageUrl: proofPreview, heroLocation });
      onCompleteDirective({ ...activeDirective, proofImageUrl: proofPreview, auditHash });
      setShowCreatedState(true);
    } catch { setError(new AiError('TEMPORARY_FAILURE', 'Ledger commit failed.')); }
    finally { setIsSubmittingProof(false); }
  };

  const workPanels = [
      {
          id: 'directiveQueue',
          title: 'Directive_Queue',
          component: (
              <PanelShell id="directiveQueue" title="Directive_Queue">
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center space-x-2">
                            <MapPin className="w-3 h-3 text-rose-500" /><span>Geospatial_Lock</span>
                        </label>
                        <input value={heroLocation} onChange={e => setHeroLocation(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white font-black uppercase outline-none focus:border-cyan-500 transition-all" placeholder="Enter Address..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Focus_Domain</label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES_WITH_ICONS.slice(0, 6).map(cat => (
                                <button key={cat.value} onClick={() => setSelectedCategory(cat.value as Category)} className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase transition-all ${selectedCategory === cat.value ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-black border-zinc-800 text-zinc-600'}`}>
                                    {cat.icon} {t(cat.translationKey)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleRefresh} disabled={!selectedCategory || isGenerating} className="w-full bg-white text-black font-black py-4 rounded-xl text-[10px] uppercase shadow-lg active:scale-95 transition-all">
                        {isGenerating ? 'Syncing...' : 'Sync_Directives'}
                    </button>
                    <div className="space-y-3 pt-4 border-t border-zinc-800">
                        {directives.map(dir => (
                            <button key={dir.id} onClick={() => setActiveDirective(dir)} className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${activeDirective?.id === dir.id ? 'bg-amber-500/10 border-amber-500' : 'bg-black border-zinc-800'}`}>
                                <h4 className="font-black text-xs text-white uppercase truncate">{dir.title}</h4>
                                <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1">Reward: {dir.rewardHc} HC</p>
                            </button>
                        ))}
                    </div>
                </div>
              </PanelShell>
          )
      },
      {
          id: 'directiveDetail',
          title: 'Field_Protocol',
          component: (
              <PanelShell id="directiveDetail" title="Field_Protocol">
                {activeDirective ? (
                    <div className="p-8 space-y-8">
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-white leading-none">{activeDirective.title}</h2>
                        <p className="text-sm text-zinc-400 font-bold leading-relaxed border-l-4 border-amber-500 pl-6 italic">"{activeDirective.description}"</p>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Primary_Action_Chain</label>
                            {activeDirective.packet?.steps.map((s, i) => (
                                <div key={i} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex gap-4">
                                    <span className="text-xs font-black text-zinc-700">0{i+1}</span>
                                    <p className="text-[10px] font-black text-white uppercase">{s.verb}: {s.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center p-12 text-center opacity-20">
                        <p className="text-xs font-black uppercase tracking-widest">Awaiting_Directive_Select</p>
                    </div>
                )}
              </PanelShell>
          )
      },
      {
          id: 'evidencePanelWork',
          title: 'Proof_Materialization',
          component: (
              <PanelShell id="evidencePanelWork" title="Proof_Materialization">
                <div className="p-6 space-y-6">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-full aspect-video rounded-3xl bg-zinc-950 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-all overflow-hidden shadow-inner group"
                    >
                        {proofPreview ? (
                            <img src={proofPreview} alt="Proof" className="w-full h-full object-cover grayscale opacity-60" />
                        ) : (
                            <div className="text-center p-8">
                                <Camera className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
                                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Awaiting_Telemetry</p>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoCapture} />
                    </div>
                    <button 
                        onClick={handleSubmitProof}
                        disabled={!proofPreview || isSubmittingProof || !activeDirective}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-xl active:scale-95 transition-all disabled:opacity-10"
                    >
                        {isSubmittingProof ? 'Sealing...' : 'Seal_Evidence_Artifact'}
                    </button>
                </div>
              </PanelShell>
          )
      }
  ];

  const defaultLayouts = {
    lg: [
        { i: 'directiveQueue', x: 0, y: 0, w: 3, h: 30, minW: 3, minH: 10 },
        { i: 'directiveDetail', x: 3, y: 0, w: 5, h: 20, minW: 4, minH: 10 },
        { i: 'evidencePanelWork', x: 8, y: 0, w: 4, h: 15, minW: 3, minH: 10 }
    ],
    md: [
        { i: 'directiveQueue', x: 0, y: 0, w: 2, h: 24, minW: 2, minH: 10 },
        { i: 'directiveDetail', x: 2, y: 0, w: 4, h: 16, minW: 3, minH: 10 },
        { i: 'evidencePanelWork', x: 2, y: 16, w: 4, h: 10, minW: 3, minH: 10 }
    ]
  };

  const mobileTabs = [
      { id: 'directiveQueue', label: 'Directives', icon: <List /> },
      { id: 'directiveDetail', label: 'Execute', icon: <Zap /> },
      { id: 'evidencePanelWork', label: 'Evidence', icon: <Camera /> }
  ];

  return (
    <div className="flex flex-col h-[90vh] bg-black font-mono">
      <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-4 flex justify-between items-center z-30">
        <div className="flex items-center space-x-4">
          <button onClick={onReturn} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tighter text-white">Work_Directives_OS</h1>
          </div>
        </div>
      </header>

      <div className="flex-grow p-4 md:p-6 overflow-hidden">
        {showCreatedState ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-emerald-400 animate-fade-in">
                    <CheckCircle className="w-12 h-12 text-black" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Shard_Committed</h2>
                <button onClick={() => setShowCreatedState(false)} className="bg-cyan-600 text-white font-black px-12 py-4 rounded-2xl uppercase text-xs">Return_To_Queue</button>
            </div>
        ) : (
            <WorkspaceManager 
                screenId="work-directives"
                panels={workPanels}
                defaultLayouts={defaultLayouts}
                mobileTabs={mobileTabs}
            />
        )}
      </div>
    </div>
  );
};

export default AiWorkDirectivesView;
