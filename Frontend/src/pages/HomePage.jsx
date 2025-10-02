import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import NewArrivals from '../components/NewArrivals';
const HomePage = () => {
return (
<>
<Hero />
<FeaturedProducts />
{/* We can add more sections here later, like brand logos, testimonials, etc. */}
</>
);
};
export default HomePage;