import React from 'react';

const TeamSection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-indigo-500/5 backdrop-blur-3xl"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Meet Our Team</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          The brilliant minds behind UNIBOT, working together to create the future of AI assistance.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="group relative"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl blur transition-all duration-300 group-hover:blur-xl"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl">
                <div className="relative w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 animate-pulse-slow"></div>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="relative z-10 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                  {member.name}
                </h3>
                <p className="text-sm text-center text-muted-foreground mb-2">{member.role}</p>
                <p className="text-sm text-center text-muted-foreground">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const teamMembers = [
  {
    name: "Dr. Sarah Chen",
    role: "AI Research Lead",
    description: "Leading the development of UNIBOT's core AI capabilities and natural language processing.",
    image: "/static/images/team/sarah.svg"
  },
  {
    name: "Alex Rodriguez",
    role: "Frontend Developer",
    description: "Crafting beautiful and intuitive user interfaces for seamless interaction with UNIBOT.",
    image: "/static/images/team/alex.svg"
  },
  {
    name: "Priya Patel",
    role: "ML Engineer",
    description: "Optimizing UNIBOT's machine learning models for enhanced performance and accuracy.",
    image: "/static/images/team/priya.svg"
  },
  {
    name: "James Wilson",
    role: "Backend Developer",
    description: "Building robust server architecture and API integrations for UNIBOT's services.",
    image: "/static/images/team/james.svg"
  },
  {
    name: "Maria Garcia",
    role: "UX Designer",
    description: "Ensuring UNIBOT provides the best possible user experience through thoughtful design.",
    image: "/static/images/team/maria.svg"
  },
  {
    name: "David Kim",
    role: "Data Scientist",
    description: "Analyzing user interactions to continuously improve UNIBOT's understanding and responses.",
    image: "/static/images/team/david.svg"
  }
];

export default TeamSection;