
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Hero } from '../types';
import { Send, ShieldCheck, User, Zap, Loader, Camera, X, Broadcast, Maximize2, Mic, Play, Square, Volume2, Paperclip, MapPin } from './icons';

interface MissionChatroomProps {
    missionId: string;
    messages: ChatMessage[];
    onSendMessage: (text: string, imageUrl?: string, audioUrl?: string) => void;
    hero: Hero;
}

const AudioPlayer: React.FC<{ url: string }> = ({ url }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
    };

    return (
        <div className="flex items-center space-x-4 bg-black/40 p-4 rounded-2xl border border-emerald-500/20 w-full max-w-[280px]">
            <button type="button" onClick={togglePlay} className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white hover:bg-emerald-500 transition-all shadow-xl active:scale-95">
                {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
            </button>
            <div className="flex-grow space-y-2">
                <div className="flex items-end justify-between gap-1 h-4">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className={`w-1 rounded-full bg-emerald-500/40 ${isPlaying ? 'animate-waveform' : ''}`} style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}/>
                    ))}
                </div>
                <p className="text-[8px] font-black text-emerald-500/60 uppercase tracking-[0.2em]">AUDIO_LOG_SHARD</p>
            </div>
            <audio ref={audioRef} src={url} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} className="hidden"/>
        </div>
    );
};

