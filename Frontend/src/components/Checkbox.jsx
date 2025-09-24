const Checkbox = ({ id, label, checked, onChange, ...props }) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-(--border-color) bg-(--surface-color) text-(--brand-color) focus:ring-(--brand-color)"
        {...props}
      />
      <label htmlFor={id} className="ml-3 text-sm text-(--text-color)">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;