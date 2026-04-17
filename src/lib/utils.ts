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
