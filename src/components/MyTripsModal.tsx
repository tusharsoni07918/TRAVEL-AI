import React, { useState } from 'react';
import { 
  Bookmark, 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  Trash2, 
  Eye, 
  X, 
  Sparkles, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { SavedTrip } from '../types/travel';

interface MyTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTrips: SavedTrip[];
  onSelectTrip: (trip: SavedTrip) => void;
  onDeleteTrip: (id: string) => void;
  onPlanTripClick: () => void;
}

export const MyTripsModal: React.FC<MyTripsModalProps> = ({
  isOpen,
  onClose,
  savedTrips,
  onSelectTrip,
  onDeleteTrip,
  onPlanTripClick,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDeleteConfirm = (id: string) => {
    onDeleteTrip(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs">
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

        {/* Trips List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5">
          {savedTrips.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Saved Trips Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Plan a customized adventure or load the demo trip to generate and save your itineraries here.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onPlanTripClick();
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white font-semibold text-xs hover:bg-sky-500 transition shadow-sm inline-flex items-center gap-1.5"
              >
                <span>Plan a Trip Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            savedTrips.map((trip) => {
              const isConfirming = confirmDeleteId === trip.id;

              return (
                <div
                  key={trip.id}
                  className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-sky-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      <MapPin className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-slate-900">{trip.destination}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {trip.status || 'Ready'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
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
                        <span className="flex items-center gap-1 font-bold text-slate-800">
                          <Wallet className="w-3.5 h-3.5 text-teal-600" />
                          {trip.budgetFormatted}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400 block">
                        Saved on {new Date(trip.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isConfirming ? (
                      <div className="flex items-center gap-2 bg-rose-50 p-1.5 rounded-xl border border-rose-200 text-xs">
                        <span className="text-[11px] font-semibold text-rose-800 px-1">Delete?</span>
                        <button
                          onClick={() => handleDeleteConfirm(trip.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 rounded-lg bg-white text-slate-600 text-[11px] hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            onSelectTrip(trip);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 transition text-xs font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-sky-600" />
                          <span>View Trip</span>
                        </button>

                        <button
                          onClick={() => setConfirmDeleteId(trip.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Saved Trip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Saved locally in your browser storage</span>
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
