import { motion } from 'framer-motion';
import Button from './Button';

const CtaSection = () => {
  return (
    <div className="bg-(--surface-color) relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-(--brand-color)/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-(--brand-secondary)/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10">
        <motion.div 
          className="relative isolate overflow-hidden bg-gradient-to-br from-(--brand-color) via-(--brand-secondary) to-(--brand-color) bg-[length:200%_200%] animate-[gradient_8s_ease_infinite] px-6 py-24 text-center shadow-2xl rounded-3xl sm:px-16 border border-white/20"
          initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-black/10" />
          
          {/* Animated gradient mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_50%)] opacity-50" />
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full shadow-lg"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}</div>
          
          <motion.h2 
            className="relative mx-auto max-w-2xl text-4xl font-black tracking-tight text-white drop-shadow-lg sm:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to Find Your Vibe?
          </motion.h2>
          
          <motion.p 
            className="relative mx-auto mt-6 max-w-xl text-lg leading-8 text-white drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Explore our full collection of handpicked styles and find the perfect pair that speaks to you. Your next favorite shoes are just a click away.
          </motion.p>
          
          <motion.div 
            className="relative mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button 
              to="/products"
              variant="secondary"
              className="!bg-white !text-(--brand-color) hover:!bg-white/90 border-transparent shadow-2xl !font-bold !text-base !px-8 !py-4"
            >
              Shop All Products
            </Button>
          </motion.div>

          {/* Background Blobs */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <motion.circle 
              cx={512} 
              cy={512} 
              r={512} 
              fill="url(#gradient-blobs)" 
              fillOpacity="0.4"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <defs>
              <radialGradient id="gradient-blobs">
                <stop stopColor="#ffffff" />
                <stop offset={1} stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default CtaSection;