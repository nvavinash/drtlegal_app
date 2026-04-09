import React from "react";
import { motion } from "framer-motion";
import { scrollReveal } from "../utils/animations";

/**
 * SectionWrapper
 * A reusable container for page sections that provides:
 * 1. Standard vertical padding and max-width.
 * 2. Automatic scroll-reveal animation using Framer Motion.
 */
const SectionWrapper = ({ children, className = "", id = "" }) => {
  return (
    <motion.section
      id={id}
      initial="initial"
      whileInView="whileInView"
      viewport={scrollReveal.viewport}
      variants={scrollReveal}
      className={`py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto w-full ${className}`}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;
