export function getWeatherIcon(weatherCode: number): string {
  if (weatherCode === 0) {
    return "/assets/generated/sunny-icon.dim_64x64.png";
  }
  if (weatherCode >= 1 && weatherCode <= 3) {
    return "/assets/generated/partly-cloudy-icon.dim_64x64.png";
  }
  if (weatherCode >= 45 && weatherCode <= 48) {
    return "/assets/generated/cloudy-icon.dim_64x64.png";
  }
  if (
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82)
  ) {
    return "/assets/generated/rainy-icon.dim_64x64.png";
  }
  if (
    (weatherCode >= 71 && weatherCode <= 77) ||
    (weatherCode >= 85 && weatherCode <= 86)
  ) {
    return "/assets/generated/snowy-icon.dim_64x64.png";
  }
  if (weatherCode >= 95 && weatherCode <= 99) {
    return "/assets/generated/thunderstorm-icon.dim_64x64.png";
  }

  return "/assets/generated/cloudy-icon.dim_64x64.png";
}
