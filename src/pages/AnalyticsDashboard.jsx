import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

const AnalyticsDashboard = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // State for dashboard data
  const [stats, setStats] = useState({
    total_conversations: 0,
    total_messages: 0,
    avg_satisfaction: 0,
    total_intents: 0,
    intent_distribution: [],
    daily_activity: [],
    conversations: [],
    intents: [],
    feedback: [],
    sentiment_analysis: {
      positive: 35,
      neutral: 55,
      negative: 10
    },
    response_times: {
      bot: 1.2, // seconds
      user: 15.8 // seconds
    },
    active_users: {
      daily: 120,
      weekly: 850,
      monthly: 3200
    },
    drop_off_points: [
      { point: 'Initial greeting', percentage: 5 },
      { point: 'Information request', percentage: 15 },
      { point: 'Complex query', percentage: 45 },
      { point: 'Handoff request', percentage: 25 },
      { point: 'Technical issue', percentage: 10 }
    ],
    top_questions: [
      { question: 'How do I reset my password?', count: 145 },
      { question: 'What are the library hours?', count: 132 },
      { question: 'How do I register for classes?', count: 118 },
      { question: 'Where is the student center?', count: 97 },
      { question: 'When is the next campus event?', count: 85 }
    ],
    user_regions: {
      'North America': 45,
      'Europe': 25,
      'Asia': 20,
      'Other': 10
    },
    session_duration: {
      average: 4.5, // minutes
      distribution: [
        { duration: '< 1 min', percentage: 15 },
        { duration: '1-3 mins', percentage: 30 },
        { duration: '3-5 mins', percentage: 25 },
        { duration: '5-10 mins', percentage: 20 },
        { duration: '> 10 mins', percentage: 10 }
      ]
    }
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('weekly');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In a real implementation, this would fetch from your API
        // const response = await fetch('/api/stats');
        // const data = await response.json();

        // For now, we'll use the mock data in our state
        // This simulates a successful API response

        // Simulate API delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeFilter, dateRange]);

  // Chart configurations with theme-aware colors
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
          font: {
            family: '"Inter", sans-serif',
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        boxPadding: 4
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      }
    }
  };

  // Chart data
  const messageActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Messages',
        data: [65, 59, 80, 81, 56, 55, 72],
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [stats.sentiment_analysis.positive, stats.sentiment_analysis.neutral, stats.sentiment_analysis.negative],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',   // green
          'rgba(59, 130, 246, 0.7)',  // blue
          'rgba(239, 68, 68, 0.7)',    // red
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const dropOffData = {
    labels: stats.drop_off_points.map(point => point.point),
    datasets: [
      {
        label: 'Drop-off Percentage',
        data: stats.drop_off_points.map(point => point.percentage),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  const topQuestionsData = {
    labels: stats.top_questions.map(q => q.question.length > 20 ? q.question.substring(0, 20) + '...' : q.question),
    datasets: [
      {
        label: 'Frequency',
        data: stats.top_questions.map(q => q.count),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const userRegionsData = {
    labels: Object.keys(stats.user_regions),
    datasets: [
      {
        data: Object.values(stats.user_regions),
        backgroundColor: [
          'rgba(79, 70, 229, 0.7)',   // indigo
          'rgba(16, 185, 129, 0.7)',  // emerald
          'rgba(245, 158, 11, 0.7)',  // amber
          'rgba(107, 114, 128, 0.7)', // gray
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const sessionDurationData = {
    labels: stats.session_duration.distribution.map(d => d.duration),
    datasets: [
      {
        label: 'Percentage',
        data: stats.session_duration.distribution.map(d => d.percentage),
        backgroundColor: 'rgba(124, 58, 237, 0.7)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Function to handle time filter change
  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  // Function to handle date range change
  const handleDateChange = (e, field) => {
    setDateRange(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Function to handle export
  const handleExport = (format) => {
    // In a real implementation, this would trigger an API call to generate the export
    alert(`Exporting dashboard data as ${format}...`);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2">Error Loading Dashboard</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'Server error (500). Please try again later.'}</p>
      <Button onClick={() => window.location.reload()} className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Try Again
      </Button>
      <Button variant="outline" onClick={() => window.location.href = '/chat'} className="mt-2">
        Go to Chat
      </Button>
    </div>
  );

  // Stat card component
  const StatCard = ({ title, value, icon, trend, trendValue, color }) => {
    const trendColors = {
      up: 'text-green-500',
      down: 'text-red-500',
      neutral: 'text-blue-500'
    };

    const bgColors = {
      blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      green: 'bg-green-500/10 text-green-600 dark:text-green-400',
      purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      red: 'bg-red-500/10 text-red-600 dark:text-red-400',
    };

    return (
      <Card className={`overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} transition-all duration-200 hover:shadow-lg`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
              <h4 className="text-2xl font-bold mt-1 mb-2 text-gray-900 dark:text-white">{value}</h4>
              {trend && (
                <p className={`text-xs font-medium flex items-center ${trendColors[trend]}`}>
                  {trend === 'up' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : trend === 'down' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    </svg>
                  )}
                  {trendValue}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-full ${bgColors[color] || bgColors.blue}`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-16">
        {error ? (
          <ErrorDisplay />
        ) : isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Monitor your chatbot performance and user engagement</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                <div className="flex space-x-2">
                  <Button
                    variant={timeFilter === 'daily' ? 'default' : 'outline'}
                    onClick={() => handleTimeFilterChange('daily')}
                    className="text-xs"
                  >
                    Daily
                  </Button>
                  <Button
                    variant={timeFilter === 'weekly' ? 'default' : 'outline'}
                    onClick={() => handleTimeFilterChange('weekly')}
                    className="text-xs"
                  >
                    Weekly
                  </Button>
                  <Button
                    variant={timeFilter === 'monthly' ? 'default' : 'outline'}
                    onClick={() => handleTimeFilterChange('monthly')}
                    className="text-xs"
                  >
                    Monthly
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleExport('PDF')}
                    className="text-xs flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('CSV')}
                    className="text-xs flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    CSV
                  </Button>
                </div>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <label className="text-sm font-medium">From:</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleDateChange(e, 'start')}
                  className="w-40"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <label className="text-sm font-medium">To:</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleDateChange(e, 'end')}
                  className="w-40"
                />
              </div>
              <Button className="self-end">
                Apply
              </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Messages"
                value={stats.total_messages.toLocaleString()}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                }
                trend="up"
                trendValue="12% from last week"
                color="blue"
              />

              <StatCard
                title="Active Users"
                value={stats.active_users[timeFilter].toLocaleString()}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
                trend="up"
                trendValue="8% from last period"
                color="green"
              />

              <StatCard
                title="Avg. Response Time"
                value={`${stats.response_times.bot.toFixed(1)}s`}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                trend="down"
                trendValue="5% faster than before"
                color="purple"
              />

              <StatCard
                title="User Satisfaction"
                value={`${(stats.avg_satisfaction * 20).toFixed(1)}%`}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                trend="up"
                trendValue="3% improvement"
                color="amber"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Message Activity Chart */}
              <Card className={`overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Message Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar options={chartOptions} data={messageActivityData} />
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment Analysis Chart */}
              <Card className={`overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="w-3/4 h-3/4">
                      <Pie options={chartOptions} data={sentimentData} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Questions Chart */}
              <Card className={`overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Top Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar
                      options={{
                        ...chartOptions,
                        indexAxis: 'y',
                      }}
                      data={topQuestionsData}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Drop-off Points Chart */}
              <Card className={`overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Conversation Drop-off Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar options={chartOptions} data={dropOffData} />
                  </div>
                </CardContent>
              </Card>

              {/* User Regions Chart */}
              <Card className={`overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">User Regions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="w-3/4 h-3/4">
                      <Pie options={chartOptions} data={userRegionsData} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Duration Chart */}
              <Card className={`overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Session Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar options={chartOptions} data={sessionDurationData} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time User Sessions */}
            <Card className={`overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} mb-8`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Real-time User Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4">User ID</th>
                        <th className="text-left py-3 px-4">Session Start</th>
                        <th className="text-left py-3 px-4">Duration</th>
                        <th className="text-left py-3 px-4">Messages</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                          <td className="py-3 px-4">user_{1000 + i}</td>
                          <td className="py-3 px-4">{new Date(Date.now() - (i * 15 * 60000)).toLocaleTimeString()}</td>
                          <td className="py-3 px-4">{Math.floor(Math.random() * 15) + 1}m {Math.floor(Math.random() * 60)}s</td>
                          <td className="py-3 px-4">{Math.floor(Math.random() * 20) + 1}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${i % 3 === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : i % 3 === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                              {i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Idle' : 'Ended'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm" className="text-xs">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" size="sm">
                  View All Sessions
                </Button>
              </CardFooter>
            </Card>

            {/* Feedback Analytics */}
            <Card className={`overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} mb-8`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Feedback Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">Rating Distribution</h4>
                    <div className="space-y-4">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const percentage = rating === 5 ? 45 : rating === 4 ? 30 : rating === 3 ? 15 : rating === 2 ? 7 : 3;
                        return (
                          <div key={rating} className="flex items-center">
                            <div className="flex items-center w-24">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <div className="w-full ml-4">
                              <div className="h-2 relative max-w-xl rounded-full overflow-hidden">
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 absolute"></div>
                                <div className="h-full bg-yellow-400 absolute" style={{ width: `${percentage}%` }}></div>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-9 text-right">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Recent Comments</h4>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                      {[
                        { rating: 5, comment: "The chatbot was extremely helpful and answered all my questions quickly." },
                        { rating: 4, comment: "Good experience overall, but could use more detailed responses." },
                        { rating: 5, comment: "Very intuitive and easy to use. Saved me a lot of time!" },
                        { rating: 3, comment: "It was okay, but didn't fully understand my complex questions." },
                        { rating: 2, comment: "Had trouble with basic questions about course registration." },
                      ].map((feedback, i) => (
                        <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <div className="flex items-center mb-1">
                            <div className="flex">
                              {[...Array(5)].map((_, j) => (
                                <svg key={j} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${j < feedback.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{new Date(Date.now() - (i * 86400000)).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm">{feedback.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;