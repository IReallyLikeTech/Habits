import React from 'react';
import { motion } from 'motion/react';
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

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
        onClick={handleClick}
        style={{ 
          borderColor: isCompleted && color ? color : undefined,
          backgroundColor: isCompleted && color ? `${color}dd` : undefined
        }}
        className={cn(
          "w-12 h-12 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center border-2",
          !color && isCompleted ? "bg-primary border-primary" : "border-outline-variant bg-transparent",
        )}
      >
        <motion.div
          initial={false}
          animate={isCompleted ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{ backgroundColor: color || 'var(--marker-color, var(--color-primary))' }}
          className={cn(
            "w-full h-full rounded-full",
            !color && "bg-primary"
          )}
        />
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
