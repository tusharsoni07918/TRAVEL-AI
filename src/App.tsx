import React, { useState } from 'react';
import { TripFormData, SavedTrip } from './types/travel';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TripPlanner } from './components/TripPlanner';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesSection } from './components/FeaturesSection';
import { MyTripsModal } from './components/MyTripsModal';
import { Footer } from './components/Footer';

export default function App() {
  // Default Initial Trip Form State
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    startDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
    numberOfDays: 3,
    numberOfTravelers: 2,
    budget: 15000,
    currency: '₹',
    travelType: 'Couple',
    travelPace: 'Balanced',
    interests: ['Beaches', 'Food'],
    foodPreference: 'No Preference',
    transportPreference: 'Mixed',
    accommodation: 'Mid-range',
    additionalRequirements: '',
  });

  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([
    {
      id: 'trip-demo-goa',
      destination: 'Goa',
      durationDays: 3,
      travelers: 2,
      travelType: 'Couple',
      budgetFormatted: '₹ 15,000',
      createdDate: 'Oct 6, 2026',
      status: 'Ready',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80'
    }
  ]);

  const [isMyTripsOpen, setIsMyTripsOpen] = useState(false);
  const [demoLoadedNotification, setDemoLoadedNotification] = useState(false);

  // Scroll to planner helper
  const scrollToPlanner = () => {
    const el = document.getElementById('planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Try Demo function: Populates exact specs requested by user
  const handleTryDemo = () => {
    setFormData({
      destination: 'Goa',
      startDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      numberOfDays: 3,
      numberOfTravelers: 2,
      budget: 15000,
      currency: '₹',
      travelType: 'Couple',
      travelPace: 'Balanced',
      interests: ['Beaches', 'Food', 'Adventure'],
      foodPreference: 'No Preference',
      transportPreference: 'Mixed',
      accommodation: 'Mid-range',
      additionalRequirements: 'Sunset beach views, local Goan seafood recommendations, and light water sports.',
    });

    setDemoLoadedNotification(true);
    setTimeout(() => setDemoLoadedNotification(false), 6000);

    scrollToPlanner();
  };

  // Save new trip
  const handleSaveTrip = (newTrip: SavedTrip) => {
    setSavedTrips(prev => [newTrip, ...prev]);
  };

  // Delete trip
  const handleDeleteTrip = (id: string) => {
    setSavedTrips(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-500/20 selection:text-sky-900">
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
          demoLoadedNotification={demoLoadedNotification}
        />

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
        onDeleteTrip={handleDeleteTrip}
        onPlanTripClick={scrollToPlanner}
      />
    </div>
  );
}
