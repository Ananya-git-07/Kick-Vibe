import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle }) => {
  return (
    <motion.div
      className="text-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.h2 
        className="text-3xl font-black tracking-tighter sm:text-4xl lg:text-5xl"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <span className="bg-gradient-to-r from-(--text-color) via-(--brand-color) to-(--brand-secondary) bg-clip-text text-transparent">
          {title}
        </span>
      </motion.h2>
      <motion.p 
        className="mt-4 text-lg text-(--text-color)/85 leading-relaxed"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {subtitle}
      </motion.p>
      {/* Decorative line */}
      <motion.div
        className="mt-6 h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-(--brand-color) to-(--brand-secondary)"
        initial={{ width: 0 }}
        whileInView={{ width: 80 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
    </motion.div>
  );
};

export default SectionHeader;