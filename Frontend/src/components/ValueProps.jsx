import { motion } from 'framer-motion';
import { Truck, ShieldCheck, PackageCheck } from 'lucide-react';

const features = [
  {
    name: 'Fast Shipping',
    description: 'Get your kicks delivered to your door in record time. We ship same-day for orders before 2 PM.',
    icon: Truck,
  },
  {
    name: 'Authenticity Guaranteed',
    description: 'Every pair is 100% authentic, verified by our expert team. Shop with complete confidence.',
    icon: ShieldCheck,
  },
  {
    name: 'Easy Returns',
    description: 'Not the perfect fit? No problem. We offer a 30-day hassle-free return policy.',
    icon: PackageCheck,
  },
];

const ValueProps = () => {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <div className="relative bg-(--surface-color) overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-(--brand-color)/3 via-transparent to-(--brand-secondary)/3 opacity-60" />
      
      <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10">
        <motion.div
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.name} 
              className="group relative text-center p-8 rounded-2xl bg-(--bg-color) border border-(--border-color)/50 hover:border-(--brand-color)/50 transition-all duration-500 hover:shadow-2xl hover:shadow-(--brand-color)/10"
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-(--brand-color)/0 to-(--brand-secondary)/0 group-hover:from-(--brand-color)/5 group-hover:to-(--brand-secondary)/5 rounded-2xl transition-all duration-500" />
              
              <motion.div 
                className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-(--brand-color) to-(--brand-secondary) shadow-lg shadow-(--brand-color)/30"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="h-8 w-8 text-white" aria-hidden="true" />
              </motion.div>
              
              <h3 className="relative mt-6 text-xl font-bold leading-7 group-hover:text-(--brand-color) transition-colors duration-300">
                {feature.name}
              </h3>
              <p className="relative mt-4 text-base text-(--text-color)/90 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-(--brand-color)/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ValueProps;