import { Card, CardContent } from "@/components/ui/card";
import { getWeatherIcon } from "@/lib/weatherUtils";

interface ForecastCardProps {
  forecast: {
    date: string;
    dayName: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
    condition: string;
  };
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
  const weatherIcon = getWeatherIcon(forecast.weatherCode);

  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 border-sky-200 dark:border-sky-800 bg-gradient-to-br from-white to-sky-50 dark:from-slate-800 dark:to-blue-950">
      <CardContent className="pt-6 pb-6 text-center space-y-3">
        <div className="font-semibold text-lg">{forecast.dayName}</div>
        <div className="text-sm text-muted-foreground">{forecast.date}</div>
        <img
          src={weatherIcon}
          alt={forecast.condition}
          className="h-16 w-16 mx-auto"
        />
        <div className="text-sm capitalize text-muted-foreground">
          {forecast.condition}
        </div>
        <div className="flex justify-center gap-3 text-lg">
          <span className="font-semibold text-sky-700 dark:text-sky-300">
            {Math.round(forecast.maxTemp)}°
          </span>
          <span className="text-muted-foreground">
            {Math.round(forecast.minTemp)}°
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
