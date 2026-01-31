import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total_conversations: 0,
    total_messages: 0,
    avg_satisfaction: 0,
    total_intents: 0,
    intent_distribution: [],
    daily_activity: [],
    conversations: [],
    intents: [],
    feedback: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Function to handle retry logic
  const fetchWithRetry = async (url, options, maxRetries = 2) => {
    let retries = 0;
    
    while (retries <= maxRetries) {
      try {
        const response = await fetch(url, options);
        
        if (response.ok) {
          return await response.json();
        }
        
        // If we get a 401 Unauthorized, don't retry - it's an auth issue
        if (response.status === 401) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Authentication failed. Please log in again.');
        }
        
        // For 500 errors, we'll retry
        if (response.status >= 500) {
          if (retries === maxRetries) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Server error (${response.status}). Please try again later.`);
          }
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
          retries++;
          continue;
        }
        
        // For other errors, don't retry
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch dashboard data (${response.status})`);
      } catch (error) {
        if (retries === maxRetries || !error.message.includes('fetch')) {
          throw error;
        }
        
        // Network errors might be temporary, so retry
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        retries++;
      }
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        const data = await fetchWithRetry('/api/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Validate required data fields
        const requiredFields = ['total_conversations', 'total_messages', 'avg_satisfaction', 'total_intents'];
        const missingFields = requiredFields.filter(field => !(field in data));

        if (missingFields.length > 0) {
          throw new Error(`Missing required data fields: ${missingFields.join(', ')}`);
        }

        // Ensure arrays are present and initialized
        data.intent_distribution = Array.isArray(data.intent_distribution) ? data.intent_distribution : [];
        data.daily_activity = Array.isArray(data.daily_activity) ? data.daily_activity : [];
        data.conversations = Array.isArray(data.conversations) ? data.conversations : [];
        data.intents = Array.isArray(data.intents) ? data.intents : [];
        data.feedback = Array.isArray(data.feedback) ? data.feedback : [];

        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message || 'An error occurred while loading the dashboard');

        // Set default values for stats when there's an error
        setStats({
          total_conversations: 0,
          total_messages: 0,
          avg_satisfaction: 0,
          total_intents: 0,
          intent_distribution: [],
          daily_activity: [],
          conversations: [],
          intents: [],
          feedback: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Add smooth reveal animation when component mounts
    const revealDashboard = () => {
      const elements = document.querySelectorAll('.animate-fadeInUp');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('opacity-100');
          el.classList.remove('opacity-0', 'translate-y-8');
        }, 100 * index);
      });
    };

    setTimeout(revealDashboard, 100);
  }, []);

  // Chart configurations
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: '"Inter", sans-serif',
            weight: '500'
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        titleFont: {
          family: '"Inter", sans-serif',
          weight: '600'
        },
        bodyFont: {
          family: '"Inter", sans-serif'
        },
        callbacks: {
          label: function(context) {
            return `Messages: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: '"Inter", sans-serif'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: '"Inter", sans-serif'
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 20,
          font: {
            size: 12,
            family: '"Inter", sans-serif',
            weight: '500'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i);
                return {
                  text: `${label} (${data.datasets[0].data[i]})`,
                  fillStyle: style.backgroundColor,
                  strokeStyle: style.borderColor,
                  lineWidth: style.borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw} (${Math.round(context.parsed * 100) / 100}%)`;
          }
        }
      },
      datalabels: {
        color: '#fff',
        anchor: 'center',
        align: 'center',
        formatter: (value, ctx) => {
          const sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = (value * 100 / sum).toFixed(1) + '%';
          return percentage;
        },
        font: {
          weight: 'bold',
          size: 11
        }
      }
    },
    cutout: '60%',
    borderWidth: 2,
    borderColor: 'rgba(30, 30, 30, 1)'
  };

  // Chart data
  const activityData = {
    labels: stats.daily_activity.map(item => item.date),
    datasets: [
      {
        label: 'Messages',
        data: stats.daily_activity.map(item => item.count),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(99, 102, 241, 0.9)',
      },
    ],
  };

  const intentData = {
    labels: stats.intent_distribution.map(item => item.intent),
    datasets: [
      {
        data: stats.intent_distribution.map(item => item.count),
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(79, 70, 229, 0.7)',
          'rgba(67, 56, 202, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(37, 99, 235, 0.7)',
          'rgba(29, 78, 216, 0.7)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(79, 70, 229, 1)',
          'rgba(67, 56, 202, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(37, 99, 235, 1)',
          'rgba(29, 78, 216, 1)',
        ],
        borderWidth: 1,
        hoverOffset: 15,
      },
    ],
  };

  // Stat Card Component
  const StatCard = ({ title, value, icon, trend }) => (
    <Card className="bg-black/30 backdrop-blur-md border-white/5 shadow-[0_0_15px_rgba(79,70,229,0.15)] overflow-hidden hover:shadow-[0_0_25px_rgba(79,70,229,0.25)] transition-all duration-300 hover:scale-[1.02] group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-blue-300 transition-colors duration-300">{title}</p>
            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:from-blue-300 group-hover:to-indigo-300 transition-all duration-300">{value}</h3>
            {trend && (
              <p className={`text-xs mt-2 flex items-center ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586 20.293 5.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0L12 8.414l-3.293 3.293a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L8 9.586V7a1 1 0 011-1h3z" clipRule="evenodd" />
                  </svg>
                )}
                {Math.abs(trend)}% from last week
              </p>
            )}
          </div>
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-3 rounded-full group-hover:from-blue-600/30 group-hover:to-indigo-600/30 transition-all duration-300">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Recent Conversation Component
  const ConversationItem = ({ conversation }) => (
    <div className="border-b border-white/5 last:border-0 py-4 animate-slideIn hover:bg-white/5 transition-colors duration-300 rounded-lg px-3 -mx-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3 animate-glow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-white">{conversation.user_id || 'Anonymous User'}</h4>
            <p className="text-xs text-muted-foreground">{new Date(conversation.timestamp).toLocaleString()}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${conversation.satisfaction > 0.7 ? 'bg-green-500/20 text-green-400' : conversation.satisfaction > 0.4 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
          {Math.round(conversation.satisfaction * 100)}% Satisfaction
        </span>
      </div>
      <p className="text-sm text-gray-300 line-clamp-2">{conversation.last_message}</p>
    </div>
  );

  // Intent Item Component
  const IntentItem = ({ intent }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 animate-slideIn hover:bg-white/5 transition-colors duration-300 rounded-lg px-3 -mx-3">
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
        <span className="text-sm">{intent.name}</span>
      </div>
      <div className="flex items-center">
        <span className="text-sm font-medium text-muted-foreground mr-4">{intent.count} uses</span>
        <div className="w-16 bg-gray-700 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 relative"
            style={{ width: `${Math.min(100, intent.count / (stats.total_intents || 1) * 100)}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-indigo-500/50 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Feedback Item Component
  const FeedbackItem = ({ feedback }) => (
    <div className="border-b border-white/5 last:border-0 py-4 animate-slideIn hover:bg-white/5 transition-colors duration-300 rounded-lg px-3 -mx-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3 animate-glow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-white">{feedback.user_id || 'Anonymous User'}</h4>
            <p className="text-xs text-muted-foreground">{new Date(feedback.timestamp).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-600'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-300">{feedback.comment}</p>
    </div>
  );

  return (
    <div className="pt-20 pb-10 min-h-screen bg-gradient-to-b from-black to-indigo-950/20 relative overflow-hidden">
      {error ? (
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center p-8 bg-red-900/20 rounded-lg border border-red-500/20 backdrop-blur-xl max-w-lg w-full animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  setTimeout(() => {
                    const fetchDashboardData = async () => {
                      try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                          throw new Error('Authentication token not found. Please log in again.');
                        }
                        
                        const data = await fetchWithRetry('/api/stats', {
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                          }
                        });
                        
                        setStats(data);
                      } catch (error) {
                        console.error('Error fetching dashboard data:', error);
                        setError(error.message || 'An error occurred while loading the dashboard');
                      } finally {
                        setIsLoading(false);
                      }
                    };
                    
                    fetchDashboardData();
                  }, 500);
                }}
                className="px-4 py-2 bg-blue-600/30 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/chat'}
                className="px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30 transition-colors"
              >
                Go to Chat
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-500">If the problem persists, please contact support.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
          </div>
          <div className="container mx-auto px-4">
            <div className="mb-8 animate-fadeInUp">
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Monitor your chatbot's performance and user interactions</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 blur-lg animate-ping"></div>
                    <div className="relative w-full h-full border-4 border-t-blue-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full animate-spin">
                      <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="mt-6 text-lg text-blue-400/80 font-medium animate-pulse">Loading dashboard data...</p>
                  <div className="mt-4 flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400/50 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400/50 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-blue-400/50 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <StatCard
                      title="Total Conversations"
                      value={stats.total_conversations}
                      trend={7.2}
                      className="animate-scale"
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      }
                    />
                  </div>
                  <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <StatCard
                      title="Total Messages"
                      value={stats.total_messages}
                      trend={12.5}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      }
                    />
                  </div>
                  <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    <StatCard
                      title="Avg. Satisfaction"
                      value={`${Math.round(stats.avg_satisfaction * 100)}%`}
                      trend={-2.3}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                    />
                  </div>
                  <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <StatCard
                      title="Total Intents"
                      value={stats.total_intents}
                      trend={5.1}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      }
                    />
                  </div>
                </div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Activity Chart */}
                  <Card className="lg:col-span-2 glass-morphism glass-morphism-hover overflow-hidden group animate-fadeInUp animate-shimmer" style={{ animationDelay: '0.5s' }}>
                    <CardHeader className="pb-2 border-b border-white/5 bg-gradient-to-r from-indigo-950/50 to-blue-950/50">
                      <CardTitle className="text-xl font-semibold group-hover:text-blue-300 transition-colors duration-300">Daily Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-80 p-2 rounded-lg bg-gradient-to-b from-black/50 to-transparent">
                        <Bar options={barChartOptions} data={activityData} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Intent Distribution */}
                  <Card className="glass-morphism glass-morphism-hover overflow-hidden group animate-fadeInUp animate-shimmer" style={{ animationDelay: '0.6s' }}>
                    <CardHeader className="pb-2 border-b border-white/5 bg-gradient-to-r from-indigo-950/50 to-blue-950/50">
                      <CardTitle className="text-xl font-semibold group-hover:text-blue-300 transition-colors duration-300">Intent Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-80 p-2 rounded-lg bg-gradient-to-b from-black/50 to-transparent relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-lg opacity-50"></div>
                        <Pie options={pieChartOptions} data={intentData} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Information */}
                <Tabs defaultValue="conversations" className="mb-8 animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
                  <TabsList className="bg-black/30 backdrop-blur-md border border-white/5 p-1 w-full flex justify-start overflow-x-auto">
                    <TabsTrigger value="conversations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/20 data-[state=active]:to-indigo-600/20 data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-300 hover:text-blue-300">
                      Recent Conversations
                    </TabsTrigger>
                    <TabsTrigger value="intents" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/20 data-[state=active]:to-indigo-600/20 data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-300 hover:text-blue-300">
                      Top Intents
                    </TabsTrigger>
                    <TabsTrigger value="feedback" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/20 data-[state=active]:to-indigo-600/20 data-[state=active]:text-white data-[state=active]:shadow-none transition-all duration-300 hover:text-blue-300">
                      User Feedback
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="conversations" className="mt-6 transition-all duration-500 animate-fadeIn">
                    <Card className="glass-morphism glass-morphism-hover overflow-hidden group animate-scale">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-semibold">Recent Conversations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="divide-y divide-white/5">
                          {stats.conversations.length > 0 ? (
                            stats.conversations.map((conversation, index) => (
                              <ConversationItem key={index} conversation={conversation} />
                            ))
                          ) : (
                            <p className="py-4 text-center text-muted-foreground">No recent conversations found</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="intents" className="mt-6 transition-all duration-500 animate-fadeIn">
                    <Card className="glass-morphism glass-morphism-hover overflow-hidden group animate-scale">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-semibold">Top Intents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="divide-y divide-white/5">
                          {stats.intents.length > 0 ? (
                            stats.intents.map((intent, index) => (
                              <IntentItem key={index} intent={intent} />
                            ))
                          ) : (
                            <p className="py-4 text-center text-muted-foreground">No intents data available</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="feedback" className="mt-6 transition-all duration-500 animate-fadeIn">
                    <Card className="glass-morphism glass-morphism-hover overflow-hidden group animate-scale">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-semibold">User Feedback</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="divide-y divide-white/5">
                          {stats.feedback.length > 0 ? (
                            stats.feedback.map((feedback, index) => (
                              <FeedbackItem key={index} feedback={feedback} />
                            ))
                          ) : (
                            <p className="py-4 text-center text-muted-foreground">No feedback available</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;