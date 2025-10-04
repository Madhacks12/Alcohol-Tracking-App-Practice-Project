import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, User, Bell, Shield, Trash2, Download, Upload } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { toast } from "sonner";
import { dataService } from "../services/dataService";

interface User {
  name: string;
  email: string;
}

interface UserSettings {
  notifications: {
    dailyReminders: boolean;
    weeklyReports: boolean;
    goalAchievements: boolean;
    encouragementMessages: boolean;
  };
  privacy: {
    shareProgress: boolean;
    analyticsOptIn: boolean;
  };
  units: 'uk' | 'us';
  theme: 'light' | 'dark' | 'system';
}

interface SettingsPageProps {
  onBack: () => void;
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

export function SettingsPage({ onBack, currentUser, onUpdateUser, onLogout }: SettingsPageProps) {
  const [user, setUser] = useState<User>(currentUser);
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      dailyReminders: true,
      weeklyReports: true,
      goalAchievements: true,
      encouragementMessages: false,
    },
    privacy: {
      shareProgress: false,
      analyticsOptIn: true,
    },
    units: 'uk',
    theme: 'system'
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('alcohol-tracker-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('alcohol-tracker-settings', JSON.stringify(settings));
    onUpdateUser(user);
    setHasUnsavedChanges(false);
    toast.success("Settings saved successfully!");
  };

  const updateSetting = (path: string, value: string | boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
    setHasUnsavedChanges(true);
  };

  const exportData = () => {
    const data = dataService.exportData();
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alcohol-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Data exported successfully!");
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = dataService.importData(jsonData);
        
        if (success) {
          // Reload user data from service
          const importedUser = dataService.getCurrentUser();
          if (importedUser) {
            setUser(importedUser);
            onUpdateUser(importedUser);
          }
          
          // Reload settings from service
          const importedSettings = dataService.getSettings();
          setSettings({
            notifications: {
              dailyReminders: true,
              weeklyReports: true,
              goalAchievements: true,
              encouragementMessages: false,
            },
            privacy: {
              shareProgress: importedSettings.dataSharing,
              analyticsOptIn: importedSettings.analytics,
            },
            units: importedSettings.units,
            theme: importedSettings.theme,
          });
          
          toast.success("Data imported successfully!");
        } else {
          toast.error("Failed to import data. Please check the file format.");
        }
      } catch (error) {
        toast.error("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const deleteAllData = () => {
    dataService.clearAllData();
    toast.success("All data deleted successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl mb-1">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and app preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => {
                    setUser({ ...user, name: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => {
                    setUser({ ...user, email: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose what notifications you'd like to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Daily Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded to log your drinks
                </p>
              </div>
              <Switch
                checked={settings.notifications.dailyReminders}
                onCheckedChange={(value) => updateSetting('notifications.dailyReminders', value)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly progress summaries
                </p>
              </div>
              <Switch
                checked={settings.notifications.weeklyReports}
                onCheckedChange={(value) => updateSetting('notifications.weeklyReports', value)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Goal Achievements</Label>
                <p className="text-sm text-muted-foreground">
                  Celebrate when you reach your goals
                </p>
              </div>
              <Switch
                checked={settings.notifications.goalAchievements}
                onCheckedChange={(value) => updateSetting('notifications.goalAchievements', value)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Encouragement Messages</Label>
                <p className="text-sm text-muted-foreground">
                  Receive motivational messages
                </p>
              </div>
              <Switch
                checked={settings.notifications.encouragementMessages}
                onCheckedChange={(value) => updateSetting('notifications.encouragementMessages', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>App Preferences</CardTitle>
            <CardDescription>
              Customize how the app works for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="units">Units System</Label>
                <Select
                  value={settings.units}
                  onValueChange={(value: 'uk' | 'us') => updateSetting('units', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uk">UK Units</SelectItem>
                    <SelectItem value="us">US Standard Drinks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value: 'light' | 'dark' | 'system') => updateSetting('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy
            </CardTitle>
            <CardDescription>
              Control your data and privacy preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Share Progress</Label>
                <p className="text-sm text-muted-foreground">
                  Allow sharing progress with support network
                </p>
              </div>
              <Switch
                checked={settings.privacy.shareProgress}
                onCheckedChange={(value) => updateSetting('privacy.shareProgress', value)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Help improve the app with anonymous usage data
                </p>
              </div>
              <Switch
                checked={settings.privacy.analyticsOptIn}
                onCheckedChange={(value) => updateSetting('privacy.analyticsOptIn', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Export, import, or delete your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" onClick={exportData} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                  id="import-data"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('import-data')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Import Data
                </Button>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your tracking data, goals, and settings.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteAllData}>
                      Delete Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {hasUnsavedChanges && (
          <Alert>
            <AlertDescription>
              You have unsaved changes. Click the button below to save them.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button 
            onClick={saveSettings}
            disabled={!hasUnsavedChanges}
            className="min-w-32"
          >
            Save Changes
          </Button>
          <Button variant="outline" onClick={onLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}