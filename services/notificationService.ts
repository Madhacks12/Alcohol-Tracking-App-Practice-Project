export interface NotificationSettings {
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

export interface DrinkEntry {
  id: string;
  type: string;
  units: number;
  quantity: number;
  time: string;
  date: string;
}

export interface Goals {
  weeklyLimit: number;
  reductionTarget: number;
  motivation: string;
}

class NotificationService {
  private settings: NotificationSettings | null = null;
  private intervals: number[] = [];
  private lastNotificationDate: string | null = null;

  constructor() {
    this.loadSettings();
    this.setupNotificationSchedules();
  }

  private loadSettings() {
    const savedSettings = localStorage.getItem('alcohol-tracker-notifications');
    if (savedSettings) {
      try {
        this.settings = JSON.parse(savedSettings);
      } catch (e) {
        console.error('Failed to load notification settings:', e);
        this.settings = this.getDefaultSettings();
      }
    } else {
      this.settings = this.getDefaultSettings();
    }
  }

  private getDefaultSettings(): NotificationSettings {
    return {
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
  }

  public updateSettings(newSettings: NotificationSettings) {
    this.settings = newSettings;
    localStorage.setItem('alcohol-tracker-notifications', JSON.stringify(newSettings));
    this.clearSchedules();
    this.setupNotificationSchedules();
  }

  public getSettings(): NotificationSettings {
    return this.settings || this.getDefaultSettings();
  }

  private clearSchedules() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }

  private setupNotificationSchedules() {
    if (!this.settings?.enabled || !('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    // Daily reminder
    if (this.settings.dailyReminder.enabled) {
      this.scheduleDailyReminder();
    }

    // Weekly report
    if (this.settings.weeklyReport.enabled) {
      this.scheduleWeeklyReport();
    }

    // Check for goal reminders every hour
    if (this.settings.goalReminders.enabled) {
      this.scheduleGoalReminders();
    }

    // Check for encouragement messages every 6 hours
    if (this.settings.encouragement.enabled) {
      this.scheduleEncouragement();
    }
  }

  private scheduleDailyReminder() {
    const [hours, minutes] = this.settings!.dailyReminder.time.split(':').map(Number);
    
    const scheduleReminder = () => {
      const now = new Date();
      const today = now.toDateString();
      
      // Don't send if already sent today
      if (this.lastNotificationDate === today) {
        return;
      }

      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      if (now >= reminderTime) {
        this.sendNotification(
          'Daily Reminder',
          this.settings!.dailyReminder.message
        );
        this.lastNotificationDate = today;
      }
    };

    // Check every minute
    const interval = setInterval(scheduleReminder, 60000);
    this.intervals.push(interval);
    
    // Initial check
    scheduleReminder();
  }

  private scheduleWeeklyReport() {
    const [hours, minutes] = this.settings!.weeklyReport.time.split(':').map(Number);
    const targetDay = this.settings!.weeklyReport.day;
    
    const scheduleReport = () => {
      const now = new Date();
      const today = now.toDateString();
      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      // Don't send if already sent this week
      if (this.lastNotificationDate === today) {
        return;
      }

      if (dayName === targetDay) {
        const reportTime = new Date();
        reportTime.setHours(hours, minutes, 0, 0);

        if (now >= reportTime) {
          this.generateWeeklyReport();
          this.lastNotificationDate = today;
        }
      }
    };

    // Check every hour
    const interval = setInterval(scheduleReport, 3600000);
    this.intervals.push(interval);
    
    // Initial check
    scheduleReport();
  }

  private scheduleGoalReminders() {
    const frequency = this.settings!.goalReminders.frequency;
    const intervalMs = frequency === 'daily' ? 3600000 : 86400000; // 1 hour or 24 hours

    const checkGoals = () => {
      const drinkHistory = this.getDrinkHistory();
      const goals = this.getGoals();
      
      if (!drinkHistory || !goals) return;

      const today = new Date().toDateString();
      const todaysDrinks = drinkHistory.filter(drink => drink.date === today);
      const todayIntake = todaysDrinks.reduce((sum, drink) => sum + drink.units, 0);
      
      const dailyLimit = goals.weeklyLimit / 7;
      
      if (todayIntake > dailyLimit * 0.8) {
        this.sendNotification(
          'Goal Reminder',
          `You're approaching your daily limit (${todayIntake.toFixed(1)}/${dailyLimit.toFixed(1)} units). Consider your goals!`
        );
      }
    };

    const interval = setInterval(checkGoals, intervalMs);
    this.intervals.push(interval);
  }

  private scheduleEncouragement() {
    const frequency = this.settings!.encouragement.frequency;
    const intervalMs = frequency === 'high' ? 21600000 : frequency === 'medium' ? 43200000 : 86400000; // 6h, 12h, 24h

    const sendEncouragement = () => {
      const drinkHistory = this.getDrinkHistory();
      const goals = this.getGoals();
      
      if (!drinkHistory || !goals) return;

      const today = new Date().toDateString();
      const todaysDrinks = drinkHistory.filter(drink => drink.date === today);
      const todayIntake = todaysDrinks.reduce((sum, drink) => sum + drink.units, 0);
      
      const dailyLimit = goals.weeklyLimit / 7;
      
      if (todayIntake === 0) {
        const messages = [
          "Great job staying alcohol-free today! 🌟",
          "You're doing amazing! Keep up the healthy choices! 💪",
          "Your future self will thank you for this! 🎉"
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        this.sendNotification('Encouragement', message);
      } else if (todayIntake <= dailyLimit * 0.5) {
        const messages = [
          "You're staying well within healthy limits! 👏",
          "Great moderation today! 🎯",
          "Your mindful drinking is paying off! ✨"
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        this.sendNotification('Encouragement', message);
      }
    };

    const interval = setInterval(sendEncouragement, intervalMs);
    this.intervals.push(interval);
  }

  private generateWeeklyReport() {
    const drinkHistory = this.getDrinkHistory();
    const goals = this.getGoals();
    
    if (!drinkHistory || !goals) return;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyDrinks = drinkHistory.filter(drink => new Date(drink.date) >= weekAgo);
    const weeklyIntake = weeklyDrinks.reduce((sum, drink) => sum + drink.units, 0);
    
    const streak = this.calculateStreak(drinkHistory, goals);
    
    let message = `Weekly Report:\n`;
    message += `• Units this week: ${weeklyIntake.toFixed(1)}/${goals.weeklyLimit}\n`;
    message += `• Current streak: ${streak} days\n`;
    
    if (weeklyIntake <= goals.weeklyLimit) {
      message += `• Great job staying within your goals! 🎉`;
    } else {
      message += `• Consider adjusting your goals for next week.`;
    }

    this.sendNotification('Weekly Report', message);
  }

  private calculateStreak(drinkHistory: DrinkEntry[], goals: Goals): number {
    const dailyLimit = goals.weeklyLimit / 7;
    let streak = 0;
    const currentDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(currentDate.getDate() - i);
      const dateString = checkDate.toDateString();
      
      const dayIntake = drinkHistory
        .filter(drink => drink.date === dateString)
        .reduce((sum, drink) => sum + drink.units, 0);
      
      if (dayIntake <= dailyLimit) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private getDrinkHistory(): DrinkEntry[] | null {
    const saved = localStorage.getItem('alcohol-tracker-drinks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load drink history:', e);
      }
    }
    return null;
  }

  private getGoals(): Goals | null {
    const saved = localStorage.getItem('alcohol-tracker-goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load goals:', e);
      }
    }
    return null;
  }

  private sendNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'alcohol-tracker'
      });
    }
  }

  public checkStreakMilestones(drinkHistory: DrinkEntry[], goals: Goals) {
    if (!this.settings?.streakCelebration.enabled) return;

    const streak = this.calculateStreak(drinkHistory, goals);
    const milestones = this.settings.streakCelebration.milestones;
    
    if (milestones.includes(streak) && streak > 0) {
      this.sendNotification(
        'Streak Milestone! 🎉',
        `Congratulations! You've reached a ${streak}-day streak of staying within your goals!`
      );
    }
  }

  public checkWarningAlerts(drinkHistory: DrinkEntry[], goals: Goals) {
    if (!this.settings?.warningAlerts.enabled) return;

    const today = new Date().toDateString();
    const todaysDrinks = drinkHistory.filter(drink => drink.date === today);
    const todayIntake = todaysDrinks.reduce((sum, drink) => sum + drink.units, 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyDrinks = drinkHistory.filter(drink => new Date(drink.date) >= weekAgo);
    const weeklyIntake = weeklyDrinks.reduce((sum, drink) => sum + drink.units, 0);

    if (todayIntake >= this.settings.warningAlerts.dailyThreshold) {
      this.sendNotification(
        'Daily Limit Warning',
        `You've reached ${todayIntake.toFixed(1)} units today. Consider your health goals.`
      );
    }

    if (weeklyIntake >= this.settings.warningAlerts.weeklyThreshold) {
      this.sendNotification(
        'Weekly Limit Warning',
        `You've reached ${weeklyIntake.toFixed(1)} units this week. Consider taking a break.`
      );
    }
  }

  public requestPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return Notification.requestPermission();
    }
    return Promise.resolve('denied');
  }

  public getPermission(): NotificationPermission {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  }

  public destroy() {
    this.clearSchedules();
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
