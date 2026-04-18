import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export interface HabitNodeProps {
  isCompleted: boolean;
  onClick: () => void;
  dateLabel?: string;
  color?: string;
}

const HabitNode: React.FC<HabitNodeProps> = ({ isCompleted, onClick, dateLabel, color }) => {
  const handleClick = () => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(isCompleted ? 5 : 15);
    }
    onClick();
  };

  // Particles for the burst effect
  const particles = Array.from({ length: 8 });

  return (
    <div className="flex flex-col items-center gap-2 relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleClick}
        style={{ 
          borderColor: isCompleted && color ? color : undefined,
        }}
        className={cn(
          "w-12 h-12 rounded-full cursor-pointer transition-all duration-500 flex items-center justify-center border-2 relative z-10",
          !color && isCompleted ? "bg-primary border-primary" : "border-outline-variant bg-transparent",
        )}
      >
        <AnimatePresence>
          {isCompleted && (
            <>
              {/* Inner fill */}
              <motion.div
                key="fill"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ backgroundColor: color || 'var(--marker-color, var(--color-primary))' }}
                className={cn(
                  "absolute inset-0 rounded-full",
                  !color && "bg-primary"
                )}
              />
              
              {/* Ripple effect */}
              <motion.div
                key="ripple"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ border: `2px solid ${color || '#6750A4'}` }}
                className="absolute inset-0 rounded-full pointer-events-none"
              />

              {/* Burst particles */}
              {particles.map((_, i) => {
                const angle = (i * 45) * (Math.PI / 180);
                const distance = 30;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                return (
                  <motion.div
                    key={`particle-${i}`}
                    initial={{ x: 0, y: 0, scale: 0.5, opacity: 1 }}
                    animate={{ x, y, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
                    style={{ backgroundColor: color || '#6750A4' }}
                    className="absolute w-2 h-2 rounded-full pointer-events-none"
                  />
                );
              })}
            </>
          )}
        </AnimatePresence>

        {/* Static outline when empty */}
        {!isCompleted && (
          <div className="w-2 h-2 rounded-full bg-outline-variant opacity-30" />
        )}
      </motion.button>

      {dateLabel && (
        <span className="text-[10px] text-on-surface/50 font-bold uppercase tracking-[0.1em]">
          {dateLabel}
        </span>
      )}
    </div>
  );
};

export default HabitNode;
