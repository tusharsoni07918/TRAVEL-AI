import React from 'react';
import { Compass, Sparkles, Heart, Globe, Twitter, Instagram, Github, Linkedin } from 'lucide-react';

interface FooterProps {
  onPlanTripClick: () => void;
  onMyTripsClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onPlanTripClick,
  onMyTripsClick,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-sans">
                TripGenie <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">AI</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Discover personalized itineraries, smarter budgets, and unforgettable experiences — all tailored to your travel style.
            </p>

            <div className="text-xs text-slate-500 font-medium">
              "Your Journey. Your Budget. Your Perfect Plan."
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-sky-400 transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={onPlanTripClick}
                  className="hover:text-sky-400 transition"
                >
                  Plan Trip
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-sky-400 transition"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('features')}
                  className="hover:text-sky-400 transition"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={onMyTripsClick}
                  className="hover:text-sky-400 transition"
                >
                  My Trips
                </button>
              </li>
            </ul>
          </div>

          {/* Socials & Community */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Connect With Us
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stay inspired with travel ideas, destination updates, and smart budgeting hacks.
            </p>

            {/* Social Icons Placeholders */}
            <div className="flex items-center gap-3">
              <a
                href="#twitter"
                onClick={(e) => e.preventDefault()}
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/50 transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#instagram"
                onClick={(e) => e.preventDefault()}
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/50 transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#linkedin"
                onClick={(e) => e.preventDefault()}
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#github"
                onClick={(e) => e.preventDefault()}
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} TripGenie AI. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted for travelers worldwide</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>

      </div>
    </footer>
  );
};
