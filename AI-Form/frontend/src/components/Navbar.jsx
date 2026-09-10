import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, User, Database, Key } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AuthVault
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono tracking-wider">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <Database className="w-3 h-3" /> MongoDB
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-purple-400">
                <Key className="w-3 h-3" /> JWT
              </span>
            </div>
          </div>
        </div>

        {/* Right side action */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-full py-1.5 px-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-semibold">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="text-xs text-slate-200 font-medium max-w-[120px] sm:max-w-[180px] truncate">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-red-500/10 hover:border-red-500/30 border border-slate-700/60 transition-all duration-200"
                title="Log out of session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center p-1 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                  activeTab === 'signup'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

