import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/hero/Hero";
import { CompanyIntro } from "@/components/sections/CompanyIntro";
import { CoreCapabilities } from "@/components/sections/CoreCapabilities";
import { FeaturedUseCase } from "@/components/sections/FeaturedUseCase";
import { Footer } from "@/components/layout/Footer";
import { ServicesPage } from "@/components/pages/ServicesPage";

export function App() {
  const getInitialView = (): "home" | "services" => {
    const hash = window.location.hash;
    const pathname = window.location.pathname;
    if (
      pathname.includes("/services") ||
      hash === "#services" ||
      hash.startsWith("#s0")
    ) {
      return "services";
    }
    return "home";
  };

  const [currentView, setCurrentView] = useState<"home" | "services">(getInitialView);

  const handleNavigate = useCallback((page: "home" | "services", hash?: string) => {
    setCurrentView(page);
    if (page === "services") {
      const targetHash = hash ? `#${hash}` : "#services";
      window.history.pushState(null, "", targetHash);
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      const targetHash = hash ? `#${hash}` : "#hero";
      window.history.pushState(null, "", targetHash);
      if (hash && hash !== "hero") {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      if (
        pathname.includes("/services") ||
        hash === "#services" ||
        hash.startsWith("#s0")
      ) {
        setCurrentView("services");
        if (hash.startsWith("#s0")) {
          const id = hash.replace("#", "");
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 80);
        }
      } else {
        setCurrentView("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  if (currentView === "services") {
    return (
      <ServicesPage onNavigateHome={(hash) => handleNavigate("home", hash || "hero")} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary antialiased selection:bg-accent selection:text-white">
      {/* Sticky Header */}
      <Header activePage="home" onNavigate={handleNavigate} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section (with TopoBackground & RobotSequence) */}
        <Hero />

        {/* 2. Company Introduction (Clean white surface with Teamwork visual) */}
        <CompanyIntro />

        {/* 3. Core Capabilities (Bento Grid 01-06) */}
        <CoreCapabilities />

        {/* 4. Featured AI Use Case (Dark Contrast Panel & 6-step Flow) */}
        <FeaturedUseCase />
      </main>

      {/* Global Structured Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
