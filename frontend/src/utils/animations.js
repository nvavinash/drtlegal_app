// Animation variants for Framer Motion
// These are reusable and keep the code clean for a junior developer to understand

export const fadeInUp = {
  initial: {
    y: 30,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1], // Custom smooth ease
    },
  },
};

export const scrollReveal = {
  initial: {
    y: 40,
    opacity: 0,
  },
  whileInView: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  viewport: { once: true, margin: "-100px" },
};

export const hoverLift = {
  whileHover: {
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
