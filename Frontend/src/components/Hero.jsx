import Button from './Button';
import { useTheme } from '../hooks/useTheme'; // 1. Import the useTheme hook

const Hero = () => {
  const { theme } = useTheme(); // 2. Get the current theme ('light' or 'dark')

  return (
    <div className="relative overflow-hidden bg-(--surface-color)">
      <div className="container mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
            Find Your <span className="text-(--brand-color)">Perfect</span> Stride
          </h1>
          <p className="mt-6 text-lg text-(--text-color)/70">
            Discover the latest trends in footwear. From high-performance sneakers to timeless classics, KickVibe has it all.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Button to="/products">Shop New Arrivals</Button>
            <Button to="/featured" variant="secondary">
              Explore Featured
            </Button>
          </div>
        </div>
      </div>
      {/* Abstract background shapes */}
      <div className="absolute inset-y-0 right-0 hidden w-1/2 items-center justify-center lg:flex">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-(--brand-color)/10 blur-3xl"></div>
        <div className="absolute -bottom-20 right-20 h-96 w-96 rounded-full bg-(--brand-secondary)/10 blur-3xl"></div>
        
        {/* 3. Conditionally render the image based on the theme */}
        {theme === 'dark' ? (
          <img 
            src="black.png" 
            alt="Featured Shoe" 
            className="relative z-10 w-3/4 max-w-lg rotate-12 transition-transform hover:scale-105"
          />
        ) : (
          <img 
            src="white.png" 
            alt="Featured Shoe" 
            className="relative z-10 w-3/4 max-w-lg rotate-12 transition-transform hover:scale-105"
          />
        )}
      </div>
    </div>
  );
};

export default Hero;