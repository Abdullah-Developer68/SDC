import React from "react";
import { logoutUser } from "../utils/auth";

export default function ComponentPage({ user, onLogout }) {
  const handleLogout = () => {
    logoutUser();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
        ✓
      </div>

      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
        You are logged in!
      </h2>

      <p className="text-slate-600 text-sm mb-6">
        Current user:{" "}
        <span className="font-semibold text-slate-900">
          {user?.username || "User"}
        </span>{" "}
        ({user?.email || "No email"})
      </p>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 cursor-pointer shadow-sm"
      >
        Log Out
      </button>
    </div>
  );
}

