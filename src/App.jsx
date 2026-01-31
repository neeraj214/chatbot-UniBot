import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import EnhancedChatPage from './pages/EnhancedChatPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import EnhancedProfilePage from './pages/EnhancedProfilePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './contexts/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <div className="min-h-screen relative" style={{
      background: 'var(--background)',
      color: 'var(--text-primary)'
    }}>
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <Navbar />
          <main className="container mx-auto px-4 py-4 min-h-[calc(100vh-80px)]">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <EnhancedChatPage />
                </ProtectedRoute>
              } />
              <Route path="/chat-basic" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <EnhancedProfilePage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
  );
};


export default App;