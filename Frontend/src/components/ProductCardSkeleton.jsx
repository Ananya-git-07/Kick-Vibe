const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] w-full rounded-lg bg-gray-300 dark:bg-gray-700"></div>
      <div className="mt-3 h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700"></div>
      <div className="mt-2 h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-700"></div>
      <div className="mt-2 h-5 w-1/3 rounded bg-gray-300 dark:bg-gray-700"></div>
    </div>
  );
};

export default ProductCardSkeleton;