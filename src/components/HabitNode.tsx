import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export interface HabitNodeProps {
  isCompleted: boolean;
  onClick: () => void;
  dateLabel?: string;
}

const HabitNode: React.FC<HabitNodeProps> = ({ isCompleted, onClick, dateLabel }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={onClick}
        className={cn(
          "w-12 h-12 rounded-full cursor-pointer transition-colors duration-200 flex items-center justify-center",
          isCompleted 
            ? "bg-primary text-white" 
            : "border-2 border-outline-variant bg-transparent"
        )}
      >
        <motion.div
          initial={false}
          animate={isCompleted ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full h-full rounded-full bg-primary"
        />
      </motion.button>
      {dateLabel && <span className="text-[11px] text-on-surface/60 font-medium uppercase tracking-wider">{dateLabel}</span>}
    </div>
  );
};

export default HabitNode;
