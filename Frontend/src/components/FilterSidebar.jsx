import Checkbox from './Checkbox';
import { CATEGORIES, BRANDS } from '../lib/constants'; // <-- IMPORT

const FilterSidebar = ({ filters, onFilterChange }) => {
  
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
          {BRANDS.map((brand) => (
            <Checkbox
              key={brand.slug}
              id={brand.slug}
              label={brand.name}
              checked={filters.brand === brand.slug}
              onChange={() => handleCheckboxChange('brand', brand.slug)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;