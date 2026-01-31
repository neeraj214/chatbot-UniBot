import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const ChatbotGuide = () => {
  // Refs for animation elements
  const guideRef = useRef(null);
  const stepsRefs = useRef([]);

  // Setup intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (guideRef.current) {
      observer.observe(guideRef.current);
    }

    stepsRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      if (guideRef.current) {
        observer.unobserve(guideRef.current);
      }
      stepsRefs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, []);

  // Guide steps data
  const steps = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: "Ask a Question",
      description: "Type your question or request in the chat input field. Be specific to get the most accurate response."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Get Instant Responses",
      description: "UniBot processes your query and provides relevant information, suggestions, or solutions in real-time."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      title: "Use Quick Suggestions",
      description: "Click on suggestion chips below the chat for common queries or to refine your current conversation."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: "Continue the Conversation",
      description: "Follow up with additional questions or clarifications to dive deeper into your topic."
    }
  ];

  // Features the chatbot offers
  const features = [
    "Answer academic and administrative questions",
    "Provide campus information and resources",
    "Help with registration and course selection",
    "Offer guidance on university policies",
    "Assist with technical support queries"
  ];

  // Tips for better interaction
  const tips = [
    "Be specific in your questions for more accurate answers",
    "Use natural language rather than keywords",
    "Break complex questions into smaller parts",
    "Provide context when asking follow-up questions",
    "Try the suggestion chips for common queries"
  ];

  return (
    <div ref={guideRef} className="w-full max-w-5xl mx-auto px-4 py-12 opacity-0">
      <Card className="overflow-hidden border-none bg-black/30 backdrop-blur-xl shadow-[0_0_45px_-15px_rgba(79,70,229,0.25)]">
        <CardHeader className="p-6 border-b border-white/10 bg-gradient-to-r from-indigo-950/80 to-blue-950/80">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            How to Use UniBot
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 bg-gradient-to-b from-gray-900/70 to-black/70">
          {/* Steps Section */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-white mb-6">Getting Started</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  ref={(el) => (stepsRefs.current[index] = el)}
                  className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 opacity-0 transition-all duration-500"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 flex items-center justify-center mb-4 group-hover:from-blue-600/30 group-hover:to-indigo-600/30 transition-all duration-300">
                      <div className="text-blue-400">{step.icon}</div>
                    </div>
                    <h4 className="text-lg font-medium text-white mb-2">{step.title}</h4>
                    <p className="text-gray-300 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-white mb-4">What UniBot Can Do</h3>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-white/5 rounded-xl p-5">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <span className="text-blue-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tips Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Tips for Better Results</h3>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-white/5 rounded-xl p-5">
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <span className="text-indigo-400 mr-2 mt-1">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotGuide;