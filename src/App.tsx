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
import { Footer } from './components/Footer';
import { getSavedTrips, saveTripToStorage, deleteTripFromStorage } from './services/storage';
import { requestGemmaItinerary } from './services/itineraryApi';
import { createSampleItinerary } from './services/sampleItinerary';

const defaultTripData: TripFormData = {
  destination: 'Goa',
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

export default function App() {
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

  // Load saved trips from localStorage on mount
  useEffect(() => {
    const loaded = getSavedTrips();
    if (loaded && loaded.length > 0) {
      setSavedTrips(loaded);
    }
  }, []);

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

  // Section 12: Try Demo function (Goa, 3 days, 2 travelers, ₹15,000, Couple, Balanced, etc.)
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

  // Save new trip to localStorage and state
  const handleSaveTrip = (newTrip: SavedTrip) => {
    saveTripToStorage(newTrip);
    setSavedTrips(prev => {
      const exists = prev.some(t => t.id === newTrip.id);
      return exists ? prev : [newTrip, ...prev];
    });
  };

  // Delete trip from localStorage and state
  const handleDeleteTrip = (id: string) => {
    const updated = deleteTripFromStorage(id);
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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-500/20 selection:text-sky-900">
      {/* Animated Loading Overlay with dynamic steps */}
      {isGenerating && (
        <LoadingOverlay
          destination={formData.destination}
          mode={loadingMode}
        />
      )}

      {/* Responsive Navbar */}
      <Navbar
        onPlanTripClick={scrollToPlanner}
        onMyTripsClick={() => setIsMyTripsOpen(true)}
        savedTripsCount={savedTrips.length}
      />

      {/* Main Content */}
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
    </div>
  );
}
