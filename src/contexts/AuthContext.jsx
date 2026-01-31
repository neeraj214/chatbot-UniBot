import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth().
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to parse error response as JSON, but handle case where it's not valid JSON
        let errorMessage = 'Login failed';
        try {
          const errorText = await response.text();
          try {
            // Try to parse as JSON
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
            console.error('Login error response:', errorData);
          } catch (parseError) {
            // If JSON parsing fails, use the text response or status text
            errorMessage = errorText || 'Login failed. Please try again.';
            console.error('Login error (non-JSON):', errorText);
          }
        } catch (textError) {
          // If text() fails, use status text or a generic message
          errorMessage = 'Login failed. Please try again.';
          console.error('Login error (failed to read response):', textError);
        }
        throw new Error(errorMessage);
      }

      // Parse the successful response
      let data;
      try {
        const responseText = await response.text();
        try {
          data = JSON.parse(responseText);
          
          // Validate the response structure
          if (!data.success) {
            console.error('Login response indicates failure:', data);
            throw new Error(data.message || 'Login failed. Please try again.');
          }
          
          if (!data.user || !data.token) {
            console.error('Invalid login response structure:', data);
            throw new Error('Server returned an invalid response. Please try again.');
          }
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', responseText);
          throw new Error('Invalid response from server. Please try again.');
        }
      } catch (textError) {
        console.error('Failed to read response text:', textError);
        throw new Error('Failed to read server response. Please try again.');
      }

      // Store user data and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      setCurrentUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (username, email, password) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to parse error response as JSON, but handle case where it's not valid JSON
        let errorMessage = 'Signup failed';
        try {
          const errorText = await response.text();
          try {
            // Try to parse as JSON
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
            console.error('Signup error response:', errorData);
          } catch (parseError) {
            // If JSON parsing fails, use the text response or status text
            errorMessage = errorText || 'Signup failed. Please try again.';
            console.error('Signup error (non-JSON):', errorText);
          }
        } catch (textError) {
          // If text() fails, use status text or a generic message
          errorMessage = 'Signup failed. Please try again.';
          console.error('Signup error (failed to read response):', textError);
        }
        throw new Error(errorMessage);
      }

      // Parse the successful response
      let data;
      try {
        const responseText = await response.text();
        try {
          data = JSON.parse(responseText);
          
          // Validate the response structure
          if (!data.success) {
            console.error('Login response indicates failure:', data);
            throw new Error(data.message || 'Login failed. Please try again.');
          }
          
          if (!data.user || !data.token) {
            console.error('Invalid login response structure:', data);
            throw new Error('Server returned an invalid response. Please try again.');
          }
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', responseText);
          throw new Error('Invalid response from server. Please try again.');
        }
      } catch (textError) {
        console.error('Failed to read response text:', textError);
        throw new Error('Failed to read server response. Please try again.');
      }

      // Store user data and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      setCurrentUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};