import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, category: string, color: string) => void;
}

const DEFAULT_CATEGORIES = ['Health', 'Work', 'Mindfulness', 'Social', 'Personal'];
const DEFAULT_COLORS = ['#6750A4', '#D23F57', '#006B5B', '#8C4E03', '#445E91'];

export default function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [color, setColor] = useState(DEFAULT_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), category, color);
      setName('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-[2px]"
          />
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface-container-high rounded-[28px] p-8 w-full max-w-sm pointer-events-auto shadow-xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <h2 className="text-[24px] font-semibold text-on-surface mb-6">New Habit</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="habit-name" className="text-sm font-bold text-on-surface/50 uppercase tracking-widest px-1">
                    What habit?
                  </label>
                  <input
                    id="habit-name"
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Read for 30 mins"
                    className="bg-surface border-2 border-outline-variant rounded-2xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-on-surface/50 uppercase tracking-widest px-1">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-xs font-bold transition-all border-2",
                          category === cat 
                            ? "bg-primary-container border-primary text-on-primary-container" 
                            : "bg-surface border-outline-variant text-on-surface/60"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-on-surface/50 uppercase tracking-widest px-1">
                    Color
                  </label>
                  <div className="flex gap-3">
                    {DEFAULT_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        style={{ backgroundColor: c }}
                        className={cn(
                          "w-8 h-8 rounded-full transition-transform",
                          color === c ? "scale-125 ring-2 ring-offset-2 ring-primary" : "opacity-80 hover:opacity-100"
                        )}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-primary font-bold rounded-full hover:bg-primary/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 bg-primary text-white font-bold rounded-full shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
