import { ViewType } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SegmentedButtonProps {
  activeView: ViewType;
  onChange: (view: ViewType) => void;
}

const views: ViewType[] = ['Today', 'Week', 'Month'];

export default function SegmentedButton({ activeView, onChange }: SegmentedButtonProps) {
  return (
    <div className="flex bg-surface border border-outline-variant rounded-full overflow-hidden p-0.5">
      {views.map((view) => {
        const isActive = activeView === view;
        return (
          <button
            key={view}
            onClick={() => onChange(view)}
            className={cn(
              "relative px-6 py-2 text-sm font-medium transition-colors duration-200 rounded-full",
              isActive ? "text-on-secondary-container" : "text-on-surface/70 hover:bg-surface-container-high"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-segment"
                className="absolute inset-0 bg-secondary-container rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{view}</span>
          </button>
        );
      })}
    </div>
  );
}
