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
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="bg-(--surface-color)">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <motion.div
          className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.div key={feature.name} className="text-center" variants={itemVariants}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-(--brand-color)/10">
                <feature.icon className="h-6 w-6 text-(--brand-color)" aria-hidden="true" />
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-7">{feature.name}</h3>
              <p className="mt-4 text-base text-(--text-color)/70">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ValueProps;