export function getWeatherIcon(weatherCode: number): string {
  // Weather code mapping based on WMO Weather interpretation codes
  // 0: Clear sky
  // 1-3: Mainly clear, partly cloudy, and overcast
  // 45, 48: Fog
  // 51-67: Rain (various intensities)
  // 71-77: Snow
  // 80-82: Rain showers
  // 85-86: Snow showers
  // 95-99: Thunderstorm

  if (weatherCode === 0) {
    return '/assets/generated/sunny-icon.dim_64x64.png';
  } else if (weatherCode >= 1 && weatherCode <= 3) {
    return '/assets/generated/partly-cloudy-icon.dim_64x64.png';
  } else if (weatherCode >= 45 && weatherCode <= 48) {
    return '/assets/generated/cloudy-icon.dim_64x64.png';
  } else if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    return '/assets/generated/rainy-icon.dim_64x64.png';
  } else if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
    return '/assets/generated/snowy-icon.dim_64x64.png';
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    return '/assets/generated/thunderstorm-icon.dim_64x64.png';
  }

  return '/assets/generated/cloudy-icon.dim_64x64.png';
}
