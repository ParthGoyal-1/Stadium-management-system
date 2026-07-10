import React, { useState, lazy, Suspense, useCallback } from "react";
import { UserRole } from "./types";
import StadiumVisualizer from "./components/StadiumVisualizer";
import LiveTelemetryStream from "./components/LiveTelemetryStream";
import DemoNarrative from "./components/DemoNarrative";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Custom custom hooks for enterprise modularity
import { useAppTheme } from "./hooks/useAppTheme";
import { useNotifications } from "./hooks/useNotifications";
import { useStadiumState } from "./hooks/useStadiumState";
import { useRoleAccess } from "./hooks/useRoleAccess";
import { useWalkthrough } from "./hooks/useWalkthrough";

// Lazy loaded modules for performance optimization
const FanApp = lazy(() => import("./components/FanApp"));
const VolunteerApp = lazy(() => import("./components/VolunteerApp"));
import OrganizerDashboard from "./components/OrganizerDashboard";
import AppGuidebook from "./components/AppGuidebook";

import { Shield, Compass, Users, Cloud, Clock, CheckCircle2, AlertTriangle, Info, Moon, Sun, Settings, Check, X, Accessibility, Navigation, MessageSquare, Zap, Activity, BookOpen } from "lucide-react";

const LoaderFallback = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center font-sans space-y-3 bg-slate-900/40 border border-slate-800 rounded-2xl w-full">
    <div className="relative">
      <div className="w-10 h-10 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-teal-400 rounded-full animate-ping" />
    </div>
    <div className="text-xs font-mono text-teal-400">Loading Tactical Module...</div>
  </div>
);

/**
 * Main application entry component for the AI Stadium Command Center.
 * Manages the global stadium telemetry state, UI theme switcher, portal role restrictions,
 * and the synchronized multi-role walkthrough system.
 *
 * @component
 */
