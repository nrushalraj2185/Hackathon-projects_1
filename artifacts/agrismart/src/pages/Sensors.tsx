import { useState } from 'react';
import { useGetSensorReadings } from '@workspace/api-client-react';
import { Radio, Droplets, Thermometer, Zap, Wind } from 'lucide-react';

function GaugeCard({ label, value, unit, min, max, icon: Icon, color }: { label: string; value: number | null | undefined; unit: string; min: number; max: number; icon: any; color: string }) {
  const safeValue = value ?? 0;
  const pct = Math.min(100, Math.max(0, ((safeValue - min) / (max - min)) * 100));
  const status = pct < 25 ? 'Low' : pct > 75 ? 'High' : 'Optimal';
  const statusColor = pct < 25 ? 'text-blue-600' : pct > 75 ? 'text-red-600' : 'text-green-600';

  return (
    <div className="bg-card border rounded-2xl p-4 hover:shadow-md transition">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-xl ${color}`}><Icon className="w-4 h-4" /></div>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className="flex items-end gap-1 mb-2">
        <span className="text-3xl font-bold">{value !== null && value !== undefined ? safeValue.toFixed(1) : '--'}</span>
        <span className="text-muted-foreground text-sm mb-1">{unit}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 mb-1">
        <div className={`h-2 rounded-full transition-all ${pct < 25 ? 'bg-blue-500' : pct > 75 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}{unit}</span>
        <span className={`font-medium ${statusColor}`}>{status}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function Sensors() {
  const [selectedField, setSelectedField] = useState('field-1');
  const { data: readings, isLoading } = useGetSensorReadings({ fieldId: selectedField });

  const fields = [
    { id: 'field-1', name: 'North Field (Wheat)' },
    { id: 'field-2', name: 'South Field (Rice)' },
    { id: 'field-3', name: 'East Field (Cotton)' },
  ];

  const latestReading = readings?.[0];
  const mockReading = {
    soilMoisture: 62, soilPh: 6.8, soilTemperature: 24, nitrogen: 180,
    phosphorus: 45, potassium: 220, airTemperature: 28, airHumidity: 65, lightIntensity: 850,
    timestamp: new Date().toISOString(), fieldName: 'North Field (Wheat)'
  };
  const data = latestReading || mockReading;

  if (isLoading) return <div className="flex items-center justify-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><Radio className="w-8 h-8 text-primary" /> IoT Sensor Data</h1>
        <p className="text-muted-foreground mt-1">Real-time field sensor readings for precision agriculture</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {fields.map(f => (
          <button key={f.id} onClick={() => setSelectedField(f.id)} className={`px-4 py-2 rounded-full text-sm font-medium border transition ${selectedField === f.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'}`}>
            {f.name}
          </button>
        ))}
      </div>

      <div className="bg-muted/50 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="font-medium">{(data as any).fieldName || fields.find(f => f.id === selectedField)?.name}</p>
          <p className="text-xs text-muted-foreground">Last updated: {new Date((data as any).timestamp || Date.now()).toLocaleString('en-IN')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-600 font-medium">Live</span>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Soil Sensors</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <GaugeCard label="Soil Moisture" value={data.soilMoisture} unit="%" min={0} max={100} icon={Droplets} color="bg-blue-100 text-blue-600" />
          <GaugeCard label="Soil pH" value={data.soilPh} unit="" min={4} max={9} icon={Zap} color="bg-purple-100 text-purple-600" />
          <GaugeCard label="Soil Temperature" value={data.soilTemperature} unit="°C" min={10} max={45} icon={Thermometer} color="bg-orange-100 text-orange-600" />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Soil Nutrients (NPK)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <GaugeCard label="Nitrogen (N)" value={data.nitrogen} unit=" ppm" min={0} max={300} icon={Zap} color="bg-green-100 text-green-600" />
          <GaugeCard label="Phosphorus (P)" value={data.phosphorus} unit=" ppm" min={0} max={100} icon={Zap} color="bg-yellow-100 text-yellow-600" />
          <GaugeCard label="Potassium (K)" value={data.potassium} unit=" ppm" min={0} max={400} icon={Zap} color="bg-red-100 text-red-600" />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Atmospheric Sensors</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <GaugeCard label="Air Temperature" value={data.airTemperature} unit="°C" min={0} max={50} icon={Thermometer} color="bg-red-100 text-red-600" />
          <GaugeCard label="Air Humidity" value={data.airHumidity} unit="%" min={0} max={100} icon={Droplets} color="bg-blue-100 text-blue-600" />
          <GaugeCard label="Light Intensity" value={data.lightIntensity} unit=" lux" min={0} max={1200} icon={Wind} color="bg-amber-100 text-amber-600" />
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
        <h3 className="font-semibold text-amber-800 mb-2">Recommendations based on current readings</h3>
        <ul className="space-y-1 text-sm text-amber-700">
          {data.soilMoisture && data.soilMoisture < 50 && <li>💧 Soil moisture is low — irrigate within 24 hours</li>}
          {data.soilPh && (data.soilPh < 6 || data.soilPh > 7.5) && <li>⚗️ Soil pH is out of optimal range — consider lime or sulfur application</li>}
          {data.nitrogen && data.nitrogen < 100 && <li>🌱 Nitrogen levels are low — apply urea or organic fertilizer</li>}
          {data.soilMoisture && data.soilMoisture >= 50 && data.soilPh && data.soilPh >= 6 && data.soilPh <= 7.5 && <li>✅ Soil conditions are optimal — continue regular monitoring</li>}
        </ul>
      </div>
    </div>
  );
}
