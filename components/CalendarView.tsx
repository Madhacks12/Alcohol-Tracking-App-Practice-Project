import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
// Badge import removed as it's not used
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface DrinkEntry {
  id: string;
  type: string;
  units: number;
  quantity: number;
  time: string;
  date: string;
}

interface CalendarViewProps {
  onBack: () => void;
  drinkHistory: DrinkEntry[];
  weeklyGoal: number;
}

export function CalendarView({ onBack, drinkHistory, weeklyGoal }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0 = Sunday
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getDayIntake = (date: Date | null) => {
    if (!date) return 0;
    
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    return drinkHistory
      .filter(drink => {
        const drinkDate = new Date(drink.date);
        drinkDate.setHours(0, 0, 0, 0);
        return drinkDate.getTime() === dayStart.getTime();
      })
      .reduce((total, drink) => total + drink.units, 0);
  };

  const getDayColor = (units: number) => {
    const dailyLimit = weeklyGoal / 7;
    if (units === 0) return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
    if (units <= dailyLimit * 0.5) return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
    if (units <= dailyLimit) return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
    return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate month statistics
  const monthDrinks = drinkHistory.filter(drink => {
    const drinkDate = new Date(drink.date);
    return drinkDate.getMonth() === currentDate.getMonth() && 
           drinkDate.getFullYear() === currentDate.getFullYear();
  });
  
  const monthUnits = monthDrinks.reduce((total, drink) => total + drink.units, 0);
  const daysWithDrinks = new Set(monthDrinks.map(drink => new Date(drink.date).getDate())).size;
  const daysInCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const alcoholFreeDays = daysInCurrentMonth - daysWithDrinks;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl">Calendar View</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthUnits.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground">Total units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Drinking Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysWithDrinks}</div>
            <p className="text-sm text-muted-foreground">Out of {daysInCurrentMonth} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Alcohol-Free</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alcoholFreeDays}</div>
            <p className="text-sm text-muted-foreground">Days this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{monthName}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="p-2 h-16"></div>;
              }
              
              const units = getDayIntake(date);
              const isToday = date.getTime() === today.getTime();
              const isFuture = date > today;
              
              return (
                <div
                  key={index}
                  className={`
                    p-2 h-16 border rounded-lg flex flex-col items-center justify-center text-sm
                    ${getDayColor(units)}
                    ${isToday ? 'ring-2 ring-primary' : ''}
                    ${isFuture ? 'opacity-50' : ''}
                  `}
                >
                  <div className="font-medium">{date.getDate()}</div>
                  {units > 0 && (
                    <div className="text-xs font-semibold">
                      {units.toFixed(1)}u
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900"></div>
              <span className="text-sm">Alcohol-free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 dark:bg-yellow-900"></div>
              <span className="text-sm">Light drinking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-100 dark:bg-orange-900"></div>
              <span className="text-sm">Moderate drinking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900"></div>
              <span className="text-sm">Heavy drinking</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Numbers show alcohol units consumed. Today is highlighted with a border.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}