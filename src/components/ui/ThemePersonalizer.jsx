import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './button';

const ThemePersonalizer = ({ isOpen, onClose }) => {
  const { theme, setThemeMode } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Theme options
  const [selectedFont, setSelectedFont] = useState('default');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedBubbleStyle, setSelectedBubbleStyle] = useState('default');
  
  // Font options
  const fontOptions = [
    { id: 'default', name: 'Default', className: 'font-sans' },
    { id: 'serif', name: 'Serif', className: 'font-serif' },
    { id: 'mono', name: 'Monospace', className: 'font-mono' },
  ];
  
  // Color scheme options
  const colorOptions = [
    { id: 'blue', name: 'Blue', gradient: 'from-blue-600 to-indigo-600', light: 'from-blue-50 to-indigo-50' },
    { id: 'purple', name: 'Purple', gradient: 'from-purple-600 to-pink-600', light: 'from-purple-50 to-pink-50' },
    { id: 'green', name: 'Green', gradient: 'from-green-600 to-teal-600', light: 'from-green-50 to-teal-50' },
    { id: 'amber', name: 'Amber', gradient: 'from-amber-600 to-orange-600', light: 'from-amber-50 to-orange-50' },
  ];
  
  // Bubble style options
  const bubbleStyleOptions = [
    { id: 'default', name: 'Default', className: 'rounded-2xl' },
    { id: 'rounded', name: 'Rounded', className: 'rounded-full' },
    { id: 'angular', name: 'Angular', className: 'rounded-md' },
  ];
  
  // Apply theme changes
  const applyThemeChanges = () => {
    // In a real app, you would save these preferences to localStorage or a backend
    document.documentElement.setAttribute('data-font', selectedFont);
    document.documentElement.setAttribute('data-color-scheme', selectedColor);
    document.documentElement.setAttribute('data-bubble-style', selectedBubbleStyle);
    
    // Close the personalizer
    onClose();
  };
  
  // Load saved preferences on mount
  useEffect(() => {
    const savedFont = document.documentElement.getAttribute('data-font') || 'default';
    const savedColor = document.documentElement.getAttribute('data-color-scheme') || 'blue';
    const savedBubbleStyle = document.documentElement.getAttribute('data-bubble-style') || 'default';
    
    setSelectedFont(savedFont);
    setSelectedColor(savedColor);
    setSelectedBubbleStyle(savedBubbleStyle);
  }, []);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} p-6 rounded-xl shadow-lg max-w-md w-full mx-4`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Personalize Chat Theme</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Font Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Font Style</h4>
          <div className="flex flex-wrap gap-2">
            {fontOptions.map((font) => (
              <button
                key={font.id}
                onClick={() => setSelectedFont(font.id)}
                className={`px-4 py-2 rounded-md ${font.className} text-sm transition-all ${selectedFont === font.id 
                  ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                  : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}`}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Color Scheme Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Color Scheme</h4>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                className={`w-10 h-10 rounded-full bg-gradient-to-r ${color.gradient} transition-all ${selectedColor === color.id ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : 'hover:scale-105'}`}
                aria-label={`Select ${color.name} theme`}
              ></button>
            ))}
          </div>
        </div>
        
        {/* Bubble Style Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Chat Bubble Style</h4>
          <div className="flex flex-wrap gap-2">
            {bubbleStyleOptions.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedBubbleStyle(style.id)}
                className={`relative px-4 py-2 ${style.className} text-sm transition-all ${selectedBubbleStyle === style.id 
                  ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                  : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Preview */}
        <div className="mb-6 p-4 border rounded-lg border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium mb-2">Preview</h4>
          <div className="flex items-start space-x-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorOptions.find(c => c.id === selectedColor)?.gradient} flex items-center justify-center`}>
              <span className="text-white text-xs">AI</span>
            </div>
            <div className={`${bubbleStyleOptions.find(b => b.id === selectedBubbleStyle)?.className} ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} p-3 ${fontOptions.find(f => f.id === selectedFont)?.className}`}>
              <p className="text-sm">This is how your chat will look!</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className={isDarkMode ? 'border-gray-700 text-gray-300' : ''}
          >
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            onClick={applyThemeChanges}
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThemePersonalizer;