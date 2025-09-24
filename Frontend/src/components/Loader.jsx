import { LoaderCircle } from 'lucide-react';

const Loader = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex justify-center items-center py-10">
      <LoaderCircle className={`animate-spin text-(--brand-color) ${sizeClasses[size]}`} />
    </div>
  );
};

export default Loader;