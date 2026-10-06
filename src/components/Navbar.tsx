import React, { useState } from 'react';
import { Sparkles, Compass, Menu, X, Bookmark, Plane, Calendar } from 'lucide-react';

interface NavbarProps {
  onPlanTripClick: () => void;
  onMyTripsClick: () => void;
  savedTripsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onPlanTripClick,
  onMyTripsClick,
  savedTripsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                  TripGenie <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">AI</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200/60">
                  <Sparkles className="w-2.5 h-2.5" />
                  Travel AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Your Journey. Your Budget. Your Perfect Plan.
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-sky-600 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('planner')}
              className="hover:text-sky-600 transition-colors"
            >
              Plan Trip
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-sky-600 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="hover:text-sky-600 transition-colors"
            >
              Features
            </button>
            <button
              onClick={onMyTripsClick}
              className="flex items-center gap-1.5 hover:text-sky-600 transition-colors relative"
            >
              <Bookmark className="w-4 h-4 text-slate-400 group-hover:text-sky-600" />
              <span>My Trips</span>
              {savedTripsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {savedTripsCount}
                </span>
              )}
            </button>
          </div>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onPlanTripClick}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-sm font-semibold hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-sky-600/20 hover:shadow-lg hover:shadow-sky-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onMyTripsClick}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative"
              aria-label="View Saved Trips"
            >
              <Bookmark className="w-5 h-5" />
              {savedTripsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedTripsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 px-5 pt-3 pb-6 space-y-3 shadow-xl">
          <button
            onClick={() => scrollTo('top')}
            className="w-full text-left py-2.5 text-base font-semibold text-slate-800 hover:text-sky-600 border-b border-slate-50"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('planner')}
            className="w-full text-left py-2.5 text-base font-semibold text-slate-800 hover:text-sky-600 border-b border-slate-50"
          >
            Plan Trip
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="w-full text-left py-2.5 text-base font-semibold text-slate-800 hover:text-sky-600 border-b border-slate-50"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo('features')}
            className="w-full text-left py-2.5 text-base font-semibold text-slate-800 hover:text-sky-600 border-b border-slate-50"
          >
            Features
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onMyTripsClick();
            }}
            className="w-full text-left py-2.5 text-base font-semibold text-slate-800 hover:text-sky-600 flex items-center justify-between"
          >
            <span>My Trips</span>
            {savedTripsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-sky-500 text-white text-xs font-bold">
                {savedTripsCount} saved
              </span>
            )}
          </button>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onPlanTripClick();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold text-center shadow-md shadow-sky-600/20"
            >
              Get Started Free
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
