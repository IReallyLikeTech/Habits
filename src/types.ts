export interface Habit {
  id: string;
  name: string;
  createdAt: number;
  completedDays: string[]; // Array of strings like "YYYY-MM-DD"
}

export type ViewType = 'Today' | 'Week' | 'Month';
export type NavTab = 'Habits' | 'Trends' | 'Settings';
