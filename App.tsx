import { useState, useEffect } from "react";
import { DashboardView } from "./components/DashboardView";
import { DrinkLogger } from "./components/DrinkLogger";
import { GoalSetting } from "./components/GoalSetting";
import { ProgressView } from "./components/ProgressView";
import { CalendarView } from "./components/CalendarView";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { SettingsPage } from "./components/SettingsPage";
import { NotificationsPage } from "./components/NotificationsPage";
import { Button } from "./components/ui/button";
import { Settings, Target, Bell } from "lucide-react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { dataService, type DrinkEntry, type Goals, type User } from "./services/dataService";
import { notificationService } from "./services/notificationService";

// Interfaces are now imported from dataService

type View = 'dashboard' | 'logger' | 'goals' | 'progress' | 'calendar' | 'settings' | 'notifications';
type AuthView = 'login' | 'register';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [drinkHistory, setDrinkHistory] = useState<DrinkEntry[]>([]);
  const [goals, setGoals] = useState<Goals>({
    weeklyLimit: 14,
    reductionTarget: 10,
    motivation: "Improve my health"
  });

  // Check authentication status on mount
  useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
  }, []);

  // Load data from services on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    setDrinkHistory(dataService.getDrinkHistory());
    setGoals(dataService.getGoals());
  }, [isAuthenticated]);

  // Save data to services when it changes
  useEffect(() => {
    if (isAuthenticated) {
      dataService.saveDrinkHistory(drinkHistory);
    }
  }, [drinkHistory, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      dataService.saveGoals(goals);
    }
  }, [goals, isAuthenticated]);

  const addDrink = (drink: Omit<DrinkEntry, 'id'>) => {
    dataService.addDrink(drink);
    setDrinkHistory(dataService.getDrinkHistory());
    
    // Check for notifications
    notificationService.checkStreakMilestones(drinkHistory, goals);
    notificationService.checkWarningAlerts(drinkHistory, goals);
    
    toast.success(`Logged ${drink.units.toFixed(1)} units of ${drink.type}`);
    setCurrentView('dashboard');
  };

  // Authentication functions
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    // Demo user
    if (email === 'demo@example.com' && password === 'demo123') {
      const user = { name: 'Demo User', email: email };
      setCurrentUser(user);
      setIsAuthenticated(true);
      dataService.saveCurrentUser(user);
      toast.success("Welcome back!");
      return true;
    }
    
    // Authenticate registered user
    const user = dataService.authenticateUser(email, password);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      dataService.saveCurrentUser(user);
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    }
    
    return false;
  };

  const handleRegister = async (email: string, password: string, name: string): Promise<boolean> => {
    const success = dataService.registerUser(email, password, name);
    
    if (success) {
      // Auto-login the new user
      const userData = { name, email };
      setCurrentUser(userData);
      setIsAuthenticated(true);
      dataService.saveCurrentUser(userData);
      toast.success(`Welcome, ${name}! Your account has been created.`);
      return true;
    }
    
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
    dataService.clearCurrentUser();
    toast.success("You've been signed out.");
  };

  const updateUser = (user: User) => {
    setCurrentUser(user);
    dataService.saveCurrentUser(user);
  };

  const saveGoals = (newGoals: Goals) => {
    setGoals(newGoals);
    toast.success("Goals updated successfully!");
  };

  // Calculate current statistics using data service
  const todaysDrinks = dataService.getTodaysDrinks();
  const todayIntake = dataService.getTodaysIntake();
  const weeklyIntake = dataService.getWeeklyIntake();
  const streak = dataService.calculateStreak();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'logger':
        return (
          <DrinkLogger
            onBack={() => setCurrentView('dashboard')}
            onLogDrink={addDrink}
            todaysDrinks={todaysDrinks}
          />
        );
      case 'goals':
        return (
          <GoalSetting
            onBack={() => setCurrentView('dashboard')}
            currentGoals={goals}
            onSaveGoals={saveGoals}
          />
        );
      case 'progress':
        return (
          <ProgressView
            onBack={() => setCurrentView('dashboard')}
            drinkHistory={drinkHistory}
            weeklyGoal={goals.weeklyLimit}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            onBack={() => setCurrentView('dashboard')}
            drinkHistory={drinkHistory}
            weeklyGoal={goals.weeklyLimit}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            onBack={() => setCurrentView('dashboard')}
            currentUser={currentUser!}
            onUpdateUser={updateUser}
            onLogout={handleLogout}
          />
        );
      case 'notifications':
        return (
          <NotificationsPage
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        return (
          <DashboardView
            todayIntake={todayIntake}
            weeklyGoal={goals.weeklyLimit}
            weeklyIntake={weeklyIntake}
            streak={streak}
            onAddDrink={() => setCurrentView('logger')}
            onViewCalendar={() => setCurrentView('calendar')}
            onViewProgress={() => setCurrentView('progress')}
          />
        );
    }
  };

  // If not authenticated, show login/register
  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <RegisterPage
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
    
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthView('register')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        {currentView === 'dashboard' && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl mb-2">Alcohol Reduction Tracker</h1>
              <p className="text-muted-foreground">
                Track your progress towards healthier drinking habits
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('goals')}
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                Goals
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('notifications')}
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('settings')}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        )}

        {/* Main content */}
        {renderCurrentView()}
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
}