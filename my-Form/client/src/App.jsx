import React, { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ComponentPage from "./components/ComponentPage";
import { getUser, isAuthenticated, logoutUser } from "./utils/auth";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return isAuthenticated() ? getUser() : null;
  });
  const [activePage, setActivePage] = useState(() => {
    return isAuthenticated() ? "component" : "signup";
  });

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setActivePage("component");
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setActivePage("login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 py-8 sm:py-12 font-sans">
      <main className="w-full max-w-md">
        {activePage === "signup" && (
          <Signup
            onAuthSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setActivePage("login")}
          />
        )}

        {activePage === "login" && (
          <Login
            onAuthSuccess={handleAuthSuccess}
            onSwitchToSignup={() => setActivePage("signup")}
          />
        )}

        {activePage === "component" && (
          <ComponentPage
            user={currentUser}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}
