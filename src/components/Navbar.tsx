import React, { useState } from 'react';
import { Sparkles, Compass, Menu, X, Bookmark, Plane, Calendar, Sun, Moon, LogIn, UserPlus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { UserMenu } from './UserMenu';

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
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user, openLogin, openRegister, logout } = useAuth();

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#071A2B]/95 backdrop-blur-md border-b border-slate-100 dark:border-[#234158] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#0B2D42] border border-[#234158] flex items-center justify-center text-white shadow-md shadow-[#071A2B]/40 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-[#00B8A9]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-[#F8FAFC] font-sans">
                  TripGenie <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B8A9] to-[#18C8E8]">AI</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800">
                  <Compass className="w-2.5 h-2.5 text-[#00B8A9]" />
                  Travel AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#B7C7D6] font-medium hidden sm:block">
                Your Journey. Your Budget. Your Perfect Plan.
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('planner')}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Plan Trip
            </button>
            <button
              onClick={() => scrollTo('itinerary-dashboard')}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold transition-colors flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800 shadow-2xs hover:bg-indigo-100/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>Itinerary Dashboard</span>
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Features
            </button>
            <button
              onClick={onMyTripsClick}
              className="flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400 transition-colors relative"
            >
              <Bookmark className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-sky-600" />
              <span>My Trips</span>
              {savedTripsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {savedTripsCount}
                </span>
              )}
            </button>
          </div>

          {/* Right Action Button & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Auth State in Desktop Navbar */}
            {isAuthenticated && user ? (
              <UserMenu
                onMyTripsClick={onMyTripsClick}
                savedTripsCount={savedTripsCount}
              />
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openLogin}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={openRegister}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-bold hover:from-sky-500 hover:to-indigo-500 shadow-md shadow-sky-600/20 hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={onMyTripsClick}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative"
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
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 px-5 pt-3 pb-6 space-y-3 shadow-xl">
          {isAuthenticated && user && (
            <div className="p-3 mb-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{user.fullName}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="text-[11px] font-semibold text-rose-500 hover:underline"
              >
                Sign Out
              </button>
            </div>
          )}

          <button
            onClick={() => scrollTo('top')}
            className="w-full text-left py-2.5 text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 border-b border-slate-100 dark:border-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('planner')}
            className="w-full text-left py-2.5 text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 border-b border-slate-100 dark:border-slate-800"
          >
            Plan Trip
          </button>
          <button
            onClick={() => scrollTo('itinerary-dashboard')}
            className="w-full text-left py-2.5 text-base font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between"
          >
            <span>Itinerary Dashboard</span>
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full uppercase">Live</span>
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="w-full text-left py-2.5 text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 border-b border-slate-100 dark:border-slate-800"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo('features')}
            className="w-full text-left py-2.5 text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 border-b border-slate-100 dark:border-slate-800"
          >
            Features
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onMyTripsClick();
            }}
            className="w-full text-left py-2.5 text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 flex items-center justify-between"
          >
            <span>My Trips</span>
            {savedTripsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-sky-500 text-white text-xs font-bold">
                {savedTripsCount} saved
              </span>
            )}
          </button>

          <div className="pt-2 space-y-2">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLogin();
                  }}
                  className="py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-center text-xs"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openRegister();
                  }}
                  className="py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-center text-xs shadow-md shadow-sky-600/20"
                >
                  Register
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onPlanTripClick();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold text-center shadow-md shadow-sky-600/20"
              >
                Plan New Adventure
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
