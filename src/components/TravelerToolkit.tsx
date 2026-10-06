import React, { useState, useEffect } from 'react';
import { 
  Languages, 
  Camera, 
  Luggage, 
  CloudRain, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  Circle, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Sun, 
  Info,
  DollarSign,
  ShieldCheck,
  Compass,
  Volume2
} from 'lucide-react';
import { Itinerary, LocalPhrase, PhotoSpot } from '../types/itinerary';
import { TripFormData } from '../types/travel';

interface TravelerToolkitProps {
  itinerary: Itinerary;
  plannerData: TripFormData;
  onApplyContingency: (contingencyInstruction: string) => void;
  isApplyingContingency?: boolean;
}

export const TravelerToolkit: React.FC<TravelerToolkitProps> = ({
  itinerary,
  plannerData,
  onApplyContingency,
  isApplyingContingency = false,
}) => {
  const [activeTab, setActiveTab] = useState<'language' | 'packing' | 'photo' | 'weather'>('language');

  const dest = itinerary.destination || 'Destination';
  const destLower = dest.toLowerCase();
  const isGoa = destLower.includes('goa');
  const isParis = destLower.includes('paris');
  const isBali = destLower.includes('bali');
  const isTokyo = destLower.includes('tokyo');

  // 1. Language Phrases Data
  const phrases: LocalPhrase[] = itinerary.localPhrases && itinerary.localPhrases.length > 0 
    ? itinerary.localPhrases 
    : isGoa
      ? [
          { phrase: 'Kitem cholla?', phonetic: 'kee-tem chol-lah', meaning: 'How are things going? / What is up?', usageContext: 'Casual greeting with friendly locals & shack owners' },
          { phrase: 'Dev borem korum', phonetic: 'dev boh-rem koh-rum', meaning: 'Thank you / God bless you', usageContext: 'Heartfelt thank you after meals or hospitality' },
          { phrase: 'Hacho dor kitlem?', phonetic: 'hah-cho dor kit-lem', meaning: 'How much does this cost?', usageContext: 'Bargaining at Mapusa or Anjuna markets' },
          { phrase: 'Maka he zai', phonetic: 'mah-kah hay zye', meaning: 'I would like this', usageContext: 'Ordering delicious fish thali or drinks' },
          { phrase: 'Borem asa', phonetic: 'boh-rem ah-sah', meaning: 'It is very good / Delicious', usageContext: 'Complimenting fresh local culinary cooking' },
        ]
      : isParis
      ? [
          { phrase: 'Bonjour, s\'il vous plaît', phonetic: 'bohn-zhoor seel voo pleh', meaning: 'Hello, please', usageContext: 'Always say upon entering ANY shop or cafe' },
          { phrase: 'L\'addition, s\'il vous plaît', phonetic: 'lah-dee-syon seel voo pleh', meaning: 'The bill, please', usageContext: 'Asking for check in Parisian restaurants' },
          { phrase: 'C\'est délicieux', phonetic: 'say day-lee-syuh', meaning: 'It is delicious', usageContext: 'Complimenting your pastry or bistro dinner' },
          { phrase: 'Parlez-vous anglais?', phonetic: 'par-lay voo ahn-glay', meaning: 'Do you speak English?', usageContext: 'Polite inquiry before asking directions' },
        ]
      : isBali
      ? [
          { phrase: 'Suksma', phonetic: 'sook-smah', meaning: 'Thank you', usageContext: 'Most common warm Balinese expression of gratitude' },
          { phrase: 'Mewali', phonetic: 'meh-wah-lee', meaning: 'You are welcome', usageContext: 'Polite reply to thanks' },
          { phrase: 'Berapa harganya?', phonetic: 'beh-rah-pah har-gah-nyah', meaning: 'How much is this?', usageContext: 'Shopping at Ubud artisan craft market' },
          { phrase: 'Enak sekali', phonetic: 'eh-nahk seh-kah-lee', meaning: 'Very delicious', usageContext: 'Praising local warung dishes' },
        ]
      : [
          { phrase: 'Hello / Greetings', phonetic: 'local greeting', meaning: 'Standard polite greeting', usageContext: 'Use with taxi drivers and hotel reception' },
          { phrase: 'Thank you very much', phonetic: 'local thanks', meaning: 'Showing appreciation', usageContext: 'After receiving service or guidance' },
          { phrase: 'How much is this?', phonetic: 'cost inquiry', meaning: 'Asking the price', usageContext: 'Before entering taxis or buying street souvenirs' },
          { phrase: 'Where is the station/center?', phonetic: 'direction ask', meaning: 'Asking directions', usageContext: 'When navigating unfamiliar streets' },
        ];

  // Cultural etiquette points
  const etiquette = itinerary.culturalEtiquette && itinerary.culturalEtiquette.length > 0
    ? itinerary.culturalEtiquette
    : isGoa
      ? [
          'Dress respectfully when visiting ancient churches in Old Goa (cover shoulders & knees).',
          'Negotiate taxi and auto-rickshaw fares politely BEFORE starting your ride, or use GoaMiles app.',
          'Always ask permission before taking close-up portraits of traditional coastal fishermen.',
          'Support local shack owners with modest tips (5–10% is deeply appreciated).'
        ]
      : isParis
      ? [
          'Always greet staff with "Bonjour" when stepping into a boutique or bakery.',
          'Service is included by law in cafes; leaving small change (1-2 euros) is customary for good service.',
          'Speak in a calm, moderate volume inside metro cars and intimate brassieres.'
        ]
      : isBali
      ? [
          'Wear a traditional sarong and sash when stepping onto temple grounds (often rented at entrance).',
          'Never step on sacred daily floral offerings (Canang Sari) placed on pavements and doorsteps.',
          'Use your right hand when giving or receiving money and goods.'
        ]
      : [
          'Respect local religious dress codes and customs at historical monuments.',
          'Ask before photographing residents or sacred ceremonies.',
          'Confirm whether tips are included on restaurant bills or given in cash.'
        ];

  // Fair pricing benchmarks
  const fairPricing = itinerary.fairPricingTips && itinerary.fairPricingTips.length > 0
    ? itinerary.fairPricingTips
    : isGoa
      ? [
          'Scooter Rentals: Typical rate is ₹350–₹500/day for Activa. Peak holiday seasons may reach ₹700.',
          'Beach Beds: Free with food/drink purchase at beach shacks; avoid paying separate flat fees.',
          'Water Sports: Bargain combo packages (parasailing + jet ski + banana ride) for ₹1,200–₹1,800/person.'
        ]
      : [
          'Local Transit: Buy multi-trip passes or day tickets rather than single one-way cards.',
          'Street Markets: A polite opening counter-offer of 20–30% below marked price is standard.',
          'Bottled Water: Buy from supermarkets rather than souvenir kiosks for standard retail prices.'
        ];

  // 2. Photo Spots Data
  const photoSpots: PhotoSpot[] = itinerary.photoSpots && itinerary.photoSpots.length > 0
    ? itinerary.photoSpots
    : isGoa
      ? [
          { spot: 'Chapora Fort Ramparts', bestTime: '5:30 PM (Golden Sunset)', tip: 'Perch on the red laterite stone cliffs overlooking Vagator bay for dramatic silhouettes.', vibe: 'Cinematic Sunset' },
          { spot: 'Fontainhas Latin Quarter', bestTime: '8:30 AM (Soft Morning Light)', tip: 'Capture pastel yellow, indigo, and terracotta Portuguese balconies before cars park.', vibe: 'Architectural Colors' },
          { spot: 'Cabo de Rama Cliff Edge', bestTime: '4:00 PM (Late Afternoon)', tip: 'Wide angle showing the sheer cliff drop into turquoise Arabian waves.', vibe: 'Dramatic Coastline' },
          { spot: 'Palolem Beach Crescent', bestTime: '6:30 PM (Blue Hour)', tip: 'Fairy lights illuminating beach shacks with reflections on low-tide wet sand.', vibe: 'Ambient Twilight' },
        ]
      : [
          { spot: `${dest} Central Historic Plaza`, bestTime: 'Early Morning (7:00 AM)', tip: 'Soft sunrise illumination without tourist crowds.', vibe: 'Historic Architecture' },
          { spot: `${dest} Waterfront Promenade`, bestTime: 'Sunset (6:00 PM)', tip: 'Golden reflections over water and illuminated bridges.', vibe: 'Golden Hour' },
          { spot: `${dest} Elevated Scenic Lookout`, bestTime: 'Twilight (7:00 PM)', tip: 'Panoramic long exposure capturing the glowing evening cityscape.', vibe: 'City Lights' },
        ];

  // 3. Interactive Packing Checklist State
  const packingStorageKey = `tripgenie_packing_${destLower.replace(/\s+/g, '_')}`;
  const defaultPackingItems = [
    { id: 'p1', text: 'Passport / Government ID & offline copies', category: 'Documents', done: false },
    { id: 'p2', text: 'Portable Power Bank (10,000mAh+) & cables', category: 'Tech', done: false },
    { id: 'p3', text: 'Comfortable broken-in walking shoes', category: 'Clothing', done: false },
    { id: 'p4', text: 'Breathable weather-appropriate outfits', category: 'Clothing', done: false },
    { id: 'p5', text: 'High-protection sunscreen & sunglasses', category: 'Health', done: false },
    { id: 'p6', text: 'Quick-dry microfiber travel towel', category: 'Gear', done: false },
    { id: 'p7', text: 'Personal medications & mini first aid kit', category: 'Health', done: false },
    { id: 'p8', text: 'Small cash reserve in local currency', category: 'Documents', done: false },
  ];

  const [packingList, setPackingList] = useState<{ id: string; text: string; category: string; done: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem(packingStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultPackingItems;
  });

  const [newPackingItem, setNewPackingItem] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(packingStorageKey, JSON.stringify(packingList));
    } catch (e) {}
  }, [packingList, packingStorageKey]);

  const togglePackingItem = (id: string) => {
    setPackingList(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleAddPackingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackingItem.trim()) return;
    setPackingList(prev => [...prev, { id: `pack-${Date.now()}`, text: newPackingItem.trim(), category: 'Custom', done: false }]);
    setNewPackingItem('');
  };

  const handleDeletePackingItem = (id: string) => {
    setPackingList(prev => prev.filter(item => item.id !== id));
  };

  const packedCount = packingList.filter(i => i.done).length;
  const packedPct = Math.round((packedCount / Math.max(1, packingList.length)) * 100);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Traveler's Smart Toolkit</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Essential language, packing checklist, photo spots & contingency reroutes
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('language')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'language' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Language & Etiquette</span>
          </button>

          <button
            onClick={() => setActiveTab('packing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'packing' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Luggage className="w-3.5 h-3.5" />
            <span>Packing ({packedCount}/{packingList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('photo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'photo' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photo Spots</span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'weather' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Weather & Contingency</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LANGUAGE & ETIQUETTE */}
      {activeTab === 'language' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Essential Local Phrases for {dest}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {phrases.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{item.phrase}</h4>
                      <span className="text-xs font-mono font-medium text-indigo-600">
                        🗣️ /{item.phonetic}/
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      Meaning
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800">
                    "{item.meaning}"
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    When to use: {item.usageContext}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Etiquette & Fair Price Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Cultural Etiquette & Local Respect</span>
              </div>
              <ul className="space-y-2 text-xs text-amber-950 font-medium">
                {etiquette.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Fair Pricing & Street Bargaining Guide</span>
              </div>
              <ul className="space-y-2 text-xs text-emerald-950 font-medium">
                {fairPricing.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PACKING CHECKLIST */}
      {activeTab === 'packing' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Departure transit preparation card if startingPoint is provided */}
          {(itinerary.startingPoint || plannerData.startingPoint) && (
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 flex items-start gap-3">
              <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block">
                  Departure Route: {itinerary.startingPoint || plannerData.startingPoint} → {itinerary.destination}
                </span>
                <p className="text-xs text-indigo-950/80 dark:text-indigo-300">
                  Carry physical government photo ID, transit/rail e-tickets, portable chargers (10,000mAh), and keep emergency contact cards accessible during intercity travel.
                </p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Packing Progress: {packedCount} of {packingList.length} items packed ({packedPct}%)
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Check items off as you place them into your luggage. Saved automatically.
              </p>
            </div>
            <div className="w-full sm:w-48 h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <div 
                style={{ width: `${packedPct}%` }}
                className="h-full bg-emerald-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Add custom item form */}
          <form onSubmit={handleAddPackingItem} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="+ Add custom item to pack (e.g. Snorkel mask, Rain jacket)..."
              value={newPackingItem}
              onChange={(e) => setNewPackingItem(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
            >
              Add Item
            </button>
          </form>

          {/* Items Checklist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {packingList.map((item) => (
              <div 
                key={item.id}
                onClick={() => togglePackingItem(item.id)}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition select-none ${
                  item.done
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                    item.done ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                  }`}>
                    {item.done && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className={`text-xs font-semibold ${item.done ? 'line-through opacity-70' : ''}`}>
                      {item.text}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePackingItem(item.id);
                  }}
                  className="text-slate-300 hover:text-rose-500 transition p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PHOTO SPOTS */}
      {activeTab === 'photo' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Golden Hour & Aesthetic Photo Spots in {dest}
            </span>
            <span className="text-[11px] text-slate-400">Curated by Gemma 4 31B</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {photoSpots.map((spot, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-pink-50/30 border border-slate-200/90 space-y-2.5">
                <div className="flex items-start justify-between">
                  <h4 className="text-base font-bold text-slate-900">{spot.spot}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                    {spot.vibe}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Best Lighting: {spot.bestTime}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  💡 <span className="font-medium text-slate-800">Composition Tip:</span> {spot.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WEATHER & CONTINGENCY REROUTE */}
      {activeTab === 'weather' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-sky-900 flex items-start gap-3">
            <CloudRain className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Smart Contingency Simulator</span>
              <p className="mt-0.5 leading-relaxed text-sky-800">
                Weather changes and travel delays happen. Use these instant Gemma reroutes to dynamically swap open-air activities without re-planning your entire trip.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Contingency 1: Rain */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                  <CloudRain className="w-4 h-4" />
                  <span>🌧️ Rain / Storm Mode</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Replaces outdoor beaches and hikes with indoor heritage museums, art cafes, spice plantation cooking workshops, and covered bazaars.
                </p>
              </div>
              <button
                onClick={() => onApplyContingency('Rain Contingency: Replace outdoor beaches and treks with indoor cultural museums, artisanal cafes, and indoor covered markets while keeping the same budget.')}
                disabled={isApplyingContingency}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isApplyingContingency ? 'Rerouting...' : 'Activate Rain Mode'}
              </button>
            </div>

            {/* Contingency 2: Flight Delay */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>⏱️ Delayed Arrival (3h)</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Compresses Day 1 schedule to bypass morning fatigue and starts fresh with a relaxed sunset view and ambient evening dinner.
                </p>
              </div>
              <button
                onClick={() => onApplyContingency('Delayed Arrival: Flight delayed by 3 hours. Compress Day 1 activities into an unhurried twilight dinner and sunset viewpoint so we do not rush.')}
                disabled={isApplyingContingency}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isApplyingContingency ? 'Rerouting...' : 'Activate Delay Mode'}
              </button>
            </div>

            {/* Contingency 3: Heatwave / Midday Pause */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-orange-700 font-bold text-sm">
                  <Sun className="w-4 h-4" />
                  <span>☀️ Heatwave Midday Siesta</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Avoids midday 12–3 PM sun exposure with shaded garden lounges and shifts energetic outdoor exploration to early morning and golden twilight.
                </p>
              </div>
              <button
                onClick={() => onApplyContingency('Heatwave Pause: Move intense outdoor sightseeing to early morning and sunset. Keep midday 12 PM to 3 PM for air-conditioned cafes or shaded rests.')}
                disabled={isApplyingContingency}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isApplyingContingency ? 'Rerouting...' : 'Activate Siesta Mode'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
