import React, { useState, useEffect } from 'react';
import '../tech-animations.css';

const TechnologySection = () => {
  const [activeTab, setActiveTab] = useState('current');
  
  // Animation effect when component mounts and for scroll animations
  useEffect(() => {
    // Initial animation when component mounts
    const cards = document.querySelectorAll('.tech-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in');
      }, index * 100);
    });
    
    // Scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observe all tech cards
    cards.forEach((card) => {
      observer.observe(card);
    });
    
    return () => {
      cards.forEach((card) => {
        observer.unobserve(card);
      });
    };
  }, [activeTab]);

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-indigo-500/5 backdrop-blur-3xl"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Technology & Features</span>
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Powered by cutting-edge technologies to deliver intelligent conversations and insights.
        </p>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1 flex">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'current' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-glow' : 'text-muted-foreground hover:text-white'}`}
            >
              Technologies We Use
            </button>
            <button
              onClick={() => setActiveTab('future')}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'future' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-glow' : 'text-muted-foreground hover:text-white'}`}
            >
              Future Technologies
            </button>
          </div>
        </div>
        
        {/* Current Technologies */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-500 ${activeTab === 'current' ? 'opacity-100' : 'opacity-0 hidden'}`}>
          {currentTechnologies.map((tech, index) => (
            <TechCard key={index} tech={tech} index={index} />
          ))}
        </div>
        
        {/* Future Technologies */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-500 ${activeTab === 'future' ? 'opacity-100' : 'opacity-0 hidden'}`}>
          {futureTechnologies.map((tech, index) => (
            <TechCard key={index} tech={tech} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TechCard = ({ tech, index }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div 
      className="tech-card group relative opacity-0 transform translate-y-4 transition-all duration-500"
      style={{ transitionDelay: `${index * 50}ms` }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl blur transition-all duration-300 group-hover:blur-xl group-hover:from-blue-500/20 group-hover:to-indigo-500/20"></div>
      
      {/* Card content with enhanced hover effects */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-[1.05] hover:shadow-2xl h-full flex flex-col">
        {/* Icon container with enhanced animations */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full p-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            {tech.icon}
          </div>
        </div>
        
        {/* Title with subtle animation */}
        <h3 className="text-xl font-semibold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-300 group-hover:from-blue-300 group-hover:to-indigo-300">
          {tech.name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-center text-muted-foreground flex-grow transition-all duration-300 group-hover:text-white/80">
          {tech.description}
        </p>
        
        {/* Optional tooltip on hover */}
        {showTooltip && (
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-3 rounded-full whitespace-nowrap z-50 animate-fadeIn">
            Click to learn more about {tech.name}
          </div>
        )}
      </div>
    </div>
  );
};

// Current technologies based on the project
const currentTechnologies = [
  {
    name: "HTML",
    description: "Standard markup language for creating web pages and web applications.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.484 6.168h13.032L17.309 18.1l-5.33 1.629-5.33-1.629L5.484 6.168zM9.989 10.11l-.326 3.651h3.349l-.164 1.848-1.87.505-1.87-.505-.12-1.343h-1.686l.236 2.648 3.441.956 3.44-.956.326-3.67h-3.765l.165-1.847h3.6l.165-1.848h-5.485v.561z"/>
      </svg>
    ),
  },
  {
    name: "Python",
    description: "Powerful programming language used for backend development and data processing.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24">
        <path fill="#3776AB" d="M11.458 2c-1.145.01-2.234.227-3.2.6-2.828 1.101-3.34 3.4-3.34 5.114v1.334h6.68v.666H3.296c-1.43 0-2.683.855-3.075 2.475-.451 1.85-.47 3.005 0 4.937.349 1.438 1.18 2.474 2.61 2.474h1.687v-2.228c0-1.61 1.393-3.03 3.034-3.03h6.674c1.35 0 2.458-1.107 2.458-2.458V7.714c0-1.31-1.107-2.295-2.458-2.515-.853-.139-1.734-.204-2.768-.2zm-3.63 1.666c.69 0 1.253.57 1.253 1.271 0 .7-.563 1.265-1.253 1.265-.691 0-1.253-.564-1.253-1.265 0-.7.562-1.271 1.253-1.271z"/>
        <path fill="#FFD43B" d="M18.584 5.714v2.161c0 1.675-1.42 3.086-3.034 3.086h-6.674c-1.33 0-2.458 1.136-2.458 2.458v4.604c0 1.31 1.14 2.08 2.458 2.458 1.573.451 3.082.532 4.935 0 1.227-.351 2.458-1.057 2.458-2.458v-1.334h-6.674v-.666h9.132c1.43 0 1.962-1 2.458-2.474.514-1.517.492-2.977 0-4.937-.353-1.402-1.028-2.474-2.458-2.474h-1.843zm-3.77 11.729c.691 0 1.253.564 1.253 1.265 0 .7-.562 1.27-1.253 1.27-.69 0-1.253-.57-1.253-1.27 0-.701.563-1.265 1.253-1.265z"/>
      </svg>
    ),
  },
  {
    name: "Flask",
    description: "Web framework for building the backend API and serving the application.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.172 20.36c-.914-.72-1.89-1.41-2.556-2.38-1.402-1.712-2.482-3.694-3.22-5.73-.738-2.037-1.108-4.164-1.11-6.25h6.488c-.094 1.977-.014 3.82.537 5.524.55 1.704 1.46 3.11 2.61 4.324.804.863 1.688 1.712 2.534 2.512h-5.283zm9.656 0c.846-.8 1.73-1.649 2.534-2.512 1.15-1.214 2.06-2.62 2.61-4.324.55-1.704.63-3.547.537-5.524h6.488c-.002 2.086-.372 4.213-1.11 6.25-.738 2.036-1.818 4.018-3.22 5.73-.666.97-1.642 1.66-2.556 2.38h-5.283z"/>
      </svg>
    ),
  },
  {
    name: "SQLAlchemy",
    description: "ORM for database operations, making data management more intuitive.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z"></path>
        <path d="M9 3v18"></path>
        <path d="M15 3v18"></path>
        <path d="M3 9h18"></path>
        <path d="M3 15h18"></path>
      </svg>
    ),
  },
  {
    name: "NLTK/Spacy",
    description: "Natural language processing libraries for understanding user input.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z"></path>
        <path d="M12 14l4-4"></path>
        <path d="M12 14l-4-4"></path>
      </svg>
    ),
  },
  {
    name: "TensorFlow",
    description: "Machine learning framework for intent classification and response generation.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.168 3.564.015-5.31zm21.43 5.311l-.014-5.31L12.46 0v24l10.262-5.856-4.096-2.378V7.603l4.096-2.378v5.942z"/>
      </svg>
    ),
  },
  {
    name: "SQLite",
    description: "Lightweight database for storing conversations and training data.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3z"></path>
        <path d="M3 9h18"></path>
        <path d="M3 15h18"></path>
        <path d="M9 3v18"></path>
        <path d="M15 3v18"></path>
      </svg>
    ),
  },
  {
    name: "React",
    description: "Frontend library for building interactive user interfaces.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 9.861a2.139 2.139 0 100 4.278 2.139 2.139 0 100-4.278zm-5.992 6.394l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 001.363 3.578l.101.213-.101.213a23.307 23.307 0 00-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 011.182-3.046A24.752 24.752 0 015.317 8.95zm12.675 7.305l-.133-.469a23.357 23.357 0 00-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 001.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 01-1.182 3.046zM5.31 8.945l-.133-.467C4.188 4.992 4.488 2.494 6 1.622c1.483-.856 3.864.155 6.359 2.716l.34.349-.34.349a23.552 23.552 0 00-2.422 2.967l-.135.193-.235.02a23.657 23.657 0 00-3.785.61l-.472.119zm1.896-6.63c-.268 0-.505.058-.705.173-.994.573-1.17 2.565-.485 5.253a25.122 25.122 0 013.233-.501 24.847 24.847 0 012.052-2.544c-1.56-1.519-3.037-2.381-4.095-2.381zm9.589 20.362c-.001 0-.001 0 0 0-1.425 0-3.255-1.073-5.154-3.023l-.34-.349.34-.349a23.53 23.53 0 002.421-2.968l.135-.193.234-.02a23.63 23.63 0 003.787-.609l.472-.119.134.468c.987 3.484.688 5.983-.824 6.854a2.38 2.38 0 01-1.205.308zm-4.096-3.381c1.56 1.519 3.037 2.381 4.095 2.381h.001c.267 0 .505-.058.704-.173.994-.573 1.171-2.566.485-5.254a25.02 25.02 0 01-3.234.501 24.674 24.674 0 01-2.051 2.545zM18.69 8.945l-.472-.119a23.479 23.479 0 00-3.787-.61l-.234-.02-.135-.193a23.414 23.414 0 00-2.421-2.967l-.34-.349.34-.349C14.135 1.778 16.515.767 18 1.622c1.512.872 1.812 3.37.824 6.855l-.134.468zM14.75 7.24c1.142.104 2.227.273 3.234.501.686-2.688.509-4.68-.485-5.253-.988-.571-2.845.304-4.8 2.208A24.849 24.849 0 0114.75 7.24zM7.206 22.677A2.38 2.38 0 016 22.369c-1.512-.871-1.812-3.369-.823-6.854l.132-.468.472.119c1.155.291 2.429.496 3.785.609l.235.02.134.193a23.596 23.596 0 002.422 2.968l.34.349-.34.349c-1.898 1.95-3.728 3.023-5.151 3.023zm-1.19-6.427c-.686 2.688-.509 4.681.485 5.254.987.563 2.843-.305 4.8-2.208a24.998 24.998 0 01-2.052-2.545 24.976 24.976 0 01-3.233-.501zm5.984.628c-.823 0-1.669-.036-2.516-.106l-.235-.02-.135-.193a30.388 30.388 0 01-1.35-2.122 30.354 30.354 0 01-1.166-2.228l-.1-.213.1-.213a30.3 30.3 0 011.166-2.228c.414-.749.885-1.472 1.35-2.122l.135-.193.235-.02a29.785 29.785 0 015.033 0l.234.02.134.193a30.006 30.006 0 012.517 4.35l.101.213-.101.213a29.6 29.6 0 01-2.517 4.35l-.134.193-.234.02c-.847.07-1.694.106-2.517.106zm-2.197-1.084c1.48.111 2.914.111 4.395 0a29.006 29.006 0 002.196-3.798 28.585 28.585 0 00-2.197-3.798 29.031 29.031 0 00-4.394 0 28.477 28.477 0 00-2.197 3.798 29.114 29.114 0 002.197 3.798z"/>
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework for creating custom designs quickly.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
      </svg>
    ),
  },
];

