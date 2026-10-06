import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  X, 
  Sparkles, 
  ChevronRight, 
  Palmtree, 
  Mountain, 
  Landmark, 
  Compass, 
  Globe2, 
  Calendar,
  Check
} from 'lucide-react';
import { DESTINATIONS_DATABASE, DestinationItem } from '../data/destinations';

interface DestinationAutocompleteProps {
  value: string;
  onChange: (value: string, meta?: { suggestedDays?: number; currency?: string }) => void;
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  isStartingPoint?: boolean;
}

export const DestinationAutocomplete: React.FC<DestinationAutocompleteProps> = ({
  value,
  onChange,
  error,
  placeholder = 'e.g. Goa, Bali, Tokyo, Paris...',
  icon,
  isStartingPoint = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered destinations list
  const filteredDestinations = useMemo(() => {
    const query = (value || '').trim().toLowerCase();

    return DESTINATIONS_DATABASE.filter(item => {
      // Category filter check
      if (selectedFilter === 'India' && item.region !== 'India') return false;
      if (selectedFilter === 'International' && item.region === 'India') return false;
      if (selectedFilter === 'Beach' && item.category !== 'Beach') return false;
      if (selectedFilter === 'Mountain' && item.category !== 'Mountain') return false;
      if (selectedFilter === 'Culture' && item.category !== 'Culture') return false;

      // Text query check
      if (!query) return true;

      const inName = item.name.toLowerCase().includes(query);
      const inCity = item.city.toLowerCase().includes(query);
      const inCountry = item.country.toLowerCase().includes(query);
      const inVibe = item.vibe.toLowerCase().includes(query);
      const inTags = item.tags.some(tag => tag.toLowerCase().includes(query));

      return inName || inCity || inCountry || inVibe || inTags;
    });
  }, [value, selectedFilter]);

  // Keep highlighted index in bounds
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [value, selectedFilter]);

  // Scroll active item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('.destination-item');
      const target = items[highlightedIndex] as HTMLElement;
      if (target) {
        target.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (dest: DestinationItem) => {
    onChange(dest.name, {
      suggestedDays: dest.suggestedDays,
      currency: dest.currency
    });
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredDestinations.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : filteredDestinations.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredDestinations.length) {
        handleSelect(filteredDestinations[highlightedIndex]);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Beach':
        return <Palmtree className="w-3.5 h-3.5 text-teal-600" />;
      case 'Mountain':
        return <Mountain className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Culture':
        return <Landmark className="w-3.5 h-3.5 text-amber-600" />;
      case 'Romantic':
        return <Sparkles className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-sky-600" />;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field */}
      <div className="relative">
        <MapPin className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
          isOpen ? 'text-sky-600' : 'text-slate-400'
        }`} />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-800 rounded-xl border text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition shadow-xs ${
            error 
              ? 'border-rose-400 focus:ring-rose-200' 
              : isOpen
                ? 'border-sky-500 ring-2 ring-sky-100 dark:ring-sky-950'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-sky-500 dark:focus:border-sky-400 focus:ring-sky-100 dark:focus:ring-sky-950'
          }`}
        />

        {/* Clear Button */}
        {value ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            title="Clear destination"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pointer-events-none hidden sm:block">
            Search
          </div>
        )}
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div 
          className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ minWidth: '320px' }}
        >
          {/* Filter Pills Bar */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto">
            {['All', 'India', 'International', 'Beach', 'Mountain', 'Culture'].map((filterName) => (
              <button
                key={filterName}
                type="button"
                onClick={() => setSelectedFilter(filterName)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedFilter === filterName
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                {filterName}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div 
            ref={listRef}
            className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 overscroll-contain"
          >
            {filteredDestinations.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <Globe2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  No predefined matches for "{value}"
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  TripGenie AI can plan anywhere in the world! Press Enter or keep "{value}" to plan this trip.
                </p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-xs font-bold transition cursor-pointer"
                >
                  Use "{value}" as Destination
                </button>
              </div>
            ) : (
              filteredDestinations.map((dest, idx) => {
                const isSelected = value.toLowerCase() === dest.name.toLowerCase();
                const isHighlighted = idx === highlightedIndex;

                return (
                  <div
                    key={dest.id}
                    onClick={() => handleSelect(dest)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`destination-item p-3 sm:p-3.5 flex items-start justify-between gap-3 cursor-pointer transition select-none ${
                      isHighlighted 
                        ? 'bg-sky-50/80 dark:bg-slate-800' 
                        : isSelected 
                          ? 'bg-sky-50/40 dark:bg-sky-950/40' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        {getCategoryIcon(dest.category)}
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {dest.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            • {dest.country}
                          </span>
                          {dest.badge && (
                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300">
                              {dest.badge}
                            </span>
                          )}
                        </div>

                        {/* Vibe / Highlights */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                          {dest.vibe}
                        </p>

                        {/* Suggested Days Tag */}
                        {dest.suggestedDays && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-400 font-medium mt-1">
                            <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-400" />
                            <span>Recommended: {dest.suggestedDays} Days</span>
                            {dest.currency && (
                              <span>• Currency: {dest.currency}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side check or arrow */}
                    <div className="shrink-0 self-center">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <ChevronRight className={`w-4 h-4 text-slate-300 dark:text-slate-600 transition ${
                          isHighlighted ? 'text-sky-600 dark:text-sky-400 translate-x-0.5' : ''
                        }`} />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Dropdown Footer */}
          <div className="p-2.5 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
              <span>{DESTINATIONS_DATABASE.length}+ global & Indian destinations</span>
            </span>
            <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">
              Use ↑↓ keys to browse • Enter to pick
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
