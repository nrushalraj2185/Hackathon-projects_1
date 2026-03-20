import { useGetFarmSummary, useGetWeatherCurrent, useGetAlerts, useGetCrops } from '@workspace/api-client-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CloudSun, CloudRain, Droplets, ArrowUpRight, ArrowDownRight, Sprout, AlertTriangle, ChevronRight, Bell } from 'lucide-react';
import { Link } from 'wouter';

export default function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetFarmSummary();
  const { data: weather } = useGetWeatherCurrent();
  const { data: alerts } = useGetAlerts({ unread: true });
  const { data: crops } = useGetCrops();

  if (isLoadingSummary) {
    return <div className="flex items-center justify-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  // Mock data if API fails to provide chart data
  const mockChartData = [
    { month: 'Jan', income: 4000, expense: 2400 },
    { month: 'Feb', income: 3000, expense: 1398 },
    { month: 'Mar', income: 2000, expense: 9800 },
    { month: 'Apr', income: 2780, expense: 3908 },
    { month: 'May', income: 1890, expense: 4800 },
    { month: 'Jun', income: 2390, expense: 3800 },
    { month: 'Jul', income: 3490, expense: 4300 },
  ];

  const chartData = summary?.monthlyIncome?.map((inc, i) => ({
    month: inc.month,
    income: inc.amount,
    expense: summary.monthlyExpenses?.[i]?.amount || 0
  })) || mockChartData;

  const activeAlerts = alerts?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Weather Widget */}
        <div className="md:w-1/3 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-primary-foreground/80">Current Weather</h3>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{weather?.location || 'Farm Location'}</span>
              </div>
              <div className="flex items-end gap-4">
                <CloudSun className="w-16 h-16 drop-shadow-md" />
                <div>
                  <div className="text-5xl font-display font-bold">{weather?.temperature || 28}°C</div>
                  <div className="text-primary-foreground/80 capitalize">{weather?.condition || 'Partly Cloudy'}</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8 bg-black/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-200" />
                <div>
                  <div className="text-xs text-primary-foreground/70">Humidity</div>
                  <div className="font-semibold">{weather?.humidity || 65}%</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-blue-200" />
                <div>
                  <div className="text-xs text-primary-foreground/70">Rainfall</div>
                  <div className="font-semibold">{weather?.rainfall || 0}mm</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 flex flex-col justify-center">
            <div className="text-sm font-medium text-muted-foreground mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-foreground">₹{(summary?.totalIncome || 450000).toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600 font-medium">
              <ArrowUpRight className="w-4 h-4" />
              <span>+12.5% from last season</span>
            </div>
          </div>
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 flex flex-col justify-center">
            <div className="text-sm font-medium text-muted-foreground mb-2">Total Expenses</div>
            <div className="text-3xl font-bold text-foreground">₹{(summary?.totalExpenses || 120000).toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-2 text-sm text-amber-600 font-medium">
              <ArrowDownRight className="w-4 h-4" />
              <span>-2.4% from last season</span>
            </div>
          </div>
          <div className="col-span-1 sm:col-span-2 bg-card rounded-3xl p-6 shadow-sm border border-border/50 h-48">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="income" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Crops */}
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-foreground">Active Crops</h3>
            <Link href="/crops" className="text-sm font-medium text-primary flex items-center hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {(crops?.slice(0, 3) || [{id:1, name:'Wheat', status:'growing', healthStatus:'excellent'}, {id:2, name:'Rice', status:'planted', healthStatus:'good'}]).map((crop: any) => (
              <div key={crop.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{crop.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{crop.status}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  crop.healthStatus === 'excellent' ? 'bg-green-100 text-green-700 border-green-200' :
                  crop.healthStatus === 'good' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                  'bg-amber-100 text-amber-700 border-amber-200'
                }`}>
                  {crop.healthStatus}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-foreground">Recent Alerts</h3>
            <Link href="/alerts" className="text-sm font-medium text-primary flex items-center hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {activeAlerts.length > 0 ? activeAlerts.map(alert => (
              <div key={alert.id} className="flex gap-4 p-4 rounded-2xl border border-border/50 hover:border-border transition-colors">
                <div className={`mt-1 p-2 rounded-full ${
                  alert.severity === 'critical' ? 'bg-destructive/10 text-destructive' :
                  alert.severity === 'warning' ? 'bg-amber-100 text-amber-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Bell className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p>No new alerts. Your farm is running smoothly.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
