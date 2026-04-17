import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

export default function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
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
              className="bg-surface-container-high rounded-[28px] p-8 w-full max-w-sm pointer-events-auto shadow-xl"
            >
              <h2 className="text-[24px] font-semibold text-on-surface mb-6">New Habit</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="habit-name" className="text-sm font-medium text-on-surface/70 px-1">
                    What habit do you want to track?
                  </label>
                  <input
                    id="habit-name"
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Read for 30 mins"
                    className="bg-surface border-2 border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-primary font-medium rounded-full hover:bg-primary/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white font-medium rounded-full shadow-md hover:bg-primary/90 transition-colors"
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
