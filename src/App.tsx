import React, { useState, useEffect, useMemo } from 'react';
import { Habit, ViewType, NavTab } from './types';
import HabitTrack from './components/HabitTrack';
import BottomNav from './components/BottomNav';
import SegmentedButton from './components/SegmentedButton';
import FAB from './components/FAB';
import AddHabitModal from './components/AddHabitModal';
import { getDatesForView } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'habit-loop-data';

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activeView, setActiveView] = useState<ViewType>('Week');
  const [activeTab, setActiveTab] = useState<NavTab>('Habits');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHabits(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load habits', e);
      }
    } else {
      // Default demo habits
      setHabits([
        { id: '1', name: 'Morning Yoga', createdAt: Date.now(), completedDays: [] },
        { id: '2', name: 'Deep Work', createdAt: Date.now(), completedDays: [] },
      ]);
    }
  }, []);

  // Save data
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    }
  }, [habits]);

  const dates = useMemo(() => getDatesForView(activeView), [activeView]);

  const toggleHabit = (habitId: string, dateKey: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const isCompleted = h.completedDays.includes(dateKey);
        return {
          ...h,
          completedDays: isCompleted 
            ? h.completedDays.filter(d => d !== dateKey)
            : [...h.completedDays, dateKey]
        };
      }
      return h;
    }));
  };

  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      completedDays: [],
    };
    setHabits(prev => [newHabit, ...prev]);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden pb-24">
      {/* Header */}
      <header className="p-8 pb-4 flex flex-col gap-6 sticky top-0 bg-surface z-20">
        <h1 className="text-display-small text-on-surface">Habit Loop</h1>
        <div className="flex justify-center">
          <SegmentedButton activeView={activeView} onChange={setActiveView} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-2 py-4 relative overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'Habits' && (
            <motion.div
              key="habits-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-2"
            >
              {habits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-on-surface/40">
                  <p className="text-label-large italic">No habits yet. Start one!</p>
                </div>
              ) : (
                habits.map(habit => (
                  <HabitTrack 
                    key={habit.id} 
                    habit={habit} 
                    dates={dates} 
                    onToggle={toggleHabit} 
                  />
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'Trends' && (
            <motion.div
              key="trends-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-6 py-10 flex flex-col items-center text-center gap-4"
            >
              <div className="w-24 h-24 rounded-full bg-secondary-container flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-on-secondary-container/20 rounded-full animate-pulse" />
              </div>
              <h2 className="text-xl font-bold">Trends & Analytics</h2>
              <p className="text-on-surface/60">Coming soon in the next update. Track your consistency over time!</p>
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div
              key="settings-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-6 py-6 flex flex-col gap-4"
            >
              <div className="bg-surface-container-high rounded-[28px] p-6 flex flex-col gap-4">
                <h3 className="text-label-large text-primary uppercase font-bold tracking-widest">Preferences</h3>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                  <span>Dark Mode</span>
                  <div className="w-12 h-6 bg-primary/20 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-primary rounded-full transition-all" />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Reminders</span>
                  <div className="w-12 h-6 bg-primary rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  if(confirm('Clear all data?')) {
                    localStorage.removeItem(STORAGE_KEY);
                    window.location.reload();
                  }
                }}
                className="mt-4 px-6 py-3 bg-red-100 text-red-700 rounded-2xl font-medium text-center hover:bg-red-200 transition-colors"
              >
                Reset App Data
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
