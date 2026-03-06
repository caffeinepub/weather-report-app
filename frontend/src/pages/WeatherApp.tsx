import { useState, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useWeather } from '@/hooks/useQueries';
import WeatherCard from '@/components/WeatherCard';
import ForecastCard from '@/components/ForecastCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WeatherApp() {
  const [searchCity, setSearchCity] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const { currentWeather, forecast, isLoading, error } = useWeather(location);

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    toast.info('Detecting your location...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const cityName = await getCityName(latitude, longitude);
          setLocation({ lat: latitude, lon: longitude, name: cityName });
          toast.success(`Location detected: ${cityName}`);
        } catch (err) {
          toast.error('Failed to get city name');
        }
      },
      (err) => {
        toast.error('Unable to retrieve your location. Please search for a city.');
        console.error(err);
      }
    );
  };

  const getCityName = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.address?.city || data.address?.town || data.address?.village || 'Unknown Location';
    } catch (err) {
      return 'Unknown Location';
    }
  };

  const searchCityCoordinates = async (cityName: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const simpleName = display_name.split(',')[0];
        setLocation({ lat: parseFloat(lat), lon: parseFloat(lon), name: simpleName });
        toast.success(`Weather loaded for ${simpleName}`);
      } else {
        toast.error('City not found. Please try another name.');
      }
    } catch (err) {
      toast.error('Failed to search city');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      searchCityCoordinates(searchCity.trim());
      setSearchCity('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="/assets/generated/weather-hero-banner.dim_800x400.png" 
            alt="Weather Banner" 
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Weather Report</h1>
              <p className="text-lg md:text-xl opacity-90">Get accurate weather forecasts for any location</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 shadow-lg border-2 border-sky-200 dark:border-sky-800">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for a city..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button type="submit" size="lg" className="px-8 bg-sky-600 hover:bg-sky-700">
                Search
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={detectLocation}
                className="px-6 border-sky-300 hover:bg-sky-50 dark:border-sky-700 dark:hover:bg-sky-950"
              >
                <MapPin className="h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-destructive">
            <CardContent className="pt-6">
              <p className="text-center text-destructive">Failed to load weather data. Please try again.</p>
            </CardContent>
          </Card>
        )}

        {/* Weather Display */}
        {!isLoading && !error && currentWeather && forecast && (
          <div className="space-y-8">
            {/* Current Weather */}
            <WeatherCard weather={currentWeather} locationName={location?.name || 'Unknown'} />

            {/* 5-Day Forecast */}
            <Card className="shadow-lg border-2 border-sky-200 dark:border-sky-800">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span>5-Day Forecast</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {forecast.map((day, index) => (
                    <ForecastCard key={index} forecast={day} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Initial State */}
        {!isLoading && !error && !currentWeather && (
          <Card className="shadow-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Location Selected</h3>
              <p className="text-muted-foreground">
                Search for a city or allow location access to see weather information
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
