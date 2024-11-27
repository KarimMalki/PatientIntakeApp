// Framer Motion variants for reusable animations
export const fadeIn = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    }
};

export const slideIn = {
    initial: {
        x: -20,
        opacity: 0
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const scaleIn = {
    initial: {
        scale: 0.95,
        opacity: 0
    },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

export const tabVariant = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

export const cardHover = {
    hover: {
        y: -5,
        transition: {
            duration: 0.2,
            ease: "easeInOut"
        }
    }
};

export const notificationBell = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.2, 1],
        transition: {
            duration: 0.3,
            times: [0, 0.5, 1]
        }
    }
};

export const modalVariant = {
    initial: {
        opacity: 0,
        scale: 0.95,
        y: 20
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: {
            duration: 0.2,
            ease: "easeIn"
        }
    }
};

export const listItemVariant = {
    initial: {
        opacity: 0,
        x: -20
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3
        }
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: {
            duration: 0.2
        }
    }
};

export const pageTransition = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    }
};

// Animation for charts and data visualizations
export const chartAnimation = {
    initial: {
        opacity: 0,
        scale: 0.9
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

// Subtle hover animation for interactive elements
export const subtleHover = {
    hover: {
        scale: 1.02,
        transition: {
            duration: 0.2
        }
    }
};

// Progress bar animation
export const progressBar = {
    initial: { width: 0 },
    animate: width => ({
        width: `${width}%`,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    })
};

// Notification dot animation
export const notificationDot = {
    animate: {
        scale: [1, 1.2, 1],
        transition: {
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
        }
    }
};
