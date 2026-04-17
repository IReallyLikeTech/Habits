import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDatesForView(view: 'Today' | 'Week' | 'Month') {
  const dates: Date[] = [];
  const now = new Date();
  
  if (view === 'Today') {
    dates.push(new Date(now));
  } else if (view === 'Week') {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dates.push(d);
    }
  } else if (view === 'Month') {
    // Current month days
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }
  }
  
  return dates;
}

export function formatDateKey(date: Date) {
  return date.toISOString().split('T')[0];
}

export function calculateStreaks(completedDays: string[]) {
  if (completedDays.length === 0) return { current: 0, longest: 0 };

  const uniqueSortedDates = Array.from(new Set(completedDays)).sort();
  
  let longest = 0;
  let current = 0;
  let tempStreak = 0;

  if (uniqueSortedDates.length > 0) {
    tempStreak = 1;
    longest = 1;
    for (let i = 1; i < uniqueSortedDates.length; i++) {
      const d1 = new Date(uniqueSortedDates[i - 1]);
      const d2 = new Date(uniqueSortedDates[i]);
      const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      longest = Math.max(longest, tempStreak);
    }

    // Check if current streak is active
    const todayDate = new Date(formatDateKey(new Date()));
    const lastCompleted = new Date(uniqueSortedDates[uniqueSortedDates.length - 1]);
    const diffToToday = Math.round((todayDate.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24));

    if (diffToToday <= 1) {
      let streakCount = 1;
      for (let i = uniqueSortedDates.length - 1; i > 0; i--) {
        const dCurrent = new Date(uniqueSortedDates[i]);
        const dPrev = new Date(uniqueSortedDates[i - 1]);
        const diff = Math.round((dCurrent.getTime() - dPrev.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          streakCount++;
        } else {
          break;
        }
      }
      current = streakCount;
    } else {
      current = 0;
    }
  }

  return { current, longest };
}
