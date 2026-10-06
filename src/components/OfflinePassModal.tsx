import React from 'react';
import { 
  X, 
  Printer, 
  MapPin, 
  Calendar, 
  Users, 
  PhoneCall, 
  ShieldCheck, 
  Hotel, 
  Sparkles, 
  Download, 
  QrCode,
  Plane,
  Clock,
  Compass
} from 'lucide-react';
import { Itinerary } from '../types/itinerary';
import { TripFormData } from '../types/travel';

interface OfflinePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: Itinerary;
  plannerData: TripFormData;
}

export const OfflinePassModal: React.FC<OfflinePassModalProps> = ({
  isOpen,
  onClose,
  itinerary,
  plannerData,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const passCode = `TG-${itinerary.destination.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const currency = itinerary.currency || plannerData.currency || 'INR';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pass Top Ribbon */}
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-indigo-700 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-200 block">
                  TripGenie AI • Offline Pass
                </span>
                <h3 className="text-xl font-black tracking-tight">{itinerary.destination} Travel Card</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/20 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-sky-200 block">Pass Code</span>
              <span className="font-mono font-bold text-sm tracking-wider">{passCode}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-sky-200 block">Dates</span>
              <span className="font-bold">{plannerData.startDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-sky-200 block">Duration</span>
              <span className="font-bold">{itinerary.days?.length || 3} Days ({plannerData.numberOfTravelers} pax)</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-sky-200 block">Est. Budget</span>
              <span className="font-bold">{currency} {itinerary.totalEstimatedCost?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Boarding Pass Notch Decorator */}
        <div className="relative flex items-center justify-between px-6 py-2 bg-slate-50 border-y border-dashed border-slate-300">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Keep this accessible without internet • Emergency verification
          </span>
          <span className="text-[10px] font-mono font-bold text-slate-500">
            Gemma 4 31B Verified
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Emergency & Offline Help Section */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Offline Emergency & Tourist Assistance</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-rose-950 font-medium">
              <div className="bg-white p-2.5 rounded-xl border border-rose-100">
                <span className="text-[10px] text-rose-600 block font-bold">Police / Distress</span>
                <span className="font-mono font-extrabold text-sm">112 / 100</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-rose-100">
                <span className="text-[10px] text-rose-600 block font-bold">Ambulance</span>
                <span className="font-mono font-extrabold text-sm">108 / 102</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-rose-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-rose-600 block font-bold">Tourist Helpline</span>
                <span className="font-mono font-extrabold text-sm">1363 (Toll Free)</span>
              </div>
            </div>
          </div>

          {/* Accommodation Anchor */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <Hotel className="w-4 h-4 text-indigo-600" />
              <span>Recommended Accommodation Base</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {typeof itinerary.accommodationSuggestions?.[0] === 'string'
                ? itinerary.accommodationSuggestions[0]
                : (itinerary.accommodationSuggestions?.[0] as any)?.name || 'Central Neighborhood Resort & Suites'}
            </p>
            <span className="text-[11px] text-slate-400 block italic">
              Show this location to local taxi or auto-rickshaw drivers if data reception drops.
            </span>
          </div>

          {/* Quick Day-by-Day Glance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Daily Itinerary Quick Index
              </span>
              <span className="text-[11px] text-slate-400">Offline Highlights</span>
            </div>

            <div className="space-y-2">
              {itinerary.days?.map((day) => (
                <div key={day.day} className="p-3 rounded-xl bg-slate-50/70 border border-slate-200 flex items-start gap-3 text-xs">
                  <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                    {day.day}
                  </span>
                  <div className="flex-1 space-y-1">
                    <span className="font-bold text-slate-900 block">{day.title}</span>
                    <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5">
                      {day.morning?.activity && <span>• 🌅 {day.morning.activity}</span>}
                      {day.afternoon?.activity && <span>• ☀️ {day.afternoon.activity}</span>}
                      {day.evening?.activity && <span>• 🌙 {day.evening.activity}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400">
            Tip: Screenshot this pass or print to keep in your luggage.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
