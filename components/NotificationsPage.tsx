import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { ArrowLeft, Bell, Clock, Target, TrendingUp, Heart, Calendar, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";

interface NotificationSettings {
  enabled: boolean;
  dailyReminder: {
    enabled: boolean;
    time: string;
    message: string;
  };
  weeklyReport: {
    enabled: boolean;
    day: string;
    time: string;
  };
  goalReminders: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
  };
  encouragement: {
    enabled: boolean;
    frequency: 'high' | 'medium' | 'low';
  };
  streakCelebration: {
    enabled: boolean;
    milestones: number[];
  };
  warningAlerts: {
    enabled: boolean;
    weeklyThreshold: number;
    dailyThreshold: number;
  };
}

interface NotificationsPageProps {
  onBack: () => void;
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  dailyReminder: {
    enabled: true,
    time: "20:00",
    message: "Don't forget to log your drinks for today!"
  },
  weeklyReport: {
    enabled: true,
    day: "sunday",
    time: "18:00"
  },
  goalReminders: {
    enabled: true,
    frequency: 'weekly'
  },
  encouragement: {
    enabled: true,
    frequency: 'medium'
  },
  streakCelebration: {
    enabled: true,
    milestones: [3, 7, 14, 30, 60, 90]
  },
  warningAlerts: {
    enabled: true,
    weeklyThreshold: 14,
    dailyThreshold: 4
  }
};

