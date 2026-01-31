import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import ChatbotGuide from '../components/ChatbotGuide';
import InteractiveFeatures from '../components/InteractiveFeatures';
import MessageCategorization from '../components/MessageCategorization';
import ContextualSuggestions from '../components/ContextualSuggestions';
import ChatControls from '../components/ChatControls';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFeatures, setShowFeatures] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // Suggestion chips for quick prompts
  const suggestions = [
    'Make it more descriptive and vivid',
    'Condense it and make it concise',
    'Add some flair and creativity',
    'Simplify the language for clarity',
    'Inject a sense of urgency and excitement',
    'Personalize it for our target audience'
  ];
  
  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = false;
      speechRecognitionRef.current.interimResults = false;
      
      speechRecognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      speechRecognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      speechRecognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort();
      }
    };
  }, []);
  
  // Function to detect message category based on content
  const detectMessageCategory = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('class') || lowerText.includes('course') || lowerText.includes('study')) {
      return 'academic';
    } else if (lowerText.includes('form') || lowerText.includes('application') || lowerText.includes('deadline')) {
      return 'administrative';
    } else if (lowerText.includes('password') || lowerText.includes('login') || lowerText.includes('account')) {
      return 'technical';
    } else if (lowerText.includes('personal') || lowerText.includes('help') || lowerText.includes('advice')) {
      return 'personal';
    }
    
    return 'general';
  };

  useEffect(() => {
    // Add welcome message when component mounts
    setMessages([{
      id: 'welcome',
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
      category: 'general'
    }]);

    // Focus on input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const message = input.trim();
    if (!message) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      category: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Stop listening if active
    if (isListening && speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    }

    try {
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      // Add bot response to chat
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: data.response,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          category: detectMessageCategory(data.response),
          category: detectMessageCategory(data.response)
        }]);
      }, 500); // Slight delay for typing effect
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'Sorry, there was an error processing your request. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleVoiceInput = (isActive) => {
    setIsListening(isActive);
    if (isActive) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.start();
      }
    } else {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    }
  };
  
  const handleExportChat = (format) => {
    // In a real app, this would generate and download the chat in the specified format
    console.log(`Exporting chat as ${format}`);
    alert(`Chat would be exported as ${format} in a real implementation`);
  };
  
  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
  };
  
  const getCategoryColor = (category) => {
    switch(category) {
      case 'academic':
        return 'bg-blue-600/30 text-blue-300';
      case 'administrative':
        return 'bg-purple-600/30 text-purple-300';
      case 'technical':
        return 'bg-green-600/30 text-green-300';
      case 'personal':
        return 'bg-red-600/30 text-red-300';
      case 'starred':
        return 'bg-amber-500/30 text-amber-300';
      default:
        return 'bg-gray-600/30 text-gray-300';
    }
  };
  
  const filteredMessages = activeCategory === 'all' 
    ? messages 
    : messages.filter(msg => msg.category === activeCategory || msg.sender === 'user');

  return (
    <div className="pt-16 pb-8 min-h-[90vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-4 mb-8">
        <Card className="overflow-hidden border-none bg-black/30 backdrop-blur-xl shadow-[0_0_45px_-15px_rgba(79,70,229,0.25)] animate-fadeIn">
          {/* Chat Header */}
          <CardHeader className="p-6 border-b border-white/10 bg-gradient-to-r from-indigo-950/80 to-blue-950/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-50 blur-md animate-pulse-slow"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-3 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                      <circle cx="12" cy="5" r="2"></circle>
                      <path d="M12 7v4"></path>
                      <line x1="8" y1="16" x2="8" y2="16"></line>
                      <line x1="16" y1="16" x2="16" y2="16"></line>
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Chat with UniBot</h2>
                  <p className="text-sm text-blue-200/80">Your AI assistant for content transformation and customization</p>
                </div>
              </div>
              
              {/* Feature toggle button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 transition-all duration-300"
                onClick={() => setShowFeatures(!showFeatures)}
              >
                <span className="mr-2">{showFeatures ? 'Hide Features' : 'Show Features'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${showFeatures ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </div>
            
            {/* Collapsible features section */}
            <div className={`overflow-hidden transition-all duration-500 ${showFeatures ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-medium text-blue-400 mb-3">Chat Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center space-x-2 text-gray-300 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <span>Voice Input</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300 text-sm">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <span>Message Categories</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300 text-sm">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                    <span>Export Chat</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300 text-sm">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <span>Save Conversations</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="p-0">
            {/* Message Categories */}
            <div className="px-4 py-2 border-b border-white/5 bg-gray-900/80">
              <MessageCategorization onCategorySelect={handleCategorySelect} />
            </div>
            
            <div className="h-[60vh] overflow-y-auto bg-gradient-to-b from-gray-900/70 to-black/70 p-6 space-y-6">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mr-3 mt-1 shadow-glow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                        <circle cx="12" cy="5" r="2"></circle>
                        <path d="M12 7v4"></path>
                      </svg>
                    </div>
                  )}
                  <div 
                    className={`max-w-[80%] p-4 rounded-2xl ${message.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                      : 'bg-gray-800/80 text-gray-100 border border-white/5'}`}
                    data-category={message.category}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <div className="flex justify-between items-center mt-2">
                      {message.category && message.sender === 'bot' && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(message.category)}`}>
                          {message.category}
                        </span>
                      )}
                      <div className="text-xs opacity-70 text-right">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center ml-3 mt-1 shadow-glow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mr-3 mt-1 shadow-glow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                      <circle cx="12" cy="5" r="2"></circle>
                      <path d="M12 7v4"></path>
                    </svg>
                  </div>
                  <div className="bg-gray-800/80 text-gray-100 p-4 rounded-2xl border border-white/5">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Contextual Suggestions */}
          <div className="p-4 border-t border-white/10 bg-gray-900/60">
            <ContextualSuggestions messages={messages} onSuggestionClick={handleSuggestionClick} />
          </div>
          
          {/* Suggestion Chips */}
          <div className="p-4 border-t border-white/10 bg-gray-900/50 overflow-x-auto">
            <div className="flex space-x-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 bg-gray-800/80 text-sm text-gray-300 rounded-full whitespace-nowrap hover:bg-gray-700/80 transition-all duration-300 hover:shadow-[0_0_10px_rgba(79,70,229,0.3)] hover:scale-105 border border-white/5 flex items-center"
                >
                  <span className="text-blue-400 mr-2">✨</span>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <CardFooter className="p-4 border-t border-white/10 bg-gray-900/70">
            <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-3">
              <div className="flex space-x-3">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? 'Listening...' : 'Ask our chatbot for the content form you require...'}
                    className={`w-full bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-blue-500 pl-4 pr-10 py-6 rounded-xl shadow-inner ${isListening ? 'border-red-500 animate-pulse' : ''}`}
                  />
                  {input && (
                    <button 
                      type="button" 
                      onClick={() => setInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </button>
                  )}
                </div>
                <Button 
                  type="submit" 
                  variant="gradient"
                  size="icon"
                  className="w-12 h-12 rounded-xl shadow-glow"
                  disabled={!input.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </Button>
              </div>
              
              {/* Chat Controls */}
              <div className="flex justify-between items-center px-2">
                <ChatControls 
                  onVoiceInput={handleVoiceInput} 
                  onExportChat={handleExportChat} 
                />
                
                <div className="text-xs text-gray-400">
                  {isListening ? (
                    <span className="text-red-400 animate-pulse flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></span>
                      Listening...
                    </span>
                  ) : (
                    <span>Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">Enter</kbd> to send</span>
                  )}
                </div>
              </div>
            </form>
          </CardFooter>
        </Card>
      </div>
      
      {/* Interactive Features Section */}
      <div className="w-full max-w-5xl mx-auto px-4 mb-8">
        <InteractiveFeatures />
      </div>
      
      {/* Chatbot Guide Section */}
      <div className="w-full max-w-5xl mx-auto px-4">
        <ChatbotGuide />
      </div>
    </div>
  );
};

export default ChatPage;