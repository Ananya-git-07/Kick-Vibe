import { useState, useEffect } from 'react';
import { getAllShoes, deleteShoeById } from '../../lib/api';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import ProductFormModal from './ProductFormModal'; // <-- IMPORT THE MODAL

const ProductsDashboardPage = () => {
  const [shoes, setShoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShoe, setEditingShoe] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getAllShoes();
      setShoes(data.shoes);
    } catch (error) {
      toast.error('Failed to fetch products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingShoe(null); // Ensure we are not in edit mode
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (shoe) => {
    setEditingShoe(shoe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingShoe(null);
  };

  // Called when a product is successfully created or updated
  const handleSave = (savedShoe) => {
    if (editingShoe) {
      // If editing, update the item in the list
      setShoes(prev => prev.map(s => (s._id === savedShoe._id ? savedShoe : s)));
    } else {
      // If creating, add the new item to the top of the list
      setShoes(prev => [savedShoe, ...prev]);
    }
  };

  const handleDelete = async (shoeId) => {
    if (window.confirm('Are you sure you want to delete this product? This cannot be undone.')) {
      try {
        await deleteShoeById(shoeId);
        toast.success('Product deleted successfully.');
        setShoes(prev => prev.filter(shoe => shoe._id !== shoeId));
      } catch (error) {
        toast.error('Failed to delete product.');
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Button onClick={handleOpenAddModal}>Add New Product</Button>
      </div>
      <div className="bg-(--surface-color) rounded-lg border border-(--border-color) shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-(--border-color)">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shoes.map(shoe => (
              <tr key={shoe._id} className="border-b border-(--border-color) last:border-b-0">
                <td className="p-4 flex items-center gap-4">
                  <img src={shoe.images[0]} alt={shoe.name} className="h-12 w-12 object-cover rounded-md" />
                  <span className="font-medium">{shoe.name}</span>
                </td>
                <td className="p-4 text-(--text-color)/80">{shoe.brand}</td>
                <td className="p-4 text-(--text-color)/80">
                  {shoe.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </td>
                <td className="p-4 text-(--text-color)/80">{shoe.stock}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => handleOpenEditModal(shoe)}>Edit</Button>
                    <Button variant="secondary" className="px-3 py-1.5 text-xs !text-red-500 hover:!bg-red-500/10" onClick={() => handleDelete(shoe._id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        shoe={editingShoe}
        onSave={handleSave}
      />
    </div>
  );
};
export default ProductsDashboardPage;