export function NotificationsPage({ onBack }: NotificationsPageProps) {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Load notification settings from localStorage
    const savedSettings = localStorage.getItem('alcohol-tracker-notifications');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to load notification settings:', e);
      }
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        toast.success("Notifications enabled successfully!");
      } else {
        toast.error("Notifications were denied. You can enable them in your browser settings.");
      }
    }
  };

  const updateSetting = (path: string, value: string | boolean | number) => {
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

  const saveSettings = () => {
    localStorage.setItem('alcohol-tracker-notifications', JSON.stringify(settings));
    setHasUnsavedChanges(false);
    toast.success("Notification settings saved!");
  };

  const testNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('Alcohol Tracker', {
        body: 'This is a test notification!',
        icon: '/favicon.ico'
      });
      toast.success("Test notification sent!");
    } else {
      toast.error("Please enable notifications first.");
    }
  };

  const days = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl mb-1">Notifications</h1>
          <p className="text-muted-foreground">
            Set up reminders and alerts to support your goals
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Notification Permission */}
        {notificationPermission !== 'granted' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Enable browser notifications to receive reminders and alerts.</span>
              <Button size="sm" onClick={requestNotificationPermission}>
                Enable Notifications
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Master Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable All Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Master switch for all notification types
                </p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(value) => updateSetting('enabled', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Daily Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Daily Reminders
            </CardTitle>
            <CardDescription>
              Get reminded to track your daily alcohol consumption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Daily Tracking Reminder</Label>
                <p className="text-sm text-muted-foreground">
                  Remind me to log my drinks
                </p>
              </div>
              <Switch
                checked={settings.dailyReminder.enabled && settings.enabled}
                onCheckedChange={(value) => updateSetting('dailyReminder.enabled', value)}
                disabled={!settings.enabled}
              />
            </div>
            
            {settings.dailyReminder.enabled && settings.enabled && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-time">Reminder Time</Label>
                    <Input
                      id="reminder-time"
                      type="time"
                      value={settings.dailyReminder.time}
                      onChange={(e) => updateSetting('dailyReminder.time', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminder-message">Custom Message</Label>
                    <Input
                      id="reminder-message"
                      placeholder="Reminder message"
                      value={settings.dailyReminder.message}
                      onChange={(e) => updateSetting('dailyReminder.message', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Weekly Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Reports
            </CardTitle>
            <CardDescription>
              Receive weekly progress summaries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Progress Report</Label>
                <p className="text-sm text-muted-foreground">
                  Get a summary of your weekly progress
                </p>
              </div>
              <Switch
                checked={settings.weeklyReport.enabled && settings.enabled}
                onCheckedChange={(value) => updateSetting('weeklyReport.enabled', value)}
                disabled={!settings.enabled}
              />
            </div>
            
            {settings.weeklyReport.enabled && settings.enabled && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-day">Day of Week</Label>
                    <Select
                      value={settings.weeklyReport.day}
                      onValueChange={(value) => updateSetting('weeklyReport.day', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map(day => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-time">Time</Label>
                    <Input
                      id="report-time"
                      type="time"
                      value={settings.weeklyReport.time}
                      onChange={(e) => updateSetting('weeklyReport.time', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Goal Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Reminders
            </CardTitle>
            <CardDescription>
              Stay motivated with goal-focused reminders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Goal Progress Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded about your reduction goals
                </p>
              </div>
              <Switch
                checked={settings.goalReminders.enabled && settings.enabled}
                onCheckedChange={(value) => updateSetting('goalReminders.enabled', value)}
                disabled={!settings.enabled}
              />
            </div>
            
            {settings.goalReminders.enabled && settings.enabled && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Reminder Frequency</Label>
                  <Select
                    value={settings.goalReminders.frequency}
                    onValueChange={(value) => updateSetting('goalReminders.frequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Encouragement Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Encouragement Messages
            </CardTitle>
            <CardDescription>
              Receive motivational messages to keep you going
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Motivational Messages</Label>
                <p className="text-sm text-muted-foreground">
                  Get encouraging messages to support your journey
                </p>
              </div>
              <Switch
                checked={settings.encouragement.enabled && settings.enabled}
                onCheckedChange={(value) => updateSetting('encouragement.enabled', value)}
                disabled={!settings.enabled}
              />
            </div>
            
            {settings.encouragement.enabled && settings.enabled && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Message Frequency</Label>
                  <Select
                    value={settings.encouragement.frequency}
                    onValueChange={(value) => updateSetting('encouragement.frequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High (Multiple per day)</SelectItem>
                      <SelectItem value="medium">Medium (Daily)</SelectItem>
                      <SelectItem value="low">Low (Few times per week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Streak Celebrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Streak Celebrations
            </CardTitle>
            <CardDescription>
              Celebrate your progress milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Milestone Celebrations</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you reach streak milestones
                </p>
              </div>
              <Switch
                checked={settings.streakCelebration.enabled && settings.enabled}
                onCheckedChange={(value) => updateSetting('streakCelebration.enabled', value)}
                disabled={!settings.enabled}
              />
            </div>
            
            {settings.streakCelebration.enabled && settings.enabled && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Celebration Milestones (days)</Label>
                  <div className="flex flex-wrap gap-2">
                    {settings.streakCelebration.milestones.map((milestone, index) => (
                      <Badge key={index} variant="secondary">
                        {milestone} days
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You'll be celebrated when you reach these streaks
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Warning Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Warning Alerts
            </CardTitle>
            <CardDescription>
              Get alerted when approaching your limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Limit Warning Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get warned when approaching your daily or weekly limits
                </p>
              </div>
              <Switch
                checked={settings.warningAlerts.enabled && settings.enabled}
                onCheckedChange={(value) => updateSetting('warningAlerts.enabled', value)}
                disabled={!settings.enabled}
              />
            </div>
            
            {settings.warningAlerts.enabled && settings.enabled && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="daily-threshold">Daily Threshold (units)</Label>
                    <Input
                      id="daily-threshold"
                      type="number"
                      min="1"
                      max="10"
                      value={settings.warningAlerts.dailyThreshold}
                      onChange={(e) => updateSetting('warningAlerts.dailyThreshold', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weekly-threshold">Weekly Threshold (units)</Label>
                    <Input
                      id="weekly-threshold"
                      type="number"
                      min="1"
                      max="50"
                      value={settings.warningAlerts.weeklyThreshold}
                      onChange={(e) => updateSetting('warningAlerts.weeklyThreshold', Number(e.target.value))}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button 
            onClick={saveSettings}
            disabled={!hasUnsavedChanges}
            className="min-w-32"
          >
            Save Settings
          </Button>
          <Button 
            variant="outline" 
            onClick={testNotification}
            disabled={notificationPermission !== 'granted'}
          >
            Test Notification
          </Button>
        </div>

        {hasUnsavedChanges && (
          <Alert>
            <AlertDescription>
              You have unsaved notification settings. Click "Save Settings" to apply your changes.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}