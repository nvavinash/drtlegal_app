import React from "react";
import HeroBanner from "../components/home/HeroBanner";
import Announcements from "../components/home/Announcements";
import OfficeBearers from "../components/home/OfficeBearers";
import QuickLinks from "../components/home/QuickLinks";

/**
 * HomePage
 * The main landing page for DRT Advocates Association Hyderabad.
 * Publicly accessible.
 */
const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroBanner />

      {/* Announcements / Notices */}
      <Announcements />

      {/* Quick Access Links */}
      <QuickLinks />

      {/* Leadership Section */}
      <OfficeBearers />

      {/* Simple Footer */}
      <footer className="py-12 border-t border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} DRT Advocates Association Hyderabad. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-zinc-400">
            <a href="#" className="hover:text-primary transition-colors text-xs font-medium uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors text-xs font-medium uppercase tracking-widest">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
