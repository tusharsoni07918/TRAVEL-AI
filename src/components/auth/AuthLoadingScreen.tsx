import React from 'react';
import { Compass, Sparkles, Loader2 } from 'lucide-react';

export const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-sm mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Brand Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-sky-500/20 animate-pulse">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Title and message */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">
              TripGenie <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">AI</span>
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-950/80 text-sky-300 border border-sky-800">
              <Sparkles className="w-2.5 h-2.5" />
              Gemma 4
            </span>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            Preparing your personalized travel space...
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center gap-2.5 text-xs text-sky-400 font-semibold pt-2">
          <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
          <span>Verifying secure session</span>
        </div>
      </div>
    </div>
  );
};
