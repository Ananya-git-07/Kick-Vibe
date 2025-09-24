import Checkbox from './Checkbox';

// We'll use hardcoded data for now. In a real app, you might fetch these from the API.
const categories = ["sneakers", "boots", "sandals", "formal", "casual"];
const brands = ["Vibe", "SkyFlex", "RidgeLine", "Oasis", "Metro"]; // Example brands

const FilterSidebar = ({ filters, onFilterChange }) => {
  
  const handleCheckboxChange = (group, value) => {
    // For simplicity, our current filter state is a single value per group.
    // A more advanced filter would support multiple selections (e.g., an array).
    onFilterChange(group, filters[group] === value ? '' : value);
  };

  return (
    <aside className="w-full lg:w-64 lg:pr-8">
      <h2 className="text-xl font-bold tracking-tight">Filters</h2>
      
      {/* Category Filter */}
      <div className="mt-6 border-t border-(--border-color) pt-6">
        <h3 className="font-semibold">Category</h3>
        <div className="mt-4 space-y-4">
          {categories.map((category) => (
            <Checkbox
              key={category}
              id={category}
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              checked={filters.category === category}
              onChange={() => handleCheckboxChange('category', category)}
            />
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mt-6 border-t border-(--border-color) pt-6">
        <h3 className="font-semibold">Brand</h3>
        <div className="mt-4 space-y-4">
          {brands.map((brand) => (
            <Checkbox
              key={brand}
              id={brand}
              label={brand}
              checked={filters.brand === brand}
              onChange={() => handleCheckboxChange('brand', brand)}
            />
          ))}
        </div>
      </div>
      
      {/* Add more filters here later, e.g., Price Range Slider */}

    </aside>
  );
};

export default FilterSidebar;