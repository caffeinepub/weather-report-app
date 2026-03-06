import { useQuery } from '@tanstack/react-query';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  weatherCode: number;
  visibility: number;
  pressure: number;
}

interface ForecastDay {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  condition: string;
}

interface Location {
  lat: number;
  lon: number;
  name: string;
}

const getWeatherCondition = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 67) return 'Rainy';
  if (code <= 77) return 'Snowy';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

const fetchWeatherData = async (location: Location): Promise<{ current: WeatherData; forecast: ForecastDay[] }> => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();

  const current: WeatherData = {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    condition: getWeatherCondition(data.current.weather_code),
    visibility: data.current.visibility || 10000,
    pressure: data.current.surface_pressure,
  };

  const forecast: ForecastDay[] = data.daily.time.slice(0, 5).map((date: string, index: number) => {
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      date: formattedDate,
      dayName,
      maxTemp: data.daily.temperature_2m_max[index],
      minTemp: data.daily.temperature_2m_min[index],
      weatherCode: data.daily.weather_code[index],
      condition: getWeatherCondition(data.daily.weather_code[index]),
    };
  });

  return { current, forecast };
};

export function useWeather(location: Location | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weather', location?.lat, location?.lon],
    queryFn: () => fetchWeatherData(location!),
    enabled: !!location,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    currentWeather: data?.current,
    forecast: data?.forecast,
    isLoading,
    error,
  };
}
