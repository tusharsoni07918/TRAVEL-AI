import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  Compass, 
  Sun, 
  Moon, 
  Coffee, 
  Utensils, 
  ShieldCheck, 
  Car, 
  Hotel, 
  Luggage, 
  Sparkles, 
  Bookmark, 
  Check, 
  Share2, 
  Printer, 
  ArrowLeft, 
  RefreshCw, 
  Edit3, 
  Clock, 
  DollarSign, 
  Cpu, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Plane, 
  Bus, 
  ChevronRight, 
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Itinerary, AccommodationSuggestionItem } from '../types/itinerary';
import { TripFormData, SavedTrip } from '../types/travel';

interface ItineraryDashboardProps {
  itinerary: Itinerary;
  plannerData: TripFormData;
  onEditTrip: () => void;
  onRegenerate: () => void;
  onSaveTrip: (trip: SavedTrip) => void;
  onBackToPlanner: () => void;
}

export const ItineraryDashboard: React.FC<ItineraryDashboardProps> = ({
  itinerary,
  plannerData,
  onEditTrip,
  onRegenerate,
  onSaveTrip,
  onBackToPlanner,
}) => {
  const [activeDayView, setActiveDayView] = useState<'all' | number>('all');
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedDays, setExpandedDays] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true
  });

  const toggleDayExpanded = (dayNum: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  const currency = itinerary.currency || plannerData.currency || 'INR';
  const totalCost = Number(itinerary.totalEstimatedCost) || 0;
  const userBudget = Number(plannerData.budget) || totalCost;

  // Budget Calculations
  const diffBudget = userBudget - totalCost;
  const budgetRatio = userBudget > 0 ? (totalCost / userBudget) : 1;

  let budgetStatus: 'WITHIN' | 'NEAR' | 'OVER' = 'WITHIN';
  let budgetMessage = '';

  if (diffBudget < 0) {
    budgetStatus = 'OVER';
    budgetMessage = `${currency} ${Math.abs(diffBudget).toLocaleString()} over your planned budget`;
  } else if (budgetRatio >= 0.95 && budgetRatio <= 1.0) {
    budgetStatus = 'NEAR';
    budgetMessage = "You're close to your budget limit";
  } else {
    budgetStatus = 'WITHIN';
    budgetMessage = `${currency} ${diffBudget.toLocaleString()} remaining in budget`;
  }

  // Budget Breakdown Calculations
  const bb = itinerary.budgetBreakdown || {
    accommodation: Math.round(totalCost * 0.38),
    food: Math.round(totalCost * 0.28),
    transportation: Math.round(totalCost * 0.16),
    activities: Math.round(totalCost * 0.12),
    miscellaneous: Math.round(totalCost * 0.06),
  };

  const calculatedTotal = (bb.accommodation || 0) + (bb.food || 0) + (bb.transportation || 0) + (bb.activities || 0) + (bb.miscellaneous || 0) || totalCost || 1;

  const budgetCategories = [
    {
      name: 'Accommodation',
      amount: bb.accommodation || 0,
      icon: Hotel,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      name: 'Food & Dining',
      amount: bb.food || 0,
      icon: Utensils,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      name: 'Transportation',
      amount: bb.transportation || 0,
      icon: Car,
      color: 'bg-sky-500',
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-50'
    },
    {
      name: 'Activities & Sightseeing',
      amount: bb.activities || 0,
      icon: Sparkles,
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      name: 'Miscellaneous & Contingency',
      amount: bb.miscellaneous || 0,
      icon: Wallet,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  // Format Activity Cost Helper (Handles 0 cost with "Included / Free")
  const formatCost = (cost?: number) => {
    if (cost === undefined || cost === null || cost === 0) {
      return 'Included / Free';
    }
    return `~ ${currency} ${cost.toLocaleString()} (Est.)`;
  };

  // Save Trip Handler with toast
  const handleSave = () => {
    const savedTrip: SavedTrip = {
      id: `trip-${Date.now()}`,
      createdAt: new Date().toISOString(),
      destination: itinerary.destination,
      durationDays: itinerary.days?.length || Number(plannerData.numberOfDays) || 3,
      travelers: Number(plannerData.numberOfTravelers) || 2,
      travelType: plannerData.travelType,
      budgetFormatted: `${currency} ${totalCost.toLocaleString()}`,
      totalEstimatedCost: totalCost,
      currency,
      plannerData,
      itinerary,
      status: 'Ready',
      imageUrl: itinerary.destination.toLowerCase().includes('goa')
        ? 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80'
    };

    onSaveTrip(savedTrip);
    setSavedToast('Trip saved successfully to My Trips!');
    setTimeout(() => setSavedToast(null), 3500);
  };

  // Share link handler
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Clean Print Handler
  const handlePrint = () => {
    window.print();
  };

  const daysList = itinerary.days || [];
  const displayedDays = activeDayView === 'all' 
    ? daysList 
    : daysList.filter(d => d.day === activeDayView);

  return (
    <div id="itinerary-dashboard" className="py-10 lg:py-16 bg-slate-50/60 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Toast Notification */}
        {savedToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-950 text-white shadow-2xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{savedToast}</span>
            <button onClick={() => setSavedToast(null)} className="ml-2 text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* 1. TOP DASHBOARD ACTION BAR (Hidden in print) */}
        <div className="print:hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={onBackToPlanner}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-sky-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Planner</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Edit Trip */}
            <button
              onClick={onEditTrip}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition text-xs font-bold flex items-center gap-1.5"
              title="Return to planner with previous form values"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Edit Trip</span>
            </button>

            {/* Regenerate */}
            <button
              onClick={onRegenerate}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition text-xs font-bold flex items-center gap-1.5"
              title="Regenerate with Gemma 4 31B IT"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
              <span>Regenerate</span>
            </button>

            {/* Save Trip */}
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-500 transition text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Trip</span>
            </button>

            {/* Print Itinerary */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition text-xs font-bold shadow-xs flex items-center gap-1.5"
              title="Open clean printable view"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Itinerary</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
              title="Share itinerary link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. TRIP HEADER SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl relative overflow-hidden">
          
          {/* Subtle top model accent ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-indigo-600 to-teal-400" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Planned Adventure
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                  gemma-4-31b-it
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  Start: {plannerData.startDate || 'Upcoming'}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                <MapPin className="w-8 h-8 text-rose-500 shrink-0" />
                <span>{itinerary.destination}</span>
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 font-semibold pt-1">
                <span>{daysList.length} Days</span>
                <span className="text-slate-300">•</span>
                <span>{plannerData.numberOfTravelers} Travelers</span>
                <span className="text-slate-300">•</span>
                <span>{plannerData.travelType} Style</span>
                <span className="text-slate-300">•</span>
                <span className="text-teal-700">{plannerData.travelPace} Travel</span>
              </div>
            </div>

            {/* Total Budget Card */}
            <div className="w-full lg:w-auto bg-slate-950 text-white px-7 py-5 rounded-2xl shadow-lg flex lg:flex-col justify-between items-center lg:items-end gap-2">
              <div className="text-left lg:text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                  Total Estimated Cost
                </span>
                <span className="text-3xl font-black text-emerald-400 tracking-tight">
                  {currency} {totalCost.toLocaleString()}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md">
                Est. Budget
              </span>
            </div>
          </div>

          {/* Quick Specs Pill Row */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 block font-medium">Destination</span>
              <span className="text-sm font-bold text-slate-900 truncate block mt-0.5">{itinerary.destination}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 block font-medium">Duration</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">{daysList.length} Days</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 block font-medium">Group & Pace</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">{plannerData.travelType} • {plannerData.travelPace}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 block font-medium">Target Budget</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">{currency} {userBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 3. TRIP SUMMARY CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Trip Summary</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal pt-1">
            {itinerary.tripSummary || `A personalized ${daysList.length}-day journey through ${itinerary.destination} tailored for a ${plannerData.travelPace.toLowerCase()} pace.`}
          </p>
        </div>

        {/* 4. BUDGET OVERVIEW SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Budget Overview</h2>
                <p className="text-xs text-slate-500">Comparing estimated expenses with your planned budget</p>
              </div>
            </div>

            {/* Status Pill Badge */}
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              budgetStatus === 'WITHIN' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : budgetStatus === 'NEAR' 
                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {budgetStatus === 'WITHIN' ? <TrendingDown className="w-3.5 h-3.5" /> : budgetStatus === 'NEAR' ? <AlertTriangle className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              <span>{budgetMessage}</span>
            </div>
          </div>

          {/* Budget Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">User Planned Budget</span>
              <span className="text-xl font-black text-slate-900 block mt-1">
                {currency} {userBudget.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Target ceiling</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Total Estimated Cost</span>
              <span className="text-xl font-black text-slate-900 block mt-1">
                {currency} {totalCost.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Calculated by Gemma</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Budget Utilization</span>
              <span className={`text-xl font-black block mt-1 ${
                budgetStatus === 'WITHIN' ? 'text-emerald-600' : budgetStatus === 'NEAR' ? 'text-amber-600' : 'text-rose-600'
              }`}>
                {Math.round(budgetRatio * 100)}%
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {budgetStatus === 'WITHIN' ? 'Within target limits' : budgetStatus === 'NEAR' ? 'Near maximum budget' : 'Exceeds budget'}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            * Note: These are AI-generated estimates based on typical seasonal rates. They do not constitute guaranteed prices or financial commitments.
          </p>
        </div>

        {/* 5. BUDGET BREAKDOWN (CATEGORY PROGRESS BARS) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Budget Breakdown</h2>
              <p className="text-xs text-slate-500">Dynamic category distribution of estimated expenses</p>
            </div>
          </div>

          {/* Unified horizontal progress bar */}
          <div className="h-3.5 rounded-full bg-slate-100 overflow-hidden flex">
            {budgetCategories.map((cat, idx) => {
              const pct = Math.max(2, Math.round((cat.amount / calculatedTotal) * 100));
              return (
                <div
                  key={idx}
                  style={{ width: `${pct}%` }}
                  className={`${cat.color} h-full transition-all`}
                  title={`${cat.name}: ${currency} ${cat.amount.toLocaleString()} (${pct}%)`}
                />
              );
            })}
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {budgetCategories.map((cat, idx) => {
              const IconComp = cat.icon;
              const pct = Math.round((cat.amount / calculatedTotal) * 100);

              return (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${cat.bgColor} ${cat.textColor}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-500">{pct}%</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 block mt-2">{cat.name}</span>
                  </div>

                  <div>
                    <div className="text-base font-black text-slate-900">
                      {currency} {cat.amount.toLocaleString()}
                    </div>
                    {/* Small category bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                      <div style={{ width: `${pct}%` }} className={`h-full ${cat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. DAILY ITINERARY SECTION ("Your Day-by-Day Adventure") */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-600" />
                <h2 className="text-xl font-bold text-slate-900">Your Day-by-Day Adventure</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {daysList.length} customized daily routes with timeline scheduling
              </p>
            </div>

            {/* Day Filter Pills (Hidden in print) */}
            <div className="print:hidden flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
              <button
                onClick={() => setActiveDayView('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeDayView === 'all'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Days ({daysList.length})
              </button>

              {daysList.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setActiveDayView(d.day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeDayView === d.day
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Day {d.day}
                </button>
              ))}
            </div>
          </div>

          {/* Empty state for days */}
          {daysList.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm font-semibold">No daily itineraries available.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {displayedDays.map((day) => {
                const isExpanded = expandedDays[day.day] ?? true;

                return (
                  <div 
                    key={day.day}
                    className="border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:border-slate-300 transition-all bg-white"
                  >
                    {/* Day Header */}
                    <div 
                      onClick={() => toggleDayExpanded(day.day)}
                      className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/70 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                          {day.day}
                        </span>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">
                            Day {day.day}
                          </span>
                          <h3 className="text-lg font-black text-slate-900">
                            {day.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-medium block">Daily Estimated Cost</span>
                          <span className="text-sm font-extrabold text-slate-900">
                            ~ {currency} {(day.dailyEstimatedCost || 0).toLocaleString()} (Est.)
                          </span>
                        </div>
                        <div className="text-slate-400 print:hidden">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Day Content (Expanded / Collapsible) */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 space-y-6">
                        
                        {/* 8. TIMELINE UI: Morning -> Afternoon -> Evening */}
                        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                          
                          {/* MORNING */}
                          {day.morning && (
                            <div className="relative space-y-2">
                              {/* Timeline Node */}
                              <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center">
                                <Sun className="w-2.5 h-2.5 text-amber-600" />
                              </div>

                              <div className="bg-amber-50/40 border border-amber-200/50 rounded-2xl p-4 sm:p-5">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                                      Morning
                                    </span>
                                    {day.morning.duration && (
                                      <span className="text-[11px] font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {day.morning.duration}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs font-extrabold text-amber-950">
                                    {formatCost(day.morning.estimatedCost)}
                                  </span>
                                </div>

                                <h4 className="text-base font-bold text-slate-900 mb-1">
                                  {day.morning.activity}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                  {day.morning.description}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* AFTERNOON */}
                          {day.afternoon && (
                            <div className="relative space-y-2">
                              {/* Timeline Node */}
                              <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-sky-100 border-2 border-sky-500 flex items-center justify-center">
                                <Compass className="w-2.5 h-2.5 text-sky-600" />
                              </div>

                              <div className="bg-sky-50/40 border border-sky-200/50 rounded-2xl p-4 sm:p-5">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1">
                                      <Compass className="w-3.5 h-3.5 text-sky-600" />
                                      Afternoon
                                    </span>
                                    {day.afternoon.duration && (
                                      <span className="text-[11px] font-semibold text-sky-900 bg-sky-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {day.afternoon.duration}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs font-extrabold text-sky-950">
                                    {formatCost(day.afternoon.estimatedCost)}
                                  </span>
                                </div>

                                <h4 className="text-base font-bold text-slate-900 mb-1">
                                  {day.afternoon.activity}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                  {day.afternoon.description}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* EVENING */}
                          {day.evening && (
                            <div className="relative space-y-2">
                              {/* Timeline Node */}
                              <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-indigo-100 border-2 border-indigo-500 flex items-center justify-center">
                                <Moon className="w-2.5 h-2.5 text-indigo-600" />
                              </div>

                              <div className="bg-indigo-50/40 border border-indigo-200/50 rounded-2xl p-4 sm:p-5">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                                      <Moon className="w-3.5 h-3.5 text-indigo-600" />
                                      Evening
                                    </span>
                                    {day.evening.duration && (
                                      <span className="text-[11px] font-semibold text-indigo-900 bg-indigo-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {day.evening.duration}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs font-extrabold text-indigo-950">
                                    {formatCost(day.evening.estimatedCost)}
                                  </span>
                                </div>

                                <h4 className="text-base font-bold text-slate-900 mb-1">
                                  {day.evening.activity}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                  {day.evening.description}
                                </p>
                              </div>
                            </div>
                          )}

                        </div>

                        {/* FOOD RECOMMENDATION CARD */}
                        {day.foodRecommendation && (
                          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                              <Utensils className="w-4 h-4" />
                            </div>
                            <div className="text-xs space-y-0.5">
                              <span className="font-bold text-amber-950 block">
                                Food Recommendation (Tailored for {plannerData.foodPreference || 'all'} diets):
                              </span>
                              <p className="text-slate-700 font-normal leading-relaxed">
                                {day.foodRecommendation}
                              </p>
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 10. ACCOMMODATION SECTION ("Where to Stay") */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Where to Stay</h2>
              <p className="text-xs text-slate-500">Accommodation suggestions aligned with your {plannerData.accommodation} preference</p>
            </div>
          </div>

          {!itinerary.accommodationSuggestions || itinerary.accommodationSuggestions.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl">
              No specific accommodation recommendations generated. Check local booking portals for {plannerData.accommodation} stays.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {itinerary.accommodationSuggestions.map((item, idx) => {
                const isObj = typeof item === 'object' && item !== null;
                const name = isObj ? (item as AccommodationSuggestionItem).name : String(item);
                const desc = isObj ? (item as AccommodationSuggestionItem).description : null;
                const cat = isObj ? (item as AccommodationSuggestionItem).category : null;
                const price = isObj ? (item as AccommodationSuggestionItem).estimatedPrice : null;

                return (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded-md">
                          {cat || `Option ${idx + 1}`}
                        </span>
                        {price && (
                          <span className="text-xs font-extrabold text-slate-900">
                            {price}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{name}</h4>
                      {desc && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{desc}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-[11px] text-slate-400 italic">
            * Note: Prices and availability are estimates and should be verified before booking.
          </p>
        </div>

        {/* 11, 12, 13, 14. LOGISTICS & TIPS GRIDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 11. TRANSPORTATION SECTION ("Getting Around") */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Getting Around</h2>
            </div>

            {!itinerary.transportationTips || itinerary.transportationTips.length === 0 ? (
              <p className="text-xs text-slate-400">No transportation tips provided.</p>
            ) : (
              <ul className="space-y-2.5 text-xs text-slate-700">
                {itinerary.transportationTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <NavigationIcon idx={idx} />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[10px] text-slate-400 italic">
              * Note: Transport estimates and routes do not represent real-time live transit feeds.
            </p>
          </div>

          {/* 12. TRAVEL TIPS ("Smart Travel Tips") */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Smart Travel Tips</h2>
            </div>

            {!itinerary.travelTips || itinerary.travelTips.length === 0 ? (
              <p className="text-xs text-slate-400">No travel tips provided.</p>
            ) : (
              <ul className="space-y-2.5 text-xs text-slate-700">
                {itinerary.travelTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <span className="p-1 rounded-md bg-teal-100 text-teal-700 font-bold shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 13. SAFETY TIPS ("Stay Safe") */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Stay Safe</h2>
            </div>

            {!itinerary.safetyTips || itinerary.safetyTips.length === 0 ? (
              <p className="text-xs text-slate-400">No specific safety tips provided.</p>
            ) : (
              <ul className="space-y-2.5 text-xs text-slate-700">
                {itinerary.safetyTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 14. PACKING LIST ("What to Pack") */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Luggage className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">What to Pack</h2>
            </div>

            {!itinerary.packingTips || itinerary.packingTips.length === 0 ? (
              <p className="text-xs text-slate-400">No packing checklist provided.</p>
            ) : (
              <ul className="space-y-2.5 text-xs text-slate-700">
                {itinerary.packingTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* BOTTOM ACTION BAR (Hidden in print) */}
        <div className="print:hidden text-center py-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onEditTrip}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            Edit Trip Preferences
          </button>
          <button
            onClick={onRegenerate}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate with Gemma 4 31B</span>
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save to My Trips</span>
          </button>
        </div>

      </div>
    </div>
  );
};

// Sub-component for transit icon variations
function NavigationIcon({ idx }: { idx: number }) {
  if (idx % 3 === 0) return <Car className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />;
  if (idx % 3 === 1) return <Bus className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />;
  return <Compass className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />;
}
