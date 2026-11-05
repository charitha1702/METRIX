
import "./App.css";
import { useState, useEffect, useRef } from "react";

import CityMapping from "./CityMapping";
import ScenarioPlanning from "./ScenarioPlanning";
import LandingPage from "./LandingPage";
import AuthPage from "./AuthPage";
import { supabase } from "./supabase";

import {
  LayoutDashboard,
  Map,
  Activity,
  MapPin,
  ArrowRight,
  Layers,
  BrainCircuit,
  ChevronRight,
  Compass,
  Menu,
  X,
  Sun,
  Moon,
  CloudSun,
  Sparkles,
  CalendarDays,
  LogOut,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8002/api/mapping";

const welcomeMessages = [
  "Ready to discover something interesting? Let's explore.",
  "Every region has a story. Let's uncover it.",
  "A little curiosity can lead to smarter planning.",
  "Let's turn geographic data into better decisions.",
  "Think beyond today's boundaries. Plan for tomorrow.",
  "Your next big planning idea starts here.",
];

function App() {
  // AUTHENTICATION
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState(null);

  // WORKSPACE
  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // LIVE CLOCK
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [messageIndex, setMessageIndex] = useState(0);

  // GEOGRAPHIC DATASETS
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [taluksLoading, setTaluksLoading] = useState(false);

  // SHARED LOCATION SELECTION
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedTaluk, setSelectedTaluk] = useState("");

  // CACHE TALUKS DISTRICT-WISE
  const talukCache = useRef({});

  // CHECK EXISTING SESSION AND LISTEN FOR AUTH CHANGES
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error("Session loading error:", error);
      }

      setSession(data?.session ?? null);
      setAuthLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);

      if (newSession) {
        setAuthMode(null);
        setActivePage("Dashboard");
      } else {
        setAuthMode(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // SIGN OUT
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
    }
  };

  // LIVE CLOCK
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(clockInterval);
  }, []);

  // ROTATE WELCOME MESSAGES
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex(
        (previous) => (previous + 1) % welcomeMessages.length
      );
    }, 7000);

    return () => clearInterval(messageInterval);
  }, []);

  // DYNAMIC GREETING
  const hour = currentTime.getHours();

  const greeting =
    hour >= 5 && hour < 12
      ? "Good morning"
      : hour >= 12 && hour < 17
      ? "Good afternoon"
      : "Good evening";

  const GreetingIcon =
    hour >= 5 && hour < 12
      ? Sun
      : hour >= 12 && hour < 17
      ? CloudSun
      : Moon;

  const formattedDate = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // USER NAME
  const displayName =
    session?.user?.user_metadata?.full_name ||
    session?.user?.email?.split("@")[0] ||
    "there";

  // FETCH DISTRICTS
  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const response = await fetch(`${API_BASE}/districts`);

        if (!response.ok) {
          throw new Error("Unable to load districts.");
        }

        const data = await response.json();

        const districtFeatures = (data.features || []).sort((a, b) =>
          String(a.properties.KGISDist_1).localeCompare(
            String(b.properties.KGISDist_1)
          )
        );

        setDistricts(districtFeatures);

        if (districtFeatures.length > 0) {
          setSelectedDistrictCode(
            String(districtFeatures[0].properties.KGISDistri)
          );
        }
      } catch (error) {
        console.error("District loading error:", error);
      }
    };

    loadDistricts();
  }, []);

  // FETCH TALUKS FOR SELECTED DISTRICT
  useEffect(() => {
    if (!selectedDistrictCode) {
      setTaluks([]);
      return;
    }

    let cancelled = false;

    const loadTaluks = async () => {
      if (talukCache.current[selectedDistrictCode]) {
        setTaluks(talukCache.current[selectedDistrictCode]);
        setTaluksLoading(false);
        return;
      }

      setTaluksLoading(true);
      setTaluks([]);

      try {
        const response = await fetch(
          `${API_BASE}/taluks?district_code=${encodeURIComponent(
            selectedDistrictCode
          )}`
        );

        if (!response.ok) {
          throw new Error("Unable to load taluks.");
        }

        const data = await response.json();

        const features = (data.features || []).sort((a, b) =>
          String(a.properties.KGISTalukN).localeCompare(
            String(b.properties.KGISTalukN)
          )
        );

        talukCache.current[selectedDistrictCode] = features;

        if (!cancelled) {
          setTaluks(features);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Taluk loading error:", error);
          setTaluks([]);
        }
      } finally {
        if (!cancelled) {
          setTaluksLoading(false);
        }
      }
    };

    loadTaluks();

    return () => {
      cancelled = true;
    };
  }, [selectedDistrictCode]);

  // FIND SELECTED DISTRICT
  const selectedDistrict = districts.find(
    (district) =>
      String(district.properties.KGISDistri) === selectedDistrictCode
  );

  // SHARED STUDY AREA
  const studyArea = selectedTaluk
    ? selectedTaluk
    : selectedDistrict?.properties.KGISDist_1 || "Karnataka";

  // DISTRICT SELECTION
  const handleDistrictChange = (districtCode) => {
    setSelectedDistrictCode(districtCode);
    setSelectedTaluk("");
  };

  // TALUK SELECTION
  const handleTalukChange = (talukName) => {
    setSelectedTaluk(talukName);
  };

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "City Mapping", icon: Map },
    { name: "Scenario Planning", icon: Activity },
  ];

  const navigateTo = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  // AUTHENTICATION LOADING SCREEN
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f3]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#243b53] text-white flex items-center justify-center mx-auto mb-4">
            <Compass size={25} />
          </div>

          <h1 className="text-xl font-bold tracking-[0.12em] text-[#243b53]">
            METRIX
          </h1>

          <p className="text-sm text-[#82909c] mt-2">
            Preparing your workspace...
          </p>
        </div>
      </div>
    );
  }

  // AUTHENTICATION PAGE
  if (!session && authMode) {
    return (
      <AuthPage
        initialMode={authMode}
        onBack={() => setAuthMode(null)}
      />
    );
  }

  // PUBLIC LANDING PAGE
  if (!session) {
    return (
      <LandingPage
        onGetStarted={() => setAuthMode("signup")}
        onSignIn={() => setAuthMode("signin")}
      />
    );
  }

  // METRIX WORKSPACE
  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#26384a] md:flex">

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-[255px] shrink-0 min-h-screen bg-white border-r border-[#e9e8e2] flex-col">
        <div className="px-7 py-8 border-b border-[#efeee9]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#243b53] text-white flex items-center justify-center">
              <Compass size={23} strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-[0.12em] text-[#243b53]">
                METRIX
              </h1>

              <p className="text-[10px] tracking-[0.13em] uppercase text-[#82909c]">
                Intelligent City Planning
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-8 flex-1">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#9aa4aa] px-3 mb-4">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => navigateTo(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-[#e8edf1] text-[#243b53] font-semibold"
                      : "text-[#778590] hover:bg-[#f5f5f1] hover:text-[#243b53]"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{item.name}</span>

                  {isActive && (
                    <ChevronRight
                      size={16}
                      className="ml-auto text-[#536d82]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-10 px-3">
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#9aa4aa] mb-4">
              Current Region
            </p>

            <div className="rounded-xl bg-[#f2f4f0] p-4">
              <div className="flex items-center gap-2 text-[#536d68]">
                <MapPin size={16} />
                <span className="text-xs font-semibold">
                  Karnataka, India
                </span>
              </div>

              <p className="text-[11px] text-[#82909c] mt-2 leading-relaxed">
                Administrative geography and planning exploration
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-[#efeee9]">
          <div className="rounded-2xl bg-[#f0eef6] p-4">
            <div className="flex items-center gap-2 text-[#655c80]">
              <BrainCircuit size={18} />
              <p className="text-xs font-semibold">
                METRIX Intelligence
              </p>
            </div>

            <p className="text-[11px] text-[#817995] mt-2 leading-relaxed">
              Explore hypothetical urban development scenarios with
              AI-assisted insights.
            </p>
          </div>

          <p className="text-[10px] text-[#a0a7aa] mt-5 text-center">
            METRIX · Think ahead. Plan smarter.
          </p>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden bg-white border-b border-[#e9e8e2] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#243b53] text-white flex items-center justify-center">
            <Compass size={20} />
          </div>

          <div>
            <h1 className="font-bold tracking-widest text-[#243b53]">
              METRIX
            </h1>

            <p className="text-[9px] uppercase tracking-wider text-[#82909c]">
              City Planning
            </p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#243b53]"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e9e8e2] px-4 py-3 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => navigateTo(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                  activePage === item.name
                    ? "bg-[#e8edf1] text-[#243b53] font-semibold"
                    : "text-[#778590] hover:bg-[#f5f5f1]"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </button>
            );
          })}
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0">

        {/* TOP HEADER */}
        <header className="bg-[#f8f7f3]/95 border-b border-[#e9e8e2] px-5 md:px-10 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.17em] text-[#9aa4aa]">
              METRIX / Workspace
            </p>

            <h2 className="text-sm font-semibold text-[#344e68] mt-1">
              {activePage}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-[#344e68]">
                {displayName}
              </p>

              <p className="text-[10px] text-[#929da4]">
                {session.user.email}
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 border border-[#e1e2dc] bg-white hover:bg-[#f1f1ec] text-[#536779] rounded-xl px-3 py-2.5 text-xs font-medium transition"
              title="Sign out"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        <div className="p-5 md:p-10 max-w-[1500px] mx-auto">

          {/* DASHBOARD */}
          {activePage === "Dashboard" && (
            <div className="space-y-9">

              {/* PERSONALIZED WELCOME */}
              <section className="relative overflow-hidden rounded-[24px] bg-[#f0eee7] border border-[#e8e5dc] p-6 md:p-10">
                <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full border border-[#d9ded5]" />
                <div className="absolute -right-5 -bottom-32 w-72 h-72 rounded-full border border-[#d9ded5]" />

                <div className="relative z-10 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3 mb-7">
                    <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.17em] uppercase text-[#82988d]">
                      <span className="w-2 h-2 rounded-full bg-[#91aa9a]" />
                      Your planning workspace
                    </span>

                    <span className="text-[#c3c0b6]">/</span>

                    <span className="text-[10px] uppercase tracking-wider text-[#929080]">
                      Live workspace
                    </span>
                  </div>

                  {/* GREETING */}
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <GreetingIcon
                      size={22}
                      strokeWidth={1.7}
                      className="text-[#849b8e] self-center"
                    />

                    <h1 className="serif-heading text-4xl md:text-5xl leading-tight text-[#243b53]">
                      {greeting}, {displayName}.
                    </h1>
                  </div>

                  <p className="text-sm text-[#788590] mt-4 leading-7 max-w-2xl">
                    Your workspace is ready. Explore regions, understand
                    their geography, and discover new possibilities for
                    smarter infrastructure planning.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-7">
                    <button
                      onClick={() =>
                        document.getElementById("study-area")?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        })
                      }
                      className="soft-button px-5 py-3.5 text-sm font-medium flex items-center gap-3"
                    >
                      Let's explore
                      <ArrowRight size={17} />
                    </button>

                    <div className="flex items-center gap-2 text-xs text-[#82909c]">
                      <Sparkles size={15} className="text-[#849b8e]" />
                      <span>{welcomeMessages[messageIndex]}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-8 text-xs text-[#929080]">
                    <CalendarDays size={15} />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </section>

              {/* STUDY AREA */}
              <section
                id="study-area"
                className="soft-card p-5 md:p-6 scroll-mt-24"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#e5edf4] text-[#536d82] flex items-center justify-center">
                      <MapPin size={21} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#344e68]">
                        Where shall we explore?
                      </h3>

                      <p className="text-xs text-[#929da4] mt-1">
                        Choose a district and taluk across Karnataka
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <select
                      value={selectedDistrictCode}
                      onChange={(e) =>
                        handleDistrictChange(e.target.value)
                      }
                      disabled={districts.length === 0}
                      className="w-full sm:w-52 bg-[#f8f8f5] border border-[#e8e8e1] rounded-xl px-4 py-3 text-sm text-[#344e68] outline-none focus:ring-2 focus:ring-[#dce8e2] disabled:opacity-50"
                    >
                      <option value="" disabled>
                        Select district
                      </option>

                      {districts.map((district) => (
                        <option
                          key={district.properties.KGISDistri}
                          value={String(district.properties.KGISDistri)}
                        >
                          {district.properties.KGISDist_1}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedTaluk}
                      onChange={(e) =>
                        handleTalukChange(e.target.value)
                      }
                      disabled={!selectedDistrictCode || taluksLoading}
                      className="w-full sm:w-52 bg-[#f8f8f5] border border-[#e8e8e1] rounded-xl px-4 py-3 text-sm text-[#344e68] outline-none focus:ring-2 focus:ring-[#dce8e2] disabled:opacity-50"
                    >
                      <option value="">
                        {taluksLoading
                          ? "Loading taluks..."
                          : "All taluks in district"}
                      </option>

                      {taluks.map((taluk) => (
                        <option
                          key={taluk.properties.KGISTalukC}
                          value={taluk.properties.KGISTalukN}
                        >
                          {taluk.properties.KGISTalukN}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SELECTED STUDY AREA */}
                <div className="mt-6 pt-5 border-t border-[#eae9e3] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#91a096] font-semibold">
                      Your selected study area
                    </p>

                    <h3 className="text-lg font-semibold text-[#243b53] mt-1">
                      {studyArea}
                    </h3>

                    <p className="text-xs text-[#929da4] mt-1">
                      {selectedTaluk
                        ? `Taluk · ${
                            selectedDistrict?.properties.KGISDist_1 ||
                            "Karnataka"
                          }`
                        : "District · Karnataka"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigateTo("City Mapping")}
                      className="soft-button px-5 py-3 text-sm flex items-center gap-2"
                    >
                      View on map
                      <Map size={16} />
                    </button>

                    <button
                      onClick={() => navigateTo("Scenario Planning")}
                      className="border border-[#dcded6] bg-white hover:bg-[#f4f4ef] text-[#536779] rounded-xl px-5 py-3 text-sm flex items-center gap-2 transition"
                    >
                      Plan a scenario
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </section>

              {/* OVERVIEW */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="serif-heading text-2xl text-[#243b53]">
                      Karnataka at a glance
                    </h2>

                    <p className="text-xs text-[#929da4] mt-1">
                      A look at the geographic foundation of METRIX
                    </p>
                  </div>

                  <span className="text-[10px] uppercase tracking-wider text-[#91a096]">
                    Geographic dataset
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div className="soft-card p-6">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-[#e5edf4] text-[#536d82] flex items-center justify-center">
                        <Map size={21} />
                      </div>

                      <span className="text-[10px] uppercase tracking-wider text-[#82909c]">
                        State
                      </span>
                    </div>

                    <h3 className="serif-heading text-4xl text-[#243b53] mt-6">
                      31
                    </h3>

                    <p className="text-sm font-medium text-[#536779] mt-1">
                      District boundaries
                    </p>

                    <p className="text-xs text-[#9aa4aa] mt-2">
                      Karnataka
                    </p>
                  </div>

                  <div className="soft-card p-6">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-[#e8e5f2] text-[#746b91] flex items-center justify-center">
                        <Layers size={21} />
                      </div>

                      <span className="text-[10px] uppercase tracking-wider text-[#82909c]">
                        Sub-district
                      </span>
                    </div>

                    <h3 className="serif-heading text-4xl text-[#243b53] mt-6">
                      240
                    </h3>

                    <p className="text-sm font-medium text-[#536779] mt-1">
                      Taluk boundaries
                    </p>

                    <p className="text-xs text-[#9aa4aa] mt-2">
                      Processed geographic dataset
                    </p>
                  </div>

                  <div className="soft-card p-6">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-[#dce8e2] text-[#617d70] flex items-center justify-center">
                        <Activity size={21} />
                      </div>

                      <span className="text-[10px] uppercase tracking-wider text-[#82909c]">
                        Core feature
                      </span>
                    </div>

                    <h3 className="serif-heading text-3xl text-[#243b53] mt-6">
                      What-If
                    </h3>

                    <p className="text-sm font-medium text-[#536779] mt-1">
                      Scenario planning
                    </p>

                    <p className="text-xs text-[#9aa4aa] mt-2">
                      Explore hypothetical development
                    </p>
                  </div>
                </div>
              </section>

              {/* SCENARIO PLANNING FEATURE */}
              <section className="rounded-[22px] bg-[#243b53] p-7 md:p-9 text-white">
                <div className="flex items-center gap-2 text-[#c8d7ce] text-xs font-semibold tracking-[0.16em] uppercase">
                  <BrainCircuit size={17} />
                  Think ahead. Plan smarter.
                </div>

                <h2 className="serif-heading text-2xl md:text-3xl mt-5 !text-white">
                  WHAT COULD YOUR REGION LOOK LIKE TOMORROW?
                </h2>

                <p className="text-sm text-[#d2dce3] mt-3 leading-7 max-w-2xl">
                  Explore hypothetical population growth and infrastructure
                  development scenarios. Adjust planning assumptions, compare
                  possible outcomes, and use AI-assisted insights to understand
                  how future needs could influence your region.
                </p>

                <button
                  onClick={() => navigateTo("Scenario Planning")}
                  className="mt-6 inline-flex items-center gap-3 bg-[#e5ede8] hover:bg-white text-[#243b53] px-5 py-3 rounded-xl text-sm font-semibold transition"
                >
                  Start scenario planning
                  <ArrowRight size={17} />
                </button>
              </section>

              {/* WORKSPACE MODULES */}
              <section>
                <div className="mb-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#91a096] font-semibold">
                    Your tools
                  </p>

                  <h2 className="serif-heading text-2xl text-[#243b53] mt-2">
                    Explore your planning workspace
                  </h2>

                  <p className="text-sm text-[#929da4] mt-1">
                    Choose where you want to begin. Your selected study area
                    will carry across the workspace.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <button
                    onClick={() => navigateTo("City Mapping")}
                    className="soft-card p-6 text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#e5edf4] text-[#536d82] flex items-center justify-center">
                        <Map size={22} />
                      </div>

                      <ArrowRight
                        size={19}
                        className="text-[#aab4b7] group-hover:text-[#536d82] group-hover:translate-x-1 transition"
                      />
                    </div>

                    <h3 className="font-semibold text-[#344e68] mt-6">
                      Geographic mapping
                    </h3>

                    <p className="text-sm text-[#84909a] mt-2 leading-6">
                      Explore administrative boundaries and available
                      infrastructure locations through interactive
                      geographic maps.
                    </p>

                    <span className="inline-block mt-5 text-xs font-semibold text-[#6f8799]">
                      Explore maps →
                    </span>
                  </button>

                  <button
                    onClick={() => navigateTo("Scenario Planning")}
                    className="soft-card p-6 text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#e8e5f2] text-[#746b91] flex items-center justify-center">
                        <BrainCircuit size={22} />
                      </div>

                      <ArrowRight
                        size={19}
                        className="text-[#aab4b7] group-hover:text-[#746b91] group-hover:translate-x-1 transition"
                      />
                    </div>

                    <h3 className="font-semibold text-[#344e68] mt-6">
                      What-if scenario planning
                    </h3>

                    <p className="text-sm text-[#84909a] mt-2 leading-6">
                      Adjust hypothetical growth and infrastructure
                      assumptions, compare possible scenarios, and explore
                      AI-assisted planning insights.
                    </p>

                    <span className="inline-block mt-5 text-xs font-semibold text-[#82799c]">
                      Explore scenarios →
                    </span>
                  </button>
                </div>
              </section>

              {/* DATA TRANSPARENCY */}
              <section className="rounded-2xl bg-[#f1eee4] border border-[#e9e4d7] p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-white/70 flex items-center justify-center text-[#988b69]">
                    <Layers size={16} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#756b55]">
                      Data transparency
                    </h3>

                    <p className="text-xs text-[#897f69] mt-1 leading-6">
                      Geographic indicators represent available processed
                      boundary datasets. Population and infrastructure
                      scenarios are hypothetical and should not be interpreted
                      as verified forecasts or actual infrastructure gaps.
                    </p>
                  </div>
                </div>
              </section>

              <p className="text-[10px] text-[#a0a7aa] text-center tracking-wide">
                METRIX · AI-Assisted Data-Driven City Planning
              </p>
            </div>
          )}

          {/* CITY MAPPING */}
          {activePage === "City Mapping" && (
            <CityMapping
              studyArea={studyArea}
              onStudyAreaChange={setSelectedTaluk}
              districts={districts}
              taluks={taluks}
              selectedDistrict={selectedDistrict}
              selectedDistrictCode={selectedDistrictCode}
              selectedTaluk={selectedTaluk}
              onDistrictChange={handleDistrictChange}
              onTalukChange={handleTalukChange}
            />
          )}

          {/* SCENARIO PLANNING */}
          {activePage === "Scenario Planning" && (
            <ScenarioPlanning
              studyArea={studyArea}
              districts={districts}
              taluks={taluks}
              selectedDistrict={
                selectedDistrict?.properties.KGISDist_1 || ""
              }
              selectedDistrictCode={selectedDistrictCode}
              selectedTaluk={selectedTaluk}
              taluksLoading={taluksLoading}
              onDistrictChange={handleDistrictChange}
              onTalukChange={handleTalukChange}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
