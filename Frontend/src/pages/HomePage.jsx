import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import NewArrivals from '../components/NewArrivals';
import PageWrapper from '../components/PageWrapper';
import ValueProps from '../components/ValueProps';
import Testimonials from '../components/Testimonials';
import CtaSection from '../components/CtaSection';

const HomePage = () => {
  return (
    <PageWrapper>
      <Hero />
      <ValueProps />
      <FeaturedProducts />
      <NewArrivals />
      <Testimonials />
      <CtaSection />
    </PageWrapper>
  );
};
export default HomePage;