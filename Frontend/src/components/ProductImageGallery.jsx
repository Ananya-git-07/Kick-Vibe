import { useState } from 'react';
import { motion } from 'framer-motion';

const ProductImageGallery = ({ images = [] }) => {
  if (!images || images.length === 0) {
    images = ['https://via.placeholder.com/600x750.png?text=No+Image'];
  }

  const [mainImage, setMainImage] = useState(images[0]);
  const [isZooming, setIsZooming] = useState(false);

  // --- Logic for zoom effect ---
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    e.currentTarget.style.backgroundPosition = `${x}% ${y}%`;
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${mainImage === image ? 'border-(--brand-color)' : 'border-transparent'}`}
            onClick={() => setMainImage(image)}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      
      {/* Main Image with Zoom */}
      <motion.div
        className="flex-1 aspect-[4/5] w-full overflow-hidden rounded-lg bg-(--border-light) dark:bg-(--border-dark) cursor-zoom-in"
        style={{
          backgroundImage: `url(${mainImage})`,
          backgroundSize: isZooming ? '200%' : 'cover', // Zoom factor
          backgroundRepeat: 'no-repeat',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => {
          setIsZooming(false);
          // Reset background position
          event.currentTarget.style.backgroundPosition = 'center center';
        }}
        transition={{ duration: 0.3 }}
      >
        {/* We use the img tag for accessibility and as a fallback, but hide it visually */}
        <img
          src={mainImage}
          alt="Main product"
          className="h-full w-full object-cover object-center opacity-0" // Hide the actual image
        />
      </motion.div>
    </div>
  );
};

export default ProductImageGallery;