import React, { useState } from 'react';
import { cn } from '../../lib/utils';

const ColorPicker = ({ value, onChange, className }) => {
  const [showPicker, setShowPicker] = useState(false);
  
  // Predefined color options
  const colorOptions = [
    { name: 'Blue', value: '#3b82f6', gradient: 'from-blue-600 to-indigo-600' },
    { name: 'Purple', value: '#8b5cf6', gradient: 'from-purple-600 to-pink-600' },
    { name: 'Green', value: '#10b981', gradient: 'from-green-600 to-teal-600' },
    { name: 'Amber', value: '#f59e0b', gradient: 'from-amber-600 to-orange-600' },
    { name: 'Red', value: '#ef4444', gradient: 'from-red-600 to-rose-600' },
    { name: 'Cyan', value: '#06b6d4', gradient: 'from-cyan-600 to-blue-600' },
  ];

  const handleColorSelect = (colorValue) => {
    onChange(colorValue);
    setShowPicker(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
        aria-label="Select color"
      >
        <div 
          className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: value }}
        />
        <span className="text-sm text-muted-foreground">
          {colorOptions.find(c => c.value === value)?.name || 'Custom'}
        </span>
      </button>

      {showPicker && (
        <div className="absolute z-50 mt-1 p-3 bg-popover border border-border rounded-md shadow-md animate-in fade-in-80 w-[220px]">
          <div className="grid grid-cols-3 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className={cn(
                  "w-full aspect-square rounded-md transition-all hover:scale-105",
                  "bg-gradient-to-br", 
                  color.gradient,
                  value === color.value && "ring-2 ring-ring ring-offset-1"
                )}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-border">
            <label className="block text-xs text-muted-foreground mb-1">Custom color</label>
            <input
              type="color"
              value={value}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { ColorPicker };