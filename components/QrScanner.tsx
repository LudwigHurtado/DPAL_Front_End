
import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, Loader, ShieldCheck, Target, RefreshCw } from './icons';

interface QrScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScan, onClose }) => {
    const [status, setStatus] = useState<'requesting' | 'active' | 'error'>('requesting');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                let stream;
                try {
                    // Try to get environment facing camera first with standard constraints
                    stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { 
                            facingMode: { ideal: 'environment' },
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        } 
                    });
                } catch (e) {
                    // If complex constraints fail, try the simplest possible request
                    stream = await navigator.mediaDevices.getUserMedia({ 
                        video: true 
                    });
                }
                
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    // Wait for video to be ready before marking as active
                    videoRef.current.onloadedmetadata = () => {
                        setStatus('active');
                        videoRef.current?.play().catch(console.error);
                    };
                }
            } catch (err) {
                console.error("Camera access failed", err);
                setStatus('error');
            }
        };

        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Simulated scanner for the purpose of the prototype
    const handleSimulateScan = () => {
        const dummyParcel = {
            id: 'PARCEL-SIM',
            type: 'credits',
            amount: 500,
            sender: 'Admin_Node',
            isClaimed: false,
            timestamp: Date.now()
        };
        const baseUrl = window.location.origin;
        onScan(`${baseUrl}?parcelId=${encodeURIComponent(JSON.stringify(dummyParcel))}`);
    };

    return (
        <div className="relative w-full max-w-lg aspect-square bg-black rounded-[3rem] border-4 border-zinc-800 overflow-hidden shadow-2xl group">
            {/* HUD OVERLAY */}
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center">
                 {/* Crosshair */}
                 <div className="relative w-64 h-64 border-2 border-cyan-500/20 rounded-3xl flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl animate-pulse"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-xl animate-pulse"></div>
                    
                    <div className="w-1 h-32 bg-cyan-500/5 absolute animate-scan-y"></div>
                 </div>

                 <div className="mt-8 flex flex-col items-center space-y-2">
                    <p className="text-[10px] font-black uppercase text-cyan-400 animate-pulse tracking-[0.3em]">Align_Shard_With_Sensors</p>
                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Auto_Capture_Enabled</p>
                 </div>
            </div>

            {status === 'requesting' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10 space-y-4">
                    <Loader className="w-10 h-10 animate-spin text-cyan-500" />
                    <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Calibrating_Optics...</p>
                </div>
            )}

            {status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10 p-12 text-center space-y-6">
                    <div className="p-4 bg-rose-500/20 rounded-full border border-rose-500/30">
                        <Camera className="w-10 h-10 text-rose-500" />
                    </div>
                    <div>
                        <p className="text-xl font-black uppercase tracking-tighter text-white">Sensor_Failure</p>
                        <p className="text-xs text-zinc-500 mt-2">Could not initialize system camera. Manual sync required.</p>
                    </div>
                    <button onClick={handleSimulateScan} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black py-4 px-8 rounded-2xl uppercase text-[10px] tracking-widest border border-zinc-700 transition-all">
                        Simulate_Sync (500 HC Shard)
                    </button>
                </div>
            )}

            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
            />

            <canvas ref={canvasRef} className="hidden" />

            <style>{`
                @keyframes scanY {
                    0% { transform: translateY(-32px); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: translateY(32px); opacity: 0; }
                }
                .animate-scan-y { animation: scanY 2s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default QrScanner;
