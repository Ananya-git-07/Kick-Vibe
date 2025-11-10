import { motion, useMotionValue, useTransform } from 'framer-motion';
import Button from './Button';
import { useTheme } from '../hooks/useTheme';

const Hero = () => {
  const { theme } = useTheme();

  // --- Parallax Logic ---
  // Track mouse position using Motion Values for performance
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse position into a smaller range for subtle movement
  const rotateX = useTransform(mouseY, [-500, 500], [10, -10]);
  const rotateY = useTransform(mouseX, [-500, 500], [-10, 10]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // Calculate mouse position relative to the center of the element
    mouseX.set(event.clientX - rect.width / 2);
    mouseY.set(event.clientY - rect.height / 2);
  };

  const handleMouseLeave = () => {
    // Reset position when mouse leaves
    mouseX.set(0);
    mouseY.set(0);
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div 
      className="relative overflow-hidden bg-(--surface-color) isolate"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 z-[-10] bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="container mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <motion.div
          className="max-w-2xl text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl"
            style={{ textShadow: "1px 1px 10px oklch(from var(--brand-primary) l c h / 30%)" }}
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-(--brand-color) to-(--brand-secondary) bg-clip-text text-transparent">
              Find Your
            </span> Perfect Stride
          </motion.h1>

          <motion.p className="mt-6 text-lg text-(--text-color)/70" variants={itemVariants}>
            Discover the latest trends in footwear. From high-performance sneakers to timeless classics, KickVibe has it all.
          </motion.p>
          
          <motion.div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start" variants={itemVariants}>
            <Button to="/products">Shop New Arrivals</Button>
            <Button to="/products" variant="secondary">
              Explore All Products
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Right Column with Animated Blobs and Parallax Image */}
      <div className="absolute inset-y-0 right-0 hidden w-1/2 items-center justify-center lg:flex" style={{ perspective: '1000px' }}>
        
        {/* Continuously floating blobs */}
        <motion.div
          className="absolute h-[28rem] w-[28rem] rounded-full bg-(--brand-color)/10 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
        <motion.div
          className="absolute h-[28rem] w-[28rem] rounded-full bg-(--brand-secondary)/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            delay: 1,
          }}
        />
        
        {/* Parallax Shoe Image */}
        <motion.div
          className="relative z-10 w-3/4 max-w-lg"
          style={{
            rotateX,
            rotateY,
            rotateZ: 12,
            transition: 'transform 0.1s linear', // smooths out the transform
          }}
        >
          {theme === 'dark' ? (
            <motion.img 
              src="/black.png" 
              alt="Featured Shoe" 
              className="w-full h-auto transition-transform duration-500 ease-in-out hover:scale-110"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
            />
          ) : (
            <motion.img 
              src="/white.png" 
              alt="Featured Shoe" 
              className="w-full h-auto transition-transform duration-500 ease-in-out hover:scale-110"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;