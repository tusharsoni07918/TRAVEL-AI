import React from 'react';
import { 
  Sparkles, 
  Wallet, 
  Bot, 
  Sliders, 
  Calendar, 
  Bookmark,
  Check,
  ArrowRight
} from 'lucide-react';

interface FeaturesSectionProps {
  onPlanTripClick: () => void;
  onMyTripsClick: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  onPlanTripClick,
  onMyTripsClick,
}) => {
  const features = [
    {
      title: 'Personalized Itineraries',
      description: 'Zero generic cookie-cutter plans. Every activity, restaurant, and route reflects your exact travel pace and group dynamics.',
      icon: Sparkles,
      color: 'bg-sky-50 text-sky-600',
      tag: 'Hyper-Personalized'
    },
    {
      title: 'Smart Budget Planning',
      description: 'Accurate cost forecasting covering stays, dining, transport, and leisure so you never encounter surprise travel bills.',
      icon: Wallet,
      color: 'bg-indigo-50 text-indigo-600',
      tag: 'Zero Overspending'
    },
    {
      title: 'AI Travel Assistant',
      description: 'Intelligent recommendations tailored for your preferences—from hidden gems to local culinary recommendations.',
      icon: Bot,
      color: 'bg-teal-50 text-teal-600',
      tag: '24/7 Intelligence'
    },
    {
      title: 'Flexible Trip Customization',
      description: 'Swap activities, modify duration on the fly, adjust transportation preferences, and re-balance your itinerary with ease.',
      icon: Sliders,
      color: 'bg-amber-50 text-amber-600',
      tag: 'Total Control'
    },
    {
      title: 'Day-by-Day Planning',
      description: 'Chronologically arranged timetables minimizing transit backtrack. Morning, afternoon, and evening flows mapped with precision.',
      icon: Calendar,
      color: 'bg-rose-50 text-rose-600',
      tag: 'Optimized Routes'
    },
    {
      title: 'Saved Trips',
      description: 'Store multiple upcoming journeys, revisit previous itineraries, share links with travel companions, and access plans anytime.',
      icon: Bookmark,
      color: 'bg-purple-50 text-purple-600',
      tag: 'Offline Ready'
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Modern Explorers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Features Designed for Stress-Free Travel
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Everything you need to orchestrate the perfect getaway without spending 20 hours reading travel blogs.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/60 rounded-3xl p-8 border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-xl hover:shadow-slate-100 transition-all hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-slate-500 border border-slate-100">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100/80 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Included in Free Tier</span>
                  {feature.title === 'Saved Trips' ? (
                    <button
                      onClick={onMyTripsClick}
                      className="text-sky-600 hover:text-sky-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>View Trips</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={onPlanTripClick}
                      className="text-sky-600 hover:text-sky-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Try It</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
