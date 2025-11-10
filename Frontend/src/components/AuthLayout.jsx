import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Animated Blobs */}
      <motion.div
        className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-(--brand-color)/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-(--brand-secondary)/20 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
          delay: 2,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-(--surface-color)/50 backdrop-blur-xl border border-(--border-color) rounded-2xl shadow-2xl p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;