export interface Habit {
  id: string;
  name: string;
  createdAt: number;
  completedDays: string[]; // Array of strings like "YYYY-MM-DD"
  category: string;
  color: string;
  streak: number;
  longestStreak: number;
  duration?: number; // Duration in minutes
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type ViewType = 'Today' | 'Week' | 'Month';
export type NavTab = 'Habits' | 'Planner' | 'Trends' | 'Settings';
