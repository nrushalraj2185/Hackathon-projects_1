import { useGetWeatherCurrent, useGetWeatherForecast, useGetWeatherAlerts } from '@workspace/api-client-react';
import { CloudSun, Droplets, Wind, Eye, Thermometer, Sun, AlertTriangle } from 'lucide-react';

const severityColors: Record<string, string> = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
};

export default function Weather() {
  const { data: current, isLoading } = useGetWeatherCurrent();
  const { data: forecast } = useGetWeatherForecast();
  const { data: weatherAlerts } = useGetWeatherAlerts();

  if (isLoading) {
    return <div className="flex items-center justify-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;
  }

  const mockCurrent = current || { location: 'Punjab, India', temperature: 28, humidity: 65, rainfall: 2.5, windSpeed: 12, condition: 'Partly Cloudy', icon: '⛅', feelsLike: 31, uvIndex: 6, visibility: 10, updatedAt: new Date().toISOString() };
  const mockForecast = forecast || [
    { date: '2026-03-20', high: 30, low: 18, rainfall: 0, condition: 'Sunny', icon: '☀️', humidity: 55, recommendation: 'Good day for fieldwork' },
    { date: '2026-03-21', high: 28, low: 17, rainfall: 5, condition: 'Partly Cloudy', icon: '⛅', humidity: 65, recommendation: 'Hold off on pesticides' },
    { date: '2026-03-22', high: 22, low: 15, rainfall: 25, condition: 'Heavy Rain', icon: '🌧️', humidity: 85, recommendation: 'Avoid fieldwork, check drainage' },
    { date: '2026-03-23', high: 24, low: 16, rainfall: 10, condition: 'Light Rain', icon: '🌦️', humidity: 78, recommendation: 'Good for transplanting seedlings' },
    { date: '2026-03-24', high: 27, low: 17, rainfall: 0, condition: 'Sunny', icon: '☀️', humidity: 58, recommendation: 'Excellent for harvesting' },
    { date: '2026-03-25', high: 29, low: 18, rainfall: 0, condition: 'Clear', icon: '🌤️', humidity: 52, recommendation: 'Good for spraying and fertilizing' },
    { date: '2026-03-26', high: 31, low: 20, rainfall: 0, condition: 'Hot', icon: '🌡️', humidity: 45, recommendation: 'Extra irrigation needed' },
  ];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Weather & Forecast</h1>
        <p className="text-muted-foreground mt-1">{mockCurrent.location} · Updated {new Date(mockCurrent.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      {/* Current Weather */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-4">
              <span className="text-7xl">{mockCurrent.icon || '⛅'}</span>
              <div>
                <div className="text-7xl font-bold leading-none">{mockCurrent.temperature}°</div>
                <div className="text-blue-200 text-xl mt-1">{mockCurrent.condition}</div>
              </div>
            </div>
            <div className="mt-4 text-blue-100">Feels like {mockCurrent.feelsLike || mockCurrent.temperature + 3}°C</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { icon: Droplets, label: 'Humidity', value: `${mockCurrent.humidity}%` },
              { icon: Wind, label: 'Wind', value: `${mockCurrent.windSpeed || 12} km/h` },
              { icon: Eye, label: 'Visibility', value: `${mockCurrent.visibility || 10} km` },
              { icon: Sun, label: 'UV Index', value: String(mockCurrent.uvIndex || 6) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <Icon className="w-5 h-5 text-blue-200 mb-1" />
                <div className="text-blue-200 text-xs">{label}</div>
                <div className="font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather Alerts */}
      {weatherAlerts && weatherAlerts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-500" /> Active Alerts</h2>
          <div className="space-y-3">
            {weatherAlerts.map((alert: any) => (
              <div key={alert.id} className={`border rounded-xl p-4 ${severityColors[alert.severity] || 'bg-gray-100'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full border ${severityColors[alert.severity]} mr-2`}>{alert.severity}</span>
                    <span className="font-semibold">{alert.title}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm">{alert.description}</p>
                {alert.validFrom && <p className="mt-1 text-xs opacity-70">Valid: {new Date(alert.validFrom).toLocaleDateString()} – {new Date(alert.validUntil || alert.validFrom).toLocaleDateString()}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      <div>
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><CloudSun className="w-5 h-5 text-primary" /> 7-Day Forecast</h2>
        <div className="grid grid-cols-1 gap-3">
          {mockForecast.map((day: any) => (
            <div key={day.date} className="bg-card border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-32 shrink-0">
                <div className="font-medium">{formatDate(day.date)}</div>
              </div>
              <div className="flex items-center gap-3 w-24 shrink-0">
                <span className="text-2xl">{day.icon || '🌤️'}</span>
                <span className="text-sm text-muted-foreground">{day.condition}</span>
              </div>
              <div className="flex gap-4 text-sm shrink-0">
                <span className="font-semibold text-red-500">{day.high}°</span>
                <span className="text-blue-500">{day.low}°</span>
                {day.rainfall > 0 && <span className="text-blue-400 flex items-center gap-1"><Droplets className="w-3 h-3" />{day.rainfall}mm</span>}
                <span className="text-muted-foreground"><Droplets className="w-3 h-3 inline mr-1" />{day.humidity}%</span>
              </div>
              {day.recommendation && (
                <div className="flex-1 text-sm bg-green-50 border border-green-100 text-green-800 rounded-lg px-3 py-1.5">
                  💡 {day.recommendation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
