import { motion } from 'framer-motion';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;