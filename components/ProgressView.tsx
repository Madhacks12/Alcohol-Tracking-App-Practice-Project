import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface DrinkEntry {
  id: string;
  type: string;
  units: number;
  quantity: number;
  time: string;
  date: string;
}

interface ProgressViewProps {
  onBack: () => void;
  drinkHistory: DrinkEntry[];
  weeklyGoal: number;
}

export function ProgressView({ onBack, drinkHistory, weeklyGoal }: ProgressViewProps) {
  // Calculate weekly data for the last 8 weeks
  const getWeeklyData = () => {
    const weeks: { [key: string]: number } = {};
    const now = new Date();
    
    // Initialize last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      const weekKey = `Week ${8 - i}`;
      weeks[weekKey] = 0;
    }
    
    // Sum up drinks by week
    drinkHistory.forEach(drink => {
      const drinkDate = new Date(drink.date);
      const weeksAgo = Math.floor((now.getTime() - drinkDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
      if (weeksAgo >= 0 && weeksAgo < 8) {
        const weekKey = `Week ${8 - weeksAgo}`;
        if (weeks[weekKey] !== undefined) {
          weeks[weekKey] += drink.units;
        }
      }
    });
    
    return Object.entries(weeks).map(([week, units]) => ({
      week,
      units: Number(units.toFixed(1)),
      goal: weeklyGoal
    }));
  };

  // Calculate daily data for the last 30 days
  const getDailyData = () => {
    const days: { [key: string]: number } = {};
    const now = new Date();
    
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const dayKey = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days[dayKey] = 0;
    }
    
    // Sum up drinks by day
    drinkHistory.forEach(drink => {
      const drinkDate = new Date(drink.date);
      const dayKey = drinkDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (days[dayKey] !== undefined) {
        days[dayKey] += drink.units;
      }
    });
    
    return Object.entries(days).map(([day, units]) => ({
      day,
      units: Number(units.toFixed(1))
    }));
  };

  // Calculate statistics
  const totalDrinks = drinkHistory.length;
  const totalUnits = drinkHistory.reduce((sum, drink) => sum + drink.units, 0);
  const averageUnitsPerDay = totalUnits / 30; // Last 30 days
  const averageUnitsPerWeek = averageUnitsPerDay * 7;
  
  // Most common drink type
  const drinkTypeCounts = drinkHistory.reduce((acc, drink) => {
    acc[drink.type] = (acc[drink.type] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  
  const mostCommonDrink = Object.entries(drinkTypeCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || "None";

  const weeklyData = getWeeklyData();
  const dailyData = getDailyData();
  
  // Calculate trend
  const recentWeeks = weeklyData.slice(-4);
  const firstHalf = recentWeeks.slice(0, 2).reduce((sum, week) => sum + week.units, 0) / 2;
  const secondHalf = recentWeeks.slice(2).reduce((sum, week) => sum + week.units, 0) / 2;
  const trend = secondHalf - firstHalf;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl">Progress & Statistics</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drinks</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDrinks}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
            {trend < 0 ? (
              <TrendingDown className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageUnitsPerWeek.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {trend < 0 ? (
                <span className="text-green-600">↓ {Math.abs(trend).toFixed(1)} from previous weeks</span>
              ) : trend > 0 ? (
                <span className="text-red-600">↑ {trend.toFixed(1)} from previous weeks</span>
              ) : (
                <span className="text-muted-foreground">No change</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Performance</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🎯</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((1 - averageUnitsPerWeek / weeklyGoal) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {averageUnitsPerWeek <= weeklyGoal ? "Under goal" : "Over goal"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Drink</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🍷</div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{mostCommonDrink}</div>
            <p className="text-xs text-muted-foreground">Most logged</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Consumption Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="units" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Actual Units"
                />
                <Line 
                  type="monotone" 
                  dataKey="goal" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="5 5"
                  name="Weekly Goal"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Consumption (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="units" 
                  fill="hsl(var(--primary))" 
                  name="Units"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Current weekly average:</span>
              <Badge variant={averageUnitsPerWeek <= weeklyGoal ? "secondary" : "destructive"}>
                {averageUnitsPerWeek.toFixed(1)} units
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Weekly goal:</span>
              <Badge variant="outline">{weeklyGoal} units</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Trend:</span>
              <Badge variant={trend <= 0 ? "secondary" : "destructive"}>
                {trend <= 0 ? "Improving" : "Increasing"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {averageUnitsPerWeek > weeklyGoal && (
              <p className="text-sm">• Consider reducing your weekly intake to meet your goal</p>
            )}
            {trend > 0 && (
              <p className="text-sm">• Your consumption has increased recently - try to identify triggers</p>
            )}
            {averageUnitsPerWeek <= weeklyGoal && (
              <p className="text-sm">• Great job staying within your goals! Keep it up</p>
            )}
            <p className="text-sm">• Spread drinking over at least 3 days per week</p>
            <p className="text-sm">• Have alcohol-free days to give your body a break</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}