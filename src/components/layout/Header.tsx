import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_ITEMS } from "@/data/heroContent";

interface HeaderProps {
  activePage?: "home" | "services";
  onNavigate?: (page: "home" | "services", hash?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activePage = "home", onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(activePage === "services" ? "Services" : "Home");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = NAV_ITEMS.filter((item) => item.label !== "Contact Us");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? `h-16 sm:h-20 bg-white shadow-sm ${activePage === "services" ? "" : "border-b border-border"}`
          : `h-16 sm:h-20 bg-white shadow-sm ${activePage === "services" ? "" : "border-b border-border"}`
      }`}
    >
      <div className="container mx-auto h-full px-4 sm:px-5 flex items-center">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate("home", "hero");
            }
          }}
          className="flex items-center gap-3 group focus:outline-none py-1"
        >
          <img
            src="/Techlogo_cutout_clean.png"
            alt="Techinjections Logo"
            className="h-20 sm:h-24 lg:h-28 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-md"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-5 ml-auto" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const isActive = activeItem === item.label;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  setActiveItem(item.label);
                  if (item.label === "Services") {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate("services");
                    }
                  } else if (item.label === "Home") {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate("home", "hero");
                    }
                  } else if (onNavigate && activePage === "services") {
                    e.preventDefault();
                    onNavigate("home", item.href.replace("#", ""));
                  }
                }}
                className={`nav-link text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-accent font-semibold" : "text-text-primary hover:text-text-primary/80"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 ml-4">
          {/* Contact Us - The one filled button on the header */}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm"
          >
            <span>Contact Us</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-text-primary hover:bg-bg-base transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-surface border-b border-border shadow-lg overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((item) => (
                <div key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      setActiveItem(item.label);
                      setMobileMenuOpen(false);
                      if (item.label === "Services") {
                        if (onNavigate) {
                          e.preventDefault();
                          onNavigate("services");
                        }
                      } else if (item.label === "Home") {
                        if (onNavigate) {
                          e.preventDefault();
                          onNavigate("home", "hero");
                        }
                      } else if (onNavigate && activePage === "services") {
                        e.preventDefault();
                        onNavigate("home", item.href.replace("#", ""));
                      }
                    }}
                    className="block text-base font-medium text-text-primary hover:text-accent transition-colors"
                  >
                    {item.label}
                  </a>
                </div>
              ))}
              <div className="pt-4 border-t border-border">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
