import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center p-1 h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 overflow-hidden"
      style={{
        backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB',
        borderColor: 'var(--border-color)',
        borderWidth: '1px',
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Track background with gradient */}
      <span 
        className="absolute inset-0 rounded-full transition-opacity duration-300"
        style={{
          opacity: isDark ? 0.1 : 0,
          background: 'linear-gradient(to right, var(--gradient-start), var(--gradient-end))'
        }}
      />

      {/* Toggle indicator */}
      <span
        className={`absolute top-1 left-1 flex items-center justify-center h-6 w-6 rounded-full transform transition-transform duration-300 ${isDark ? 'translate-x-8 bg-gray-800' : 'bg-white'}`}
        style={{
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Sun icon */}
        <svg
          className={`h-4 w-4 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: '#F59E0B' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        {/* Moon icon */}
        <svg
          className={`absolute h-4 w-4 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: '#F3F4F6' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;