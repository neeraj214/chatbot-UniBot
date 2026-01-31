import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme, setThemeMode } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  
  // State for editable profile fields
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    username: currentUser?.username || '',
    bio: currentUser?.bio || '',
  });
  
  // State for preferences
  const [preferences, setPreferences] = useState({
    language: 'English',
    notifications: true,
    emailAlerts: false,
  });
  
  // Mock data for chat history
  const [chatStats, setChatStats] = useState({
    totalConversations: 24,
    lastActive: new Date().toISOString(),
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
  
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Your Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-1">
          <Card className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'} shadow-lg overflow-hidden h-full`}>
            <CardHeader className="pb-4">
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Manage your personal details</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center pb-6">
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md group-hover:bg-blue-500/30 transition-all duration-300"></div>
                <Avatar className="w-32 h-32 border-4 border-background relative">
                  {currentUser?.photoURL ? (
                    <AvatarImage src={currentUser.photoURL} alt={profileData.username} />
                  ) : (
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      {profileData.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              
              {editMode ? (
                <div className="space-y-4 w-full">
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
                className="w-full max-w-xs"
              >
                {editMode ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="preferences" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Manage your app preferences and settings</CardDescription>
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
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive email notifications about your conversations</p>
                    </div>
                    <Switch
                      checked={preferences.emailAlerts}
                      onCheckedChange={(checked) => handlePreferenceChange('emailAlerts', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
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
                    <Button type="submit" variant="gradient">Change Password</Button>
                  </form>

                  <div className="pt-6 border-t">
                    <h4 className="text-sm font-medium mb-4">Session Management</h4>
                    <Button
                      variant="destructive"
                      onClick={handleLogoutAllDevices}
                      className="w-full"
                    >
                      Logout from all devices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent activity on your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityLogs.map(log => (
                      <div key={log.id} className="flex items-center justify-between py-2">
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

export default ProfilePage;