// Future technologies to be implemented
const futureTechnologies = [
  {
    name: "OpenAI GPT",
    description: "Advanced language model for more natural and context-aware conversations.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
  },
  {
    name: "Rasa",
    description: "Open source framework for building contextual AI assistants and chatbots.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    ),
  },
  {
    name: "PyTorch",
    description: "Deep learning framework for more advanced AI model training and deployment.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7L12 3"></path>
        <circle cx="12" cy="12" r="9"></circle>
        <circle cx="12" cy="12" r="4"></circle>
      </svg>
    ),
  },
  {
    name: "Hugging Face",
    description: "State-of-the-art NLP models and tools for enhanced language understanding.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
        <path d="M8 9h2v2H8z"></path>
        <path d="M14 9h2v2h-2z"></path>
        <path d="M8 13h8v2H8z"></path>
      </svg>
    ),
  },
  {
    name: "MongoDB",
    description: "NoSQL database for more flexible and scalable data storage solutions.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
    ),
  },
  {
    name: "GraphQL",
    description: "Query language for APIs to enable more efficient data fetching.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l9 16H3L12 2z"></path>
        <path d="M12 22l-9-16h18L12 22z"></path>
      </svg>
    ),
  },
  {
    name: "Docker",
    description: "Containerization platform for easier deployment and scaling of the application.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="13" width="4" height="4"></rect>
        <rect x="9" y="13" width="4" height="4"></rect>
        <rect x="15" y="13" width="4" height="4"></rect>
        <rect x="3" y="7" width="4" height="4"></rect>
        <rect x="9" y="7" width="4" height="4"></rect>
        <path d="M21 10V7m-3 3h3"></path>
      </svg>
    ),
  },
];

export default TechnologySection;