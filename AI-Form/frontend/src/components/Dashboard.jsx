import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMeApi } from '../services/api';
import {
  User,
  Mail,
  Calendar,
  Key,
  ShieldCheck,
  LogOut,
  RefreshCw,
  CheckCircle2,
  Lock,
  Server,
  Database
} from 'lucide-react';

export const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [testApiResult, setTestApiResult] = useState(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  // Decode JWT payload for inspection (client-side visualization)
  const decodedToken = React.useMemo(() => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        return { header, payload, signature: parts[2] };
      }
    } catch {
      return null;
    }
    return null;
  }, [token]);

  const handleTestProtectedEndpoint = async () => {
    setIsTestingApi(true);
    try {
      const data = await getMeApi(token);
      setTestApiResult({
        success: true,
        message: 'JWT Token verified by Express backend!',
        data: data.user,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      setTestApiResult({
        success: false,
        message: err.message,
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-indigo-900/60 via-slate-900/80 to-purple-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/30 ring-2 ring-white/10">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Welcome, {user?.name}!
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                You are securely logged into your account via JWT authentication.
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-red-500/15 text-slate-300 hover:text-red-300 border border-slate-700/60 hover:border-red-500/30 text-sm font-medium transition-all shadow-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User profile card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-5">
            <Database className="w-4 h-4" />
            MongoDB User Record
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400">
                <User className="w-4 h-4" /> Name:
              </div>
              <span className="text-slate-200 font-medium">{user?.name}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4" /> Email:
              </div>
              <span className="text-slate-200 font-mono text-xs sm:text-sm">{user?.email}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400">
                <Key className="w-4 h-4" /> MongoDB ID:
              </div>
              <span className="text-slate-400 font-mono text-xs truncate max-w-[180px]">
                {user?._id || user?.id}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4" /> Created At:
              </div>
              <span className="text-slate-300 text-xs">
                {user?.createdAt ? new Date(user.createdAt).toLocaleString() : 'Just now'}
              </span>
            </div>
          </div>
        </div>

        {/* Live JWT Protected API Test Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Server className="w-4 h-4" />
                Live Protected API Verification
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Click below to send a live <code className="text-indigo-300">GET /api/auth/me</code> request with your JWT Bearer token in the header.
            </p>

            <button
              onClick={handleTestProtectedEndpoint}
              disabled={isTestingApi}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingApi ? 'animate-spin text-indigo-400' : ''}`} />
              {isTestingApi ? 'Verifying Token with Server...' : 'Test GET /api/auth/me (Bearer Token)'}
            </button>
          </div>

          {testApiResult && (
            <div
              className={`mt-4 p-3 rounded-xl border text-xs font-mono transition-all ${
                testApiResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-950/40 border-red-500/30 text-red-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Status: 200 OK (Verified)
                </span>
                <span className="text-[10px] opacity-70">{testApiResult.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Server validated JWT signature and retrieved user: <strong className="text-emerald-400">{testApiResult.data?.name}</strong> ({testApiResult.data?.email})
              </p>
            </div>
          )}
        </div>
      </div>

      {/* JWT Inspector Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            JWT Token Inspector
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Algorithm: HS256 • Type: JWT
          </span>
        </div>

        <div className="space-y-4">
          {/* Raw Token Preview */}
          <div>
            <span className="text-xs text-slate-400 font-semibold block mb-1">
              Active Authorization Header
            </span>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 break-all select-all">
              <span className="text-purple-400 font-bold">Bearer </span>
              {token}
            </div>
          </div>

          {/* Decoded Payload */}
          {decodedToken && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-xs text-slate-400 font-semibold block mb-1">
                  Decoded Header
                </span>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-[11px] text-pink-400 overflow-x-auto">
                  {JSON.stringify(decodedToken.header, null, 2)}
                </pre>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block mb-1">
                  Decoded Payload
                </span>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-[11px] text-indigo-400 overflow-x-auto">
                  {JSON.stringify(decodedToken.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

