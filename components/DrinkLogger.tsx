import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { ArrowLeft, Plus, Minus } from "lucide-react";

const DRINK_TYPES = [
  { name: "Beer (Pint)", units: 2.3, icon: "🍺" },
  { name: "Beer (Half Pint)", units: 1.2, icon: "🍺" },
  { name: "Wine (Large Glass)", units: 3.0, icon: "🍷" },
  { name: "Wine (Medium Glass)", units: 2.1, icon: "🍷" },
  { name: "Wine (Small Glass)", units: 1.5, icon: "🍷" },
  { name: "Spirits (Double)", units: 2.0, icon: "🥃" },
  { name: "Spirits (Single)", units: 1.0, icon: "🥃" },
  { name: "Cocktail", units: 1.5, icon: "🍸" },
  { name: "Alcopop", units: 1.1, icon: "🍹" },
];

interface DrinkEntry {
  id: string;
  type: string;
  units: number;
  quantity: number;
  time: string;
  date: string;
}

interface DrinkLoggerProps {
  onBack: () => void;
  onLogDrink: (drink: Omit<DrinkEntry, 'id'>) => void;
  todaysDrinks: DrinkEntry[];
}

export function DrinkLogger({ onBack, onLogDrink, todaysDrinks }: DrinkLoggerProps) {
  const [selectedDrink, setSelectedDrink] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [customUnits, setCustomUnits] = useState("");

  const selectedDrinkType = DRINK_TYPES.find(d => d.name === selectedDrink);
  const totalUnits = selectedDrinkType ? selectedDrinkType.units * quantity : parseFloat(customUnits) || 0;

  const handleQuickAdd = (drinkType: typeof DRINK_TYPES[0]) => {
    const now = new Date();
    onLogDrink({
      type: drinkType.name,
      units: drinkType.units,
      quantity: 1,
      time: now.toLocaleTimeString(),
      date: now.toDateString()
    });
  };

  const handleLogDrink = () => {
    if (!selectedDrink && !customUnits) return;
    
    const now = new Date();
    const drinkType = selectedDrinkType;
    
    onLogDrink({
      type: drinkType ? drinkType.name : "Custom",
      units: totalUnits,
      quantity: quantity,
      time: now.toLocaleTimeString(),
      date: now.toDateString()
    });
    
    // Reset form
    setSelectedDrink("");
    setQuantity(1);
    setCustomUnits("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl">Log a Drink</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Add</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {DRINK_TYPES.slice(0, 6).map((drink) => (
                <Button
                  key={drink.name}
                  variant="outline"
                  onClick={() => handleQuickAdd(drink)}
                  className="justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{drink.icon}</span>
                    {drink.name}
                  </span>
                  <Badge variant="secondary">{drink.units} units</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="drink-type">Drink Type</Label>
              <Select value={selectedDrink} onValueChange={setSelectedDrink}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a drink type" />
                </SelectTrigger>
                <SelectContent>
                  {DRINK_TYPES.map((drink) => (
                    <SelectItem key={drink.name} value={drink.name}>
                      <span className="flex items-center gap-2">
                        <span>{drink.icon}</span>
                        {drink.name} ({drink.units} units)
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDrink && (
              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="custom-units">Or enter custom units</Label>
              <Input
                id="custom-units"
                type="number"
                step="0.1"
                placeholder="e.g., 2.5"
                value={customUnits}
                onChange={(e) => setCustomUnits(e.target.value)}
              />
            </div>

            {totalUnits > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  Total: <span className="font-semibold">{totalUnits.toFixed(1)} units</span>
                </p>
              </div>
            )}

            <Button 
              onClick={handleLogDrink} 
              className="w-full"
              disabled={totalUnits === 0}
            >
              Log Drink
            </Button>
          </CardContent>
        </Card>
      </div>

      {todaysDrinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Drinks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todaysDrinks.map((drink) => (
                <div key={drink.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{drink.type}</p>
                    <p className="text-sm text-muted-foreground">{drink.time}</p>
                  </div>
                  <Badge>{drink.units.toFixed(1)} units</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}