const Input = ({ id, label, type = "text", placeholder, value, onChange, required = false, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-(--text-color)/80">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-3 py-2 border border-(--border-color) bg-(--surface-color) rounded-md focus:outline-none focus:ring-(--brand-color) focus:border-(--brand-color) sm:text-sm"
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;