
import React, { useState, useEffect } from 'react';
import { useTranslations } from '../i18n';
import { type IntelItem, MissionApproach, MissionGoal } from '../types';
import { ArrowLeft, CheckCircle, Circle, Loader, MapPin, Link as LinkIcon, Zap, ShieldCheck, Activity, Target, User, Scale, Box, ArrowRight, Broadcast, Sparkles } from './icons';
import { CATEGORIES_WITH_ICONS } from '../constants';

interface GenerateMissionViewProps {
  intelItem: IntelItem;
  onReturn: () => void;
  onAcceptMission: (intelItem: IntelItem, approach: MissionApproach, goal: MissionGoal) => Promise<void> | void;
}

const GenerateMissionView: React.FC<GenerateMissionViewProps> = ({ intelItem, onReturn, onAcceptMission }) => {
  const { t } = useTranslations();
  const [approach, setApproach] = useState<MissionApproach | null>(null);
  const [goal, setGoal] = useState<MissionGoal | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
      if (!approach || !goal) return;
      setIsAccepting(true);
      try {
          await onAcceptMission(intelItem, approach, goal);
      } catch (err) {
          console.error("Mission Sync Failed:", err);
          setIsAccepting(false);
          alert("Neural sync timed out. Please retry initializing the directive.");
      }
  };

  const approaches = [
      { id: 'EVIDENCE_FIRST' as MissionApproach, label: 'Evidence First', icon: <Scale className="w-5 h-5"/>, desc: 'Prioritize high-fidelity proof and data anchors.' },
      { id: 'COMMUNITY_FIRST' as MissionApproach, label: 'Community First', icon: <User className="w-5 h-5"/>, desc: 'Focus on collective impact and resource mapping.' },
      { id: 'SYSTEMS_FIRST' as MissionApproach, label: 'Systems First', icon: <ShieldCheck className="w-5 h-5"/>, desc: 'Analyze policies and target responsible entities.' }
  ];

  const goals = [
      { id: 'STOP_HARM' as MissionGoal, label: 'Stop Harm', desc: 'Prevent immediate escalation.' },
      { id: 'DOCUMENT_HARM' as MissionGoal, label: 'Document', desc: 'Secure permanent evidence.' },
      { id: 'GET_REMEDY' as MissionGoal, label: 'Remedy', desc: 'Demand specific corrective action.' }
  ];

  return (
    <div className="bg-zinc-950 text-white p-8 rounded-[3rem] animate-fade-in min-h-[85vh] border border-zinc-800 shadow-4xl font-mono relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02),transparent)] pointer-events-none"></div>
        
        <button onClick={onReturn} className="inline-flex items-center space-x-3 text-xs font-black uppercase text-zinc-500 hover:text-cyan-400 transition-colors mb-8 group">
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Return_To_Intel</span>
        </button>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Intel Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Broadcast className="w-20 h-20 text-cyan-400"/></div>
                    <div className="flex items-center space-x-4 mb-6">
                        <span className="bg-cyan-950/40 text-cyan-400 px-3 py-1 rounded-full border border-cyan-900/50 text-[8px] font-black uppercase tracking-widest">ASSIGNMENT_ROOT</span>
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{intelItem.title}</h2>
                    <p className="text-xs text-zinc-500 leading-relaxed italic">"{intelItem.summary}"</p>
                    <div className="mt-8 pt-8 border-t border-zinc-800 space-y-4">
                        <div className="flex items-center space-x-3 text-[10px] text-zinc-400">
                            <MapPin className="w-4 h-4 text-rose-500" />
                            <span>{intelItem.location}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-[10px] text-zinc-400">
                            <Target className="w-4 h-4 text-cyan-500" />
                            <span>{intelItem.category}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Configuration */}
            <div className="lg:col-span-8 space-y-12">
                <section className="space-y-6">
                    <h3 className="text-sm font-black uppercase text-cyan-500 tracking-[0.4em] px-4">01. Select_Approach</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {approaches.map(a => (
                            <button 
                                key={a.id} 
                                onClick={() => setApproach(a.id)}
                                className={`p-6 rounded-[2rem] border-2 text-left transition-all ${approach === a.id ? 'bg-cyan-950/20 border-cyan-500 shadow-xl scale-[1.02]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 opacity-60 hover:opacity-100'}`}
                            >
                                <div className="mb-4 text-cyan-400">{a.icon}</div>
                                <h4 className="text-sm font-black text-white uppercase mb-2">{a.label}</h4>
                                <p className="text-[10px] font-black text-zinc-500 font-bold leading-relaxed">{a.desc}</p>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="space-y-6">
                    <h3 className="text-sm font-black uppercase text-amber-500 tracking-[0.4em] px-4">02. Define_Outcome_Goal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {goals.map(g => (
                            <button 
                                key={g.id} 
                                onClick={() => setGoal(g.id)}
                                className={`p-6 rounded-[2rem] border-2 text-left transition-all ${goal === g.id ? 'bg-amber-950/20 border-amber-500 shadow-xl scale-[1.02]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 opacity-60 hover:opacity-100'}`}
                            >
                                <h4 className="text-sm font-black text-white uppercase mb-2">{g.label}</h4>
                                <p className="text-[10px] font-black text-zinc-500 font-bold leading-relaxed">{g.desc}</p>
                            </button>
                        ))}
                    </div>
                </section>

                <div className="pt-8 border-t border-zinc-900">
                    <button 
                        onClick={handleAccept}
                        disabled={!approach || !goal || isAccepting}
                        className="w-full bg-white text-black font-black py-8 rounded-[2.5rem] uppercase tracking-[0.4em] text-xs shadow-4xl active:scale-95 transition-all disabled:opacity-10 flex items-center justify-center space-x-6"
                    >
                        {isAccepting ? <Loader className="w-8 h-8 animate-spin" /> : <Sparkles className="w-8 h-8 text-cyan-500" />}
                        <span>{isAccepting ? 'SYNERGIZING_STRATEGY...' : 'Initialize_Tactical_Directive'}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default GenerateMissionView;
