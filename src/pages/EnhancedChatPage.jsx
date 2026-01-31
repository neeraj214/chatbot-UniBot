import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useTheme } from '../contexts/ThemeContext';
import ThemePersonalizer from '../components/ui/ThemePersonalizer';
import '../chatbot-animations.css';

const EnhancedChatPage = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [currentFeedbackMessage, setCurrentFeedbackMessage] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPersonalizerOpen, setIsPersonalizerOpen] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Quick reply suggestions
  const suggestions = [
    'Tell me about the university',
    'How do I register for classes?',
    'What are the library hours?',
    'When is the next campus event?',
    'How do I contact student services?',
    'What dining options are available?'
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

  useEffect(() => {
    // Add welcome message when component mounts
    setMessages([{
      id: 'welcome',
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date().toISOString()
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
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

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
        const botResponse = {
          id: Date.now().toString(),
          text: data.response,
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, botResponse]);
        
        // Auto-read response if text-to-speech is enabled
        if (isSpeaking) {
          speakText(data.response);
        }
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
  
  const toggleListening = () => {
    if (!speechRecognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    
    if (isListening) {
      speechRecognitionRef.current.stop();
    } else {
      setIsListening(true);
      speechRecognitionRef.current.start();
    }
  };
  
  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
  };
  
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const showFeedback = (messageId) => {
    setCurrentFeedbackMessage(messageId);
    setFeedbackVisible(true);
  };
  
  const submitFeedback = async () => {
    // In a real app, you would send this to your backend
    console.log(`Feedback submitted: ${currentRating} stars for message ${currentFeedbackMessage}`);
    
    // Reset feedback state
    setFeedbackVisible(false);
    setCurrentRating(0);
    setCurrentFeedbackMessage(null);
    
    // Show thank you message
    alert('Thank you for your feedback!');
  };

  return (
    <div className="pt-16 pb-8 min-h-[90vh] flex items-center justify-center theme-transition">
      <div className="w-full max-w-5xl mx-auto px-4">
        <Card className={`overflow-hidden border-none ${isDarkMode ? 'glassmorphism-dark' : 'glassmorphism'} shadow-[0_0_45px_-15px_rgba(79,70,229,0.25)] animate-fadeIn transition-all duration-500`}>
          {/* Chat Header */}
          <CardHeader className={`p-6 border-b ${isDarkMode ? 'border-white/10 bg-gradient-to-r from-indigo-950/80 to-blue-950/80' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-50 blur-md animate-pulse-slow`}></div>
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
                  <p className={`text-sm ${isDarkMode ? 'text-blue-200/80' : 'text-blue-500/80'}`}>Your AI assistant for university information</p>
                </div>
              </div>
              
              {/* Theme Controls */}
              <div className="flex space-x-2">
                {/* Personalize Theme Button */}
                <button 
                  onClick={() => setIsPersonalizerOpen(true)}
                  className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-blue-300 hover:bg-gray-700' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                  aria-label="Personalize theme"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </button>
                
                {/* Theme Toggle Button */}
                <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="p-0">
            <div className={`h-[65vh] overflow-y-auto ${isDarkMode ? 'bg-gradient-to-b from-gray-900/70 to-black/70' : 'bg-gradient-to-b from-gray-50 to-white'} p-6 space-y-6`}>
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mr-3 mt-1 shadow-glow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                        <circle cx="12" cy="5" r="2"></circle>
                        <path d="M12 7v4"></path>
                      </svg>
                    </div>
                  )}
                  <div 
                    className={`max-w-[80%] p-4 rounded-2xl ${message.sender === 'user' 
                      ? `bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] chat-bubble-user` 
                      : `${isDarkMode ? 'bg-gray-800/80 text-gray-100 border border-white/5' : 'bg-white text-gray-800 border border-gray-200 shadow-md'} chat-bubble-bot`}`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <div className="text-xs opacity-70 mt-2 flex justify-between items-center">
                      <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      
                      {message.sender === 'bot' && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => speakText(message.text)}
                            className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                            aria-label="Read message aloud"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => showFeedback(message.id)}
                            className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                            aria-label="Rate this response"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center ml-3 mt-1 shadow-glow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mr-3 mt-1 shadow-glow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                      <circle cx="12" cy="5" r="2"></circle>
                      <path d="M12 7v4"></path>
                    </svg>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-800/80 text-gray-100 border border-white/5' : 'bg-white text-gray-800 border border-gray-200 shadow-md'} p-4 rounded-2xl chat-bubble-bot`}>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 typing-dot"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-400 typing-dot"></div>
                      <div className="w-2 h-2 rounded-full bg-purple-400 typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Feedback Modal */}
          {feedbackVisible && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
              <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} p-6 rounded-xl shadow-lg max-w-md w-full mx-4`}>
                <h3 className="text-xl font-bold mb-4">Rate this response</h3>
                <div className="flex justify-center space-x-2 mb-6">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setCurrentRating(rating)}
                      className={`text-2xl transition-transform ${currentRating >= rating ? 'text-yellow-400 scale-110' : 'text-gray-400'} hover:scale-110`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setFeedbackVisible(false)}
                    className={isDarkMode ? 'border-gray-700 text-gray-300' : ''}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="gradient" 
                    onClick={submitFeedback}
                    disabled={currentRating === 0}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Suggestion Chips */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-white/10 bg-gray-900/50' : 'border-gray-200 bg-gray-50'} overflow-x-auto`}>
            <div className="flex space-x-3 pb-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-4 py-2 ${isDarkMode ? 'bg-gray-800/80 text-gray-300 border border-white/5' : 'bg-white text-gray-700 border border-gray-200'} text-sm rounded-full whitespace-nowrap hover:bg-gray-700/80 transition-all duration-300 hover:shadow-[0_0_10px_rgba(79,70,229,0.3)] hover-scale hover-glow flex items-center`}
                >
                  <span className="text-blue-400 mr-2">✨</span>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <CardFooter className={`p-4 ${isDarkMode ? 'bg-gray-900/90' : 'bg-white'} border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Type your message here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  ref={inputRef}
                  className={`pr-10 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : 'bg-gray-50'}`}
                />
                {isListening && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  </div>
                )}
              </div>
              
              {/* Voice Input Button */}
              <Button 
                type="button" 
                onClick={toggleListening}
                variant={isListening ? "destructive" : "outline"}
                className={`rounded-full p-0 w-10 h-10 flex items-center justify-center ${isListening ? 'recording-pulse bg-red-500 text-white' : ''} ${isDarkMode && !isListening ? 'border-gray-700 text-gray-300' : ''} hover-scale`}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isListening ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  )}
                </svg>
              </Button>
              
              {/* Text-to-Speech Toggle Button */}
              <Button 
                type="button" 
                onClick={toggleSpeaking}
                variant={isSpeaking ? "gradient" : "outline"}
                className={`rounded-full p-0 w-10 h-10 flex items-center justify-center ${isDarkMode && !isSpeaking ? 'border-gray-700 text-gray-300' : ''}`}
                aria-label={isSpeaking ? "Disable text-to-speech" : "Enable text-to-speech"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </Button>
              
              {/* Send Button */}
              <Button type="submit" variant="gradient" className="rounded-full p-0 w-10 h-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" transform="rotate(90 12 12)" />
                </svg>
              </Button>
            </form>
          </CardFooter>
          
          {/* Floating Feedback Button */}
          <button 
            onClick={() => showFeedback('general')}
            className="absolute bottom-20 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 animated-gradient text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-scale z-10"
            aria-label="Give feedback"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          
          {/* Theme Personalizer */}
          <ThemePersonalizer isOpen={isPersonalizerOpen} onClose={() => setIsPersonalizerOpen(false)} />
        </Card>
      </div>
    </div>
  );
};

export default EnhancedChatPage;