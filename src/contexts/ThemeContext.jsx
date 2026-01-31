import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the theme context
const ThemeContext = createContext(null);

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Provider component that wraps the app and makes theme object available to any child component that calls useTheme().
export const ThemeProvider = ({ children }) => {
  // Check if user has a saved theme preference in localStorage, default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Update localStorage and document attributes when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Update the document's data-theme attribute for CSS variables
    document.documentElement.setAttribute('data-theme', theme);
    
    // Also add/remove the 'dark' class for Tailwind dark mode support
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Set a specific theme
  const setThemeMode = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setTheme(mode);
    }
  };

  const value = {
    theme,
    toggleTheme,
    setThemeMode,
    isDarkMode: theme === 'dark'
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};