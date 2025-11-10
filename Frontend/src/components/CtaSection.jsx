import Button from './Button';

const CtaSection = () => {
  return (
    <div className="bg-(--surface-color)">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-(--brand-color) to-(--brand-secondary) px-6 py-24 text-center shadow-2xl rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Find Your Vibe?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-100">
            Explore our full collection of handpicked styles and find the perfect pair that speaks to you. Your next favorite shoes are just a click away.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {/* --- THIS IS THE FIX --- */}
            <Button 
              to="/products"
              variant="secondary" // Use the secondary variant as a base
              className="!bg-white !text-(--brand-color) hover:!bg-gray-100 border-transparent shadow-xl" // Override specific styles
            >
              Shop All Products
            </Button>
          </div>

          {/* Background Blobs */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#gradient-blobs)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="gradient-blobs">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;