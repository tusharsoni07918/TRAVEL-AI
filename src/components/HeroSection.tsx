import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  Compass, 
  CheckCircle2,
  Sun,
  Camera,
  Star
} from 'lucide-react';

interface HeroSectionProps {
  onPlanTripClick: () => void;
  onTryDemoClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPlanTripClick,
  onTryDemoClick,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-sky-50/50 via-white to-slate-50">
      {/* Background ambient gradient blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
        <div className="absolute top-32 left-1/2 w-72 h-72 bg-teal-200/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200/80 text-sky-800 text-xs font-semibold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
              <span>Next-Gen Travel Intelligence</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">Your Journey. Your Budget. Your Perfect Plan.</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Your Next Adventure, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-500">
                Planned by AI.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Discover personalized itineraries, smarter budgets, and unforgettable experiences — all tailored to your travel style.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onPlanTripClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white font-bold text-base shadow-lg shadow-sky-600/25 hover:shadow-xl hover:shadow-sky-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 group"
              >
                <span>Plan My Trip</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onTryDemoClick}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-sky-300 text-slate-800 font-bold text-base shadow-xs hover:bg-sky-50/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>View Live Demo Dashboard</span>
              </button>
            </div>

            {/* Trust & Stat Indicators */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-sky-100/70 text-sky-700 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Personalized Plans</div>
                  <div className="text-[11px] text-slate-500">100% Customized</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-100/70 text-indigo-700 shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Smart Budgeting</div>
                  <div className="text-[11px] text-slate-500">Zero Guesswork</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-teal-100/70 text-teal-700 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">AI Powered</div>
                  <div className="text-[11px] text-slate-500">Instant Schedule</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Travel Showcase Card */}
          <div className="lg:col-span-5 relative">
            {/* Decorative background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-3xl blur-2xl opacity-20 -rotate-2 scale-95" />

            {/* Travel Showcase Card */}
            <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-slate-100 shadow-2xl space-y-5">
              
              {/* Card Header with Destination Image Banner */}
              <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-400 via-sky-500 to-indigo-600 shadow-md">
                {/* Simulated destination aesthetic overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/60" />
                
                {/* Floating Destination Badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-slate-900">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Goa, India</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md font-semibold">
                    Popular
                  </span>
                </div>

                {/* Floating Rating */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>4.9</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between text-white">
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight">Tropical Getaway</h3>
                    <p className="text-xs text-white/90 font-medium flex items-center gap-1.5 mt-0.5">
                      <Sun className="w-3.5 h-3.5 text-amber-300" />
                      <span>28°C Sunny • Coastal Vibe</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-sky-200 font-semibold block">Budget</span>
                    <span className="text-lg font-black text-white">₹15,000</span>
                  </div>
                </div>
              </div>

              {/* Quick Trip Snapshot Specs */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Duration</div>
                  <div className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>3 Days</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Travelers</div>
                  <div className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>2 (Couple)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Pace</div>
                  <div className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                    <Compass className="w-3.5 h-3.5 text-teal-600" />
                    <span>Balanced</span>
                  </div>
                </div>
              </div>

              {/* Sample Day Breakdown Teaser */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>SAMPLE AI TIMETABLE</span>
                  <span className="text-sky-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Auto-Optimized
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-sky-50/70 border border-sky-100/80 text-xs">
                    <span className="font-bold text-sky-800 px-2 py-0.5 rounded-md bg-white border border-sky-200">Day 1</span>
                    <span className="text-slate-700 font-medium truncate">Anjuna Flea Market & Sunset at Curlies Beach</span>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100/80 text-xs">
                    <span className="font-bold text-indigo-800 px-2 py-0.5 rounded-md bg-white border border-indigo-200">Day 2</span>
                    <span className="text-slate-700 font-medium truncate">Old Goa Latin Quarter, Spice Plantation & Water Sports</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <button
                onClick={onTryDemoClick}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs hover:from-sky-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore Live Itinerary Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
