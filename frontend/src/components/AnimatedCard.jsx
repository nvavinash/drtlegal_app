import React from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { hoverLift } from "../utils/animations";

/**
 * AnimatedCard
 * A reusable card component that combines ShadCN UI Card with Framer Motion animations.
 */
const AnimatedCard = ({ children, className = "", onClick }) => {
  return (
    <motion.div
      whileHover={hoverLift.whileHover}
      variants={hoverLift}
      onClick={onClick}
      className={`cursor-pointer h-full transition-shadow duration-300 hover:shadow-lg ${className}`}
    >
      <Card className="h-full border-zinc-200 bg-white">
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
