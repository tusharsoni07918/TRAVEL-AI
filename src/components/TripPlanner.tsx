import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  Compass, 
  Heart, 
  Sparkles, 
  Car, 
  Hotel, 
  Utensils, 
  Plus, 
  Minus, 
  Check, 
  AlertCircle,
  Clock,
  ArrowRight,
  Smile,
  ShieldCheck,
  Plane,
  Camera,
  Coffee,
  ShoppingBag,
  Palmtree,
  Mountain,
  Landmark,
  Share2,
  Bookmark
} from 'lucide-react';
import { 
  TripFormData, 
  TravelType, 
  TravelPace, 
  Interest, 
  FoodPreference, 
  TransportPreference, 
  AccommodationType,
  SavedTrip 
} from '../types/travel';

interface TripPlannerProps {
  formData: TripFormData;
  setFormData: React.Dispatch<React.SetStateAction<TripFormData>>;
  onSaveTrip: (trip: SavedTrip) => void;
  demoLoadedNotification: boolean;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({
  formData,
  setFormData,
  onSaveTrip,
  demoLoadedNotification,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);

  const popularDestinations = [
    'Goa',
    'Bali',
    'Paris',
    'Tokyo',
    'Dubai',
    'New York',
    'Rome',
    'Santorini'
  ];

  const travelTypes: { type: TravelType; label: string; desc: string }[] = [
    { type: 'Solo', label: 'Solo', desc: 'Personal journey & freedom' },
    { type: 'Couple', label: 'Couple', desc: 'Romantic getaways & leisure' },
    { type: 'Family', label: 'Family', desc: 'Kid-friendly & relaxed' },
    { type: 'Friends', label: 'Friends', desc: 'Action-packed & nightlife' },
  ];

  const travelPaces: { pace: TravelPace; label: string; desc: string; icon: string }[] = [
    { pace: 'Relaxed', label: 'Relaxed', desc: '1-2 spots/day, plenty of downtime', icon: '☕' },
    { pace: 'Balanced', label: 'Balanced', desc: 'Comfortable balance of sights & rest', icon: '⚖️' },
    { pace: 'Fast-paced', label: 'Fast-paced', desc: 'Packed schedule, maximize landmarks', icon: '⚡' },
  ];

  const interestOptions: { interest: Interest; label: string; icon: any }[] = [
    { interest: 'Beaches', label: 'Beaches', icon: Palmtree },
    { interest: 'Adventure', label: 'Adventure', icon: Mountain },
    { interest: 'Food', label: 'Food & Cuisine', icon: Utensils },
    { interest: 'Culture', label: 'Culture & Arts', icon: Landmark },
    { interest: 'History', label: 'History & Heritage', icon: Landmark },
    { interest: 'Nature', label: 'Nature & Wildlife', icon: Palmtree },
    { interest: 'Shopping', label: 'Shopping', icon: ShoppingBag },
    { interest: 'Photography', label: 'Photography', icon: Camera },
  ];

  const foodPreferences: FoodPreference[] = [
    'Vegetarian',
    'Non-Vegetarian',
    'Vegan',
    'No Preference'
  ];

  const transportOptions: TransportPreference[] = [
    'Public Transport',
    'Taxi/Cab',
    'Rental Car',
    'Walking',
    'Mixed'
  ];

  const accommodationOptions: { type: AccommodationType; desc: string; range: string }[] = [
    { type: 'Budget', desc: 'Hostels, cozy guesthouses, clean budget hotels', range: '★☆☆' },
    { type: 'Mid-range', desc: '3-4 star hotels, boutique stays, scenic villas', range: '★★☆' },
    { type: 'Luxury', desc: '5-star resorts, private villas, concierge amenities', range: '★★★' },
  ];

  const handleInterestToggle = (interest: Interest) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      const updated = exists 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.destination.trim()) {
      newErrors.destination = 'Please enter or select a destination';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Please choose a trip start date';
    }
    if (!formData.numberOfDays || Number(formData.numberOfDays) <= 0) {
      newErrors.numberOfDays = 'Duration must be at least 1 day';
    }
    if (!formData.budget || Number(formData.budget) <= 0) {
      newErrors.budget = 'Please enter an estimated budget';
    }
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please pick at least one travel interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!validateForm()) {
      // Scroll to top of planner form
      const el = document.getElementById('planner');
      el?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsGenerating(true);
    setGenerationStep(1);

    // Simulated progress steps for the temporary AI transition
    setTimeout(() => setGenerationStep(2), 800);
    setTimeout(() => setGenerationStep(3), 1600);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResultModal(true);

      // Auto-save this trip
      const newSavedTrip: SavedTrip = {
        id: `trip-${Date.now()}`,
        destination: formData.destination,
        durationDays: Number(formData.numberOfDays),
        travelers: Number(formData.numberOfTravelers),
        travelType: formData.travelType,
        budgetFormatted: `${formData.currency} ${Number(formData.budget).toLocaleString()}`,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Ready',
        imageUrl: formData.destination.toLowerCase().includes('goa') 
          ? 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80'
      };
      onSaveTrip(newSavedTrip);
    }, 2400);
  };

  return (
    <section id="planner" className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Trip Customizer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Plan Your Tailored Travel Itinerary
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Tell TripGenie AI your travel preferences, budget, and favorite pace. We'll curate every single detail.
          </p>

          {/* Demo loaded banner */}
          {demoLoadedNotification && (
            <div className="mt-4 p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Check className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Demo parameters successfully loaded for Goa (3 Days, 2 Travelers, ₹15,000)! You can customize below or click Generate.</span>
            </div>
          )}
        </div>

        {/* Planner Card Container */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100">
          
          <div className="space-y-10">

            {/* Section 1: Destination & Dates */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                <h3 className="text-base font-bold text-slate-900">Destination & Schedule</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Destination Input */}
                <div className="md:col-span-6 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Destination <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, destination: e.target.value }));
                        if (errors.destination) setErrors(prev => ({ ...prev, destination: '' }));
                      }}
                      placeholder="e.g. Goa, Bali, Tokyo, Paris..."
                      className={`w-full pl-10 pr-4 py-3 bg-white rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                        errors.destination 
                          ? 'border-rose-400 focus:ring-rose-200' 
                          : 'border-slate-200 focus:border-sky-500 focus:ring-sky-100'
                      }`}
                    />
                  </div>
                  {errors.destination && (
                    <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.destination}
                    </p>
                  )}

                  {/* Quick destination chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                    <span className="text-[11px] text-slate-400 font-medium mr-1">Popular:</span>
                    {popularDestinations.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, destination: city }));
                          if (errors.destination) setErrors(prev => ({ ...prev, destination: '' }));
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition font-medium ${
                          formData.destination.toLowerCase() === city.toLowerCase()
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:text-sky-600'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Date */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={formData.startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, startDate: e.target.value }));
                        if (errors.startDate) setErrors(prev => ({ ...prev, startDate: '' }));
                      }}
                      className={`w-full pl-10 pr-3 py-3 bg-white rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition ${
                        errors.startDate 
                          ? 'border-rose-400 focus:ring-rose-200' 
                          : 'border-slate-200 focus:border-sky-500 focus:ring-sky-100'
                      }`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* Number of Days */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Duration (Days) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, numberOfDays: Math.max(1, Number(prev.numberOfDays) - 1) }))}
                      className="p-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition"
                      aria-label="Decrease days"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={formData.numberOfDays}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfDays: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-full text-center py-3 text-sm font-bold text-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, numberOfDays: Math.min(30, Number(prev.numberOfDays) + 1) }))}
                      className="p-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition"
                      aria-label="Increase days"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {errors.numberOfDays && (
                    <p className="text-xs text-rose-500 font-medium mt-1">{errors.numberOfDays}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Travelers & Budget */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                <h3 className="text-base font-bold text-slate-900">Travelers & Budget Parameters</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Number of Travelers */}
                <div className="md:col-span-4 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Number of Travelers
                  </label>
                  <div className="flex items-center bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, numberOfTravelers: Math.max(1, Number(prev.numberOfTravelers) - 1) }))}
                      className="p-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition"
                      aria-label="Decrease travelers"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="w-full text-center py-3 text-sm font-bold text-slate-900 flex items-center justify-center gap-1.5">
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span>{formData.numberOfTravelers} {Number(formData.numberOfTravelers) === 1 ? 'Traveler' : 'Travelers'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, numberOfTravelers: Math.min(20, Number(prev.numberOfTravelers) + 1) }))}
                      className="p-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition"
                      aria-label="Increase travelers"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Currency Selection */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-3 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-500"
                  >
                    <option value="₹">₹ INR (Indian Rupee)</option>
                    <option value="$">$ USD (US Dollar)</option>
                    <option value="€">€ EUR (Euro)</option>
                    <option value="£">£ GBP (British Pound)</option>
                    <option value="A$">A$ AUD (Australian Dollar)</option>
                    <option value="AED">AED (UAE Dirham)</option>
                  </select>
                </div>

                {/* Total Budget */}
                <div className="md:col-span-5 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Target Budget <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                      {formData.currency}
                    </span>
                    <input
                      type="number"
                      step="500"
                      value={formData.budget}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, budget: e.target.value }));
                        if (errors.budget) setErrors(prev => ({ ...prev, budget: '' }));
                      }}
                      placeholder="e.g. 15000, 25000..."
                      className={`w-full pl-10 pr-4 py-3 bg-white rounded-xl border text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 transition ${
                        errors.budget 
                          ? 'border-rose-400 focus:ring-rose-200' 
                          : 'border-slate-200 focus:border-sky-500 focus:ring-sky-100'
                      }`}
                    />
                  </div>
                  {errors.budget && (
                    <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.budget}
                    </p>
                  )}
                </div>
              </div>

              {/* Travel Type Selectable Cards */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Travel Group Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {travelTypes.map((t) => {
                    const isSelected = formData.travelType === t.type;
                    return (
                      <button
                        key={t.type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, travelType: t.type }))}
                        className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-200 text-sky-900 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm">{t.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                        </div>
                        <span className="text-[11px] text-slate-500 leading-tight">{t.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 3: Travel Pace & Interests */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                <h3 className="text-base font-bold text-slate-900">Pace & Key Interests</h3>
              </div>

              {/* Travel Pace */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Trip Pace
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {travelPaces.map((p) => {
                    const isSelected = formData.travelPace === p.pace;
                    return (
                      <button
                        key={p.pace}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, travelPace: p.pace }))}
                        className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 ${
                          isSelected
                            ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-200 text-teal-900'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span className="text-xl">{p.icon}</span>
                        <div>
                          <div className="font-bold text-sm">{p.label}</div>
                          <div className="text-[11px] text-slate-500">{p.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interests Multi-Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Interests & Activities (Select All That Apply) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {interestOptions.map((opt) => {
                    const isSelected = formData.interests.includes(opt.interest);
                    const IconComponent = opt.icon;
                    return (
                      <button
                        key={opt.interest}
                        type="button"
                        onClick={() => handleInterestToggle(opt.interest)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-indigo-200" />}
                      </button>
                    );
                  })}
                </div>
                {errors.interests && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.interests}
                  </p>
                )}
              </div>
            </div>

            {/* Section 4: Food, Transport & Accommodation */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-7 h-7 rounded-lg bg-amber-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                <h3 className="text-base font-bold text-slate-900">Logistics & Accommodation</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Food Preference */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Food Preference
                  </label>
                  <div className="space-y-1.5">
                    {foodPreferences.map((food) => (
                      <label
                        key={food}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition ${
                          formData.foodPreference === food
                            ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{food}</span>
                        <input
                          type="radio"
                          name="foodPref"
                          checked={formData.foodPreference === food}
                          onChange={() => setFormData(prev => ({ ...prev, foodPreference: food }))}
                          className="accent-amber-600"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Transport Preference */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Preferred Transport
                  </label>
                  <div className="space-y-1.5">
                    {transportOptions.map((transport) => (
                      <label
                        key={transport}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition ${
                          formData.transportPreference === transport
                            ? 'bg-sky-50 border-sky-500 text-sky-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{transport}</span>
                        <input
                          type="radio"
                          name="transportPref"
                          checked={formData.transportPreference === transport}
                          onChange={() => setFormData(prev => ({ ...prev, transportPreference: transport }))}
                          className="accent-sky-600"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Accommodation Preference */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Accommodation
                  </label>
                  <div className="space-y-2">
                    {accommodationOptions.map((acc) => (
                      <label
                        key={acc.type}
                        className={`block p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          formData.accommodation === acc.type
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold">{acc.type}</span>
                          <span className="text-[10px] text-amber-500 font-bold">{acc.range}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal">{acc.desc}</p>
                        <input
                          type="radio"
                          name="accPref"
                          checked={formData.accommodation === acc.type}
                          onChange={() => setFormData(prev => ({ ...prev, accommodation: acc.type }))}
                          className="hidden"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Additional Requirements */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Additional Requirements / Special Notes
              </label>
              <textarea
                value={formData.additionalRequirements}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                rows={3}
                placeholder="e.g. Accessibility needs, traveling with pets, must-see landmarks, preferred neighborhood, photography spots..."
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 resize-none"
              />
            </div>

            {/* Prominent CTA Button */}
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full sm:w-auto min-w-[320px] px-10 py-5 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white font-extrabold text-lg shadow-xl shadow-sky-600/25 hover:shadow-2xl hover:shadow-sky-600/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-3 group"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>
                      {generationStep === 1 && 'Analyzing Destination Vibes...'}
                      {generationStep === 2 && 'Balancing Budget & Stops...'}
                      {generationStep === 3 && 'Finalizing Itinerary...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Generate My Itinerary</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="mt-3 text-xs text-slate-500">
                ✨ Free preview • Real-time budget calculation • Exportable day-by-day plan
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Generated Itinerary Preview Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Itinerary Preview Generated
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {formData.destination} Adventure ({formData.numberOfDays} Days)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tailored for {formData.numberOfTravelers} Travelers • {formData.travelType} • {formData.travelPace} Pace
                </p>
              </div>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* AI Next Phase Notice */}
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-sky-900 text-xs leading-relaxed space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-sky-800">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Frontend Preview Complete
              </div>
              <p>
                Your customized trip parameters have been captured and saved to <strong>My Trips</strong>. Live AI LLM generation pipeline will be plugged in during the next step!
              </p>
            </div>

            {/* Quick Trip Highlights Preview */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">Estimated Cost</span>
                <span className="text-base font-extrabold text-slate-900">
                  {formData.currency} {Number(formData.budget).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">Accommodation</span>
                <span className="text-base font-extrabold text-slate-900">{formData.accommodation}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">Transport</span>
                <span className="text-base font-extrabold text-slate-900">{formData.transportPreference}</span>
              </div>
            </div>

            {/* Daily Schedule Preview Snippet */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Curated Day-by-Day Sneak Peek
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <span className="font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md shrink-0">Day 1</span>
                  <div>
                    <span className="font-bold text-slate-800 block">Arrival & Coastal Unwind</span>
                    <span className="text-slate-500">Check-in at {formData.accommodation} stay, beachside welcome meal, and evening sunset stroll.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <span className="font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md shrink-0">Day 2</span>
                  <div>
                    <span className="font-bold text-slate-800 block">Heritage Exploration & {formData.interests[0] || 'Local'} Sights</span>
                    <span className="text-slate-500">Morning architectural walking tour, artisan markets, and authentic culinary dinner spot.</span>
                  </div>
                </div>

                {Number(formData.numberOfDays) >= 3 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <span className="font-black text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md shrink-0">Day 3</span>
                    <div>
                      <span className="font-bold text-slate-800 block">Scenic Excursion & Farewell Night</span>
                      <span className="text-slate-500">Adventure activity, photo session, and relaxed departure shopping.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowResultModal(false)}
                className="flex-1 py-3 px-5 rounded-xl bg-sky-600 text-white font-bold text-sm hover:bg-sky-500 shadow-md transition"
              >
                Saved in "My Trips"!
              </button>
              <button
                onClick={() => setShowResultModal(false)}
                className="py-3 px-5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
              >
                Close & Edit Form
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
