import { useState, useEffect } from 'react';

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', updatePosition);

    // Initial call
    updatePosition();

    // Cleanup
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
};