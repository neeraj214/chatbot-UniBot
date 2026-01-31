import React, { useState } from 'react';
import { Button } from './ui/button';

const ChatControls = ({ onVoiceInput, onExportChat }) => {
  const [isListening, setIsListening] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (onVoiceInput) {
      onVoiceInput(!isListening);
    }
  };
  
  const handleExportChat = (format) => {
    if (onExportChat) {
      onExportChat(format);
    }
    setShowExportOptions(false);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Voice Input Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-full transition-all duration-300 ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-gray-800/50 text-gray-400 hover:text-blue-400'}`}
        onClick={handleVoiceToggle}
        title={isListening ? 'Stop listening' : 'Voice input'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </Button>
      
      {/* Save Conversation Button */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-gray-800/50 text-gray-400 hover:text-amber-400 transition-all duration-300"
        title="Save conversation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </Button>
      
      {/* Export Chat Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-gray-800/50 text-gray-400 hover:text-green-400 transition-all duration-300"
          onClick={() => setShowExportOptions(!showExportOptions)}
          title="Export chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </Button>
        
        {/* Export Options Dropdown */}
        {showExportOptions && (
          <div className="absolute bottom-full right-0 mb-2 w-32 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden animate-fadeIn z-10">
            <button 
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              onClick={() => handleExportChat('pdf')}
            >
              Export as PDF
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              onClick={() => handleExportChat('txt')}
            >
              Export as Text
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              onClick={() => handleExportChat('json')}
            >
              Export as JSON
            </button>
          </div>
        )}
      </div>
      
      {/* Theme Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-gray-800/50 text-gray-400 hover:text-purple-400 transition-all duration-300"
        title="Toggle theme"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </Button>
    </div>
  );
};

export default ChatControls;