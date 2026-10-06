import React, { useState } from 'react';
import { Sun, Compass, Moon, Clock, MapPin, ExternalLink, Wallet, Image as ImageIcon } from 'lucide-react';
import { Activity } from '../types/itinerary';
import { getActivityLocationImage } from '../services/activityImageService';

interface ActivityCardProps {
  activity: Activity;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  destination: string;
  currency: string;
  formatCost: (cost?: number) => string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  timeOfDay,
  destination,
  currency,
  formatCost,
}) => {
  const [imageError, setImageError] = useState(false);

  const initialImageUrl = getActivityLocationImage(
    activity.activity,
    destination,
    timeOfDay,
    activity.imageUrl
  );

  const config = {
    morning: {
      title: 'Morning',
      icon: Sun,
      bg: 'bg-amber-50/50 dark:bg-amber-950/20',
      border: 'border-amber-200/70 dark:border-amber-900/40',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200',
      iconColor: 'text-amber-600 dark:text-amber-400',
      buttonBg: 'bg-amber-100/80 hover:bg-amber-200/80 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-300/60 dark:border-amber-800',
      costBg: 'bg-amber-100/70 dark:bg-amber-900/30 text-amber-950 dark:text-amber-100 border-amber-200 dark:border-amber-800/60',
    },
    afternoon: {
      title: 'Afternoon',
      icon: Compass,
      bg: 'bg-sky-50/50 dark:bg-sky-950/20',
      border: 'border-sky-200/70 dark:border-sky-900/40',
      badgeBg: 'bg-sky-100 dark:bg-sky-900/50 text-sky-900 dark:text-sky-200',
      iconColor: 'text-sky-600 dark:text-sky-400',
      buttonBg: 'bg-sky-100/80 hover:bg-sky-200/80 dark:bg-sky-900/40 dark:hover:bg-sky-900/60 text-sky-900 dark:text-sky-200 border-sky-300/60 dark:border-sky-800',
      costBg: 'bg-sky-100/70 dark:bg-sky-900/30 text-sky-950 dark:text-sky-100 border-sky-200 dark:border-sky-800/60',
    },
    evening: {
      title: 'Evening',
      icon: Moon,
      bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      border: 'border-indigo-200/70 dark:border-indigo-900/40',
      badgeBg: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-200',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      buttonBg: 'bg-indigo-100/80 hover:bg-indigo-200/80 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 border-indigo-300/60 dark:border-indigo-800',
      costBg: 'bg-indigo-100/70 dark:bg-indigo-900/30 text-indigo-950 dark:text-indigo-100 border-indigo-200 dark:border-indigo-800/60',
    },
  }[timeOfDay];

  const IconComp = config.icon;
  const costFormatted = formatCost(activity.estimatedCost);

  return (
    <div className={`rounded-3xl border ${config.bg} ${config.border} p-5 sm:p-6 transition-all shadow-xs`}>
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 lg:gap-6">
        
        {/* LEFT COLUMN: Activity Content */}
        <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
          
          {/* Top Badges (Time of day + Duration) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${config.badgeBg}`}>
              <IconComp className={`w-3.5 h-3.5 ${config.iconColor}`} />
              <span>{config.title}</span>
            </span>

            {activity.duration && (
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span>{activity.duration}</span>
              </span>
            )}
          </div>

          {/* Activity Title */}
          <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug break-words">
            {activity.activity}
          </h4>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal break-words">
            {activity.description}
          </p>

          {/* Bottom Controls: Google Maps Button & Estimated Cost */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/50 dark:border-slate-800/60">
            {/* Google Maps Button */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activity.activity}, ${destination}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer shadow-2xs ${config.buttonBg}`}
              title={`View ${activity.activity} on Google Maps`}
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {/* Estimated Activity Cost (Must remain clearly visible) */}
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-extrabold shadow-2xs ${config.costBg}`}>
              <Wallet className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <span>Estimated Cost: {costFormatted}</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Location Image */}
        <div className="w-full md:w-60 lg:w-72 h-44 sm:h-48 md:h-40 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shrink-0 relative bg-slate-100 dark:bg-slate-800 shadow-md group">
          {!imageError ? (
            <img
              src={initialImageUrl}
              alt={activity.activity}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-500 dark:text-slate-400">
              <ImageIcon className="w-6 h-6 mb-1 text-slate-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-1">{activity.activity}</span>
              <span className="text-[10px] text-slate-400">{destination}</span>
            </div>
          )}

          {/* Subtle destination overlay tag on image */}
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1 pointer-events-none">
            <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
            <span className="truncate max-w-[120px]">{destination.split(',')[0]}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
