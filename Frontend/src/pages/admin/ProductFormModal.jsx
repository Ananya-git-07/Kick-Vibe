import { useState, useEffect } from 'react';
import { createShoe, updateShoeById } from '../../lib/api';
import { CATEGORIES, BRANDS } from '../../lib/constants';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const ProductFormModal = ({ isOpen, onClose, shoe, onSave }) => {
  const isEditing = !!shoe;
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    } else {
      // Reset form for "Add New"
      setFormData({
        name: '', description: '', price: '', brand: BRANDS[0].slug,
        category: CATEGORIES[0].slug, sizes: '', stock: '1', isFeatured: false
      });
    }
  }, [shoe, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, images: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing) {
        // For editing, we don't handle image uploads yet (more complex)
        // We just send the text data.
        const updatedShoe = await updateShoeById(shoe._id, {
          ...formData,
          sizes: formData.sizes.split(',').map(s => s.trim()),
        });
        toast.success('Product updated successfully!');
        onSave(updatedShoe);
      } else {
        // For creating, we send FormData
        const data = new FormData();
        Object.keys(formData).forEach(key => {
          if (key === 'images') {
            for (let i = 0; i < formData.images.length; i++) {
              data.append('images', formData.images[i]);
            }
          } else {
            data.append(key, formData[key]);
          }
        });

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
          <div>
            <label className="block text-sm font-medium text-(--text-color)/80 mb-1.5">Brand</label>
            <select name="brand" value={formData.brand || ''} onChange={handleChange} className="w-full px-4 py-3 border border-(--border-color) bg-(--surface-color) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-color) focus:border-transparent sm:text-sm">
              {BRANDS.map(b => <option key={b.slug} value={b.slug}>{b.name}</option>)}
            </select>
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

        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-(--text-color)/80 mb-1.5">Images</label>
            <input type="file" name="images" onChange={handleFileChange} multiple required className="block w-full text-sm text-(--text-color)/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-(--brand-color)/10 file:text-(--brand-color) hover:file:bg-(--brand-color)/20"/>
          </div>
        )}

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