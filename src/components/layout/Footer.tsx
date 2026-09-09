import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { FOOTER_DATA } from "@/data/heroContent";

interface FooterProps {
  onNavigate?: (page: "home" | "services", hash?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <footer id="contact" className="w-full bg-surface border-t border-border pt-16 pb-12 text-text-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-border">
          {/* Col 1: Brand & Tagline (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <a
              href="#hero"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate("home", "hero");
                }
              }}
              className="inline-block"
            >
              <img
                src="/Techlogo_cutout_clean.png"
                alt="Techinjections Logo"
                className="h-20 sm:h-24 w-auto object-contain drop-shadow-md"
              />
            </a>
            <p className="text-sm text-text-secondary max-w-sm leading-relaxed font-sans">
              {FOOTER_DATA.companyDescription}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>All systems operational · Enterprise ready</span>
            </div>
          </div>

          {/* Col 2: Services (lg:col-span-3) - with smooth expandable items */}
          <div className="lg:col-span-3">
            <div
              onClick={() => toggleSection("services")}
              className="flex items-center justify-between cursor-pointer md:cursor-default mb-4"
            >
              <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-text-primary">
                Services
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-text-secondary md:hidden transition-transform duration-200 ${
                  expandedSection === "services" ? "rotate-180" : ""
                }`}
              />
            </div>

            <div className={`space-y-2.5 ${expandedSection === "services" ? "block" : "hidden md:block"}`}>
              {FOOTER_DATA.services.map((service, i) => (
                <motion.div
                  key={service}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <a
                    href={`#s0${i + 1}`}
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate("services", `s0${i + 1}`);
                      }
                    }}
                    className="group flex items-center justify-between text-xs sm:text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    <span>{service}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Col 3: Focus & Technologies (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div
              onClick={() => toggleSection("tech")}
              className="flex items-center justify-between cursor-pointer md:cursor-default mb-4"
            >
              <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-text-primary">
                Technologies
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-text-secondary md:hidden transition-transform duration-200 ${
                  expandedSection === "tech" ? "rotate-180" : ""
                }`}
              />
            </div>

            <div className={`space-y-2.5 ${expandedSection === "tech" ? "block" : "hidden md:block"}`}>
              {FOOTER_DATA.technologies.map((item) => (
                <div key={item}>
                  <a
                    href="#capabilities"
                    className="text-xs sm:text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {item}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Contact & Inquiry (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-heading font-semibold uppercase tracking-wider text-text-primary mb-4">
              Connect
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-text-secondary">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a href={`mailto:${FOOTER_DATA.contact.email}`} className="hover:text-accent transition-colors">
                  {FOOTER_DATA.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a href={`tel:${FOOTER_DATA.contact.phone}`} className="hover:text-accent transition-colors">
                  {FOOTER_DATA.contact.phone}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{FOOTER_DATA.contact.address}</span>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="pt-2">
              <a
                href={`mailto:${FOOTER_DATA.contact.email}?subject=Project%20Inquiry%20-%20Techinjections`}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded bg-accent text-white text-xs sm:text-sm font-medium hover:bg-accent-hover transition-colors shadow-sm"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-secondary">
          <p>© {new Date().getFullYear()} Techinjections. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="#terms" className="hover:text-accent transition-colors">
              Terms of Service
            </a>
            <span>·</span>
            <a href="#security" className="hover:text-accent transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
