const Checkbox = ({ id, label, checked, onChange, ...props }) => {
  return (
    <div className="flex items-center group cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 rounded-md border-2 border-(--border-color) bg-(--surface-color) text-(--brand-color) focus:ring-2 focus:ring-(--brand-color) focus:ring-offset-2 focus:ring-offset-(--bg-color) transition-all duration-300 cursor-pointer checked:scale-110"
        {...props}
      />
      <label 
        htmlFor={id} 
        className="ml-3 text-sm text-(--text-color) cursor-pointer select-none group-hover:text-(--brand-color) transition-colors duration-300"
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;