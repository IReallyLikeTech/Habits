import React from 'react';
import HabitNode from './HabitNode';
import { Habit } from '../types';
import { formatDateKey } from '../lib/utils';
import { Flame, Trophy, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface HabitTrackProps {
  habit: Habit;
  dates: Date[];
  onToggle: (habitId: string, dateKey: string) => void;
  onDelete: (habitId: string) => void;
}

const HabitTrack: React.FC<HabitTrackProps> = ({ habit, dates, onToggle, onDelete }) => {
  return (
    <div className="flex flex-col gap-3 py-4 w-full overflow-hidden">
      <div className="flex justify-between items-center px-6">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-label-large text-on-surface font-bold">{habit.name}</h3>
            <button 
              onClick={() => onDelete(habit.id)}
              className="p-1 hover:bg-red-50 text-on-surface/20 hover:text-red-500 rounded-full transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
          <span className="text-[10px] text-on-surface/50 uppercase font-black tracking-widest leading-none">
            {habit.category || 'Uncategorized'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {habit.streak > 0 && (
              <motion.div 
                key={`${habit.id}-streak-${habit.streak}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100"
              >
                <Flame size={14} className="fill-orange-600" />
                <span className="text-xs font-bold leading-none">{habit.streak}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
            <Trophy size={14} className="fill-amber-600/20" />
            <span className="text-xs font-bold leading-none">{habit.longestStreak}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-surface-container-high rounded-[28px] p-6 flex gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        {dates.map((date) => {
          const dateKey = formatDateKey(date);
          const isCompleted = habit.completedDays.includes(dateKey);
          const isToday = formatDateKey(new Date()) === dateKey;
          
          return (
            <HabitNode
              key={dateKey}
              isCompleted={isCompleted}
              onClick={() => onToggle(habit.id, dateKey)}
              color={habit.color}
              dateLabel={isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HabitTrack;
