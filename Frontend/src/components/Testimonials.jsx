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
    <div className="relative bg-(--bg-color) py-24 sm:py-32 overflow-hidden">
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-(--brand-color)/12 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-(--brand-secondary)/12 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          title="What Our Customers Say"
          subtitle="We are proud to have a vibrant community that loves our products and service."
        />
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author.name}
              className="group relative space-y-6 rounded-3xl glass border border-(--border-color)/50 p-8 shadow-xl hover:shadow-2xl hover:shadow-(--brand-color)/10 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 40, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-(--brand-color)/0 via-transparent to-(--brand-secondary)/0 group-hover:from-(--brand-color)/10 group-hover:to-(--brand-secondary)/10 transition-all duration-500" />
              
              {/* Quote decoration */}
              <div className="absolute top-6 left-6 text-6xl text-(--brand-color)/10 font-serif leading-none">"</div>
              
              <div className="relative flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 + i * 0.1, duration: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
              
              <blockquote className="relative text-lg text-(--text-color) leading-relaxed">
                <p>{testimonial.body}</p>
              </blockquote>
              
              <figcaption className="relative flex items-center gap-x-4 pt-4 border-t border-(--border-color)/40">
                <div className="relative">
                  <img 
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-(--border-color) group-hover:ring-(--brand-color) transition-all duration-300" 
                    src={testimonial.author.imageUrl} 
                    alt={testimonial.author.name} 
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full ring-2 ring-(--surface-color)" />
                </div>
                <div>
                  <div className="font-bold text-(--text-color) group-hover:text-(--brand-color) transition-colors">
                    {testimonial.author.name}
                  </div>
                  <div className="text-sm text-(--text-color)/75">
                    {testimonial.author.handle}
                  </div>
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