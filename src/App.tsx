import React, { useState, useEffect, useMemo } from 'react';
import { Habit, ViewType, NavTab } from './types';
import HabitTrack from './components/HabitTrack';
import BottomNav from './components/BottomNav';
import SegmentedButton from './components/SegmentedButton';
import FAB from './components/FAB';
import AddHabitModal from './components/AddHabitModal';
import { getDatesForView, calculateStreaks, cn, formatDateKey } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STORAGE_KEY = 'habit-loop-data-v2';

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activeView, setActiveView] = useState<ViewType>('Week');
  const [activeTab, setActiveTab] = useState<NavTab>('Habits');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration/Sanitization
        const sanitized = parsed.map((h: any) => ({
          ...h,
          category: h.category || 'Personal',
          color: h.color || '#6750A4',
          streak: h.streak || 0,
          longestStreak: h.longestStreak || 0,
          duration: h.duration || 0
        }));
        setHabits(sanitized);
      } catch (e) {
        console.error('Failed to load habits', e);
      }
    } else {
      // Empty state as requested
      setHabits([]);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const dates = useMemo(() => getDatesForView(activeView), [activeView]);

  const toggleHabit = (habitId: string, dateKey: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const isCompleted = h.completedDays.includes(dateKey);
        const newCompletedDays = isCompleted 
          ? h.completedDays.filter(d => d !== dateKey)
          : [...h.completedDays, dateKey];
        
        const streaks = calculateStreaks(newCompletedDays);
        return {
          ...h,
          completedDays: newCompletedDays,
          streak: streaks.current,
          longestStreak: streaks.longest
        };
      }
      return h;
    }));
  };

  const deleteHabit = (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      setHabits(prev => prev.filter(h => h.id !== habitId));
    }
  };

  const addHabit = (name: string, category: string, color: string, duration: number) => {
    const newHabit: Habit = {
      id: typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(7),
      name,
      createdAt: Date.now(),
      completedDays: [],
      category,
      color,
      streak: 0,
      longestStreak: 0,
      duration
    };
    setHabits(prev => [newHabit, ...prev]);
  };

  const categories = useMemo(() => {
    const cats = new Set(habits.map(h => h.category));
    return Array.from(cats);
  }, [habits]);

  const filteredHabits = useMemo(() => {
    if (!selectedCategory) return habits;
    return habits.filter(h => h.category === selectedCategory);
  }, [habits, selectedCategory]);

  const totalDailyMinutes = useMemo(() => {
    return habits.reduce((acc, h) => acc + (h.duration || 0), 0);
  }, [habits]);

  const formatHours = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  // Trends Data
  const trendsData = useMemo(() => {
    const last7Days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      last7Days.push(formatDateKey(d));
    }

    return last7Days.map(dateKey => {
      const count = habits.reduce((acc, h) => acc + (h.completedDays.includes(dateKey) ? 1 : 0), 0);
      return {
        date: dateKey.slice(5), // MM-DD
        completions: count,
      };
    });
  }, [habits]);

  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden pb-24 border-x border-outline-variant/20">
      {/* Header */}
      <header className="px-8 pt-10 pb-4 flex flex-col gap-6 sticky top-0 bg-surface z-20">
        <div className="flex justify-between items-baseline">
          <h1 className="text-display-small text-on-surface">Habit Loop</h1>
          <span className="text-[10px] font-black text-primary/30 uppercase tracking-[0.3em]">v2.2</span>
        </div>
        <div className="flex justify-center">
          <SegmentedButton activeView={activeView} onChange={setActiveView} />
        </div>

        {activeTab === 'Habits' && habits.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
                !selectedCategory 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-surface text-on-surface/40 border-outline-variant hover:border-primary/30"
              )}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
                  selectedCategory === cat 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                    : "bg-surface text-on-surface/40 border-outline-variant hover:border-primary/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 px-2 py-4 relative overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'Habits' && (
            <motion.div
              key="habits-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-2"
            >
              {filteredHabits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-on-surface/30 gap-4">
                  <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 opacity-20 bg-on-surface rounded-full" />
                  </div>
                  <p className="text-label-large font-bold uppercase tracking-widest">
                    {habits.length === 0 ? "No habits yet" : "No habits in this category"}
                  </p>
                </div>
              ) : (
                filteredHabits.map(habit => (
                  <HabitTrack 
                    key={habit.id} 
                    habit={habit} 
                    dates={dates} 
                    onToggle={toggleHabit} 
                    onDelete={deleteHabit}
                  />
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'Planner' && (
            <motion.div
              key="planner-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="px-6 py-6 flex flex-col gap-6"
            >
              <div className="bg-surface-container-high rounded-[28px] p-8 flex flex-col gap-4 border border-outline-variant/10 shadow-inner overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="flex flex-col gap-1 relative">
                  <span className="text-[10px] uppercase font-black tracking-widest text-primary/60">Daily Commitment</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-on-surface">{formatHours(totalDailyMinutes)}</span>
                    <span className="text-sm font-bold text-on-surface/30">Total</span>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col gap-3 relative">
                  {habits.length === 0 ? (
                    <p className="text-sm text-on-surface/40 italic">Nothing planned yet. Define your habits to see your daily stack.</p>
                  ) : (
                    habits.map(h => (
                      <div key={h.id} className="flex items-center gap-3 bg-surface/40 p-3 rounded-2xl border border-outline-variant/20 hover:border-primary/20 transition-all group">
                        <div 
                          className="w-1.5 h-8 rounded-full shadow-sm"
                          style={{ backgroundColor: h.color }}
                        />
                        <div className="flex-1 flex flex-col">
                          <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{h.name}</span>
                          <span className="text-[10px] text-on-surface/40 uppercase font-black tracking-widest">{h.category}</span>
                        </div>
                        <span className="text-xs font-black text-on-surface/60 font-mono tracking-tighter">
                          {h.duration || 0}m
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-[24px] border border-primary/10 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs">!</div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary/80 leading-snug">
                    Time Management Insight
                  </h4>
                </div>
                <p className="text-[11px] font-medium leading-relaxed text-on-surface/60">
                  {totalDailyMinutes > 180 
                    ? "Warning: Your daily commitment is quite high. Ensure you've buffered for unexpected interruptions."
                    : "Your daily stack looks manageable. Consistency is easier with a clear time budget!"}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'Trends' && (
            <motion.div
              key="trends-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="px-6 py-10 flex flex-col gap-8"
            >
              <div className="flex flex-col items-center text-center gap-2">
                <h2 className="text-xl font-black uppercase tracking-widest text-primary">Daily Consistency</h2>
                <p className="text-on-surface/50 text-xs font-bold uppercase tracking-widest">Last 7 Days</p>
              </div>

              <div className="h-64 bg-surface-container-high rounded-[28px] p-6 shadow-inner border border-outline-variant/10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendsData}>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 'bold', fill: '#1D1B20', opacity: 0.5 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(103, 80, 164, 0.05)' }}
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        backgroundColor: '#FEF7FF'
                      }}
                    />
                    <Bar dataKey="completions" radius={[6, 6, 0, 0]}>
                      {trendsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.completions > 0 ? '#6750A4' : '#CAC4D0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-high rounded-[24px] p-4 flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-on-surface/40">Total Habits</span>
                  <span className="text-2xl font-black text-primary">{habits.length}</span>
                </div>
                <div className="bg-surface-container-high rounded-[24px] p-4 flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-on-surface/40">Active Streaks</span>
                  <span className="text-2xl font-black text-orange-600">{habits.filter(h => h.streak > 0).length}</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div
              key="settings-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-6 py-6 flex flex-col gap-4"
            >
              <div className="bg-surface-container-high rounded-[28px] p-6 flex flex-col gap-4 border border-outline-variant/10 shadow-inner">
                <h3 className="text-[10px] text-primary uppercase font-black tracking-[0.2em] mb-2 px-2">Configuration</h3>
                <div className="flex justify-between items-center py-3 border-b border-outline-variant/30 px-2">
                  <span className="font-bold text-sm">Haptic Feedback</span>
                  <div className="w-10 h-5 bg-primary rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all" />
                  </div>
                </div>
                <div className="flex justify-between items-center py-3 px-2">
                  <span className="font-bold text-sm">Strict Mode</span>
                  <div className="w-10 h-5 bg-surface/20 rounded-full relative border border-outline-variant">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-outline-variant rounded-full transition-all" />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  if(confirm('This will permanently delete all habits and progress. Continue?')) {
                    localStorage.removeItem(STORAGE_KEY);
                    window.location.reload();
                  }
                }}
                className="mt-4 px-6 py-4 bg-red-50 text-red-600 rounded-[28px] font-black uppercase tracking-widest text-[11px] text-center hover:bg-red-100 transition-all active:scale-95 border-2 border-red-100/50"
              >
                Flush System Cache
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* UI Elements */}
      {activeTab === 'Habits' && <FAB onClick={() => setIsAddModalOpen(true)} />}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      <AddHabitModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={addHabit} 
      />
    </div>
  );
}
