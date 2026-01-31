import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ColorPicker } from '../components/ui/color-picker';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import '../profile-animations.css';

const EnhancedProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme, setThemeMode } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Animation refs
  const profileSectionRef = useRef(null);
  
  // State for editable profile fields
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    username: currentUser?.username || '',
    bio: currentUser?.bio || '',
    avatarUrl: currentUser?.photoURL || '',
  });
  
  // State for preferences
  const [preferences, setPreferences] = useState({
    language: 'English',
    chatbotTone: 'friendly',
    notifications: true,
    emailAlerts: false,
    themeColor: '#3b82f6',
  });
  
  // Mock data for user stats
  const [userStats, setUserStats] = useState({
    totalChats: 24,
    lastActive: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    totalUsageTime: '12h 45m',
    topTopics: ['Academic', 'Registration', 'Campus Life']
  });
  
  // Mock data for account activity
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, action: 'Login', device: 'Chrome on Windows', location: 'New York, USA', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, action: 'Password Changed', device: 'Chrome on Windows', location: 'New York, USA', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, action: 'Login', device: 'Mobile App on Android', location: 'New York, USA', timestamp: new Date(Date.now() - 172800000).toISOString() },
  ]);
  
  // Handle profile edit
  const handleEditToggle = () => {
    if (editMode) {
      // Save changes logic would go here
      // For now, we'll just toggle the mode
    }
    setEditMode(!editMode);
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle preference change
  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle logout from all devices
  const handleLogoutAllDevices = () => {
    // This would typically call an API endpoint
    logout();
    navigate('/login');
  };
  
  // Handle password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Password change logic would go here
    // Reset form after submission
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL
      const url = URL.createObjectURL(file);
      setProfileData(prev => ({
        ...prev,
        avatarUrl: url
      }));
    }
  };
  
  // Handle chat history export
  const handleExportChatHistory = () => {
    // In a real app, this would fetch chat history from the server
    // For now, we'll just create a mock JSON file
    const mockChatHistory = {
      user: profileData.username,
      conversations: [
        {
          id: 1,
          date: new Date().toISOString(),
          messages: [
            { sender: 'user', text: 'Hello, I need help with registration.' },
            { sender: 'bot', text: 'Hi there! I can help you with registration. What specific information do you need?' }
          ]
        }
      ]
    };
    
    const blob = new Blob([JSON.stringify(mockChatHistory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${profileData.username}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Animation effect when component mounts
  useEffect(() => {
    const cards = document.querySelectorAll('.profile-card');
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
    
    // Observe all profile cards
    cards.forEach((card) => {
      observer.observe(card);
    });
    
    return () => {
      cards.forEach((card) => {
        observer.unobserve(card);
      });
    };
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 profile-animate-in">
        Your Profile
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info Card */}
          <Card className={`${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white/50'} backdrop-blur-sm border border-white/10 shadow-lg overflow-hidden profile-card`}>
            <CardHeader className="pb-4">
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Manage your personal details</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center pb-6">
              <div className="relative mb-6 group cursor-pointer" onClick={handleAvatarClick}>
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md group-hover:bg-blue-500/30 transition-all duration-300 avatar-glow"></div>
                <Avatar className="w-32 h-32 border-4 border-background relative transition-transform duration-300 group-hover:scale-105">
                  {profileData.avatarUrl ? (
                    <AvatarImage src={profileData.avatarUrl} alt={profileData.username} />
                  ) : (
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      {profileData.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-medium">Change Avatar</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                />
              </div>
              
              {editMode ? (
                <div className="space-y-4 w-full profile-slide-in">
                  <div>
                    <label className="text-sm font-medium block mb-1">Full Name</label>
                    <Input 
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Username</label>
                    <Input 
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Email</label>
                    <Input 
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 w-full">
                  <h3 className="text-xl font-bold">{profileData.fullName || 'Your Name'}</h3>
                  <p className="text-muted-foreground">@{profileData.username}</p>
                  <p className="text-sm">{profileData.email}</p>
                  {profileData.bio && (
                    <p className="text-sm mt-4 italic">{profileData.bio}</p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={handleEditToggle}
                variant="gradient"
                className="w-full max-w-xs profile-pulse"
              >
                {editMode ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* User Stats Card */}
          <Card className={`${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white/50'} backdrop-blur-sm border border-white/10 shadow-lg overflow-hidden profile-card delay-2`}>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>Your activity on the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Chats</h4>
                  <p className="text-2xl font-bold">{userStats.totalChats}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Usage Time</h4>
                  <p className="text-2xl font-bold">{userStats.totalUsageTime}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Last Active</h4>
                <p className="text-sm text-muted-foreground">{formatDate(userStats.lastActive)}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Top Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {userStats.topTopics.map((topic, index) => (
                    <Badge key={index} variant="gradient" className="profile-pulse">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleExportChatHistory}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Chat History
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="preferences" className="w-full">
            <TabsList className="w-full mb-6 bg-background/50 backdrop-blur-sm">
              <TabsTrigger value="preferences" className="profile-pulse">Preferences</TabsTrigger>
              <TabsTrigger value="appearance" className="profile-pulse">Appearance</TabsTrigger>
              <TabsTrigger value="security" className="profile-pulse">Security</TabsTrigger>
              <TabsTrigger value="activity" className="profile-pulse">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="preferences" className="profile-card delay-1">
              <Card className={`${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white/50'} backdrop-blur-sm border border-white/10`}>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Manage your app preferences and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Language</h4>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => handlePreferenceChange('language', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                        <SelectItem value="Japanese">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Chatbot Tone</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handlePreferenceChange('chatbotTone', 'friendly')}
                        className={`p-4 rounded-lg border transition-all ${preferences.chatbotTone === 'friendly' 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-border bg-background/50 hover:bg-muted/50'}`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium">Friendly</span>
                          <p className="text-xs text-muted-foreground text-center">Casual, warm, and approachable</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => handlePreferenceChange('chatbotTone', 'formal')}
                        className={`p-4 rounded-lg border transition-all ${preferences.chatbotTone === 'formal' 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-border bg-background/50 hover:bg-muted/50'}`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-sm font-medium">Formal</span>
                          <p className="text-xs text-muted-foreground text-center">Professional, precise, and direct</p>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive email notifications about your conversations</p>
                    </div>
                    <Switch
                      checked={preferences.emailAlerts}
                      onCheckedChange={(checked) => handlePreferenceChange('emailAlerts', checked)}
                      className="toggle-animate"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="profile-card delay-2">
              <Card className={`${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white/50'} backdrop-blur-sm border border-white/10`}>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how the application looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Dark Mode</h4>
                      <p className="text-sm text-muted-foreground">Enable dark mode for better viewing at night</p>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={() => setThemeMode(isDarkMode ? 'light' : 'dark')}
                      className="toggle-animate"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Theme Color</h4>
                      <ColorPicker
                        value={preferences.themeColor}
                        onChange={(color) => handlePreferenceChange('themeColor', color)}
                      />
                    </div>
                    
                    <div className="mt-4 p-4 rounded-lg border border-border">
                      <h5 className="text-sm font-medium mb-2">Preview</h5>
                      <div 
                        className="h-20 rounded-md transition-all duration-300"
                        style={{ 
                          background: `linear-gradient(135deg, ${preferences.themeColor}33 0%, ${preferences.themeColor}66 100%)`,
                          boxShadow: `0 4px 12px ${preferences.themeColor}33`
                        }}
                      >
                        <div className="flex items-center justify-center h-full">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: preferences.themeColor }}
                          >
                            UI
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="profile-card delay-3">
              <Card className={`${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white/50'} backdrop-blur-sm border border-white/10`}>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Current Password</label>
                      <Input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">New Password</label>
                      <Input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Confirm New Password</label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <Button type="submit" variant="gradient" className="profile-pulse">Change Password</Button>
                  </form>

                  <div className="pt-6 border-t">
                    <h4 className="text-sm font-medium mb-4">Session Management</h4>
                    <Button
                      variant="destructive"
                      onClick={handleLogoutAllDevices}
                      className="w-full profile-pulse"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout from all devices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="profile-card delay-4">
              <Card className={`${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white/50'} backdrop-blur-sm border border-white/10`}>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent activity on your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityLogs.map(log => (
                      <div key={log.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground">{log.device} • {log.location}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfilePage;