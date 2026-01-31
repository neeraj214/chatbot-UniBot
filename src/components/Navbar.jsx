import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavLink from './ui/NavLink';
import ThemeToggle from './ui/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/85 backdrop-blur-xl shadow-lg border-b border-indigo-500/10' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md group-hover:bg-blue-500/30 transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full p-2.5 shadow-glow group-hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all duration-300">
                <div className="w-6 h-6 relative overflow-hidden rounded-full">
                  <img src="/static/images/UNIBOT.png" alt="UNIBOT" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:from-blue-300 group-hover:to-indigo-400 transition-all duration-300">UNIBOT</span>
              <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"></div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" active={location.pathname === '/'} className="relative group">
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
            </NavLink>
            {currentUser ? (
              <>
                <NavLink to="/chat" active={location.pathname === '/chat'} className="relative group">
                  <span>Chat</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
                </NavLink>
                <NavLink to="/dashboard" active={location.pathname === '/dashboard'} className="relative group">
                  <span>Dashboard</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
                </NavLink>
                <NavLink to="/profile" active={location.pathname === '/profile'} className="relative group">
                  <span>Profile</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
                </NavLink>
                <button 
                  onClick={logout} 
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-500/20 rounded-full text-sm font-medium text-white transition-all duration-300 hover:shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                >
                  Logout
                </button>
                <div className="ml-2">
                  <ThemeToggle />
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" active={location.pathname === '/login'} className="relative group">
                  <span>Login</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
                </NavLink>
                <Link to="/signup" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full text-sm font-medium text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] transform hover:scale-105">
                  Sign Up
                </Link>
                <div className="ml-2">
                  <ThemeToggle />
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <MobileMenuButton />
        </div>
      </div>
    </nav>
  );
};

// NavLink component is now imported from './ui/NavLink'

// Mobile Menu Button Component
const MobileMenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-gray-200 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md shadow-lg p-4 flex flex-col space-y-3 animate-fadeIn" style={{ backgroundColor: 'var(--card-background)', color: 'var(--container-text)' }}>
          <Link to="/" className={`px-4 py-2 rounded-md ${location.pathname === '/' ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white' : 'text-gray-300'}`}>Home</Link>
          {currentUser ? (
            <>
              <Link to="/chat" className={`px-4 py-2 rounded-md ${location.pathname === '/chat' ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white' : 'text-gray-300'}`}>Chat</Link>
              <Link to="/dashboard" className={`px-4 py-2 rounded-md ${location.pathname === '/dashboard' ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white' : 'text-gray-300'}`}>Dashboard</Link>
              <button 
                onClick={logout} 
                className="px-4 py-2 rounded-md text-gray-300"
              >
                Logout
              </button>
              <div className="flex justify-center py-2">
                <ThemeToggle />
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={`px-4 py-2 rounded-md ${location.pathname === '/login' ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white' : 'text-gray-300'}`}>Login</Link>
              <Link to="/signup" className={`px-4 py-2 rounded-md ${location.pathname === '/signup' ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white' : 'text-gray-300'}`}>Sign Up</Link>
              <div className="flex justify-center py-2">
                <ThemeToggle />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;