import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { fadeInUp } from "../../utils/animations";
import { useNavigate } from "react-router-dom";

/**
 * HeroBanner Section
 * The main introduction section with the association name and primary CTA.
 */
const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white px-6">
      {/* Background Subtle Artwork Placeholder */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none flex items-center justify-center">
        {/* <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="w-full max-w-2xl h-auto"
        >
          <path d="M12 3v18M12 3L7 8M12 3l5 5M12 21l-5-5M12 21l5-5" />
          <circle cx="12" cy="12" r="10" />
        </svg> */}
        <div>
          <img src="src/assets/legal-profession.jpg" alt="" className="w-full max-w-5xl h-auto"/>
        </div>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="relative z-10 text-center max-w-4xl"
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6"
          variants={fadeInUp}
        >
          DRT ADVOCATES ASSOCIATION <br />
          <span className="text-primary">HYDERABAD</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-zinc-500 mb-10 max-w-2xl mx-auto"
          variants={fadeInUp}
        >
          A Professional Legal Association dedicated to excellence, 
          integrity, and the advancement of the legal profession in Debt Recovery Tribunals.
        </motion.p>

        <motion.div variants={fadeInUp}>
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg font-medium bg-primary hover:bg-primary/90 transition-all duration-300 rounded-full"
            onClick={() => navigate("/login")}
          >
            Admin Login
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroBanner;
