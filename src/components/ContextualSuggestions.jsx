import React, { useState, useEffect } from 'react';

const ContextualSuggestions = ({ messages, onSuggestionClick }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate contextual suggestions based on the conversation history
  useEffect(() => {
    if (messages.length === 0) return;

    // Get the last message to determine context
    const lastMessage = messages[messages.length - 1];
    
    // Only generate suggestions for bot messages
    if (lastMessage.sender === 'bot') {
      const text = lastMessage.text.toLowerCase();
      let newSuggestions = [];
      
      // Academic context
      if (text.includes('class') || text.includes('course') || text.includes('study') || text.includes('academic')) {
        newSuggestions = [
          { text: 'Show me my course schedule', icon: '📚', category: 'academic' },
          { text: 'How do I register for classes?', icon: '✏️', category: 'academic' },
          { text: 'When are final exams?', icon: '📝', category: 'academic' }
        ];
      } 
      // Administrative context
      else if (text.includes('form') || text.includes('application') || text.includes('deadline') || text.includes('submit')) {
        newSuggestions = [
          { text: 'Where do I submit this form?', icon: '📋', category: 'administrative' },
          { text: 'What is the deadline?', icon: '⏰', category: 'administrative' },
          { text: 'Who should I contact for help?', icon: '👨‍💼', category: 'administrative' }
        ];
      }
      // Campus life context
      else if (text.includes('event') || text.includes('campus') || text.includes('activity') || text.includes('club')) {
        newSuggestions = [
          { text: 'What events are happening this week?', icon: '🎭', category: 'campus' },
          { text: 'How do I join a student club?', icon: '🤝', category: 'campus' },
          { text: 'Where is the student center located?', icon: '🏢', category: 'campus' }
        ];
      }
      // Technical support context
      else if (text.includes('password') || text.includes('login') || text.includes('account') || text.includes('access')) {
        newSuggestions = [
          { text: 'How do I reset my password?', icon: '🔑', category: 'technical' },
          { text: 'I can\'t access my account', icon: '🔒', category: 'technical' },
          { text: 'Where do I find my student ID?', icon: '🪪', category: 'technical' }
        ];
      }
      // Default suggestions if no specific context is detected
      else {
        newSuggestions = [
          { text: 'Tell me more about that', icon: '🔍', category: 'general' },
          { text: 'Can you explain in simpler terms?', icon: '🔄', category: 'general' },
          { text: 'What other options do I have?', icon: '📊', category: 'general' }
        ];
      }
      
      setSuggestions(newSuggestions);
    }
  }, [messages]);

  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion.text);
    }
    // Collapse after selection
    setIsExpanded(false);
  };

  // No suggestions to show
  if (suggestions.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-blue-400">Suggested Responses</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
      
      <div className={`grid gap-2 transition-all duration-500 ${isExpanded ? 'grid-cols-1' : 'grid-cols-3'}`}>
        {suggestions.slice(0, isExpanded ? suggestions.length : 3).map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className={`flex items-center p-3 rounded-lg bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] text-left group animate-fadeIn`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-xl mr-3 group-hover:scale-125 transition-transform duration-300">{suggestion.icon}</span>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{suggestion.text}</span>
          </button>
        ))}
      </div>
      
      {/* Animated indicator for more suggestions */}
      {!isExpanded && suggestions.length > 3 && (
        <div className="flex justify-center mt-2">
          <div className="flex space-x-1">
            <div className="w-1 h-1 rounded-full bg-blue-400 animate-bounce"></div>
            <div className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextualSuggestions;