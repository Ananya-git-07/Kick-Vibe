import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle }) => {
  return (
    <motion.div
      className="text-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{title}</h2>
      <p className="mt-4 text-lg text-(--text-color)/70">{subtitle}</p>
    </motion.div>
  );
};

export default SectionHeader;