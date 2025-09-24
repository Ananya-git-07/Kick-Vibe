import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShoeById } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

// Reusable Components
import Loader from '../components/Loader';
import Button from '../components/Button';
import ProductImageGallery from '../components/ProductImageGallery';

const ProductPage = () => {
  // Get the dynamic 'id' parameter from the URL (e.g., /product/some-id)
  const { id } = useParams();
  const navigate = useNavigate();

  // Hooks for managing global state
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  // Component-level state
  const [shoe, setShoe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // For "Add to Cart" button loading state

  // useEffect hook to fetch the product data when the component mounts or the ID changes
  useEffect(() => {
    const fetchShoe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const shoeData = await getShoeById(id);
        setShoe(shoeData);

        // Automatically select the first available size as a default
        if (shoeData.sizes && shoeData.sizes.length > 0) {
          setSelectedSize(shoeData.sizes[0]);
        }
      } catch (err) {
        // If the API returns an error (e.g., 404 Not Found), set an error message
        setError("Product not found or an error occurred while fetching the details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShoe();
  }, [id]); // This effect re-runs whenever the `id` from the URL changes

  // Function to handle the "Add to Cart" button click
  const handleAddToCart = async () => {
    // 1. Check if the user is logged in. If not, redirect them to the login page.
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // 2. Ensure a size has been selected.
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    // 3. Add the item to the cart using the global context function.
    setIsAdding(true);
    try {
      await addItem({ shoeId: shoe._id, quantity: 1, size: selectedSize });
      alert(`Success! "${shoe.name}" (Size: ${selectedSize}) has been added to your cart.`);
    } catch (error) {
      // Show an error message if the API call fails
      alert(error.message || "Could not add item to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  // Function to format price to INR
  const formatPrice = (amount) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    });
  };

  // --- Render Logic ---

  // Display a full-page loader while fetching data
  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Display an error message if the API call failed
  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }
  
  // Display a message if the shoe data is somehow still null (edge case)
  if (!shoe) {
    return <div className="text-center py-20">Product details could not be loaded.</div>;
  }

  // Render the main page content
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left Column: Image Gallery */}
        <ProductImageGallery images={shoe.images} />

        {/* Right Column: Product Details */}
        <div>
          <p className="text-sm font-medium text-(--brand-color) uppercase tracking-wider">{shoe.brand}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">{shoe.name}</h1>
          <p className="mt-4 text-3xl font-bold">{formatPrice(shoe.price)}</p>

          <div className="mt-8 border-t border-(--border-color) pt-8">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-2 text-(--text-color)/70 whitespace-pre-wrap leading-relaxed">{shoe.description}</p>
          </div>

          {/* Size Selector */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Select Size</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {shoe.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200
                    ${selectedSize === size
                      ? 'bg-(--brand-color) text-white border-(--brand-color) ring-2 ring-offset-2 ring-offset-(--bg-color) ring-(--brand-color)'
                      : 'bg-(--surface-color) border-(--border-color) hover:bg-(--border-light) dark:hover:bg-(--border-dark)'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-10">
            <Button 
              onClick={handleAddToCart}
              className="w-full text-base py-4"
              disabled={isAdding || shoe.stock === 0}
            >
              {shoe.stock === 0 ? 'Out of Stock' : (isAdding ? 'Adding...' : 'Add to Cart')}
            </Button>
          </div>
          
          <p className="mt-4 text-sm text-center text-(--text-color)/60">
            {shoe.stock > 0 ? `Hurry! Only ${shoe.stock} left in stock.` : 'This item is currently out of stock.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;