export default function App() {
  const { theme, setTheme, toggleTheme } = useAppTheme();
  const { notifications, addSystemNotification } = useNotifications();
  const [activeRole, setActiveRole] = useState<UserRole>("fan");

  const {
    stadiumState,
    setStadiumState,
    activePresetIndex,
    setActivePresetIndex,
    handleSelectPreset,
    handleUpdateVolunteerStatus,
    handleAddIncident,
    handleResolveIncident,
  } = useStadiumState(addSystemNotification);

  const {
    activeStepId,
    setActiveStepId,
    selectedSectorId,
    setSelectedSectorId,
    selectedGateId,
    setSelectedGateId,
    handleStepChange,
    handleResetDemo,
  } = useWalkthrough({
    setStadiumState,
    setActivePresetIndex,
    setActiveRole,
    addSystemNotification,
  });

  const {
    isSettingsOpen,
    setIsSettingsOpen,
    pendingRole,
    setPendingRole,
    passwordInput,
    setPasswordInput,
    passwordError,
    setPasswordError,
    handlePasswordSubmit,
  } = useRoleAccess({
    onRoleChange: setActiveRole,
    addSystemNotification,
  });

  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);
  const [activeFanTab, setActiveFanTab] = useState<number>(1);
  const [activeVolunteerTab, setActiveVolunteerTab] = useState<number>(1);
  const [activeOrganizerTab, setActiveOrganizerTab] = useState<number>(1);


  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* Skip to Main Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-teal-500 focus:text-slate-950 focus:font-bold focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:shadow-2xl transition"
      >
        Skip to Main Content
      </a>

      {/* Dynamic Toast Notifications */}
      <div 
        className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
        role="log"
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl p-4 shadow-2xl border backdrop-blur-md animate-slideIn ${
              n.type === 'success' 
                ? "bg-emerald-950/90 border-emerald-500/35 text-emerald-300"
                : n.type === 'alert'
                ? "bg-rose-950/90 border-rose-500/35 text-rose-300"
                : "bg-slate-900/95 border-slate-700/60 text-slate-200"
            }`}
          >
            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" aria-hidden="true" />}
            {n.type === 'alert' && <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 animate-pulse" aria-hidden="true" />}
            {n.type === 'info' && <Info className="w-5 h-5 text-sky-400 flex-shrink-0" aria-hidden="true" />}
            
            <div className="flex-1 text-xs font-sans leading-relaxed">
              {n.message}
            </div>
          </div>
        ))}
      </div>

      {/* STADIUM COMMAND CENTRE GLOBAL HEADER */}
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center shadow-lg shadow-teal-500/10">
              <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-sans font-bold tracking-tight text-slate-100 text-base flex items-center gap-2">
                Stadium Digital Command Center
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
                  AI Stadium Copilot
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Integrated Fan Guidance, Volunteer Dispatch &amp; Safety Intelligence Platform</p>
            </div>
          </div>

          {/* Quick Telemetry and Theme Toggle Bar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 bg-slate-950/60 border border-slate-900 px-4 py-2 rounded-xl">
              <span className="flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-sky-400" />
                {stadiumState.weather.condition}
              </span>
              <span className="w-px h-3 bg-slate-800" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                Sim Time: {stadiumState.simulatedTime}
              </span>
              <span className="w-px h-3 bg-slate-800" />
              <span className="flex items-center gap-1.5 text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                {stadiumState.incidents.filter(i => i.status !== "Resolved").length} Alerts
              </span>
            </div>

            {/* Settings Button Control */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                aria-haspopup="dialog"
                aria-expanded={isSettingsOpen}
                aria-controls="settings-panel"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/60 border ${
                  isSettingsOpen 
                    ? "border-teal-500 text-teal-400 shadow-lg shadow-teal-500/10" 
                    : "border-slate-900 text-slate-400 hover:text-teal-400 hover:border-slate-800"
                } shadow-md transition duration-300 pointer-events-auto cursor-pointer text-xs font-sans font-medium focus-visible:ring-2 focus-visible:ring-teal-500 outline-none`}
                title="System Preferences & Modes"
              >
                <Settings className={`w-4 h-4 ${isSettingsOpen ? 'animate-spin-slow' : ''}`} aria-hidden="true" />
                <span>Settings</span>
              </button>

              {/* Settings Mini Panel Popover */}
              {isSettingsOpen && (
                <>
                  {/* Click outside to close overlay */}
                  <div 
                    className="fixed inset-0 z-40 pointer-events-auto" 
                    aria-hidden="true"
                    onClick={() => setIsSettingsOpen(false)}
                  />
                  
                  <div 
                    id="settings-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="System Preferences"
                    className="absolute right-0 mt-3 w-80 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-4 z-50 backdrop-blur-xl animate-fadeIn font-sans pointer-events-auto focus:outline-none"
                  >
                    {/* Popover Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-teal-400" aria-hidden="true" />
                        <span className="text-xs font-bold tracking-wide uppercase text-slate-200">System Preferences</span>
                      </div>
                      <button 
                        onClick={() => setIsSettingsOpen(false)}
                        aria-label="Close System Preferences"
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Theme Selector Section */}
                    <div className="space-y-2 mb-4">
                      <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">App Theme</div>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Pure Dark Option */}
                        <button
                          onClick={() => {
                            setTheme("dark");
                            addSystemNotification("Switched to Pure Dark Theme", "info");
                          }}
                          className={`flex items-center gap-1.5 p-2 rounded-xl border text-left transition duration-200 cursor-pointer w-full ${
                            theme === "dark"
                              ? "bg-teal-500/10 border-teal-500/40 text-teal-400 shadow-sm shadow-teal-500/5"
                              : "bg-slate-950/40 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <Moon className="w-3.5 h-3.5 flex-shrink-0" />
                          <div className="text-xs font-medium">Pure Dark</div>
                          {theme === "dark" && <Check className="w-3.5 h-3.5 ml-auto text-teal-400 flex-shrink-0" />}
                        </button>

                        {/* Modern Light Option */}
                        <button
                          onClick={() => {
                            setTheme("light");
                            addSystemNotification("Switched to Modern Perfect Light Theme", "info");
                          }}
                          className={`flex items-center gap-1.5 p-2 rounded-xl border text-left transition duration-200 cursor-pointer w-full ${
                            theme === "light"
                              ? "bg-teal-500/10 border-teal-500/40 text-teal-400 shadow-sm shadow-teal-500/5"
                              : "bg-slate-950/40 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <Sun className="w-3.5 h-3.5 flex-shrink-0 text-amber-500" />
                          <div className="text-xs font-medium">Perfect Light</div>
                          {theme === "light" && <Check className="w-3.5 h-3.5 ml-auto text-teal-400 flex-shrink-0" />}
                        </button>
                      </div>
                    </div>

                    {/* Switch Modes of Use (Roles) */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">App Mode</div>
                      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                        {/* Supporter App Mode */}
                        <button
                          onClick={() => {
                            setActiveRole("fan");
                            setPendingRole(null);
                            setPasswordInput("");
                            setPasswordError(null);
                            addSystemNotification("Switched to Supporter Interface.", "info");
                          }}
                          className={`w-full flex items-start gap-3 p-2 rounded-xl border text-left transition duration-200 cursor-pointer ${
                            activeRole === "fan" && !pendingRole
                              ? "bg-teal-500/10 border-teal-500/40 text-teal-400 shadow-sm shadow-teal-500/5"
                              : "bg-slate-950/40 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <Users className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-400" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold">Supporter App</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed break-words">
                              Fan app simulator with ticketing, directions & reporting
                            </div>
                          </div>
                          {activeRole === "fan" && !pendingRole && <Check className="w-3.5 h-3.5 ml-1 mt-0.5 text-teal-400 flex-shrink-0" />}
                        </button>

                        {/* Volunteer App Mode */}
                        <button
                          onClick={() => {
                            if (activeRole === "volunteer") {
                              addSystemNotification("Already in Volunteer Portal.", "info");
                              return;
                            }
                            setPendingRole("volunteer");
                            setPasswordInput("");
                            setPasswordError(null);
                          }}
                          className={`w-full flex items-start gap-3 p-2 rounded-xl border text-left transition duration-200 cursor-pointer ${
                            activeRole === "volunteer" || pendingRole === "volunteer"
                              ? "bg-sky-500/10 border-sky-500/40 text-sky-400 shadow-sm shadow-sky-500/5"
                              : "bg-slate-950/40 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-sky-400" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold">Volunteer Portal</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed break-words">
                              Dispatch workspace with interactive tasks and checklist
                            </div>
                          </div>
                          {activeRole === "volunteer" && <Check className="w-3.5 h-3.5 ml-1 mt-0.5 text-sky-400 flex-shrink-0" />}
                        </button>

                        {/* Organizer Cockpit Mode */}
                        <button
                          onClick={() => {
                            if (activeRole === "organizer") {
                              addSystemNotification("Already in Organizer Cockpit.", "info");
                              return;
                            }
                            setPendingRole("organizer");
                            setPasswordInput("");
                            setPasswordError(null);
                          }}
                          className={`w-full flex items-start gap-3 p-2 rounded-xl border text-left transition duration-200 cursor-pointer ${
                            activeRole === "organizer" || pendingRole === "organizer"
                              ? "bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-sm shadow-amber-500/5"
                              : "bg-slate-950/40 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <Compass className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold">Organizer Cockpit</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed break-words">
                              Unified supervisor console, presets & map tactical overlay
                            </div>
                          </div>
                          {activeRole === "organizer" && <Check className="w-3.5 h-3.5 ml-1 mt-0.5 text-amber-500 flex-shrink-0" />}
                        </button>
                      </div>
                    </div>

                    {/* Password Entry Section */}
                    {pendingRole && (
                      <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-teal-500/30 animate-fadeIn space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-200">
                            Enter Password for {pendingRole === 'volunteer' ? 'Volunteer' : 'Organizer'}
                          </span>
                          <button 
                            onClick={() => { setPendingRole(null); setPasswordInput(""); setPasswordError(null); }}
                            className="text-[10px] text-slate-500 hover:text-slate-300 transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Password is <code className="text-teal-400 font-mono font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850">{pendingRole}</code>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="flex gap-2">
                          <div className="flex-1 min-w-0">
                            <label htmlFor="settings-password-input" className="sr-only">
                              Password for {pendingRole === 'volunteer' ? 'Volunteer' : 'Organizer'}
                            </label>
                            <input
                              id="settings-password-input"
                              type="text"
                              value={passwordInput}
                              onChange={(e) => {
                                setPasswordInput(e.target.value);
                                setPasswordError(null);
                              }}
                              placeholder={`Enter "${pendingRole}"`}
                              autoFocus
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500 transition"
                            />
                          </div>
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition cursor-pointer flex-shrink-0 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
                          >
                            Verify
                          </button>
                        </form>
                        {passwordError && (
                          <div className="text-[10px] text-rose-400 font-semibold leading-tight">
                            {passwordError}
                          </div>
                        )}
                      </div>
                    )}

                    {/* App Guidebook Button */}
                    <div className="pt-3.5 border-t border-slate-800/80 mt-4">
                      <button
                        onClick={() => {
                          setIsGuidebookOpen(true);
                          setIsSettingsOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500/10 to-sky-500/10 hover:from-teal-500/20 hover:to-sky-500/20 border border-teal-500/35 hover:border-teal-500/50 text-teal-300 font-bold text-xs tracking-wide transition duration-300 cursor-pointer shadow-md"
                        id="open-guidebook-btn"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Open App Guidebook</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* FAN MODE SUB-NAVIGATION TABS */}
      {activeRole === "fan" && (
        <div className="max-w-7xl w-full mx-auto px-6 pt-6">
          <div className="bg-slate-900/60 border border-slate-800 p-1 rounded-2xl flex flex-wrap gap-1 shadow-lg backdrop-blur-md">
            <button
              onClick={() => setActiveFanTab(1)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-300 cursor-pointer ${
                activeFanTab === 1
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>1. Tour & Telemetry</span>
            </button>
            <button
              onClick={() => setActiveFanTab(2)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-300 cursor-pointer ${
                activeFanTab === 2
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>2. AI Smart Advisory</span>
            </button>
            <button
              onClick={() => setActiveFanTab(3)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-300 cursor-pointer ${
                activeFanTab === 3
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Accessibility className="w-4 h-4" />
              <span>3. Inclusive & Eco</span>
            </button>
            <button
              onClick={() => setActiveFanTab(4)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-300 cursor-pointer ${
                activeFanTab === 4
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>4. Multilingual Copilot</span>
            </button>
          </div>
        </div>
      )}

      {/* VOLUNTEER MODE SUB-NAVIGATION TABS */}
      {activeRole === "volunteer" && (
        <div className="max-w-7xl w-full mx-auto px-6 pt-6">
          <div className="bg-slate-900/60 border border-slate-800 p-1 rounded-2xl flex flex-wrap gap-1 shadow-lg backdrop-blur-md">
            <button
              onClick={() => setActiveVolunteerTab(1)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-300 cursor-pointer ${
                activeVolunteerTab === 1
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>1. Tour & Telemetry</span>
            </button>
            <button
              onClick={() => setActiveVolunteerTab(2)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-300 cursor-pointer ${
                activeVolunteerTab === 2
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>2. Duty & Dispatch</span>
            </button>
            <button
              onClick={() => setActiveVolunteerTab(3)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-300 cursor-pointer ${
                activeVolunteerTab === 3
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>3. Logger & Copilot</span>
            </button>
          </div>
        </div>
      )}

      {/* ORGANIZER MODE SUB-NAVIGATION TABS */}
      {activeRole === "organizer" && (
        <div className="max-w-7xl w-full mx-auto px-6 pt-6">
          <div className="bg-slate-900/60 border border-slate-800 p-1 rounded-2xl flex flex-wrap gap-1 shadow-lg backdrop-blur-md">
            <button
              onClick={() => setActiveOrganizerTab(1)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-300 cursor-pointer ${
                activeOrganizerTab === 1
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>1. Tour & Telemetry</span>
            </button>
            <button
              onClick={() => setActiveOrganizerTab(2)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-300 cursor-pointer ${
                activeOrganizerTab === 2
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>2. Live Operations</span>
            </button>
            <button
              onClick={() => setActiveOrganizerTab(3)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-300 cursor-pointer ${
                activeOrganizerTab === 3
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>3. Predictive Analytics</span>
            </button>
          </div>
        </div>
      )}

      {/* ORGANIZER MODE MAIN CONTAINER (Adaptive Multi-Page Layout) */}
      {activeRole === "organizer" && (
        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-6" tabIndex={-1}>
          {activeOrganizerTab === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
              {/* Left/Top: Tour Walkthrough */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden animate-slideIn">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4 font-mono">
                    <Compass className="w-4 h-4 text-amber-400" />
                    Interactive Tour Walkthrough
                  </h3>
                  <DemoNarrative
                    currentStepId={activeStepId}
                    onStepChange={handleStepChange}
                    onResetDemo={handleResetDemo}
                  />
                </div>
              </div>

              {/* Right/Bottom: Stadium Map & Telemetry Stream */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4 font-mono">
                    <Cloud className="w-4 h-4 text-sky-400" />
                    Arena Telemetry Map & Occupancy
                  </h3>
                  <StadiumVisualizer
                    state={stadiumState}
                    selectedSectorId={selectedSectorId}
                    onSelectSector={setSelectedSectorId}
                    selectedGateId={selectedGateId}
                    onSelectGate={setSelectedGateId}
                  />
                  <div className="mt-4 bg-slate-950/40 border border-slate-850 rounded-xl p-4 text-[11px] text-slate-400 leading-relaxed font-sans">
                    💡 <b>Interactive Tips:</b> Try clicking on sectors (North/East/South/West) or Gates (A/B/C/D) on the live telemetry map to inspect occupancies and alerts in real-time.
                  </div>
                </div>

                <LiveTelemetryStream
                  state={stadiumState}
                  activeStepId={activeStepId}
                  addSystemNotification={addSystemNotification}
                />
              </div>
            </div>
          )}

          {activeOrganizerTab === 2 && (
            <div className="animate-fadeIn">
              <ErrorBoundary><Suspense fallback={<LoaderFallback />}>
                <OrganizerDashboard
                  state={stadiumState}
                  onSelectPreset={handleSelectPreset}
                  activePresetIndex={activePresetIndex}
                  onResolveIncident={handleResolveIncident}
                  onUpdateVolunteerStatus={handleUpdateVolunteerStatus}
                  addSystemNotification={addSystemNotification}
                  activeStepId={activeStepId}
                  activeSection={2}
                />
              </Suspense></ErrorBoundary>
            </div>
          )}

          {activeOrganizerTab === 3 && (
            <div className="animate-fadeIn">
              <ErrorBoundary><Suspense fallback={<LoaderFallback />}>
                <OrganizerDashboard
                  state={stadiumState}
                  onSelectPreset={handleSelectPreset}
                  activePresetIndex={activePresetIndex}
                  onResolveIncident={handleResolveIncident}
                  onUpdateVolunteerStatus={handleUpdateVolunteerStatus}
                  addSystemNotification={addSystemNotification}
                  activeStepId={activeStepId}
                  activeSection={3}
                />
              </Suspense></ErrorBoundary>
            </div>
          )}
        </main>
      )}

      {/* VOLUNTEER MODE MAIN CONTAINER (Adaptive Multi-Page Layout) */}
      {activeRole === "volunteer" && (
        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-6" tabIndex={-1}>
          {activeVolunteerTab === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
              {/* Left/Top: Tour Walkthrough */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4 font-mono">
                    <Compass className="w-4 h-4 text-teal-400" />
                    Interactive Tour Walkthrough
                  </h3>
                  <DemoNarrative
                    currentStepId={activeStepId}
                    onStepChange={handleStepChange}
                    onResetDemo={handleResetDemo}
                  />
                </div>
              </div>

              {/* Right/Bottom: Stadium Map & Telemetry Stream */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4 font-mono">
                    <Cloud className="w-4 h-4 text-sky-400" />
                    Arena Telemetry Map & Occupancy
                  </h3>
                  <StadiumVisualizer
                    state={stadiumState}
                    selectedSectorId={selectedSectorId}
                    onSelectSector={setSelectedSectorId}
                    selectedGateId={selectedGateId}
                    onSelectGate={setSelectedGateId}
                  />
                  <div className="mt-4 bg-slate-950/40 border border-slate-850 rounded-xl p-4 text-[11px] text-slate-400 leading-relaxed font-sans">
                    💡 <b>Interactive Tips:</b> Try clicking on sectors (North/East/South/West) or Gates (A/B/C/D) on the live telemetry map to inspect occupancies and alerts in real-time.
                  </div>
                </div>

                <LiveTelemetryStream
                  state={stadiumState}
                  activeStepId={activeStepId}
                  addSystemNotification={addSystemNotification}
                />
              </div>
            </div>
          )}

          {activeVolunteerTab === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
              {/* Left: Volunteer status & dispatch tasks */}
              <div className="lg:col-span-7">
                <ErrorBoundary><Suspense fallback={<LoaderFallback />}>
                  <VolunteerApp
                    state={stadiumState}
                    onUpdateVolunteerStatus={handleUpdateVolunteerStatus}
                    onResolveIncident={handleResolveIncident}
                    onAddIncident={handleAddIncident}
                    addSystemNotification={addSystemNotification}
                    activeVolunteerTab={2}
                  />
                </Suspense></ErrorBoundary>
              </div>

              {/* Right: Live Telemetry & Event Stream */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4 font-mono">
                    <Cloud className="w-4 h-4 text-sky-400" />
                    Live Telemetry
                  </h3>
                  <StadiumVisualizer
                    state={stadiumState}
                    selectedSectorId={selectedSectorId}
                    onSelectSector={setSelectedSectorId}
                    selectedGateId={selectedGateId}
                    onSelectGate={setSelectedGateId}
                  />
                </div>

                <LiveTelemetryStream
                  state={stadiumState}
                  activeStepId={activeStepId}
                  addSystemNotification={addSystemNotification}
                />
              </div>
            </div>
          )}

          {activeVolunteerTab === 3 && (
            <div className="animate-fadeIn">
              <ErrorBoundary><Suspense fallback={<LoaderFallback />}>
                <VolunteerApp
                  state={stadiumState}
                  onUpdateVolunteerStatus={handleUpdateVolunteerStatus}
                  onResolveIncident={handleResolveIncident}
                  onAddIncident={handleAddIncident}
                  addSystemNotification={addSystemNotification}
                  activeVolunteerTab={3}
                />
              </Suspense></ErrorBoundary>
            </div>
          )}
        </main>
      )}

      {activeRole === "fan" && (
        /* FAN MODE MAIN CONTAINER (Adaptive Multi-Page Layout) */
        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-6" tabIndex={-1}>
          {activeFanTab === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
              {/* Left/Top: Walkthrough Story Narrative (Tour Walkthrough) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4 font-mono">
                    <Compass className="w-4 h-4 text-teal-400" />
                    Interactive Tour Walkthrough
                  </h3>
                  <DemoNarrative
                    currentStepId={activeStepId}
                    onStepChange={handleStepChange}
                    onResetDemo={handleResetDemo}
                  />
                </div>
              </div>

              {/* Right/Bottom: Stadium Map & Telemetry Stream (Arena Telemetry) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4 font-mono">
                    <Cloud className="w-4 h-4 text-sky-400" />
                    Arena Telemetry Map & Occupancy
                  </h3>
                  <StadiumVisualizer
                    state={stadiumState}
                    selectedSectorId={selectedSectorId}
                    onSelectSector={setSelectedSectorId}
                    selectedGateId={selectedGateId}
                    onSelectGate={setSelectedGateId}
                  />
                  <div className="mt-4 bg-slate-950/40 border border-slate-850 rounded-xl p-4 text-[11px] text-slate-400 leading-relaxed font-sans">
                    💡 <b>Interactive Tips:</b> Try clicking on sectors (North/East/South/West) or Gates (A/B/C/D) on the live telemetry map to inspect occupancies and alerts in real-time.
                  </div>
                </div>

                <LiveTelemetryStream
                  state={stadiumState}
                  activeStepId={activeStepId}
                  addSystemNotification={addSystemNotification}
                />
              </div>
            </div>
          )}

          {activeFanTab !== 1 && (
            <div className="animate-fadeIn font-sans">
              <ErrorBoundary><Suspense fallback={<LoaderFallback />}>
                <FanApp
                  state={stadiumState}
                  addIncident={handleAddIncident}
                  addSystemNotification={addSystemNotification}
                  activeFanTab={activeFanTab}
                />
              </Suspense></ErrorBoundary>
            </div>
          )}
        </main>
      )}

      {/* PLATFORM FOOTER */}
      <footer className="border-t border-slate-900 py-6 mt-12 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <div>
            Stadium Digital Command Center — COPILOT OS v3.5
          </div>
          <div className="flex gap-4">
            <span>Sensors: Active</span>
            <span>Grounding: Connected</span>
            <span>Security Rule: Compliant</span>
          </div>
        </div>
      </footer>

      {/* APP GUIDEBOOK OVERLAY MODAL */}
      <ErrorBoundary><Suspense fallback={null}>
        <AppGuidebook isOpen={isGuidebookOpen} onClose={() => setIsGuidebookOpen(false)} />
      </Suspense></ErrorBoundary>

    </div>
  );
}
