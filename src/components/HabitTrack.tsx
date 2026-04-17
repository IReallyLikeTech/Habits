import React from 'react';
import HabitNode from './HabitNode';
import { Habit } from '../types';
import { formatDateKey } from '../lib/utils';

export interface HabitTrackProps {
  habit: Habit;
  dates: Date[];
  onToggle: (habitId: string, dateKey: string) => void;
}

const HabitTrack: React.FC<HabitTrackProps> = ({ habit, dates, onToggle }) => {
  return (
    <div className="flex flex-col gap-3 py-4 w-full overflow-hidden">
      <div className="flex justify-between items-center px-6">
        <h3 className="text-label-large text-on-surface">{habit.name}</h3>
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
              dateLabel={isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HabitTrack;
