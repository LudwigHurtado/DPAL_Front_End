
import React, { useState, useRef, useEffect } from 'react';
import { type Hero, type Report, type Mission, type TacticalDossier, type TeamMessage } from '../types';
// FIX: Added Sparkles to the imports from ./icons to resolve the missing name error on line 239.
import { ArrowLeft, User, Send, Package, Broadcast, ShieldCheck, Target, Zap, Clock, Plus, Database, FileText, Check, ChevronRight, X, ArrowRight, Monitor, Search, Loader, RefreshCw, Hash, Sparkles } from './icons';
import { useTranslations } from '../i18n';

interface TeamOpsViewProps {
    onReturn: () => void;
    hero: Hero;
    reports: Report[];
    missions: Mission[];
    dossiers: TacticalDossier[];
    setDossiers: React.Dispatch<React.SetStateAction<TacticalDossier[]>>;
    messages: TeamMessage[];
    setMessages: React.Dispatch<React.SetStateAction<TeamMessage[]>>;
    onJoinMission: (missionId: string) => void;
}

interface OperationRoom {
    id: string;
    name: string;
    reportId?: string;
    createdDate: number;
    creator: string;
    activeNodes: number;
}

const TeamOpsView: React.FC<TeamOpsViewProps> = ({ onReturn, hero, reports, missions, dossiers, setDossiers, messages, setMessages, onJoinMission }) => {
    const { t } = useTranslations();
    const [activeTab, setActiveTab] = useState<'rooms' | 'comms' | 'dossiers'>('rooms');
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [isCreatingDossier, setIsCreatingDossier] = useState(false);
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [joinId, setJoinId] = useState('');
    const [newRoom, setNewRoom] = useState({ name: '', reportId: '' });
    const [newDossier, setNewDossier] = useState({ name: '', desc: '', reports: [] as string[] });
    const [inputText, setInputText] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mock initial operation rooms
    const [rooms, setRooms] = useState<OperationRoom[]>([
        { id: 'RM-A92', name: 'Metro North Oversight', reportId: 'rep-001', createdDate: Date.now() - 86400000, creator: 'Sentinel_Prime', activeNodes: 4 },
        { id: 'RM-B12', name: 'Vertex Group Audit', reportId: 'rep-002', createdDate: Date.now() - 43200000, creator: 'Analyst_Sigma', activeNodes: 12 }
    ]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, activeTab]);

    const handleSendMessage = (e?: React.FormEvent, attachment?: TeamMessage['attachment']) => {
        if (e) e.preventDefault();
        if (!inputText.trim() && !attachment) return;

        const msg: TeamMessage = {
            id: `tm-${Date.now()}`,
            sender: hero.name,
            text: inputText.trim(),
            timestamp: Date.now(),
            rank: hero.rank,
            avatarUrl: hero.personas.find(p => p.id === hero.equippedPersonaId)?.imageUrl,
            attachment
        };
        setMessages(prev => [...prev, msg]);
        setInputText('');
    };

    const handleCreateRoom = () => {
        if (!newRoom.name.trim()) return;
        setIsSyncing(true);
        setTimeout(() => {
            const room: OperationRoom = {
                id: `RM-${Math.random().toString(36).substring(2, 5).toUpperCase()}${Math.floor(Math.random() * 90) + 10}`,
                name: newRoom.name,
                reportId: newRoom.reportId || undefined,
                createdDate: Date.now(),
                creator: hero.name,
                activeNodes: 1
            };
            setRooms(prev => [room, ...prev]);
            setIsCreatingRoom(false);
            setNewRoom({ name: '', reportId: '' });
            setActiveRoomId(room.id);
            setActiveTab('comms');
            setIsSyncing(false);
            
            handleSendMessage(undefined, {
                type: 'invite',
                refId: room.id,
                label: `New Operation Room: ${room.name}`
            });
        }, 1500);
    };

    const handleJoinRoom = () => {
        if (!joinId.trim()) return;
        setIsSyncing(true);
        setTimeout(() => {
            // In a real app, verify ID exists. Here we just mock transition.
            setActiveRoomId(joinId.toUpperCase());
            setActiveTab('comms');
            setIsSyncing(false);
            setJoinId('');
        }, 1200);
    };

    const handleCreateDossier = () => {
        if (!newDossier.name.trim() || newDossier.reports.length === 0) return;
        const dossier: TacticalDossier = {
            id: `dos-${Date.now()}`,
            name: newDossier.name,
            description: newDossier.desc,
            reportIds: newDossier.reports,
            author: hero.name,
            timestamp: Date.now()
        };
        setDossiers(prev => [dossier, ...prev]);
        setIsCreatingDossier(false);
        setNewDossier({ name: '', desc: '', reports: [] });
        
        handleSendMessage(undefined, {
            type: 'dossier',
            refId: dossier.id,
            label: `Tactical Dossier: ${dossier.name}`
        });
    };

    const activeRoom = rooms.find(r => r.id === activeRoomId);

    return (
        <div className="bg-zinc-950 text-white min-h-[85vh] rounded-[2.5rem] border border-zinc-800 shadow-2xl animate-fade-in font-mono overflow-hidden flex flex-col">
            <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 z-30">
                <div className="flex items-center space-x-6">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                        <User className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">Team_Operations</h1>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Collaborative P2P Network Hub</p>
                    </div>
                </div>
                <button onClick={onReturn} className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Terminal_Home</span>
                </button>
            </header>

            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden h-[calc(85vh-88px)]">
                <aside className="lg:w-80 border-r border-zinc-800 bg-zinc-900/40 p-6 space-y-3 flex-shrink-0">
                    <TabButton active={activeTab === 'rooms'} onClick={() => setActiveTab('rooms')} icon={<Monitor className="w-4 h-4"/>} label="Room_Command" />
                    <TabButton active={activeTab === 'comms'} onClick={() => setActiveTab('comms')} icon={<Broadcast className="w-4 h-4"/>} label="Live_Broadcast" />
                    <TabButton active={activeTab === 'dossiers'} onClick={() => setActiveTab('dossiers')} icon={<Database className="w-4 h-4"/>} label="Dossier_Archive" />
                    
                    <div className="pt-10 space-y-6">
                         <div className="px-3 space-y-1">
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Active_Dossier_Access</p>
                            <div className="flex items-center space-x-3 p-3 bg-black/40 rounded-2xl border border-zinc-800">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
                                    <img src={hero.personas.find(p => p.id === hero.equippedPersonaId)?.imageUrl || 'https://i.imgur.com/8p8Vp6V.png'} alt="P" className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-white truncate uppercase">{hero.name}</p>
                                    <p className="text-[7px] text-cyan-500 font-bold uppercase tracking-widest">R_LVL_{hero.rank}</p>
                                </div>
                            </div>
                         </div>
                    </div>
                </aside>

                <main className="flex-grow flex flex-col bg-black relative">
                    {activeTab === 'rooms' ? (
                        <div className="flex-grow p-8 lg:p-12 space-y-12 overflow-y-auto custom-scrollbar">
                            {/* JOIN BY ID / CREATE SECTION */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-zinc-900 pb-10">
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">Operation_Rooms</h2>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Manage secure tactical workgroups</p>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="relative flex-grow">
                                        <input 
                                            value={joinId}
                                            onChange={e => setJoinId(e.target.value.toUpperCase())}
                                            placeholder="ENTER_ROOM_ID"
                                            className="w-full md:w-56 bg-zinc-950 border-2 border-zinc-800 rounded-xl px-4 py-3 text-[10px] font-black uppercase focus:border-emerald-500 outline-none transition-all"
                                        />
                                        <Hash className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-700" />
                                    </div>
                                    <button 
                                        onClick={handleJoinRoom}
                                        disabled={!joinId.trim() || isSyncing}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-30"
                                    >
                                        {isSyncing ? 'SYNC...' : 'JOIN'}
                                    </button>
                                </div>
                            </div>

                            {isCreatingRoom ? (
                                <div className="bg-zinc-900 border-2 border-cyan-500/30 p-10 rounded-[3rem] space-y-10 animate-fade-in shadow-2xl">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <Zap className="w-6 h-6 text-cyan-500" />
                                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Protocol: Create_Operation_Room</h3>
                                        </div>
                                        <button onClick={() => setIsCreatingRoom(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors"><X className="w-6 h-6 text-zinc-600" /></button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] pl-4">Room_Identifier</label>
                                            <input 
                                                placeholder="e.g., Riverside Infrastructure Audit"
                                                value={newRoom.name}
                                                onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                                                className="w-full bg-black border-2 border-zinc-800 rounded-[1.5rem] p-6 text-base font-bold focus:border-cyan-500 outline-none transition-all text-white placeholder:text-zinc-900 shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] pl-4">Associate_Ledger_Report</label>
                                            <select 
                                                value={newRoom.reportId}
                                                onChange={(e) => setNewRoom({...newRoom, reportId: e.target.value})}
                                                className="w-full bg-black border-2 border-zinc-800 rounded-[1.5rem] p-6 text-base font-bold focus:border-cyan-500 outline-none transition-all text-white cursor-pointer shadow-inner appearance-none"
                                            >
                                                <option value="">[NO_REPORT_LINKED]</option>
                                                {reports.filter(r => r.isAuthor).map(r => (
                                                    <option key={r.id} value={r.id}>{r.title.toUpperCase()}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleCreateRoom}
                                        disabled={!newRoom.name.trim() || isSyncing}
                                        className="w-full bg-white text-black font-black py-8 rounded-[2.5rem] uppercase tracking-[0.4em] text-xs transition-all shadow-2xl active:scale-95 disabled:opacity-30 flex items-center justify-center space-x-4"
                                    >
                                        {isSyncing ? <Loader className="w-6 h-6 animate-spin"/> : <Sparkles className="w-6 h-6 text-cyan-600"/>}
                                        <span>{isSyncing ? 'MATERIALIZING_NODE...' : 'Initialize_Secure_Room'}</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <button 
                                        onClick={() => setIsCreatingRoom(true)}
                                        className="flex flex-col items-center justify-center p-16 bg-zinc-950 border-4 border-dashed border-zinc-900 rounded-[3.5rem] hover:border-cyan-500/30 transition-all group shadow-inner"
                                    >
                                        <div className="p-6 bg-zinc-900 rounded-[2rem] border border-zinc-800 mb-6 group-hover:border-cyan-900 transition-all">
                                            <Plus className="w-12 h-12 text-zinc-700 group-hover:text-cyan-500 transition-colors" />
                                        </div>
                                        <span className="text-xs font-black uppercase text-zinc-600 group-hover:text-white tracking-[0.3em]">Create_New_Operation</span>
                                    </button>

                                    {rooms.map(room => (
                                        <div key={room.id} className="bg-zinc-900/60 border-2 border-zinc-800 p-10 rounded-[3.5rem] hover:border-emerald-500/30 transition-all group relative overflow-hidden shadow-xl">
                                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-3xl pointer-events-none"></div>
                                            <div className="flex justify-between items-start mb-8">
                                                 <div className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all">
                                                    <Target className="w-8 h-8 text-emerald-400"/>
                                                 </div>
                                                 <div className="text-right">
                                                     <p className="text-xs font-black text-emerald-500 uppercase">{room.id}</p>
                                                     <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1 tracking-widest">{room.activeNodes} Nodes Active</p>
                                                 </div>
                                            </div>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-3 group-hover:text-emerald-50 transition-colors">{room.name}</h3>
                                            {room.reportId && (
                                                <div className="flex items-center space-x-3 text-[9px] font-black text-cyan-600 uppercase tracking-[0.2em] mb-8 bg-cyan-950/20 w-fit px-4 py-1.5 rounded-full border border-cyan-900/30">
                                                    <ShieldCheck className="w-4 h-4" />
                                                    <span>LINKED_SHARD: {room.reportId}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between pt-8 border-t border-zinc-800/50">
                                                <div className="flex items-center space-x-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                                    <User className="w-4 h-4" />
                                                    <span>Admin: {room.creator}</span>
                                                </div>
                                                <button 
                                                    onClick={() => { setActiveRoomId(room.id); setActiveTab('comms'); }}
                                                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                                >
                                                    Deploy_To_Room
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'comms' ? (
                        <>
                            <div className="bg-zinc-900 border-b border-zinc-800 px-10 py-6 flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white">
                                            {activeRoom ? activeRoom.name : 'Global_Operation_Loop'}
                                        </h3>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                                            Handshake: {activeRoom ? `ENCRYPTED_LINK_${activeRoom.id}` : 'PUBLIC_UNENCRYPTED_PULSE'}
                                        </p>
                                    </div>
                                </div>
                                {activeRoom && (
                                    <button 
                                        onClick={() => setActiveRoomId(null)}
                                        className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-400 flex items-center space-x-3 group/disc"
                                    >
                                        <X className="w-4 h-4 group-hover/disc:rotate-90 transition-transform" />
                                        <span>Sever_Connection</span>
                                    </button>
                                )}
                            </div>
                            
                            <div ref={scrollRef} className="flex-grow overflow-y-auto p-10 space-y-8 custom-scrollbar bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.015),transparent)]">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-700 opacity-40 space-y-6">
                                        <div className="p-8 bg-zinc-900 rounded-[3rem] border border-zinc-800">
                                            <Zap className="w-16 h-16" />
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-[0.6em]">Initialize_Transmission_Sync</p>
                                    </div>
                                ) : (
                                    messages.map(msg => (
                                        <div key={msg.id} className={`flex flex-col ${msg.sender === hero.name ? 'items-end' : 'items-start'} space-y-2 group animate-fade-in`}>
                                            <div className="flex items-center space-x-3 text-[10px] font-black text-zinc-600 uppercase px-4">
                                                <span>OPERATIVE_{msg.sender.toUpperCase()} [LVL_{msg.rank}]</span>
                                                <div className="h-0.5 w-0.5 rounded-full bg-zinc-800"></div>
                                                <span className="opacity-40">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            
                                            <div className={`max-w-[85%] p-8 rounded-[2.5rem] border-2 transition-all relative shadow-xl ${
                                                msg.sender === hero.name ? 'bg-emerald-950/20 border-emerald-500/20 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                                            }`}>
                                                {msg.text && <p className="text-base leading-relaxed mb-4 font-medium">{msg.text}</p>}
                                                
                                                {msg.attachment && (
                                                    <button 
                                                        onClick={() => {
                                                            if (msg.attachment?.type === 'invite' || msg.attachment?.type === 'mission') onJoinMission(msg.attachment.refId);
                                                            else if (msg.attachment?.type === 'dossier') setActiveTab('dossiers');
                                                        }}
                                                        className="w-full mt-4 p-5 bg-black/50 border border-zinc-800 rounded-3xl flex items-center justify-between hover:border-cyan-500 transition-all group/attach"
                                                    >
                                                        <div className="flex items-center space-x-6 truncate">
                                                            <div className="p-3 bg-zinc-900 rounded-2xl group-hover/attach:bg-cyan-950/40 transition-colors">
                                                                {msg.attachment.type === 'dossier' ? <Package className="w-6 h-6 text-emerald-500"/> : <Target className="w-6 h-6 text-cyan-500"/>}
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-[10px] font-black uppercase text-white truncate tracking-widest">{msg.attachment.label}</p>
                                                                <p className="text-[8px] font-bold text-zinc-600 uppercase mt-1">ID: {msg.attachment.refId}</p>
                                                            </div>
                                                        </div>
                                                        <ArrowRight className="w-5 h-5 text-zinc-600 group-hover/attach:translate-x-2 transition-transform" />
                                                    </button>
                                                )}
                                                
                                                <div className={`absolute bottom-[-24px] ${msg.sender === hero.name ? 'right-4' : 'left-4'} opacity-0 group-hover:opacity-100 transition-all`}>
                                                    <div className="bg-zinc-950 border border-zinc-800 px-4 py-1.5 rounded-lg flex items-center space-x-3 text-[8px] font-mono text-emerald-600/80">
                                                        <ShieldCheck className="w-3 h-3" />
                                                        <span>SIG: 0x{msg.id.split('-').pop()?.toUpperCase()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form onSubmit={(e) => handleSendMessage(e)} className="p-8 lg:p-10 bg-zinc-900/60 border-t border-zinc-800 flex items-center gap-8">
                                <input 
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={activeRoom ? `Broadcast analytical telemetry to ${activeRoom.name}...` : "Initiate public operational broadcast..."}
                                    className="flex-grow bg-zinc-950 border-2 border-zinc-800 rounded-[2rem] px-10 py-6 text-base font-bold focus:outline-none focus:border-emerald-500 outline-none transition-all placeholder:text-zinc-900 text-white shadow-inner"
                                />
                                <button 
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className="p-7 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 rounded-[1.8rem] transition-all shadow-[0_0_35px_rgba(16,185,129,0.2)] active:scale-95"
                                >
                                    <Send className="w-8 h-8 text-white" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-grow p-12 space-y-12 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center border-b border-zinc-900 pb-10">
                                <div>
                                    <h2 className="text-4xl font-black uppercase tracking-tighter">Archive_Dossiers</h2>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em] mt-2">Team Intelligence Repository</p>
                                </div>
                                <button 
                                    onClick={() => setIsCreatingDossier(true)}
                                    className="flex items-center space-x-4 px-10 py-5 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Compile_New_Dossier</span>
                                </button>
                            </div>

                            {isCreatingDossier ? (
                                <div className="bg-zinc-900/60 border-2 border-emerald-500/30 p-12 rounded-[3.5rem] space-y-10 animate-fade-in shadow-2xl">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <Database className="w-6 h-6 text-emerald-500" />
                                            <span className="text-sm font-black text-emerald-500 uppercase tracking-widest">Protocol: Dossier_Compilation</span>
                                        </div>
                                        <button onClick={() => setIsCreatingDossier(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors"><X className="w-6 h-6 text-zinc-600" /></button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] pl-4">Dossier_Identifier</label>
                                            <input 
                                                placeholder="e.g., Regional Environmental Hazard Log"
                                                value={newDossier.name}
                                                onChange={(e) => setNewDossier({...newDossier, name: e.target.value})}
                                                className="w-full bg-black border-2 border-zinc-800 rounded-[1.8rem] p-6 text-base font-bold focus:border-emerald-500 outline-none transition-all text-white placeholder:text-zinc-900"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] pl-4">Operational_Context</label>
                                            <input 
                                                placeholder="Define mission objective summary..."
                                                value={newDossier.desc}
                                                onChange={(e) => setNewDossier({...newDossier, desc: e.target.value})}
                                                className="w-full bg-black border-2 border-zinc-800 rounded-[1.8rem] p-6 text-base font-bold focus:border-emerald-500 outline-none transition-all text-white placeholder:text-zinc-900"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] pl-4">Select_Evidence_Shards (Personal Reports)</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-80 overflow-y-auto pr-4 custom-scrollbar p-1">
                                            {reports.filter(r => r.isAuthor).map(r => (
                                                <button 
                                                    key={r.id}
                                                    onClick={() => {
                                                        const isSel = newDossier.reports.includes(r.id);
                                                        setNewDossier({...newDossier, reports: isSel ? newDossier.reports.filter(id => id !== r.id) : [...newDossier.reports, r.id]});
                                                    }}
                                                    className={`p-6 rounded-[2rem] border-2 text-left transition-all text-xs font-black uppercase tracking-tighter ${
                                                        newDossier.reports.includes(r.id) ? 'border-emerald-500 bg-emerald-950/20 text-white shadow-lg' : 'border-zinc-800 bg-black text-zinc-500 hover:border-zinc-700'
                                                    }`}
                                                >
                                                    {r.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleCreateDossier}
                                        disabled={!newDossier.name.trim() || newDossier.reports.length === 0}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-8 rounded-[2.5rem] uppercase tracking-[0.5em] text-sm transition-all shadow-2xl disabled:opacity-20 active:scale-95"
                                    >
                                        Seal_Dossier_To_Public_Ledger
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {dossiers.length === 0 ? (
                                        <div className="col-span-2 py-40 text-center border-4 border-dashed border-zinc-900 rounded-[4rem] bg-zinc-950/40">
                                            <Database className="w-24 h-24 text-zinc-800 mx-auto mb-8 opacity-20" />
                                            <p className="text-xs font-black uppercase text-zinc-700 tracking-[0.6em]">Archive_Repository_Empty</p>
                                        </div>
                                    ) : (
                                        dossiers.map(dos => (
                                            <div key={dos.id} className="bg-zinc-900/60 border-2 border-zinc-800 p-10 rounded-[3.5rem] hover:border-emerald-500/40 transition-all group relative shadow-xl">
                                                <div className="flex justify-between items-start mb-8">
                                                     <div className="p-5 bg-emerald-500/10 rounded-3xl border border-emerald-500/20"><Package className="w-10 h-10 text-emerald-400"/></div>
                                                     <span className="text-[10px] font-mono text-zinc-700 font-black tracking-widest">#{dos.id.split('-').pop()?.toUpperCase()}</span>
                                                </div>
                                                <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-4 group-hover:text-emerald-100 transition-colors leading-none">{dos.name}</h3>
                                                <p className="text-sm text-zinc-500 font-bold leading-relaxed mb-10 line-clamp-2 italic border-l-2 border-emerald-950 pl-6">"{dos.description}"</p>
                                                <div className="flex items-center justify-between pt-8 border-t border-zinc-800/60">
                                                    <div className="flex items-center space-x-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                                        <FileText className="w-5 h-5 text-zinc-700" />
                                                        <span>{dos.reportIds.length} Linked Shards</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleSendMessage(undefined, { type: 'dossier', refId: dos.id, label: `Audit Dossier: ${dos.name}` })}
                                                        className="p-4 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-xl active:scale-95 group/btn"
                                                    >
                                                        <Send className="w-6 h-6 group-hover/btn:scale-110 transition-transform"/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
            `}</style>
        </div>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center space-x-5 px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
            active ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-950/50 border-t border-emerald-400/50' : 'bg-transparent text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300'
        }`}
    >
        <div className={`transition-transform duration-500 ${active ? 'scale-110 rotate-[360deg]' : ''}`}>{icon}</div>
        <span>{label}</span>
    </button>
);

export default TeamOpsView;
