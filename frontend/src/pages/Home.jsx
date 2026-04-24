import React from "react";
import HeroBanner from "../components/home/HeroBanner";
import MeetingSection from "../components/home/MeetingSection";
import Leadership from "../components/home/Leadership";
import Announcements from "../components/home/Announcements";
import OfficeBearers from "../components/home/OfficeBearers";
import QuickLinks from "../components/home/QuickLinks";
import Footer from "@/components/home/Footer";

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

      {/* Virtual Court / Meeting Section */}
      <MeetingSection />

      {/* Leadership Messages */}
      <Leadership />

      {/* Announcements / Notices */}
      <Announcements />

      {/* Quick Access Links */}
      <QuickLinks />

      {/* Full Team Section */}
      <OfficeBearers />

      {/* Map and Address */}
      <Footer />

      {/* Simple Footer */}
      {/* <div className="py-12 border-t border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} DRT Advocates Association Hyderabad.
            All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-zinc-400">
            <a
              href="#"
              className="hover:text-primary transition-colors text-xs font-medium uppercase tracking-widest"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors text-xs font-medium uppercase tracking-widest"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Home;