const MissionChatroom: React.FC<MissionChatroomProps> = ({ missionId, messages, onSendMessage, hero }) => {
    const [inputText, setInputText] = useState('');
    const [attachment, setAttachment] = useState<string | null>(null);
    const [audioAttachment, setAudioAttachment] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAudioAttachment(reader.result as string);
                };
                reader.readAsDataURL(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Also start STT for live transcription
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.lang = 'en-US';
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.onresult = (event: any) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        transcript += event.results[i][0].transcript;
                    }
                    setInputText(prev => transcript);
                };
                recognitionRef.current = recognition;
                recognition.start();
            }
        } catch (err) {
            console.error("Recording failed", err);
            alert("Microphone access denied or unavailable.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            recognitionRef.current?.stop();
            setIsRecording(false);
        }
    };

    const handleVoiceToggle = () => {
        if (isRecording) stopRecording();
        else startRecording();
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() && !attachment && !audioAttachment) return;
        onSendMessage(inputText.trim(), attachment || undefined, audioAttachment || undefined);
        setInputText('');
        setAttachment(null);
        setAudioAttachment(null);
    };

    const handleShareLocation = () => {
        if (!navigator.geolocation) return;
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const text = `[GEOSPATIAL_SIGNAL]: Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)} // Verified by Device_OS.`;
                onSendMessage(text);
                setIsLocating(false);
            },
            () => setIsLocating(false),
            { timeout: 8000 }
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAttachment(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col min-h-[600px] h-full bg-zinc-950 font-mono relative">
            <style>{`
                @keyframes waveform { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.4); } }
                .animate-waveform { animation: waveform 0.8s ease-in-out infinite; }
                @keyframes mic-pulse { 0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(244, 63, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); } }
                .animate-mic-pulse { animation: mic-pulse 2s infinite; }
            `}</style>

            {/* LIGHTBOX */}
            {selectedImage && (
                <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in" onClick={() => setSelectedImage(null)}>
                    <button type="button" className="absolute top-10 right-10 p-4 bg-zinc-900 rounded-full text-white border border-zinc-800 shadow-2xl hover:bg-zinc-800 transition-all"><X className="w-8 h-8"/></button>
                    <div className="relative max-w-full max-h-full rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-[0_0_100px_rgba(6,182,212,0.2)]">
                        <img src={selectedImage} alt="Shard Preview" className="max-w-full max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
                    </div>
                </div>
            )}

            {/* CHANNEL INFO */}
            <div className="bg-zinc-900/60 border-b border-zinc-800 px-8 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">CHANNEL_SYNC: {missionId.substring(0, 8).toUpperCase()}</span>
                </div>
                {isRecording && (
                    <div className="flex items-center space-x-2 text-rose-500 text-[10px] font-black uppercase animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                        <span>Recording_Vox...</span>
                    </div>
                )}
            </div>

            {/* MESSAGES */}
            <div ref={scrollRef} className="flex-grow p-8 space-y-8 overflow-y-auto custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] opacity-10 space-y-6">
                        <Broadcast className="w-16 h-16 text-zinc-600" />
                        <p className="text-sm font-black uppercase tracking-[0.6em]">Establishing_Link...</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isSelf = msg.sender === hero.name;
                        if (msg.isSystem) {
                            return (
                                <div key={msg.id} className="flex justify-center my-6">
                                    <div className="bg-zinc-900/60 px-6 py-2 rounded-full border border-zinc-800/80 shadow-xl">
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{msg.text}</span>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div key={msg.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} space-y-2`}>
                                <div className="flex items-center space-x-3 text-[10px] font-black text-zinc-600 uppercase px-3">
                                    {!isSelf && <span className="text-cyan-600">OP_{msg.sender.substring(0, 10)}</span>}
                                    <span className="opacity-40">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className={`max-w-[80%] p-6 rounded-[2rem] text-sm relative group transition-all duration-300 shadow-2xl border-2 ${
                                    isSelf ? 'bg-emerald-950/20 border-emerald-500/30 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                                }`}>
                                    {msg.imageUrl && (
                                        <div className="mb-4 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl cursor-zoom-in group-hover:border-emerald-500/50 transition-colors" onClick={() => setSelectedImage(msg.imageUrl || null)}>
                                            <img src={msg.imageUrl} alt="Artifact" className="w-full h-auto object-cover opacity-90 grayscale group-hover:grayscale-0 transition-all duration-700" />
                                        </div>
                                    )}
                                    {msg.audioUrl && <div className="mb-4"><AudioPlayer url={msg.audioUrl} /></div>}
                                    {msg.text && <p className="leading-relaxed whitespace-pre-wrap font-medium text-base">{msg.text}</p>}
                                    <div className={`absolute bottom-[-22px] ${isSelf ? 'right-4' : 'left-4'} opacity-0 group-hover:opacity-100 transition-all flex items-center space-x-2 bg-black px-3 py-1 rounded-lg border border-zinc-800 z-10`}>
                                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                        <span className="text-[8px] font-mono text-emerald-700 uppercase font-black tracking-widest">VERIFIED_BLOCK_HASH: {msg.ledgerProof.substring(0, 12)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* INPUT FOOTER */}
            <div className="p-8 bg-zinc-900 border-t border-zinc-800 flex-shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                {(attachment || audioAttachment) && (
                    <div className="flex items-center space-x-4 p-4 bg-zinc-950 rounded-2xl border border-emerald-500/40 mb-6 animate-fade-in shadow-inner">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-emerald-500/20 flex items-center justify-center">
                            {attachment ? <img src={attachment} alt="P" className="w-full h-full object-cover" /> : <Volume2 className="w-6 h-6 text-emerald-400"/>}
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{attachment ? 'IMAGE_ARTIFACT_QUEUED' : 'AUDIO_PACKET_BUFFERED'}</span>
                        <button type="button" onClick={() => { setAttachment(null); setAudioAttachment(null); }} className="ml-auto p-2 text-zinc-500 hover:text-rose-500 transition-colors"><X className="w-6 h-6"/></button>
                    </div>
                )}
                
                <form onSubmit={handleSend} className="flex items-center gap-4 w-full">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-4 rounded-2xl border-2 border-zinc-800 text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-xl active:scale-90" title="Attach Shard">
                        <Paperclip className="w-6 h-6" />
                    </button>
                    <button type="button" onClick={handleShareLocation} disabled={isLocating} className={`p-4 rounded-2xl border-2 border-zinc-800 text-zinc-500 hover:text-rose-400 hover:border-rose-500/50 transition-all shadow-xl active:scale-90 ${isLocating ? 'animate-pulse text-emerald-400' : ''}`} title="Share Location">
                        <MapPin className="w-6 h-6" />
                    </button>

                    <div className="w-px h-10 bg-zinc-800 mx-1"></div>

                    <button 
                        type="button" 
                        onClick={handleVoiceToggle}
                        className={`p-4 rounded-2xl border-2 transition-all shadow-xl active:scale-90 ${isRecording ? 'bg-rose-600 border-rose-400 text-white animate-mic-pulse' : 'border-zinc-800 text-zinc-500 hover:text-rose-500'}`} 
                        title={isRecording ? "Stop Recording" : "Record Voice Note"}
                    >
                        {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-6 h-6" />}
                    </button>
                    
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={isRecording ? "Transcribing operative vox..." : isLocating ? "Awaiting GPS coordinates..." : "Input analytical broadcast data..."}
                        className={`flex-grow bg-zinc-950 border-2 border-zinc-800 rounded-2xl px-8 py-5 text-base font-bold focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-zinc-800 shadow-inner ${isRecording ? 'border-rose-500/30' : ''}`}
                    />
                    
                    <button type="submit" disabled={!inputText.trim() && !attachment && !audioAttachment} className="p-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl disabled:opacity-20 transition-all shadow-2xl active:scale-95 border-b-4 border-emerald-800">
                        <Send className="w-7 h-7" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MissionChatroom;
