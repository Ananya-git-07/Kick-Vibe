import { createContext, useState, useEffect } from 'react';

// Create the context with a default value
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// Create the provider component
export const ThemeProvider = ({ children }) => {
  // State to hold the current theme. We'll check localStorage for a saved theme,
  // or default to 'light'.
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // This effect runs whenever the theme state changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove the old theme class and add the new one
    const oldTheme = theme === 'dark' ? 'light' : 'dark';
    root.classList.remove(oldTheme);
    root.classList.add(theme);

    // Save the new theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Provide the theme state and the toggle function to children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};