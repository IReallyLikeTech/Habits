import { LayoutList, TrendingUp, Settings } from 'lucide-react';
import { NavTab } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: NavTab;
  onChange: (tab: NavTab) => void;
}

const tabs: { id: NavTab; label: string; icon: any }[] = [
  { id: 'Habits', label: 'Habits', icon: LayoutList },
  { id: 'Trends', label: 'Trends', icon: TrendingUp },
  { id: 'Settings', label: 'Settings', icon: Settings },
];

export default function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant pb-safe px-4 pt-3 flex justify-around items-center h-20 z-40">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex flex-col items-center gap-1 min-w-[64px]"
          >
            <div className="relative flex items-center justify-center">
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute w-16 h-8 bg-secondary-container rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon 
                size={24} 
                className={cn(
                  "relative z-10 transition-colors duration-200",
                  isActive ? "text-on-secondary-container" : "text-on-surface/60"
                )} 
              />
            </div>
            <span 
              className={cn(
                "text-[12px] font-medium tracking-wide transition-colors duration-200",
                isActive ? "text-on-surface" : "text-on-surface/60"
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
