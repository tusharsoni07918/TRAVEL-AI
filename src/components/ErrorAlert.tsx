import React from 'react';
import { AlertCircle, RefreshCw, Cpu, ShieldAlert, Sparkles, Layout } from 'lucide-react';
import { GenerationError } from '../types/itinerary';

interface ErrorAlertProps {
  error: GenerationError;
  onRetry: () => void;
  onDismiss?: () => void;
  onLoadSamplePreview?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onRetry,
  onDismiss,
  onLoadSamplePreview,
}) => {
  return (
    <div className="my-6 p-6 rounded-3xl bg-rose-50/90 border-2 border-rose-200 text-slate-800 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-rose-900">
              Unable to generate your itinerary right now.
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-200/60 text-rose-800 border border-rose-300">
              {error.type}
            </span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {error.message || 'Unable to generate your itinerary right now. Your trip details are safe. Please try again.'}
          </p>

          {/* Model Targeted & Configuration Diagnosis */}
          <div className="pt-2 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Cpu className="w-4 h-4 text-rose-600" />
              <span>Target Model: <strong className="font-mono text-slate-900">{error.modelTargeted || 'gemma-4-31b-it'}</strong></span>
            </div>

            {error.diagnosticDetails && (
              <div className="mt-1 p-3 rounded-xl bg-white/80 border border-rose-200 font-mono text-[11px] text-rose-800 leading-relaxed break-words">
                <span className="font-sans font-bold block mb-0.5 text-slate-800">Configuration Diagnostics:</span>
                {error.diagnosticDetails}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-rose-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-600">
          All your destination, dates, budget, and travel preferences are safely preserved.
        </div>

        <div className="flex items-center gap-2.5">
          {onLoadSamplePreview && (
            <button
              onClick={onLoadSamplePreview}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition flex items-center gap-1.5"
              title="Preview complete Itinerary Dashboard layout"
            >
              <Layout className="w-3.5 h-3.5 text-indigo-600" />
              <span>Preview Dashboard Layout</span>
            </button>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-rose-100 transition"
            >
              Dismiss
            </button>
          )}

          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition shadow-md shadow-rose-600/20 flex items-center gap-2 group"
          >
            <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform" />
            <span>Retry Generation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
