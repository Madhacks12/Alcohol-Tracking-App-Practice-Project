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

export interface User {
  name: string;
  email: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  units: 'uk' | 'us';
  notifications: boolean;
  dataSharing: boolean;
  analytics: boolean;
}

export interface AppData {
  drinks: DrinkEntry[];
  goals: Goals;
  user: User;
  settings: AppSettings;
}

class DataService {
  private readonly STORAGE_KEYS = {
    DRINKS: 'alcohol-tracker-drinks',
    GOALS: 'alcohol-tracker-goals',
    USER: 'alcohol-tracker-user',
    SETTINGS: 'alcohol-tracker-settings',
    AUTH: 'alcohol-tracker-auth',
    USERS: 'alcohol-tracker-users'
  };

  // Drink Management
  public getDrinkHistory(): DrinkEntry[] {
    const saved = localStorage.getItem(this.STORAGE_KEYS.DRINKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load drink history:', e);
      }
    }
    return [];
  }

  public saveDrinkHistory(drinks: DrinkEntry[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.DRINKS, JSON.stringify(drinks));
    } catch (e) {
      console.error('Failed to save drink history:', e);
    }
  }

  public addDrink(drink: Omit<DrinkEntry, 'id'>): DrinkEntry {
    const newDrink: DrinkEntry = {
      ...drink,
      id: this.generateId()
    };
    
    const drinks = this.getDrinkHistory();
    drinks.push(newDrink);
    this.saveDrinkHistory(drinks);
    
    return newDrink;
  }

  public removeDrink(drinkId: string): boolean {
    const drinks = this.getDrinkHistory();
    const filteredDrinks = drinks.filter(drink => drink.id !== drinkId);
    
    if (filteredDrinks.length < drinks.length) {
      this.saveDrinkHistory(filteredDrinks);
      return true;
    }
    return false;
  }

  public updateDrink(drinkId: string, updates: Partial<DrinkEntry>): boolean {
    const drinks = this.getDrinkHistory();
    const index = drinks.findIndex(drink => drink.id === drinkId);
    
    if (index !== -1) {
      drinks[index] = { ...drinks[index], ...updates };
      this.saveDrinkHistory(drinks);
      return true;
    }
    return false;
  }

  // Goals Management
  public getGoals(): Goals {
    const saved = localStorage.getItem(this.STORAGE_KEYS.GOALS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load goals:', e);
      }
    }
    return this.getDefaultGoals();
  }

  public saveGoals(goals: Goals): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error('Failed to save goals:', e);
    }
  }

  private getDefaultGoals(): Goals {
    return {
      weeklyLimit: 14,
      reductionTarget: 10,
      motivation: "Improve my health"
    };
  }

  // User Management
  public getCurrentUser(): User | null {
    const saved = localStorage.getItem(this.STORAGE_KEYS.AUTH);
    if (saved) {
      try {
        const authData = JSON.parse(saved);
        return authData.user || null;
      } catch (e) {
        console.error('Failed to load current user:', e);
      }
    }
    return null;
  }

  public saveCurrentUser(user: User): void {
    try {
      const authData = { user };
      localStorage.setItem(this.STORAGE_KEYS.AUTH, JSON.stringify(authData));
    } catch (e) {
      console.error('Failed to save current user:', e);
    }
  }

  public clearCurrentUser(): void {
    localStorage.removeItem(this.STORAGE_KEYS.AUTH);
  }

  public registerUser(email: string, password: string, name: string): boolean {
    const users = this.getRegisteredUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return false;
    }
    
    // Add new user
    const newUser = { name, email, password };
    users.push(newUser);
    
    try {
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
      return true;
    } catch (e) {
      console.error('Failed to register user:', e);
      return false;
    }
  }

  public authenticateUser(email: string, password: string): User | null {
    const users = this.getRegisteredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      return { name: user.name, email: user.email };
    }
    return null;
  }

  private getRegisteredUsers(): Array<{name: string, email: string, password: string}> {
    const saved = localStorage.getItem(this.STORAGE_KEYS.USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load registered users:', e);
      }
    }
    return [];
  }

  // Settings Management
  public getSettings(): AppSettings {
    const saved = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
    return this.getDefaultSettings();
  }

  public saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  private getDefaultSettings(): AppSettings {
    return {
      theme: 'system',
      units: 'uk',
      notifications: true,
      dataSharing: false,
      analytics: false
    };
  }

  // Data Analysis
  public getTodaysDrinks(): DrinkEntry[] {
    const today = new Date().toDateString();
    return this.getDrinkHistory().filter(drink => drink.date === today);
  }

  public getTodaysIntake(): number {
    return this.getTodaysDrinks().reduce((sum, drink) => sum + drink.units, 0);
  }

  public getWeeklyDrinks(): DrinkEntry[] {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return this.getDrinkHistory().filter(drink => new Date(drink.date) >= weekAgo);
  }

  public getWeeklyIntake(): number {
    return this.getWeeklyDrinks().reduce((sum, drink) => sum + drink.units, 0);
  }

  public calculateStreak(): number {
    const drinks = this.getDrinkHistory();
    const goals = this.getGoals();
    const dailyLimit = goals.weeklyLimit / 7;
    let streak = 0;
    const currentDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(currentDate.getDate() - i);
      const dateString = checkDate.toDateString();
      
      const dayIntake = drinks
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

  public getDrinksByDateRange(startDate: Date, endDate: Date): DrinkEntry[] {
    return this.getDrinkHistory().filter(drink => {
      const drinkDate = new Date(drink.date);
      return drinkDate >= startDate && drinkDate <= endDate;
    });
  }

  public getAverageDailyIntake(days: number = 7): number {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const drinks = this.getDrinksByDateRange(startDate, endDate);
    const totalUnits = drinks.reduce((sum, drink) => sum + drink.units, 0);
    
    return totalUnits / days;
  }

  public getDrinkTypeStats(): Record<string, {count: number, units: number}> {
    const drinks = this.getDrinkHistory();
    const stats: Record<string, {count: number, units: number}> = {};
    
    drinks.forEach(drink => {
      if (!stats[drink.type]) {
        stats[drink.type] = { count: 0, units: 0 };
      }
      stats[drink.type].count += drink.quantity;
      stats[drink.type].units += drink.units;
    });
    
    return stats;
  }

  // Data Export/Import
  public exportData(): string {
    const data: AppData = {
      drinks: this.getDrinkHistory(),
      goals: this.getGoals(),
      user: this.getCurrentUser() || { name: '', email: '' },
      settings: this.getSettings()
    };
    
    return JSON.stringify(data, null, 2);
  }

  public importData(jsonData: string): boolean {
    try {
      const data: AppData = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.drinks || !Array.isArray(data.drinks)) {
        throw new Error('Invalid drinks data');
      }
      if (!data.goals || typeof data.goals !== 'object') {
        throw new Error('Invalid goals data');
      }
      if (!data.settings || typeof data.settings !== 'object') {
        throw new Error('Invalid settings data');
      }
      
      // Save imported data
      this.saveDrinkHistory(data.drinks);
      this.saveGoals(data.goals);
      this.saveSettings(data.settings);
      
      if (data.user && data.user.name && data.user.email) {
        this.saveCurrentUser(data.user);
      }
      
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }

  public clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Utility
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Demo data for testing
  public generateDemoData(): void {
    const demoDrinks: DrinkEntry[] = [
      {
        id: this.generateId(),
        type: "Beer (Pint)",
        units: 2.3,
        quantity: 1,
        time: "19:30",
        date: new Date(Date.now() - 86400000).toDateString() // Yesterday
      },
      {
        id: this.generateId(),
        type: "Wine (Medium Glass)",
        units: 2.1,
        quantity: 1,
        time: "20:15",
        date: new Date(Date.now() - 86400000).toDateString() // Yesterday
      },
      {
        id: this.generateId(),
        type: "Beer (Half Pint)",
        units: 1.2,
        quantity: 1,
        time: "18:45",
        date: new Date(Date.now() - 2 * 86400000).toDateString() // 2 days ago
      }
    ];
    
    this.saveDrinkHistory(demoDrinks);
    
    const demoGoals: Goals = {
      weeklyLimit: 14,
      reductionTarget: 20,
      motivation: "Improve my health and save money"
    };
    
    this.saveGoals(demoGoals);
  }
}

// Export singleton instance
export const dataService = new DataService();
