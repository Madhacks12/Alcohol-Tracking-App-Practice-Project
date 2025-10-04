import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, Target, Info } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface Goals {
  weeklyLimit: number;
  reductionTarget: number;
  motivation: string;
}

interface GoalSettingProps {
  onBack: () => void;
  currentGoals: Goals;
  onSaveGoals: (goals: Goals) => void;
}

const NHS_GUIDELINES = {
  weekly: 14,
  daily: 2
};

const MOTIVATIONS = [
  "Improve my health",
  "Save money",
  "Better sleep quality",
  "Lose weight", 
  "Set a good example",
  "Reduce dependency",
  "Better mental health",
  "Other"
];

export function GoalSetting({ onBack, currentGoals, onSaveGoals }: GoalSettingProps) {
  const [weeklyLimit, setWeeklyLimit] = useState(currentGoals.weeklyLimit);
  const [reductionTarget, setReductionTarget] = useState(currentGoals.reductionTarget);
  const [motivation, setMotivation] = useState(currentGoals.motivation);

  const handleSave = () => {
    onSaveGoals({
      weeklyLimit,
      reductionTarget,
      motivation
    });
    onBack();
  };

  const isWithinGuidelines = weeklyLimit <= NHS_GUIDELINES.weekly;
  const dailyAverage = weeklyLimit / 7;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl">Set Your Goals</h1>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          NHS guidelines recommend no more than 14 units per week for both men and women, spread over at least 3 days.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Weekly Limit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weekly-limit">Units per week</Label>
              <Input
                id="weekly-limit"
                type="number"
                value={weeklyLimit}
                onChange={(e) => setWeeklyLimit(Number(e.target.value))}
                min="0"
                step="0.5"
              />
              <p className="text-sm text-muted-foreground">
                Daily average: {dailyAverage.toFixed(1)} units
              </p>
            </div>

            <div className={`p-3 rounded-lg ${isWithinGuidelines ? 'bg-green-50 dark:bg-green-950' : 'bg-yellow-50 dark:bg-yellow-950'}`}>
              <p className="text-sm">
                {isWithinGuidelines ? (
                  <span className="text-green-700 dark:text-green-300">✓ Within NHS guidelines</span>
                ) : (
                  <span className="text-yellow-700 dark:text-yellow-300">⚠ Above NHS guidelines ({NHS_GUIDELINES.weekly} units/week)</span>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Quick presets</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWeeklyLimit(14)}
                  className={weeklyLimit === 14 ? "bg-primary text-primary-foreground" : ""}
                >
                  NHS Guidelines (14)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWeeklyLimit(10)}
                  className={weeklyLimit === 10 ? "bg-primary text-primary-foreground" : ""}
                >
                  Moderate (10)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWeeklyLimit(7)}
                  className={weeklyLimit === 7 ? "bg-primary text-primary-foreground" : ""}
                >
                  Low (7)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWeeklyLimit(0)}
                  className={weeklyLimit === 0 ? "bg-primary text-primary-foreground" : ""}
                >
                  Alcohol-free (0)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reduction Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reduction-target">Weekly reduction target (%)</Label>
              <Input
                id="reduction-target"
                type="number"
                value={reductionTarget}
                onChange={(e) => setReductionTarget(Number(e.target.value))}
                min="0"
                max="100"
                step="5"
              />
              <p className="text-sm text-muted-foreground">
                How much you want to reduce your intake each week
              </p>
            </div>

            <div className="space-y-2">
              <Label>Common targets</Label>
              <div className="grid grid-cols-2 gap-2">
                {[10, 15, 25, 50].map((target) => (
                  <Button
                    key={target}
                    variant="outline"
                    size="sm"
                    onClick={() => setReductionTarget(target)}
                    className={reductionTarget === target ? "bg-primary text-primary-foreground" : ""}
                  >
                    {target}%
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation">Main motivation</Label>
              <Select value={motivation} onValueChange={setMotivation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your motivation" />
                </SelectTrigger>
                <SelectContent>
                  {MOTIVATIONS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Goal Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Weekly limit:</strong> {weeklyLimit} units ({dailyAverage.toFixed(1)} units/day average)</p>
            <p><strong>Reduction target:</strong> {reductionTarget}% per week</p>
            <p><strong>Motivation:</strong> {motivation}</p>
            {isWithinGuidelines ? (
              <p className="text-green-600 dark:text-green-400">Your goal is within NHS healthy drinking guidelines.</p>
            ) : (
              <p className="text-yellow-600 dark:text-yellow-400">Consider reducing to meet NHS guidelines of 14 units per week.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="min-w-24">
          Save Goals
        </Button>
      </div>
    </div>
  );
}