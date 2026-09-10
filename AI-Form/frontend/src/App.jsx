import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { Dashboard } from './components/Dashboard';
import { Loader2, ShieldCheck, Database, FileCode2, Layers, Server } from 'lucide-react';

const MainContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('signup');

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <Loader2 className="w-6 h-6 text-indigo-400 absolute" />
        </div>
        <p className="mt-4 text-sm text-slate-400 font-medium">
          Verifying security session...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <div className="w-full max-w-md">
            {/* View Switcher Tabs */}
            <div className="flex rounded-2xl bg-slate-900/90 p-1.5 border border-slate-800 mb-8 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Render Form */}
            {activeTab === 'signup' ? (
              <SignupForm onSwitchToLogin={() => setActiveTab('login')} />
            ) : (
              <LoginForm onSwitchToSignup={() => setActiveTab('signup')} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-850 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MongoDB Connected & JWT Secured</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> React 19
            </span>
            <span className="flex items-center gap-1">
              <FileCode2 className="w-3.5 h-3.5 text-sky-400" /> Tailwind CSS
            </span>
            <span className="flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-emerald-400" /> Express.js
            </span>
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-green-400" /> Mongoose
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
