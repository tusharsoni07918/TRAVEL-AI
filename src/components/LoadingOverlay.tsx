import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, Calendar, Wallet, CheckCircle2, RefreshCw } from 'lucide-react';

interface LoadingOverlayProps {
  destination: string;
  mode?: 'generate' | 'regenerate';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ destination, mode = 'generate' }) => {
  const generateSteps = [
    { text: 'Understanding your travel preferences...', icon: Sparkles, color: 'text-sky-500' },
    { text: 'Planning your perfect route...', icon: MapPin, color: 'text-indigo-500' },
    { text: 'Optimizing your budget...', icon: Wallet, color: 'text-teal-500' },
    { text: "Finding experiences you'll love...", icon: Compass, color: 'text-amber-500' },
    { text: 'Creating your personalized itinerary...', icon: Calendar, color: 'text-rose-500' },
  ];

  const regenerateSteps = [
    { text: 'Replanning your adventure...', icon: RefreshCw, color: 'text-sky-500' },
    { text: 'Optimizing your itinerary...', icon: Compass, color: 'text-indigo-500' },
    { text: 'Gemma is creating a better plan...', icon: Sparkles, color: 'text-teal-500' },
    { text: 'Almost ready...', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  const steps = mode === 'regenerate' ? regenerateSteps : generateSteps;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [steps.length]);

  const currentStep = steps[currentStepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 text-center space-y-6 relative overflow-hidden">
        
        {/* Animated background gradient progress */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 via-indigo-600 to-teal-400 transition-all duration-500 ease-out"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Central Icon Spinner */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-teal-400 animate-spin opacity-20 blur-md" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/25">
            <StepIcon className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Text and Status */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            <span>Gemma 4 31B IT Engine</span>
          </div>

          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {mode === 'regenerate' ? 'Regenerating Itinerary' : `Crafting Your ${destination ? `${destination} ` : ''}Adventure`}
          </h3>

          <p className="text-sm font-semibold text-slate-600 min-h-[24px] transition-all duration-300">
            {currentStep.text}
          </p>
        </div>

        {/* Visual Step Checklist */}
        <div className="space-y-2 pt-2 text-left bg-slate-50/80 rounded-2xl p-4 border border-slate-100 text-xs">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div 
                key={idx} 
                className={`flex items-center gap-2.5 transition-colors ${
                  isCompleted 
                    ? 'text-emerald-700 font-medium' 
                    : isCurrent 
                      ? 'text-slate-900 font-bold' 
                      : 'text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-sky-500 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className="truncate">{step.text}</span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400">
          Powered by Google Gemma 4 31B IT • Precision route planning & budget balancing
        </p>
      </div>
    </div>
  );
};
