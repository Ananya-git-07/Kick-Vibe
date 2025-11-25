import { useState, useEffect } from 'react';
import { createShoe, updateShoeById, updateShoeImages, deleteShoeImages } from '../../lib/api';
import { CATEGORIES } from '../../lib/constants';
import api from '../../lib/api';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import { X, Trash2 } from 'lucide-react';

const ProductFormModal = ({ isOpen, onClose, shoe, onSave }) => {
  const isEditing = !!shoe;
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [existingBrands, setExistingBrands] = useState([]);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [newImages, setNewImages] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);

  // Fetch existing brands for suggestions
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get('/shoes/brands');
        setExistingBrands(response.data.data || []);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);

  // When the modal opens or the 'shoe' prop changes, populate the form
  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: shoe.name || '',
        description: shoe.description || '',
        price: shoe.price || '',
        brand: shoe.brand || '',
        category: shoe.category || '',
        sizes: shoe.sizes.join(', ') || '',
        stock: shoe.stock || '',
        isFeatured: shoe.isFeatured || false,
      });
      setCurrentImages(shoe.images || []);
      setImagePreview(shoe.images || []);
      setNewImages(null);
      setImagesToDelete([]);
    } else {
      // Reset form for "Add New"
      setFormData({
        name: '', description: '', price: '', brand: '',
        category: CATEGORIES[0].slug, sizes: '', stock: '1', isFeatured: false
      });
      setCurrentImages([]);
      setImagePreview([]);
      setNewImages(null);
      setImagesToDelete([]);
    }
  }, [shoe, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleBrandChange = (e) => {
    setFormData(prev => ({ ...prev, brand: e.target.value }));
    setShowBrandSuggestions(e.target.value.length > 0);
  };

  const selectBrand = (brandName) => {
    setFormData(prev => ({ ...prev, brand: brandName }));
    setShowBrandSuggestions(false);
  };

  const filteredBrands = existingBrands.filter(b => 
    b.name.toLowerCase().includes(formData.brand?.toLowerCase() || '')
  );

  const handleFileChange = (e) => {
    const files = e.target.files;
    setNewImages(files);
    
    // Create preview URLs for new images
    const previews = Array.from(files).map(file => URL.createObjectURL(file));
    setImagePreview(previews);
    setImagesToDelete([]); // Clear delete list when new images are selected
  };

  const clearNewImages = () => {
    setNewImages(null);
    if (isEditing && currentImages) {
      setImagePreview(currentImages);
    } else {
      setImagePreview([]);
    }
    setImagesToDelete([]);
  };

  const toggleImageForDeletion = (imageUrl) => {
    setImagesToDelete(prev => {
      if (prev.includes(imageUrl)) {
        return prev.filter(url => url !== imageUrl);
      } else {
        // Check if at least one image will remain
        const remainingImages = currentImages.filter(img => !prev.includes(img) && img !== imageUrl);
        if (remainingImages.length === 0) {
          toast.error('At least one image must remain');
          return prev;
        }
        return [...prev, imageUrl];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        // Update text data first
        const updatedShoe = await updateShoeById(shoe._id, {
          ...formData,
          sizes: formData.sizes.split(',').map(s => s.trim()),
        });
        
        let finalShoe = updatedShoe;
        
        // Handle image deletions
        if (imagesToDelete.length > 0) {
          finalShoe = await deleteShoeImages(shoe._id, imagesToDelete);
          toast.success(`${imagesToDelete.length} image(s) deleted successfully!`);
        }
        
        // If new images were selected, update them separately
        if (newImages && newImages.length > 0) {
          const imageFormData = new FormData();
          for (let i = 0; i < newImages.length; i++) {
            imageFormData.append('images', newImages[i]);
          }
          finalShoe = await updateShoeImages(shoe._id, imageFormData);
          toast.success('Product and images updated successfully!');
        } else if (imagesToDelete.length === 0) {
          toast.success('Product updated successfully!');
        }
        
        onSave(finalShoe);
      } else {
        // For creating, we send FormData with everything
        const data = new FormData();
        Object.keys(formData).forEach(key => {
          data.append(key, formData[key]);
        });
        
        // Add images separately
        if (newImages && newImages.length > 0) {
          for (let i = 0; i < newImages.length; i++) {
            data.append('images', newImages[i]);
          }
        }

        const newShoe = await createShoe(data);
        toast.success('Product created successfully!');
        onSave(newShoe);
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Product' : 'Add New Product'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="name" label="Product Name" value={formData.name || ''} onChange={handleChange} required />
          <Input name="price" label="Price (INR)" type="number" value={formData.price || ''} onChange={handleChange} required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-(--text-color)/80 mb-1.5">Description</label>
          <textarea name="description" rows={4} value={formData.description || ''} onChange={handleChange} className="w-full px-4 py-3 border border-(--border-color) bg-(--surface-color) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-color) focus:border-transparent sm:text-sm transition-all duration-200" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-(--text-color)/80 mb-1.5">Brand</label>
            <input 
              type="text" 
              name="brand" 
              value={formData.brand || ''} 
              onChange={handleBrandChange}
              onFocus={() => setShowBrandSuggestions(true)}
              onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
              placeholder="Enter brand name (e.g., Nike, Adidas)"
              className="w-full px-4 py-3 border border-(--border-color) bg-(--surface-color) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-color) focus:border-transparent sm:text-sm"
              required 
            />
            {showBrandSuggestions && filteredBrands.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-(--surface-color) border border-(--border-color) rounded-lg shadow-lg max-h-48 overflow-y-auto">
                <div className="p-2 text-xs text-(--text-color)/60 border-b border-(--border-color)">
                  Existing brands (click to select):
                </div>
                {filteredBrands.map(b => (
                  <button
                    key={b.slug}
                    type="button"
                    onClick={() => selectBrand(b.name)}
                    className="w-full text-left px-4 py-2 hover:bg-(--bg-color) text-sm"
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-(--text-color)/80 mb-1.5">Category</label>
            <select name="category" value={formData.category || ''} onChange={handleChange} className="w-full px-4 py-3 border border-(--border-color) bg-(--surface-color) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-color) focus:border-transparent sm:text-sm">
              {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="sizes" label="Sizes (comma-separated)" value={formData.sizes || ''} onChange={handleChange} placeholder="e.g. 8, 9, 10" required />
          <Input name="stock" label="Stock" type="number" value={formData.stock || ''} onChange={handleChange} required />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-(--text-color)/80 mb-1.5">
            {isEditing ? 'Product Images' : 'Product Images'}
          </label>
          
          {/* Current Images Preview */}
          {imagePreview.length > 0 && !newImages && (
            <div className="mb-3">
              <div className="grid grid-cols-3 gap-3">
                {currentImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={img} 
                      alt={`Product ${index + 1}`}
                      className={`w-full h-24 object-cover rounded-lg border-2 transition-all ${
                        imagesToDelete.includes(img) 
                          ? 'border-red-500 opacity-50' 
                          : 'border-(--border-color)'
                      }`}
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => toggleImageForDeletion(img)}
                        className={`absolute top-1 right-1 p-1.5 rounded-full transition-all ${
                          imagesToDelete.includes(img)
                            ? 'bg-red-500 text-white'
                            : 'bg-black/50 text-white hover:bg-red-500'
                        }`}
                        title={imagesToDelete.includes(img) ? 'Undo delete' : 'Mark for deletion'}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 rounded-b-lg">
                      Image {index + 1}
                      {imagesToDelete.includes(img) && ' (Will be deleted)'}
                    </div>
                  </div>
                ))}
              </div>
              {isEditing && imagesToDelete.length > 0 && (
                <p className="mt-2 text-sm text-red-500">
                  {imagesToDelete.length} image(s) marked for deletion
                </p>
              )}
            </div>
          )}

          {/* New Images Preview */}
          {newImages && (
            <div className="mb-3">
              <p className="text-sm font-medium text-(--text-color)/80 mb-2">New Images Preview:</p>
              <div className="grid grid-cols-3 gap-3">
                {imagePreview.map((img, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={img} 
                      alt={`New ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-green-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs py-1 px-2 rounded-b-lg">
                      New Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Input */}
          <input 
            type="file" 
            name="images" 
            onChange={handleFileChange} 
            multiple 
            required={!isEditing}
            accept="image/*"
            className="block w-full text-sm text-(--text-color)/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-(--brand-color)/10 file:text-(--brand-color) hover:file:bg-(--brand-color)/20"
          />
          
          {isEditing && newImages && (
            <button
              type="button"
              onClick={clearNewImages}
              className="mt-2 text-sm text-(--text-color)/60 hover:text-(--text-color) flex items-center gap-1"
            >
              <X size={14} /> Clear new images
            </button>
          )}
          
          <p className="mt-1 text-xs text-(--text-color)/60">
            {isEditing 
              ? 'Click trash icon to mark images for deletion, or upload new images to replace all. You must keep at least one image.'
              : 'Upload up to 5 images. First image will be the main product image.'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured || false} onChange={handleChange} className="h-4 w-4 rounded border-(--border-color) bg-(--surface-color) text-(--brand-color) focus:ring-(--brand-color)" />
          <label htmlFor="isFeatured" className="text-sm font-medium">Mark as Featured</label>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-(--border-color)">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Product'}</Button>
        </div>
      </form>
    </Modal>
  );
};
export default ProductFormModal;