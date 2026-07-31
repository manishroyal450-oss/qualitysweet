import React, { useState, useEffect } from 'react';
import { WifiOff, Radio, RefreshCw } from 'lucide-react';

export default function OfflineOverlay() {
  const [isOffline, setIsOffline] = useState<boolean>(() => !navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
      id="offline-overlay"
      style={{ touchAction: 'none' }}
    >
      <div 
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200"
        id="offline-card"
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-3xl shadow-inner animate-pulse">
            📡
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full shadow-sm">
            <WifiOff className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
            Currently Offline
          </h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Please check your internet connection
          </p>
        </div>

        <div className="pt-2 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-400" />
            <span>Waiting for connection...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
