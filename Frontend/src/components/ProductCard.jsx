import { Link } from 'react-router-dom';

const ProductCard = ({ shoe }) => {
  const { _id, name, brand, price, images } = shoe;
  const imageUrl = images && images.length > 0 ? images[0] : 'https://via.placeholder.com/400x500.png?text=No+Image';

  // Function to format price to INR
  const formatPrice = (amount) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    });
  };

  return (
    <Link to={`/product/${_id}`} className="group block overflow-hidden">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-(--border-light) dark:bg-(--border-dark)">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-(--text-color) truncate">{name}</h3>
        <p className="mt-1 text-sm text-(--text-color)/70">{brand}</p>
      </div>
      <p className="mt-1 text-base font-semibold text-(--text-color)">
        {price ? formatPrice(price) : 'Price not available'}
      </p>
    </Link>
  );
};

export default ProductCard;