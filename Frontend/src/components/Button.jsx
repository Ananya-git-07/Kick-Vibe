import { Link } from 'react-router-dom';

const Button = ({ to, children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-(--bg-color) transform hover:-translate-y-1 active:translate-y-0 overflow-hidden";

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-(--brand-color) to-(--brand-secondary) 
      text-white 
      hover:shadow-2xl hover:shadow-(--brand-color)/40
      focus:ring-(--brand-color)
      before:absolute before:inset-0
      before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0
      before:translate-x-[-200%] hover:before:translate-x-[200%]
      before:transition-transform before:duration-700
      shadow-lg shadow-(--brand-color)/25
    `,
    secondary: `
      bg-(--surface-color) text-(--text-color) 
      border-2 border-(--border-color) 
      hover:border-(--brand-color)
      hover:bg-(--border-light) dark:hover:bg-(--border-dark) 
      focus:ring-(--brand-color) 
      shadow-md hover:shadow-xl
      backdrop-blur-sm
    `,
  };

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={finalClasses} {...props}>
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button className={finalClasses} {...props}>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;