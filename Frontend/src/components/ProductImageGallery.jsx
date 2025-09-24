import { useState } from 'react';

const ProductImageGallery = ({ images = [] }) => {
  // If there are no images, show a placeholder
  if (!images || images.length === 0) {
    images = ['https://via.placeholder.com/600x750.png?text=No+Image'];
  }

  const [mainImage, setMainImage] = useState(images[0]);

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
      
      {/* Main Image */}
      <div className="flex-1 aspect-[4/5] w-full overflow-hidden rounded-lg bg-(--border-light) dark:bg-(--border-dark)">
        <img
          src={mainImage}
          alt="Main product"
          className="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  );
};

export default ProductImageGallery;