
import React, { useState, useMemo, useRef } from 'react';
import { type Hero, type HealthRecord } from '../types';
import { ArrowLeft, Activity, ShieldCheck, Plus, Database, Cloud, X, QrCode, User, Heart, Trash2, Printer, Pill, Smile, FileCode, Check, Pencil, Globe, Target, Camera, Sparkles, Monitor, RefreshCw } from './icons';

interface MedicalOutpostViewProps {
    onReturn: () => void;
    hero: Hero;
    records: HealthRecord[];
    setRecords: React.Dispatch<React.SetStateAction<HealthRecord[]>>;
}

type FolderCategory = 'GENERAL' | 'DENTAL' | 'XRAYS' | 'LABS' | 'RX' | 'SPECIALIST';

const MEDICAL_FOLDERS: { id: FolderCategory, label: string, icon: React.ReactNode }[] = [
    { id: 'GENERAL', label: 'General Practice', icon: <User className="w-5 h-5"/> },
    { id: 'DENTAL', label: 'Dental Records', icon: <Smile className="w-5 h-5"/> },
    { id: 'XRAYS', label: 'Radiology / X-Rays', icon: <Activity className="w-5 h-5"/> },
    { id: 'LABS', label: 'Lab Results', icon: <FileCode className="w-5 h-5"/> },
    { id: 'RX', label: 'Prescriptions', icon: <Pill className="w-5 h-5"/> },
    { id: 'SPECIALIST', label: 'Specialist Reports', icon: <Target className="w-5 h-5"/> },
];

