import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, TrendingDown, Award, AlertTriangle } from "lucide-react";

interface DashboardViewProps {
  todayIntake: number;
  weeklyGoal: number;
  weeklyIntake: number;
  streak: number;
  onAddDrink: () => void;
  onViewCalendar: () => void;
  onViewProgress: () => void;
}

export function DashboardView({ 
  todayIntake, 
  weeklyGoal, 
  weeklyIntake, 
  streak,
  onAddDrink,
  onViewCalendar,
  onViewProgress 
}: DashboardViewProps) {
  const dailyLimit = Math.floor(weeklyGoal / 7);
  const weeklyProgress = (weeklyIntake / weeklyGoal) * 100;
  const dailyProgress = (todayIntake / dailyLimit) * 100;

  const getStatusColor = (progress: number) => {
    if (progress <= 50) return "bg-green-500";
    if (progress <= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusMessage = () => {
    if (todayIntake === 0) return "Great job staying alcohol-free today!";
    if (todayIntake <= dailyLimit * 0.5) return "You're doing well staying within healthy limits";
    if (todayIntake <= dailyLimit) return "Approaching your daily limit";
    return "You've exceeded your daily goal";
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl">Today's Progress</h1>
        <p className="text-muted-foreground">{getStatusMessage()}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🍷</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayIntake.toFixed(1)} units</div>
            <p className="text-xs text-muted-foreground">
              Goal: {dailyLimit.toFixed(1)} units/day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyIntake.toFixed(1)} units</div>
            <p className="text-xs text-muted-foreground">
              Goal: {weeklyGoal} units/week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days</div>
            <p className="text-xs text-muted-foreground">
              {streak > 0 ? "Within goals" : "Set a goal to start"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {dailyProgress > 100 ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : (
              <div className="h-4 w-4 text-green-500">✓</div>
            )}
          </CardHeader>
          <CardContent>
            <Badge 
              variant={dailyProgress > 100 ? "destructive" : "secondary"}
              className="text-xs"
            >
              {dailyProgress > 100 ? "Over limit" : "On track"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Units consumed</span>
                <span>{todayIntake.toFixed(1)} / {dailyLimit.toFixed(1)}</span>
              </div>
              <Progress 
                value={Math.min(dailyProgress, 100)} 
                className="h-2"
                indicatorClassName={getStatusColor(dailyProgress)}
              />
            </div>
            <Button onClick={onAddDrink} className="w-full">
              Log a Drink
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekly intake</span>
                <span>{weeklyIntake.toFixed(1)} / {weeklyGoal}</span>
              </div>
              <Progress 
                value={Math.min(weeklyProgress, 100)} 
                className="h-2"
                indicatorClassName={getStatusColor(weeklyProgress)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={onViewCalendar} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
              <Button variant="outline" onClick={onViewProgress}>
                Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}