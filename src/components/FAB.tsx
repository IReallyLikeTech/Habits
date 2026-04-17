import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface FABProps {
  onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 bg-primary-container text-on-primary-container rounded-[16px] flex items-center justify-center shadow-lg z-30"
    >
      <Plus size={24} />
    </motion.button>
  );
}
