import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Category, Report, SeverityLevel } from '../types';
import { 
  MapPin, Send, Loader, Camera, RefreshCw, AlertTriangle, ShieldCheck, Target, Zap, 
  // Added Broadcast, removed non-existent BarChart
  Activity, Info, Briefcase, Database, Scale, Globe, FileText, Trash2, 
  CheckCircle, ChevronRight, Maximize2, Clock, Play, Volume2, Paperclip, Plus, X, Sparkles, Broadcast
} from './icons';
import { FORM_BUNDLE, CATEGORIES_WITH_ICONS } from '../constants';

interface SubmissionPanelProps {
  addReport: (report: Omit<Report, 'id' | 'timestamp' | 'hash' | 'blockchainRef' | 'status'>, audioUrl?: string) => void;
  preselectedCategory?: Category;
  prefilledDescription?: string;
}

interface AttachedFile {
    file: File;
    preview: string | null;
    type: 'image' | 'video' | 'audio' | 'other';
}

const STEPS = [
  { id: 'DOMAIN', label: 'Domain_Picker', icon: <Target className="w-4 h-4"/> },
  { id: 'TEMPORAL', label: 'Temporal_Sync', icon: <Clock className="w-4 h-4"/> },
  { id: 'FORENSIC', label: 'Forensic_Data', icon: <FileText className="w-4 h-4"/> },
  { id: 'EVIDENCE', label: 'Visual_Intel', icon: <Camera className="w-4 h-4"/> },
  { id: 'SAFETY', label: 'Safety_Audit', icon: <ShieldCheck className="w-4 h-4"/> },
  { id: 'COMMIT', label: 'Ledger_Seal', icon: <Database className="w-4 h-4"/> }
];

