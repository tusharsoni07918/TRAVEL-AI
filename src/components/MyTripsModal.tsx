import React from 'react';
import { Bookmark, MapPin, Calendar, Users, Wallet, Trash2, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { SavedTrip } from '../types/travel';

interface MyTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTrips: SavedTrip[];
  onDeleteTrip: (id: string) => void;
  onPlanTripClick: () => void;
}

export const MyTripsModal: React.FC<MyTripsModalProps> = ({
  isOpen,
  onClose,
  savedTrips,
  onDeleteTrip,
  onPlanTripClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                My Saved Trips
              </h3>
              <p className="text-xs text-slate-500">
                {savedTrips.length} {savedTrips.length === 1 ? 'trip' : 'trips'} saved in your TripGenie AI library
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Trips List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {savedTrips.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Saved Trips Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Customize your first adventure in the Trip Planner or load the demo trip to see your itineraries saved here.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onPlanTripClick();
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white font-semibold text-xs hover:bg-sky-500 transition shadow-sm"
              >
                Plan a Trip Now
              </button>
            </div>
          ) : (
            savedTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 hover:border-sky-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-slate-900">{trip.destination}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {trip.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        {trip.durationDays} Days
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        {trip.travelers} ({trip.travelType})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Wallet className="w-3.5 h-3.5 text-teal-600" />
                        {trip.budgetFormatted}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 block mt-1">
                      Created on {trip.createdDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            TripGenie AI Local Storage Cache
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
