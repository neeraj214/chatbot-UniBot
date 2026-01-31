import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from './ui/card';

const InteractiveFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef(null);

  // Features data with icons and descriptions
  const features = [
    {
      id: 'voice',
      title: 'Voice Interaction',
      description: 'Speak to UniBot directly using your microphone for a hands-free experience.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'save',
      title: 'Save Conversations',
      description: 'Bookmark important conversations to reference them later when needed.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'categories',
      title: 'Message Categories',
      description: 'Organize messages by topics to easily track different conversation threads.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'export',
      title: 'Export Chat',
      description: 'Download your conversation history in multiple formats for your records.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  // Setup intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={featuresRef}
      className={`w-full max-w-5xl mx-auto px-4 py-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <Card className="overflow-hidden border-none bg-black/30 backdrop-blur-xl shadow-[0_0_45px_-15px_rgba(79,70,229,0.25)]">
        <CardContent className="p-6 bg-gradient-to-b from-gray-900/70 to-black/70">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-6 text-center">
            Interactive Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div 
                key={feature.id}
                className={`relative bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] cursor-pointer ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 150}ms` }}
                onMouseEnter={() => setActiveFeature(feature.id)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${feature.color} bg-opacity-20 flex items-center justify-center mb-2 transition-transform duration-500 ${activeFeature === feature.id ? 'scale-110' : ''}`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                  
                  {/* Animated tooltip that appears on hover */}
                  <div 
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white text-xs font-bold transition-all duration-300 ${activeFeature === feature.id ? 'animate-pulse scale-110' : 'scale-0'}`}
                  >
                    New
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Call-to-action button */}
          <div className="mt-8 text-center">
            <button 
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105 animate-fadeIn"
              style={{ animationDelay: '600ms' }}
            >
              Explore All Features
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveFeatures;