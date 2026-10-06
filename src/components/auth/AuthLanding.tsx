import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  Loader2, 
  Sun, 
  Moon, 
  Cpu, 
  MapPin, 
  Wallet, 
  Layers, 
  HeartHandshake,
  UserPlus,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const AuthLanding: React.FC = () => {
  const { login, register, forgotPassword } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Mode: 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Derive readable name from email if needed
  const deriveNameFromEmail = (em: string) => {
    if (!em || !em.includes('@')) return 'Traveler';
    const prefix = em.split('@')[0];
    const cleaned = prefix.replace(/[0-9._-]/g, ' ').trim();
    if (!cleaned) return 'Traveler';
    return cleaned
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const switchMode = (mode: 'login' | 'register' | 'forgot') => {
    setAuthMode(mode);
    setErrorMessage(null);
    setAccountNotFound(false);
    setSuccessMessage(null);
    
    // Smoothly carry over typed email & password to Create Account
    if (mode === 'register') {
      if (password && !confirmPassword) {
        setConfirmPassword(password);
      }
      if (!fullName && email) {
        setFullName(deriveNameFromEmail(email));
      }
    }
  };

  const isEmailValid = (em: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.trim());

  // Handle Login Submit
  const handleLoginSubmit = async (e?: React.FormEvent, autoRegister = false) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setAccountNotFound(false);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !isEmailValid(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const derived = fullName.trim() || deriveNameFromEmail(trimmedEmail);
      const res = await login({
        email: trimmedEmail,
        password,
        autoRegisterIfMissing: autoRegister,
        fullName: derived
      });

      if (res.success) {
        setSuccessMessage('Welcome back! Loading your travel dashboard...');
      } else {
        if (res.accountNotFound) {
          setAccountNotFound(true);
          setErrorMessage(`No account found for "${trimmedEmail}". Click below to create your account instantly.`);
        } else {
          setErrorMessage(res.error || 'Invalid email or password. Please check your credentials.');
        }
      }
    } catch (err: any) {
      setErrorMessage('Unable to connect to authentication server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant 1-click create & sign in
  const handleInstantCreateAndLogin = async () => {
    await handleLoginSubmit(undefined, true);
  };

  // Quick Demo sign in (Golu Kushwaha / Demo Traveler)
  const handleDemoSignIn = async () => {
    setEmail('golukushwaha82698@gmail.com');
    setPassword('TripGenie2026!');
    setFullName('Golu Kushwaha');
    setIsSubmitting(true);
    setErrorMessage(null);
    setAccountNotFound(false);
    try {
      const res = await login({
        email: 'golukushwaha82698@gmail.com',
        password: 'TripGenie2026!',
        autoRegisterIfMissing: true,
        fullName: 'Golu Kushwaha'
      });
      if (res.success) {
        setSuccessMessage('Signed in as Golu Kushwaha! Opening TripGenie...');
      } else {
        setErrorMessage(res.error || 'Unable to sign in.');
      }
    } catch (err: any) {
      setErrorMessage('Authentication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setAccountNotFound(false);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!trimmedEmail || !isEmailValid(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password.');
      return;
    }
    if (!termsAccepted) {
      setErrorMessage('Please accept the Terms & Conditions to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        fullName: fullName.trim(),
        email: trimmedEmail,
        password,
      });
      if (res.success) {
        setSuccessMessage('Account created successfully! Entering TripGenie AI...');
      } else {
        setErrorMessage(res.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Unable to connect to authentication server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setAccountNotFound(false);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !isEmailValid(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await forgotPassword(trimmedEmail);
      if (res.success) {
        setSuccessMessage(res.message || 'Password reset guidance has been sent to your email.');
      } else {
        setErrorMessage(res.error || 'Unable to request password reset. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Unable to connect to authentication server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500/20 selection:text-sky-300 relative overflow-hidden transition-colors">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">
                TripGenie <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">AI</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-950/80 text-sky-300 border border-sky-800">
                <Sparkles className="w-2.5 h-2.5" />
                Gemma 4 31B
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Your Journey. Your Budget. Your Perfect Plan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-amber-400 hover:bg-slate-800 transition cursor-pointer shadow-xs"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </header>

      {/* Main Split Content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
          
          {/* LEFT COLUMN: Branding, Value Proposition & Feature Cards */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/80 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Gen Travel Engine • Gemma 4 31B IT</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Your Next Adventure,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-teal-300">
                  Planned by AI.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Create personalized, budget-aware travel itineraries from your departure city to dream destinations. Let AI adapt your journey whenever your plans change.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xs space-y-1.5">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered Itineraries</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Day-by-day morning, afternoon & evening plans generated by Gemma 4 31B.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xs space-y-1.5">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                  <Wallet className="w-4 h-4" />
                  <span>Smart Budget Planning</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Realistic intercity transit costs, accommodation, food, and daily expense breakdowns.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xs space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Layers className="w-4 h-4" />
                  <span>Adaptive Travel Plans</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  One-click AI tweaks: make it cheaper, relaxing, food-focused, or couple-friendly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xs space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Traveler's Smart Toolkit</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Packing checklists, photo spots, offline passes, and local language etiquette.
                </p>
              </div>
            </div>

            {/* Quick trust metrics */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                100% Free & Unlimited
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                Personal User Space
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-400" />
                Point-to-Point Departure Logic
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Authentication Card */}
          <div className="lg:col-span-6 max-w-md w-full mx-auto">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/80 backdrop-blur-md relative overflow-hidden">
              
              {/* Top accent ribbon */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-teal-400" />

              {/* Card Header & Tab Switcher */}
              <div className="space-y-4 text-center pb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {authMode === 'login' && 'Welcome to TripGenie AI'}
                    {authMode === 'register' && 'Create Your Account'}
                    {authMode === 'forgot' && 'Reset Your Password'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {authMode === 'login' && 'Sign in to access your saved journeys and customized AI itineraries.'}
                    {authMode === 'register' && 'Join TripGenie AI to plan, personalize, and save trips across devices.'}
                    {authMode === 'forgot' && 'Enter your email address and we will help you reset your password.'}
                  </p>
                </div>

                {/* Tab Switcher Buttons */}
                {authMode !== 'forgot' && (
                  <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 mt-2">
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                        authMode === 'login'
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                        authMode === 'register'
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>

              {/* Feedback Alerts */}
              <div className="my-3 space-y-2">
                {errorMessage && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-700 text-rose-200 text-xs space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <span>{errorMessage}</span>
                    </div>

                    {/* Actionable button if account was not found */}
                    {accountNotFound && (
                      <button
                        type="button"
                        onClick={handleInstantCreateAndLogin}
                        disabled={isSubmitting}
                        className="w-full mt-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Create Account with this Email & Sign In</span>
                      </button>
                    )}
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    <span>{successMessage}</span>
                  </div>
                )}
              </div>

              {/* Form Content */}
              <div className="pt-2">
                {/* 1. SIGN IN FORM */}
                {authMode === 'login' && (
                  <form onSubmit={(e) => handleLoginSubmit(e, false)} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (accountNotFound) setAccountNotFound(false);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder="traveler@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-950 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => switchMode('forgot')}
                          className="text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-950 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to TripGenie</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Quick 1-Click Access for Golu Kushwaha / Demo */}
                    <div className="pt-2">
                      <div className="relative flex items-center justify-center my-2">
                        <div className="border-t border-slate-800 w-full" />
                        <span className="bg-slate-900 px-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          Or Instant Access
                        </span>
                        <div className="border-t border-slate-800 w-full" />
                      </div>

                      <button
                        type="button"
                        onClick={handleDemoSignIn}
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Quick Sign In as Golu Kushwaha</span>
                      </button>
                    </div>

                    <div className="text-center pt-2">
                      <p className="text-xs text-slate-400">
                        Don't have an account yet?{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('register')}
                          className="font-bold text-sky-400 hover:text-sky-300 hover:underline cursor-pointer"
                        >
                          Create Account
                        </button>
                      </p>
                    </div>
                  </form>
                )}

                {/* 2. REGISTER FORM */}
                {authMode === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Golu Kushwaha"
                          className="w-full pl-10 pr-4 py-2 bg-slate-950/80 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-950 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="golukushwaha82698@gmail.com"
                          className="w-full pl-10 pr-4 py-2 bg-slate-950/80 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-950 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Password (min 8 characters)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2 bg-slate-950/80 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-950 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-10 py-2 bg-slate-950/80 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                            confirmPassword && confirmPassword !== password
                              ? 'border-rose-500 focus:ring-rose-950'
                              : 'border-slate-800 focus:border-sky-500 focus:ring-sky-950'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {confirmPassword && confirmPassword !== password && (
                        <p className="text-[11px] text-rose-400 font-medium mt-1">
                          Passwords do not match.
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="terms-landing"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500 h-4 w-4"
                      />
                      <label htmlFor="terms-landing" className="text-xs text-slate-400 cursor-pointer">
                        I accept the TripGenie AI terms and travel guidelines
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Create Account & Enter</span>
                        </>
                      )}
                    </button>

                    <div className="text-center pt-1">
                      <p className="text-xs text-slate-400">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('login')}
                          className="font-bold text-sky-400 hover:text-sky-300 hover:underline cursor-pointer"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </form>
                )}

                {/* 3. FORGOT PASSWORD FORM */}
                {authMode === 'forgot' && (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Your Registered Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="golukushwaha82698@gmail.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-950 transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending instructions...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>Send Reset Instructions</span>
                        </>
                      )}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="text-xs font-bold text-sky-400 hover:text-sky-300 hover:underline cursor-pointer"
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Card Footer Trust Note */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted Session • User-Scoped Travel Space</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 px-4 py-5 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} TripGenie AI. Powered by Google's Gemma 4 31B IT. All rights reserved.</p>
      </footer>
    </div>
  );
};
