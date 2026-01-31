import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

const HeroSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>
      
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full text-blue-400 text-sm font-medium mb-4 backdrop-blur-sm border border-blue-500/10">
              AI-powered chat assistance
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Meet <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">UNIBOT</span>,
              <br />
              Your Universal
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">Assistant</span>
            </h1>
            
            <p className="text-lg mt-4 max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              Experience the next generation of AI chat assistance. UNIBOT understands your
              needs, learns from interactions, and delivers personalized responses instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all duration-300"
                asChild
              >
                <Link to="/chat">Start Chatting</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10 backdrop-blur-sm"
                asChild
              >
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 flex items-center justify-center md:justify-start space-x-6 text-gray-400 text-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
          
          {/* Right content - Chat UI Preview */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-2xl opacity-70 blur-2xl animate-pulse-slow"></div>
              <div className="relative bg-black/30 backdrop-blur-xl rounded-2xl shadow-[0_0_25px_rgba(79,70,229,0.3)] overflow-hidden border border-white/10">
                {/* Browser mockup header */}
                <div className="bg-black/50 px-4 py-2 flex items-center border-b border-white/10">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="mx-auto text-xs text-gray-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                    unibot.ai
                  </div>
                </div>
                
                {/* Chat interface mockup */}
                <div className="p-6 bg-transparent">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(79,70,229,0.6)] border-2 border-indigo-500/50 animate-glow">
                      <img src="/static/images/UNIBOT.png" alt="UNIBOT" className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-white text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Chat with UNIBOT</h3>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        <p className="text-xs text-gray-400">Online & Ready to Help</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm p-3 rounded-lg rounded-tl-none max-w-[85%] text-sm text-white border border-blue-500/20 shadow-sm animate-fadeIn">
                      <div className="flex items-center mb-1">
                        <div className="w-5 h-5 rounded-full overflow-hidden mr-2">
                          <img src="/static/images/UNIBOT.png" alt="UNIBOT" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs text-blue-300">UNIBOT</span>
                      </div>
                      Hello! I'm your AI assistant. How can I help you today?
                    </div>
                    
                    <div className="bg-gray-700/30 backdrop-blur-sm p-3 rounded-lg rounded-tr-none max-w-[85%] ml-auto text-sm text-white border border-white/10 shadow-sm animate-fadeIn">
                      <div className="flex items-center justify-end mb-1">
                        <span className="text-xs text-gray-400">You</span>
                      </div>
                      Can you help me with my research paper on AI ethics?
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm p-3 rounded-lg rounded-tl-none max-w-[85%] text-sm text-white border border-blue-500/20 shadow-sm animate-fadeIn">
                      <div className="flex items-center mb-1">
                        <div className="w-5 h-5 rounded-full overflow-hidden mr-2">
                          <img src="/static/images/UNIBOT.png" alt="UNIBOT" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs text-blue-300">UNIBOT</span>
                      </div>
                      Absolutely! I'd be happy to help with your research paper on AI ethics. Would you like me to help with structuring the paper, finding relevant sources, or discussing key ethical considerations in AI development?
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Type your message..." 
                        className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-2 text-white hover:shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-blue-300 hover:bg-blue-500/10 cursor-pointer transition-colors duration-300">Research sources</span>
                      <span className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-blue-300 hover:bg-blue-500/10 cursor-pointer transition-colors duration-300">Paper structure</span>
                      <span className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-blue-300 hover:bg-blue-500/10 cursor-pointer transition-colors duration-300">AI ethics principles</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;