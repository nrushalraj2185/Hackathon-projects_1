import { Router } from "express";

const router = Router();

const weatherData = {
  location: "Punjab, India",
  temperature: 28,
  humidity: 65,
  rainfall: 2.5,
  windSpeed: 12,
  condition: "Partly Cloudy",
  icon: "⛅",
  feelsLike: 31,
  uvIndex: 6,
  visibility: 10,
  updatedAt: new Date().toISOString(),
};

const forecastData = [
  { date: "2026-03-20", high: 30, low: 18, rainfall: 0, condition: "Sunny", icon: "☀️", humidity: 55, recommendation: "Good day for fieldwork and irrigation" },
  { date: "2026-03-21", high: 28, low: 17, rainfall: 5, condition: "Partly Cloudy", icon: "⛅", humidity: 65, recommendation: "Light rain expected, hold off on pesticides" },
  { date: "2026-03-22", high: 22, low: 15, rainfall: 25, condition: "Heavy Rain", icon: "🌧️", humidity: 85, recommendation: "Avoid fieldwork, check drainage channels" },
  { date: "2026-03-23", high: 24, low: 16, rainfall: 10, condition: "Light Rain", icon: "🌦️", humidity: 78, recommendation: "Good for transplanting seedlings after rain" },
  { date: "2026-03-24", high: 27, low: 17, rainfall: 0, condition: "Sunny", icon: "☀️", humidity: 58, recommendation: "Excellent day for harvesting and crop inspection" },
  { date: "2026-03-25", high: 29, low: 18, rainfall: 0, condition: "Clear", icon: "🌤️", humidity: 52, recommendation: "Good conditions for spraying and fertilizing" },
  { date: "2026-03-26", high: 31, low: 20, rainfall: 0, condition: "Hot", icon: "🌡️", humidity: 45, recommendation: "Extra irrigation needed, heat stress risk" },
];

const alertsData = [
  { id: 1, type: "weather", severity: "high", title: "Heavy Rain Alert", description: "Heavy rainfall of 25-30mm expected on March 22. Ensure drainage channels are clear.", validFrom: "2026-03-22T06:00:00Z", validUntil: "2026-03-22T18:00:00Z" },
  { id: 2, type: "weather", severity: "medium", title: "High Temperature Warning", description: "Temperatures may exceed 38°C this weekend. Increase irrigation frequency.", validFrom: "2026-03-25T10:00:00Z", validUntil: "2026-03-26T18:00:00Z" },
];

router.get("/current", (_req, res) => {
  res.json({ ...weatherData, updatedAt: new Date().toISOString() });
});

router.get("/forecast", (_req, res) => {
  res.json(forecastData);
});

router.get("/alerts", (_req, res) => {
  res.json(alertsData);
});

export default router;
