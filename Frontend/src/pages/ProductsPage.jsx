import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShoeById } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import Loader from '../components/Loader';
import Button from '../components/Button';
import ProductImageGallery from '../components/ProductImageGallery';
import ReviewsSection from '../components/ReviewsSection'; // <-- Import ReviewsSection

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [shoe, setShoe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        setIsLoading(true);
        const shoeData = await getShoeById(id);
        setShoe(shoeData);
        if (shoeData.sizes && shoeData.sizes.length > 0) {
          setSelectedSize(shoeData.sizes[0]);
        }
      } catch (err) {
        setError("Product not found or an error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchShoe();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }
    setIsAdding(true);
    try {
      await addItem({ shoeId: shoe._id, quantity: 1, size: selectedSize });
      alert(`Success! "${shoe.name}" has been added to your cart.`);
    } catch (error) {
      alert(error.message || "Could not add item to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  const formatPrice = (amount) => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 });
  };

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Loader size="lg" /></div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!shoe) return <div className="text-center py-20">Product details could not be loaded.</div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        <ProductImageGallery images={shoe.images} />
        <div>
          <p className="text-sm font-medium text-(--brand-color) uppercase tracking-wider">{shoe.brand}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">{shoe.name}</h1>
          <p className="mt-4 text-3xl font-bold">{formatPrice(shoe.price)}</p>
          <div className="mt-8 border-t border-(--border-color) pt-8">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-2 text-(--text-color)/70 whitespace-pre-wrap leading-relaxed">{shoe.description}</p>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Select Size</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {shoe.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${selectedSize === size ? 'bg-(--brand-color) text-white border-(--brand-color) ring-2 ring-offset-2 ring-offset-(--bg-color) ring-(--brand-color)' : 'bg-(--surface-color) border-(--border-color) hover:bg-(--border-light) dark:hover:bg-(--border-dark)'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <Button onClick={handleAddToCart} className="w-full text-base py-4" disabled={isAdding || shoe.stock === 0}>
              {shoe.stock === 0 ? 'Out of Stock' : (isAdding ? 'Adding...' : 'Add to Cart')}
            </Button>
          </div>
          <p className="mt-4 text-sm text-center text-(--text-color)/60">
            {shoe.stock > 0 ? `Hurry! Only ${shoe.stock} left in stock.` : 'This item is currently out of stock.'}
          </p>
        </div>
      </div>
      {/* Add the ReviewsSection component here */}
      <ReviewsSection shoeId={id} />
    </div>
  );
};

export default ProductPage;