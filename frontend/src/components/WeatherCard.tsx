import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Wind, Eye, Gauge } from 'lucide-react';
import { getWeatherIcon } from '@/lib/weatherUtils';

interface WeatherCardProps {
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    weatherCode: number;
    visibility: number;
    pressure: number;
  };
  locationName: string;
}

export default function WeatherCard({ weather, locationName }: WeatherCardProps) {
  const weatherIcon = getWeatherIcon(weather.weatherCode);

  return (
    <Card className="shadow-2xl border-2 border-sky-200 dark:border-sky-800 bg-gradient-to-br from-white to-sky-50 dark:from-slate-800 dark:to-blue-950">
      <CardHeader>
        <CardTitle className="text-3xl flex items-center gap-3">
          <img src="/assets/generated/location-pin.dim_32x32.png" alt="Location" className="h-8 w-8" />
          {locationName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Temperature and Condition */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <img src={weatherIcon} alt={weather.condition} className="h-32 w-32" />
            <div>
              <div className="text-6xl font-bold text-sky-700 dark:text-sky-300">
                {Math.round(weather.temperature)}°C
              </div>
              <div className="text-2xl text-muted-foreground mt-2 capitalize">
                {weather.condition}
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
              <Droplets className="h-8 w-8 text-blue-500" />
              <div className="text-sm text-muted-foreground">Humidity</div>
              <div className="text-2xl font-semibold">{weather.humidity}%</div>
            </div>

            <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
              <Wind className="h-8 w-8 text-teal-500" />
              <div className="text-sm text-muted-foreground">Wind Speed</div>
              <div className="text-2xl font-semibold">{weather.windSpeed} km/h</div>
            </div>

            <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
              <Eye className="h-8 w-8 text-purple-500" />
              <div className="text-sm text-muted-foreground">Visibility</div>
              <div className="text-2xl font-semibold">{(weather.visibility / 1000).toFixed(1)} km</div>
            </div>

            <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
              <Gauge className="h-8 w-8 text-orange-500" />
              <div className="text-sm text-muted-foreground">Pressure</div>
              <div className="text-2xl font-semibold">{weather.pressure} hPa</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