const ForensicField: React.FC<{ 
    question: any; 
    value: any; 
    onChange: (val: any) => void;
}> = ({ question, value, onChange }) => {
    const { label, help_text, answer_type, options } = question;
    const baseClass = "w-full bg-zinc-950 border-2 border-zinc-800 p-4 rounded-2xl text-sm font-bold text-white outline-none focus:border-cyan-600 transition-all placeholder:text-zinc-900 shadow-inner";

    switch (answer_type) {
        case 'single_select':
            return (
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-2">{label}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {options.map((opt: string) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => onChange(opt)}
                                className={`px-4 py-3 rounded-xl border-2 transition-all text-[9px] font-black uppercase text-left truncate ${value === opt ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-700'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            );
        case 'multi_select':
            return (
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-2">{label}</label>
                    <div className="grid grid-cols-2 gap-2">
                        {options.map((opt: string) => {
                            const isSel = (value || []).includes(opt);
                            return (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                        const current = value || [];
                                        onChange(isSel ? current.filter((v: any) => v !== opt) : [...current, opt]);
                                    }}
                                    className={`px-4 py-3 rounded-xl border-2 transition-all text-[9px] font-black uppercase text-left truncate ${isSel ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-700'}`}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        case 'datetime':
            return (
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-2">{label}</label>
                    <input type="datetime-local" value={value || ''} onChange={e => onChange(e.target.value)} className={baseClass} />
                </div>
            );
        case 'short_text':
            return (
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-2">{label}</label>
                    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className={baseClass} placeholder={help_text || "Input data..."} />
                </div>
            );
        default:
            return null;
    }
};

const SubmissionPanel: React.FC<SubmissionPanelProps> = ({ addReport, preselectedCategory, prefilledDescription }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [category, setCategory] = useState<Category | ''>(preselectedCategory || '');
  const [severity, setSeverity] = useState<SeverityLevel>('Standard');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState(prefilledDescription || '');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [safetyConfirmed, setSafetyConfirmed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const schema = useMemo(() => {
    if (!category) return null;
    return FORM_BUNDLE.categories[category] || FORM_BUNDLE.categories['Other'];
  }, [category]);

  const fidelityScore = useMemo(() => {
    let score = 0;
    if (category) score += 10;
    if (location) score += 10;
    if (description.length > 50) score += 20;
    if (attachments.length > 0) score += 30;
    if (Object.keys(answers).length >= 3) score += 20;
    if (safetyConfirmed) score += 10;
    return score;
  }, [category, location, description, attachments, answers, safetyConfirmed]);

  const handleNext = () => {
    if (activeStepIndex < STEPS.length - 1) setActiveStepIndex(activeStepIndex + 1);
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) setActiveStepIndex(activeStepIndex - 1);
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    // Explicitly type file as File to resolve unknown type issues
    const newAttachments: AttachedFile[] = Array.from(files).map((file: File) => {
        let type: AttachedFile['type'] = 'other';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('audio/')) type = 'audio';
        return { file, preview: type === 'image' ? URL.createObjectURL(file) : null, type };
    });
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !safetyConfirmed) return;
    setIsSubmitting(true);
    addReport({
        title: `Forensic_Sync_${category.toUpperCase()}_${Date.now().toString().slice(-4)}`,
        description,
        category,
        location: location || 'GEO_STAMPED_NODE',
        trustScore: fidelityScore,
        severity,
        isActionable: fidelityScore > 70,
        attachments: attachments.map(a => a.file),
        structuredData: { ...answers, fidelity: fidelityScore, safety_checked: true }
    });
  };

  const renderStepContent = () => {
    switch (STEPS[activeStepIndex].id) {
      case 'DOMAIN':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Initialize_Reporting_Node</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Select the domain protocol for this artifact</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar p-2">
              {CATEGORIES_WITH_ICONS.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => { setCategory(cat.value as Category); handleNext(); }}
                  className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all ${category === cat.value ? 'bg-cyan-600 border-cyan-400 text-white shadow-2xl scale-105' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                >
                  <span className="text-4xl mb-4 grayscale group-hover:grayscale-0">{cat.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-center leading-none">{cat.value}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'TEMPORAL':
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="text-center">
              <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Geospatial_Temporal_Anchor</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Define when and where the incident manifested</p>
            </div>
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-4">01. Sector_Identifier</label>
                    <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                        <input value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-zinc-950 border-2 border-zinc-800 pl-14 pr-6 py-5 rounded-2xl outline-none focus:border-cyan-500 text-white font-black uppercase tracking-widest text-sm shadow-inner" placeholder="Address, Node, or Coordinates..." />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-4">02. Institutional_Triage</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['Informational', 'Standard', 'Critical', 'Catastrophic'].map(lvl => (
                            <button key={lvl} type="button" onClick={() => setSeverity(lvl as SeverityLevel)} className={`py-4 rounded-xl border-2 text-[9px] font-black uppercase transition-all ${severity === lvl ? 'bg-amber-600 border-amber-400 text-white shadow-lg' : 'bg-black border-zinc-900 text-zinc-600'}`}>{lvl}</button>
                        ))}
                    </div>
                </div>
            </div>
            <button onClick={handleNext} disabled={!location} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs shadow-xl active:scale-95 disabled:opacity-20 transition-all">Proceed_To_Data_Intake</button>
          </div>
        );
      case 'FORENSIC':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Forensic_Data_Intake</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Protocol: SH-256 Structured Fact Verification</p>
            </div>
            <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
               {schema?.core_questions.slice(0, 4).map(q => (
                 <ForensicField key={q.id} question={q} value={answers[q.id]} onChange={v => setAnswers({...answers, [q.id]: v})} />
               ))}
               <div className="space-y-3">
                   <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-2">Situational_Summary</label>
                   <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-zinc-950 border-2 border-zinc-800 p-6 rounded-[2rem] text-sm font-bold text-white outline-none focus:border-cyan-500 transition-all placeholder:text-zinc-900 min-h-[120px] resize-none leading-relaxed" placeholder="Summarize the core observation..." />
               </div>
            </div>
            <button onClick={handleNext} disabled={description.length < 10} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs shadow-xl active:scale-95 disabled:opacity-20 transition-all">Continue_To_Evidence_Sync</button>
          </div>
        );
      case 'EVIDENCE':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Visual_Intel_Synchronization</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Attach telemetry shards to strengthen report fidelity</p>
            </div>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="py-16 border-2 border-dashed border-zinc-800 rounded-[3rem] bg-zinc-950 flex flex-col items-center justify-center space-y-6 cursor-pointer hover:border-cyan-500/50 hover:bg-zinc-900/50 transition-all group shadow-inner"
            >
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelection} accept="image/*,video/*,audio/*" />
              <div className="p-6 bg-zinc-900 rounded-[2rem] border border-zinc-800 group-hover:border-cyan-900 group-hover:scale-110 transition-all shadow-xl">
                  <Camera className="w-12 h-12 text-zinc-700 group-hover:text-cyan-400" />
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-zinc-500 uppercase tracking-widest group-hover:text-cyan-100 transition-colors">Awaiting_Telemetry_Input</p>
                <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest mt-2">TAP TO UPLOAD PICTURES OR VIDEO</p>
              </div>
            </div>

            {attachments.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 animate-fade-in">
                    {attachments.map((item, i) => (
                        <div key={i} className="relative aspect-square bg-zinc-950 border-2 border-zinc-800 rounded-2xl overflow-hidden shadow-lg group/item">
                            {item.type === 'image' ? (
                                <img src={item.preview!} alt="P" className="w-full h-full object-cover grayscale opacity-70 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 group-hover/item:text-cyan-500 transition-colors">
                                    {item.type === 'video' ? <Play className="w-6 h-6"/> : <FileText className="w-6 h-6"/>}
                                </div>
                            )}
                            <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1.5 bg-black/80 rounded-lg text-rose-500 opacity-0 group-hover/item:opacity-100 transition-opacity border border-rose-900/30">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={handleNext} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">Proceed_To_Safety_Audit</button>
          </div>
        );
      case 'SAFETY':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase text-white tracking-tighter text-emerald-400">Operator_Safety_Protocol</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Final validation of field security status</p>
            </div>
            <div 
              onClick={() => setSafetyConfirmed(!safetyConfirmed)}
              className={`p-10 rounded-[3rem] border-4 transition-all duration-300 cursor-pointer flex flex-col items-center space-y-6 shadow-2xl relative overflow-hidden ${safetyConfirmed ? 'bg-emerald-950/20 border-emerald-500' : 'bg-zinc-950 border-zinc-800 border-dashed hover:border-zinc-700'}`}
            >
                <div className={`p-6 rounded-full transition-all duration-500 ${safetyConfirmed ? 'bg-emerald-500 text-black shadow-[0_0_30px_emerald]' : 'bg-zinc-900 text-zinc-700'}`}>
                    <ShieldCheck className="w-12 h-12" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-sm font-black text-white uppercase tracking-tighter">{safetyConfirmed ? 'Security_Protocol_Acknowledged' : 'Verify_Physical_Security'}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed max-w-[30ch]">I verify that I have maintained a safe distance and avoided direct conflict.</p>
                </div>
                {safetyConfirmed && <div className="absolute top-6 right-6 text-emerald-500 animate-pulse"><Sparkles className="w-6 h-6"/></div>}
            </div>
            <button onClick={handleNext} disabled={!safetyConfirmed} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs shadow-xl active:scale-95 disabled:opacity-20 transition-all">Review_Final_Shard</button>
          </div>
        );
      case 'COMMIT':
        return (
          <div className="space-y-10 animate-fade-in pb-8">
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase text-white tracking-tighter">Ledger_Preview_Protocol</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Review forensic metadata before cryptographic sealing</p>
            </div>

            <div className="bg-zinc-900 border-2 border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Broadcast className="w-20 h-20 text-cyan-500"/></div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Target_Domain</p>
                        <p className="text-sm font-black text-white uppercase">{category}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Geospatial_Lock</p>
                        <p className="text-sm font-black text-white uppercase truncate">{location}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Temporal_Stamp</p>
                        <p className="text-sm font-black text-white uppercase">SYSTEM_TIME_LOCKED</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Evidence_Shards</p>
                        <p className="text-sm font-black text-emerald-500 uppercase">{attachments.length} Synced</p>
                    </div>
                </div>
                <div className="pt-6 border-t border-zinc-800">
                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Situational_Narrative</p>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 italic">"{description}"</p>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-8 rounded-[2.5rem] shadow-3xl transition-all active:scale-95 flex items-center justify-center space-x-4 border-b-8 border-cyan-800 group"
            >
                {isSubmitting ? (
                    <><Loader className="w-8 h-8 animate-spin"/><span className="text-sm uppercase tracking-[0.4em]">Sealing_Shard...</span></>
                ) : (
                    <><Database className="w-8 h-8 group-hover:scale-110 transition-transform"/><span className="text-sm uppercase tracking-[0.4em]">Finalize_Ledger_Commit</span></>
                )}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="font-mono max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 pb-32">
      {/* TIMELINE SIDEBAR */}
      <aside className="lg:w-72 flex-shrink-0 order-2 lg:order-1">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[3rem] sticky top-32 space-y-10 shadow-2xl">
              <div className="space-y-2 mb-8">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Shard_Fidelity</p>
                  <div className="flex items-end gap-3">
                      <span className="text-4xl font-black tracking-tighter text-white">{fidelityScore}%</span>
                      <div className={`w-3 h-3 rounded-full mb-2 ${fidelityScore > 70 ? 'bg-emerald-500 shadow-[0_0_10px_emerald]' : 'bg-cyan-500'}`}></div>
                  </div>
                  <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 shadow-[0_0_15px_cyan] transition-all duration-1000" style={{ width: `${fidelityScore}%` }}></div>
                  </div>
              </div>

              <div className="space-y-8 relative">
                  <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-zinc-800"></div>
                  {STEPS.map((step, idx) => {
                      const isActive = activeStepIndex === idx;
                      const isComplete = activeStepIndex > idx;
                      return (
                          <div key={step.id} className={`relative flex items-center space-x-6 transition-all duration-500 ${idx > activeStepIndex ? 'opacity-20' : 'opacity-100'}`}>
                              <div className={`relative z-10 w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all ${isComplete ? 'bg-emerald-500 border-emerald-400 text-black' : isActive ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
                                  {isComplete ? <CheckCircle className="w-5 h-5" /> : step.icon}
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-zinc-500'}`}>{step.label}</span>
                          </div>
                      );
                  })}
              </div>
          </div>
      </aside>

      {/* CONTENT AREA */}
      <div className="flex-grow order-1 lg:order-2">
          <form onSubmit={handleSubmit} className="bg-zinc-900/40 border-2 border-zinc-800 rounded-[4rem] p-10 md:p-16 shadow-4xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-800">
                  <div className="h-full bg-cyan-600 transition-all duration-1000" style={{ width: `${((activeStepIndex + 1) / STEPS.length) * 100}%` }}></div>
              </div>
              
              <div className="min-h-[500px] flex flex-col justify-center">
                  {renderStepContent()}
              </div>

              {activeStepIndex > 0 && activeStepIndex < STEPS.length - 1 && (
                <div className="mt-12 pt-10 border-t border-zinc-800/50 flex justify-between">
                    <button type="button" onClick={handlePrev} className="px-10 py-4 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">Back</button>
                    <button type="button" onClick={handleNext} className="px-10 py-4 bg-zinc-900 border border-zinc-700 text-cyan-400 hover:bg-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">Skip / Next</button>
                </div>
              )}
          </form>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .animate-scan-y { animation: scanY 3s linear infinite; }
        @keyframes scanY { 0% { top: 0; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
      `}</style>
    </div>
  );
};

export default SubmissionPanel;