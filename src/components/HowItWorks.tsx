import React from 'react';
import { Sliders, Sparkles, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onPlanTripClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onPlanTripClick }) => {
  const steps = [
    {
      step: '01',
      title: 'Tell us your preferences',
      description: 'Choose your destination, travel dates, budget, group style, and favorite hobbies. Every parameter guides the generator.',
      icon: Sliders,
      badge: 'Step 1 • Input',
      color: 'from-sky-500 to-blue-600',
      tag: 'Custom Details'
    },
    {
      step: '02',
      title: 'AI creates your itinerary',
      description: 'Our engine balances travel distances, opening hours, local weather patterns, and budget allocation to build a coherent schedule.',
      icon: Sparkles,
      badge: 'Step 2 • Generation',
      color: 'from-indigo-500 to-purple-600',
      tag: 'Real-Time Curation'
    },
    {
      step: '03',
      title: 'Travel smarter',
      description: 'Access your optimized day-by-day plan with interactive maps, transit recommendations, and curated restaurant spots.',
      icon: Compass,
      badge: 'Step 3 • Adventure',
      color: 'from-teal-500 to-emerald-600',
      tag: 'Seamless Journey'
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50/60 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How TripGenie AI Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            From rough idea to full travel itinerary in under 60 seconds.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step}
                className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:shadow-slate-200/80 transition-all hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                {/* Step indicator watermark */}
                <div className="absolute top-6 right-6 text-4xl font-black text-slate-100 group-hover:text-sky-100 transition-colors pointer-events-none select-none">
                  {item.step}
                </div>

                <div>
                  {/* Step Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    {item.badge}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-600">
                    {item.tag}
                  </span>
                  <span className="text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-xl font-bold tracking-tight">Ready to map out your next vacation?</h4>
            <p className="text-xs sm:text-sm text-sky-100 mt-1">
              Test with our Goa demo or build your dream destination from scratch.
            </p>
          </div>
          <button
            onClick={onPlanTripClick}
            className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition shadow-md shrink-0"
          >
            Start Planning Now
          </button>
        </div>

      </div>
    </section>
  );
};