const MedicalOutpostView: React.FC<MedicalOutpostViewProps> = ({ onReturn, hero, records, setRecords }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
    const [activeFolder, setActiveFolder] = useState<FolderCategory | 'PROFILE'>('PROFILE');
    const [language, setLanguage] = useState<'EN' | 'ES'>('EN');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formRecord, setFormRecord] = useState({
        ownerName: '',
        relationship: 'Self',
        bloodType: '',
        dob: '',
        allergies: '',
        medications: '',
        emergencyContact: '',
        sharedFolderUri: '',
        criticalNotes: '',
        profilePicture: '' as string
    });

    const handleOpenEdit = (rec: HealthRecord) => {
        setFormRecord({
            ownerName: rec.ownerName,
            relationship: rec.relationship || 'Family',
            bloodType: rec.bloodType,
            dob: (rec as any).dob || '',
            allergies: rec.allergies.join(', '),
            medications: rec.medications.join(', '),
            emergencyContact: rec.emergencyContact,
            sharedFolderUri: rec.sharedFolderUri || '',
            criticalNotes: rec.criticalNotes || '',
            profilePicture: (rec as any).profilePicture || ''
        });
        setEditingRecordId(rec.id);
        setIsCreating(true);
    };

    const handleCreateOrUpdate = () => {
        if (!formRecord.ownerName) return;
        
        if (editingRecordId) {
            setRecords(prev => prev.map(r => r.id === editingRecordId ? {
                ...r,
                ownerName: formRecord.ownerName,
                relationship: formRecord.relationship,
                bloodType: formRecord.bloodType,
                dob: formRecord.dob,
                allergies: formRecord.allergies.split(',').map(s => s.trim()).filter(Boolean),
                medications: formRecord.medications.split(',').map(s => s.trim()).filter(Boolean),
                emergencyContact: formRecord.emergencyContact,
                sharedFolderUri: formRecord.sharedFolderUri,
                criticalNotes: formRecord.criticalNotes,
                profilePicture: formRecord.profilePicture
            } as any : r));
        } else {
            const record: HealthRecord = {
                id: `MED-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                ownerName: formRecord.ownerName,
                relationship: formRecord.relationship,
                bloodType: formRecord.bloodType,
                dob: formRecord.dob,
                allergies: formRecord.allergies.split(',').map(s => s.trim()).filter(Boolean),
                medications: formRecord.medications.split(',').map(s => s.trim()).filter(Boolean),
                emergencyContact: formRecord.emergencyContact,
                sharedFolderUri: formRecord.sharedFolderUri,
                criticalNotes: formRecord.criticalNotes,
                profilePicture: formRecord.profilePicture,
                isCloudSynced: false,
                timestamp: Date.now()
            } as any;
            setRecords(prev => [record, ...prev]);
        }
        
        setFormRecord({ ownerName: '', relationship: 'Family', bloodType: '', dob: '', allergies: '', medications: '', emergencyContact: '', sharedFolderUri: '', criticalNotes: '', profilePicture: '' });
        setIsCreating(false);
        setEditingRecordId(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Confirm deletion of this medical identity?")) {
            setRecords(prev => prev.filter(r => r.id !== id));
            if (editingRecordId === id) setEditingRecordId(null);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormRecord(prev => ({ ...prev, profilePicture: reader.result as string }));
            reader.readAsDataURL(file);
        }
    };

    const loadDemoData = () => {
        const demo: HealthRecord = {
            id: 'MED-DEMO-001',
            ownerName: 'Alejandro Martinez',
            relationship: 'Self',
            bloodType: 'O+',
            dob: '1988-05-14',
            allergies: ['Penicillin'],
            medications: ['Lisinopril'],
            emergencyContact: '+1 555 0199',
            sharedFolderUri: 'https://drive.google.com/demo',
            profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alejandro',
            isCloudSynced: true,
            timestamp: Date.now()
        } as any;
        setRecords(prev => [demo, ...prev]);
    };

    const activeRecord = useMemo(() => records.find(r => r.id === editingRecordId), [records, editingRecordId]);

    const getQrValue = (cat: FolderCategory | 'PROFILE') => {
        if (!activeRecord) return '';
        const folderPrefix = cat !== 'PROFILE' ? `:${cat}` : '';
        return `QRATE_MED:${activeRecord.id}${folderPrefix}:VAULT:${activeRecord.sharedFolderUri || 'AUTH_PENDING'}`;
    };

    const qrImageUrl = (val: string) => `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(val)}&bgcolor=ffffff&color=0f172a&margin=10`;

    return (
        <div className="bg-zinc-950 min-h-[92vh] rounded-[3rem] shadow-2xl animate-fade-in font-mono overflow-hidden flex flex-col relative text-zinc-100 border border-zinc-800">
            <style>{`
                .qr-fixed-square { aspect-ratio: 1/1; width: 100%; display: flex; align-items: center; justify-content: center; background: white; border-radius: 2rem; position: relative; overflow: hidden; }
                .qr-img-large { width: 100%; height: 100%; object-fit: contain; flex-shrink: 0; }
                .qr-profile-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 22%; height: 22%; border-radius: 20%; border: 4px solid white; background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 10; overflow: hidden; }
                @media print { .no-print { display: none !important; } .print-area { display: block !important; } }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
            `}</style>

            <header className="bg-zinc-900 border-b border-zinc-800 px-12 py-8 flex justify-between items-center z-30 shadow-sm no-print">
                <div className="flex items-center space-x-8">
                    <div className="p-4 bg-cyan-600 rounded-3xl shadow-2xl shadow-cyan-900/20">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">QRate Medical</h1>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] mt-2">Health Identity Shard</p>
                    </div>
                </div>

                <div className="flex items-center space-x-8">
                    <div className="flex bg-black/40 p-1.5 rounded-2xl border border-zinc-800">
                        <button onClick={() => setLanguage('EN')} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${language === 'EN' ? 'bg-zinc-800 text-cyan-400' : 'text-zinc-600'}`}>EN</button>
                        <button onClick={() => setLanguage('ES')} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${language === 'ES' ? 'bg-zinc-800 text-cyan-400' : 'text-zinc-600'}`}>ES</button>
                    </div>
                    <button onClick={onReturn} className="p-4 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-white">
                        <ArrowLeft className="w-8 h-8" />
                    </button>
                </div>
            </header>

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 overflow-hidden p-8 lg:p-12 gap-12 bg-black">
                <aside className="lg:col-span-3 space-y-10 no-print">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Active Records</h2>
                        <button onClick={loadDemoData} className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all" title="Load Demo Data">
                            <Sparkles className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-4">
                        {records.length === 0 ? (
                            <div className="bg-zinc-900/40 border-2 border-dashed border-zinc-800 rounded-[2.5rem] p-12 text-center space-y-4 shadow-inner">
                                <User className="w-16 h-16 text-zinc-800 mx-auto" />
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Zero Members</p>
                            </div>
                        ) : (
                            records.map(rec => (
                                <button 
                                    key={rec.id}
                                    onClick={() => { setEditingRecordId(rec.id); setActiveFolder('PROFILE'); setIsCreating(false); }}
                                    className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all flex items-center space-x-4 ${editingRecordId === rec.id ? 'bg-zinc-900 border-cyan-600 shadow-xl scale-[1.02]' : 'bg-zinc-950 border-zinc-800 opacity-60 hover:opacity-100'}`}
                                >
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-zinc-800 bg-zinc-900 flex-shrink-0">
                                        <img src={(rec as any).profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rec.ownerName}`} alt="P" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-black text-white truncate uppercase tracking-tight">{rec.ownerName}</p>
                                        <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-0.5">{rec.relationship}</p>
                                    </div>
                                </button>
                            ))
                        )}
                        <button 
                            onClick={() => { setEditingRecordId(null); setIsCreating(true); }}
                            className="w-full py-6 border-2 border-dashed border-zinc-800 rounded-[2rem] text-zinc-600 hover:text-cyan-500 hover:border-cyan-500 transition-all font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center space-x-4"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New Member</span>
                        </button>
                    </div>
                </aside>

                <div className="lg:col-span-9 bg-zinc-900/20 rounded-[4rem] border border-zinc-800/50 overflow-y-auto custom-scrollbar p-8 lg:p-16 relative">
                    {isCreating ? (
                        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in no-print">
                            <header className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-5xl font-black tracking-tighter text-white uppercase leading-none">{editingRecordId ? 'Update Shard' : 'Initialize Shard'}</h2>
                                    <p className="text-zinc-500 font-bold mt-4 tracking-widest uppercase text-[10px]">Configure identity and digital vault link</p>
                                </div>
                                <button onClick={() => setIsCreating(false)} className="p-4 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-all"><X className="w-8 h-8 text-zinc-500"/></button>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                                <div className="md:col-span-4 space-y-6">
                                     <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative w-full aspect-square rounded-[3.5rem] bg-black border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 transition-all overflow-hidden group shadow-inner"
                                    >
                                        {formRecord.profilePicture ? (
                                            <img src={formRecord.profilePicture} alt="Profile" className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                                        ) : (
                                            <div className="text-center p-8 space-y-4">
                                                <Camera className="w-12 h-12 text-zinc-800 mx-auto" />
                                                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Clinical Portrait</p>
                                            </div>
                                        )}
                                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                    </div>
                                    <p className="text-[8px] text-center text-zinc-600 font-bold uppercase tracking-widest italic">Verification photo required</p>
                                </div>

                                <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-4">Legal Name</label>
                                        <input value={formRecord.ownerName} onChange={e => setFormRecord({...formRecord, ownerName: e.target.value})} className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-5 outline-none focus:border-cyan-600 transition-all shadow-inner font-bold text-white uppercase text-sm" placeholder="Full Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-4">Date of Birth</label>
                                        <input type="date" value={formRecord.dob} onChange={e => setFormRecord({...formRecord, dob: e.target.value})} className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-5 outline-none focus:border-cyan-600 transition-all shadow-inner font-bold text-zinc-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-4">Blood Group</label>
                                        <input value={formRecord.bloodType} onChange={e => setFormRecord({...formRecord, bloodType: e.target.value})} className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-5 outline-none focus:border-cyan-600 transition-all shadow-inner font-bold text-white uppercase text-sm" placeholder="O+, A-, etc." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-4">Emergency Contact</label>
                                        <input value={formRecord.emergencyContact} onChange={e => setFormRecord({...formRecord, emergencyContact: e.target.value})} className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-5 outline-none focus:border-cyan-600 transition-all shadow-inner font-bold text-white text-sm" placeholder="Node Phone" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-4 flex items-center space-x-3">
                                            <Cloud className="w-4 h-4 text-cyan-500"/>
                                            <span>Cloud Vault (Record Link)</span>
                                        </label>
                                        <input value={formRecord.sharedFolderUri} onChange={e => setFormRecord({...formRecord, sharedFolderUri: e.target.value})} className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-5 outline-none focus:border-cyan-600 transition-all shadow-inner font-mono text-xs text-cyan-500" placeholder="https://drive.google.com/..." />
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleCreateOrUpdate} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-8 rounded-[2.5rem] uppercase tracking-[0.4em] text-xs shadow-2xl active:scale-[0.98] transition-all">
                                {editingRecordId ? 'Update Identity Shard' : 'Commit Medical Identity'}
                            </button>
                        </div>
                    ) : activeRecord ? (
                        <div className="animate-fade-in space-y-16 pb-16">
                            <div className="no-print flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-zinc-800 pb-12">
                                <div className="flex items-center space-x-10">
                                    <div className="relative">
                                        <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-zinc-800 shadow-3xl relative z-10 bg-zinc-950">
                                            <img src={(activeRecord as any).profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeRecord.ownerName}`} alt="Profile" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-3 -right-3 bg-cyan-600 p-4 rounded-2xl shadow-xl z-20 border-4 border-zinc-950">
                                            <ShieldCheck className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-5xl font-black tracking-tighter text-white uppercase leading-none">{activeRecord.ownerName}</h2>
                                        <div className="flex flex-wrap items-center gap-8 mt-6">
                                            <span className="bg-cyan-950/40 text-cyan-400 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-900/50">{activeRecord.relationship}</span>
                                            <div className="flex items-center space-x-3">
                                                <Heart className="w-5 h-5 text-rose-500" />
                                                <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">BLOOD: {activeRecord.bloodType || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Monitor className="w-5 h-5 text-cyan-500" />
                                                <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">DOB: {(activeRecord as any).dob || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => window.print()} className="p-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-2xl transition-all border border-zinc-800"><Printer className="w-6 h-6"/></button>
                                    <button onClick={() => handleOpenEdit(activeRecord)} className="p-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-2xl transition-all border border-zinc-800"><Pencil className="w-6 h-6"/></button>
                                    <button onClick={() => handleDelete(activeRecord.id)} className="p-4 bg-zinc-900 hover:bg-rose-950 text-zinc-500 hover:text-rose-500 rounded-2xl transition-all border border-zinc-800"><Trash2 className="w-6 h-6"/></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                <div className="lg:col-span-7 space-y-16">
                                    <section className="space-y-8">
                                        <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.4em] flex items-center space-x-4">
                                            <Database className="w-6 h-6 text-cyan-600"/>
                                            <span>Clinical Resource Hub</span>
                                        </h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            {MEDICAL_FOLDERS.map(folder => (
                                                <button 
                                                    key={folder.id} 
                                                    onClick={() => setActiveFolder(folder.id)}
                                                    className={`p-8 rounded-[2.5rem] border-2 text-left transition-all flex flex-col items-start space-y-6 relative group ${activeFolder === folder.id ? 'bg-cyan-600 text-white border-cyan-500 shadow-2xl scale-[1.03]' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 shadow-sm'}`}
                                                >
                                                    <div className={`p-4 rounded-2xl transition-colors ${activeFolder === folder.id ? 'bg-white/20 text-white' : 'bg-zinc-900 text-zinc-600 border border-zinc-800'}`}>{folder.icon}</div>
                                                    <span className={`text-xs font-black uppercase tracking-widest block ${activeFolder === folder.id ? 'text-white' : 'text-zinc-400'}`}>{folder.label}</span>
                                                    {activeFolder === folder.id && <div className="absolute top-6 right-6 w-2 h-2 bg-white rounded-full animate-ping"></div>}
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-10">
                                        <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.4em] flex items-center space-x-4">
                                            <Cloud className="w-6 h-6 text-cyan-600"/>
                                            <span>Distributed Sync Node</span>
                                        </h3>
                                        <div className="bg-zinc-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-zinc-800">
                                            <div className="absolute top-0 right-0 p-10 opacity-5"><Cloud className="w-80 h-80"/></div>
                                            <div className="relative z-10">
                                                <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest mb-6">P2P Vault Pointer</p>
                                                <p className="text-sm font-mono text-zinc-400 break-all mb-10 bg-black/60 p-8 rounded-2xl border border-zinc-800 leading-relaxed">{activeRecord.sharedFolderUri || 'NODE_OFFLINE'}</p>
                                                <div className="flex flex-wrap gap-6">
                                                    <a href={activeRecord.sharedFolderUri} target="_blank" rel="noopener noreferrer" className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-10 rounded-2xl text-[10px] uppercase tracking-widest flex items-center space-x-4 shadow-xl active:scale-95 transition-all">
                                                        <Globe className="w-5 h-5"/>
                                                        <span>Launch Cloud Ledger</span>
                                                    </a>
                                                    <button className="bg-white/5 hover:bg-white/10 text-white font-black py-4 px-10 rounded-2xl text-[10px] uppercase tracking-widest flex items-center space-x-4 border border-zinc-800 active:scale-95 transition-all">
                                                        <RefreshCw className="w-5 h-5"/>
                                                        <span>Sync Assets</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="lg:col-span-5 space-y-12 no-print">
                                    <div className="bg-zinc-950 border-4 border-zinc-900 p-10 rounded-[4rem] text-center space-y-10 shadow-3xl">
                                        <div className="space-y-6">
                                            <div className="w-20 h-20 bg-cyan-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-cyan-900/20">
                                                <QrCode className="w-10 h-10 text-white" />
                                            </div>
                                            <h4 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">
                                                {activeFolder === 'PROFILE' ? 'Master Shard' : MEDICAL_FOLDERS.find(f => f.id === activeFolder)?.label}
                                            </h4>
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">Identity Signature</p>
                                        </div>
                                        
                                        <div className="qr-fixed-square border-[15px] border-white shadow-2xl hover:scale-[1.02] transition-transform duration-1000 group cursor-pointer relative">
                                            <img src={qrImageUrl(getQrValue(activeFolder))} alt="Main QR" className="qr-img-large" />
                                            
                                            <div className="qr-profile-overlay flex items-center justify-center border-[4px] border-white shadow-2xl scale-110">
                                                <img 
                                                  src={(activeRecord as any).profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeRecord.ownerName}`} 
                                                  alt="QR Icon" 
                                                  className="w-full h-full object-cover scale-110"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-8 bg-zinc-900/40 rounded-[2.5rem] border-2 border-zinc-800 border-dashed">
                                          <p className="text-[9px] text-zinc-500 font-black leading-relaxed uppercase tracking-widest italic">
                                              SUBMIT THIS SHARD TO MEDICAL TERMINALS FOR INSTANT CLINICAL HISTORY INGESTION.
                                          </p>
                                        </div>

                                        <button onClick={() => window.print()} className="w-full bg-white text-black font-black py-6 rounded-2xl uppercase tracking-[0.4em] text-[10px] flex items-center justify-center space-x-6 shadow-xl active:scale-95 transition-all">
                                            <Printer className="w-6 h-6" />
                                            <span>Export Secure Shard</span>
                                        </button>
                                    </div>

                                    <div className="bg-black rounded-[3rem] p-10 text-center relative overflow-hidden shadow-inner border border-zinc-900">
                                        <div className="absolute top-6 left-6 flex items-center space-x-3 opacity-40">
                                            <ShieldCheck className="w-5 h-5 text-emerald-500"/>
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">RSA-4096</span>
                                        </div>
                                        <div className="mt-8 space-y-4">
                                            <p className="text-[8px] text-zinc-700 font-bold leading-relaxed italic px-4 uppercase">
                                                "Transparency is the foundation of modern care. Shared data saves lives."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-16">
                            <div className="relative">
                                <div className="absolute -inset-20 bg-cyan-500/5 blur-[100px] animate-pulse"></div>
                                <div className="relative p-24 bg-zinc-900/40 border-4 border-zinc-800 rounded-[8rem] shadow-inner">
                                    <Heart className="w-48 h-48 text-zinc-800" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-5xl font-black uppercase text-white tracking-tighter leading-none">Health Identity Gateway</h3>
                                <p className="text-xs text-zinc-600 font-black uppercase tracking-[0.5em] max-w-2xl mx-auto leading-relaxed">
                                    INITIALIZE SECURE CLINICAL SHARDS FOR FAMILY MEMBERS TO ENABLE P2P RECORDS SHARING.
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-8">
                                <button onClick={() => setIsCreating(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-8 px-20 rounded-[3rem] uppercase tracking-[0.4em] text-[10px] shadow-2xl active:scale-95 transition-all">Materialize Shard</button>
                                <button onClick={loadDemoData} className="bg-zinc-950 border-2 border-zinc-800 text-zinc-500 font-black py-8 px-16 rounded-[3rem] uppercase tracking-[0.4em] text-[10px] transition-all hover:bg-zinc-900 active:scale-95">Sync Sample Node</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MedicalOutpostView;
