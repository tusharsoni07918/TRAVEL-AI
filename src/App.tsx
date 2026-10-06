import React, { useState, useEffect } from 'react';
import { TripFormData, SavedTrip } from './types/travel';
import { Itinerary, GenerationError } from './types/itinerary';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TripPlanner } from './components/TripPlanner';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesSection } from './components/FeaturesSection';
import { ItineraryDashboard } from './components/ItineraryDashboard';
import { LoadingOverlay } from './components/LoadingOverlay';
import { MyTripsModal } from './components/MyTripsModal';
import { AuthModal } from './components/AuthModal';
import { AuthLanding } from './components/auth/AuthLanding';
import { AuthLoadingScreen } from './components/auth/AuthLoadingScreen';
import { Footer } from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getSavedTrips, saveTripToStorage, deleteTripFromStorage } from './services/storage';
import { requestGemmaItinerary } from './services/itineraryApi';
import { createSampleItinerary } from './services/sampleItinerary';
import { Sparkles, X } from 'lucide-react';

const defaultTripData: TripFormData = {
  startingPoint: 'Bhopal, Madhya Pradesh, India',
  destination: 'Goa, India',
  startDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
  numberOfDays: 3,
  numberOfTravelers: 2,
  budget: 15000,
  currency: 'INR',
  travelType: 'Couple',
  travelPace: 'Balanced',
  interests: ['Beaches', 'Food', 'Adventure'],
  foodPreference: 'No Preference',
  transportPreference: 'Mixed',
  accommodation: 'Mid-range',
  additionalRequirements: 'Sunset beach views, local Goan seafood recommendations, and light water sports.',
};

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Default Initial Trip Form State (pre-filled with Goa demo for instant showcase)
  const [formData, setFormData] = useState<TripFormData>(defaultTripData);

  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  // Immediately initialize with high-fidelity demo itinerary so all new features are visible on load!
  const [generatedItinerary, setGeneratedItinerary] = useState<Itinerary | null>(() => 
    createSampleItinerary(defaultTripData)
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMode, setLoadingMode] = useState<'generate' | 'regenerate'>('generate');
  const [generationError, setGenerationError] = useState<GenerationError | null>(null);

  const [isMyTripsOpen, setIsMyTripsOpen] = useState(false);
  const [demoLoadedNotification, setDemoLoadedNotification] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  // Load saved trips scoped strictly by logged in user UID
  useEffect(() => {
    if (user?.uid) {
      const loaded = getSavedTrips(user.uid);
      setSavedTrips(loaded || []);
    } else {
      setSavedTrips([]);
    }
  }, [user?.uid]);

  // Scroll to planner helper
  const scrollToPlanner = () => {
    const el = document.getElementById('planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to dashboard helper
  const scrollToDashboard = () => {
    setTimeout(() => {
      const el = document.getElementById('itinerary-dashboard');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Try Demo function (Bhopal -> Goa, 3 days, 2 travelers, ₹15,000, Couple, Balanced, etc.)
  const handleTryDemo = () => {
    setFormData(defaultTripData);
    setGeneratedItinerary(createSampleItinerary(defaultTripData));
    setDemoLoadedNotification(true);
    setTimeout(() => setDemoLoadedNotification(false), 5000);
    scrollToDashboard();
  };

  // Handler for successful itinerary generation
  const handleItineraryGenerated = (itinerary: Itinerary) => {
    setGeneratedItinerary(itinerary);
    setGenerationError(null);
    scrollToDashboard();
  };

  // Regenerate handler: Sends current planner form back to Gemma 4 31B
  const handleRegenerate = async () => {
    setLoadingMode('regenerate');
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await requestGemmaItinerary(formData);
      if (response.success && response.itinerary) {
        setGeneratedItinerary(response.itinerary);
        scrollToDashboard();
      } else {
        setGenerationError(response.error || {
          type: 'UNKNOWN_ERROR',
          message: 'Unable to regenerate your itinerary right now. Please try again.',
          modelTargeted: 'gemma-4-31b-it'
        });
        scrollToPlanner();
      }
    } catch (err: any) {
      setGenerationError({
        type: 'NETWORK_ERROR',
        message: 'Network error while regenerating itinerary.',
        modelTargeted: 'gemma-4-31b-it'
      });
      scrollToPlanner();
    } finally {
      setIsGenerating(false);
      setLoadingMode('generate');
    }
  };

  // Save new trip to storage (scoped to user)
  const handleSaveTrip = (newTrip: SavedTrip) => {
    if (!user?.uid) return;
    saveTripToStorage(newTrip, user.uid);
    setSavedTrips(prev => {
      const exists = prev.some(t => t.id === newTrip.id);
      return exists ? prev : [newTrip, ...prev];
    });
  };

  // Delete trip from storage
  const handleDeleteTrip = (id: string) => {
    if (!user?.uid) return;
    const updated = deleteTripFromStorage(id, user.uid);
    setSavedTrips(updated);
  };

  // Open saved trip from My Trips Modal
  const handleSelectSavedTrip = (savedTrip: SavedTrip) => {
    setGeneratedItinerary(savedTrip.itinerary);
    if (savedTrip.plannerData) {
      setFormData(savedTrip.plannerData);
    }
    setIsMyTripsOpen(false);
    scrollToDashboard();
  };

  // 1. Loading state during auth verification
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // 2. Authentication Landing Screen when user is logged out
  if (!isAuthenticated || !user) {
    return <AuthLanding />;
  }

  // 3. Authenticated TripGenie Application
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-sky-500/20 selection:text-sky-900 dark:selection:text-sky-200 transition-colors duration-200">
      {/* Animated Loading Overlay with dynamic steps */}
      {isGenerating && (
        <LoadingOverlay
          destination={formData.destination}
          mode={loadingMode}
        />
      )}

      {/* Authenticated Navbar */}
      <Navbar
        onPlanTripClick={scrollToPlanner}
        onMyTripsClick={() => setIsMyTripsOpen(true)}
        savedTripsCount={savedTrips.length}
      />

      {/* Personalized Welcome Banner */}
      {showWelcomeBanner && (
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-500 text-white py-2 px-4 text-xs font-semibold shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
              <span>
                Welcome back, <strong>{user.fullName || 'Traveler'}</strong> 👋 Your personal travel library is ready.
              </span>
            </div>
            <button
              onClick={() => setShowWelcomeBanner(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition cursor-pointer"
              aria-label="Dismiss greeting"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Protected Application Content */}
      <main>
        {/* Hero Section */}
        <HeroSection
          onPlanTripClick={scrollToPlanner}
          onTryDemoClick={handleTryDemo}
        />

        {/* Multi-Section Trip Planner Form */}
        <TripPlanner
          formData={formData}
          setFormData={setFormData}
          onSaveTrip={handleSaveTrip}
          onItineraryGenerated={handleItineraryGenerated}
          isGenerating={isGenerating}
          setIsGenerating={(gen) => {
            setLoadingMode('generate');
            setIsGenerating(gen);
          }}
          generationError={generationError}
          setGenerationError={setGenerationError}
          demoLoadedNotification={demoLoadedNotification}
        />

        {/* AI-Generated Itinerary Dashboard */}
        {generatedItinerary && (
          <ItineraryDashboard
            itinerary={generatedItinerary}
            plannerData={formData}
            onEditTrip={scrollToPlanner}
            onRegenerate={handleRegenerate}
            onSaveTrip={handleSaveTrip}
            onBackToPlanner={scrollToPlanner}
            onUpdateItinerary={(updated) => {
              setGeneratedItinerary(updated);
            }}
          />
        )}

        {/* How It Works (3 Steps) */}
        <HowItWorks onPlanTripClick={scrollToPlanner} />

        {/* Features Section */}
        <FeaturesSection
          onPlanTripClick={scrollToPlanner}
          onMyTripsClick={() => setIsMyTripsOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onPlanTripClick={scrollToPlanner}
        onMyTripsClick={() => setIsMyTripsOpen(true)}
      />

      {/* My Trips Modal */}
      <MyTripsModal
        isOpen={isMyTripsOpen}
        onClose={() => setIsMyTripsOpen(false)}
        savedTrips={savedTrips}
        onSelectTrip={handleSelectSavedTrip}
        onDeleteTrip={handleDeleteTrip}
        onPlanTripClick={scrollToPlanner}
      />

      {/* Global Authentication Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
