import { motion } from 'framer-motion';

const AppPreloader = ({ isLoading }) => {
  return (
    <motion.div
      animate={{ opacity: isLoading ? 1 : 0, pointerEvents: isLoading ? 'all' : 'none' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-(--surface-color)"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        className="text-4xl font-bold tracking-tighter text-(--brand-color)"
      >
        KickVibe
      </motion.div>
    </motion.div>
  );
};

export default AppPreloader;