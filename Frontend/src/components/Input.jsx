import { useState } from 'react';

const Input = ({ id, label, type = "text", placeholder, value, onChange, required = false, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative">
      <label 
        htmlFor={id} 
        className={`absolute left-3 transition-all duration-300 pointer-events-none ${
          isFocused || hasValue
            ? 'top-0 -translate-y-1/2 text-xs bg-(--surface-color) px-1 text-(--brand-color) font-semibold'
            : 'top-1/2 -translate-y-1/2 text-sm text-(--text-color)/60'
        }`}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={isFocused ? placeholder : ''}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className={`
          w-full px-4 py-3 
          border-2 rounded-xl
          bg-(--surface-color) 
          transition-all duration-300
          focus:outline-none 
          sm:text-sm
          ${
            isFocused
              ? 'border-(--brand-color) shadow-lg shadow-(--brand-color)/20 ring-4 ring-(--brand-color)/10'
              : 'border-(--border-color) hover:border-(--brand-color)/50'
          }
        `}
        {...props}
      />
    </div>
  );
};

export default Input;