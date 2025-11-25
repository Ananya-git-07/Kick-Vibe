import { useState, useEffect } from 'react';
import Checkbox from './Checkbox';
import { CATEGORIES } from '../lib/constants';
import api from '../lib/api';

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get('/shoes/brands');
        setBrands(response.data.data || []);
      } catch (error) {
        console.error('Error fetching brands:', error);
        setBrands([]);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, []);
  
  const handleCheckboxChange = (group, value) => {
    onFilterChange(group, filters[group] === value ? '' : value);
  };

  return (
    <aside className="w-full lg:w-64 lg:pr-8">
      <h2 className="text-xl font-bold tracking-tight">Filters</h2>
      
      <div className="mt-6 border-t border-(--border-color) pt-6">
        <h3 className="font-semibold">Category</h3>
        <div className="mt-4 space-y-4">
          {CATEGORIES.map((category) => (
            <Checkbox
              key={category.slug}
              id={category.slug}
              label={category.name}
              checked={filters.category === category.slug}
              onChange={() => handleCheckboxChange('category', category.slug)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-(--border-color) pt-6">
        <h3 className="font-semibold">Brand</h3>
        <div className="mt-4 space-y-4">
          {loadingBrands ? (
            <p className="text-sm text-(--text-color)/60">Loading brands...</p>
          ) : brands.length === 0 ? (
            <p className="text-sm text-(--text-color)/60">No brands available</p>
          ) : (
            brands.map((brand) => (
              <Checkbox
                key={brand.slug}
                id={brand.slug}
                label={brand.name}
                checked={filters.brand === brand.slug}
                onChange={() => handleCheckboxChange('brand', brand.slug)}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;