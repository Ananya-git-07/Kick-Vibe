import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { Star } from 'lucide-react';

const testimonials = [
  {
    body: 'The quality is insane! My Vibe Air Striders are the most comfortable shoes I’ve ever owned. The delivery was super fast too.',
    author: {
      name: 'Sarah L.',
      handle: 'Verified Buyer',
      imageUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
  },
  {
    body: 'Finally found a store that has all the cool brands in one place. The website is beautiful and easy to use. 10/10 will shop again!',
    author: {
      name: 'Michael B.',
      handle: 'Sneakerhead',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  },
  {
    body: 'I was hesitant to buy shoes online, but KickVibe made it so easy. The authenticity guarantee gave me peace of mind. Great experience!',
    author: {
      name: 'Jessica P.',
      handle: 'First-time Customer',
      imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  },
];

const Testimonials = () => {
  return (
    <div className="bg-(--bg-color) py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="What Our Customers Say"
          subtitle="We are proud to have a vibrant community that loves our products and service."
        />
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author.name}
              className="space-y-8 rounded-2xl bg-(--surface-color) p-8 shadow-lg shadow-black/5 dark:shadow-black/20"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
              </div>
              <blockquote className="text-lg text-(--text-color)">
                <p>“{testimonial.body}”</p>
              </blockquote>
              <figcaption className="flex items-center gap-x-4">
                <img className="h-10 w-10 rounded-full bg-gray-50" src={testimonial.author.imageUrl} alt="" />
                <div>
                  <div className="font-semibold">{testimonial.author.name}</div>
                  <div className="text-(--text-color)/60">{testimonial.author.handle}</div>
                </div>
              </figcaption>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;