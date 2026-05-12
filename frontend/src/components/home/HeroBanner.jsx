import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { fadeInUp } from "../../utils/animations";
import { useNavigate } from "react-router-dom";
import legalImg from "../../assets/legal-profession.jpg";

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
        <div>
          <img
            src={legalImg}
            alt=""
            className="w-full max-w-5xl lg:max-w-7xl mx-auto h-auto"
          />
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
          A Professional Legal Association dedicated to excellence, integrity,
          and the advancement of the legal profession in Debt Recovery
          Tribunals.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default HeroBanner;
