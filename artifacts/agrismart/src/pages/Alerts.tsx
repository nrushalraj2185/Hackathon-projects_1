import { useGetAlerts, useMarkAlertRead } from '@workspace/api-client-react';
import { Bell, AlertTriangle, CloudRain, Bug, Droplets, TrendingUp, Tractor, CheckCircle } from 'lucide-react';

const typeIcons: Record<string, any> = {
  weather: CloudRain,
  pest: Bug,
  irrigation: Droplets,
  market: TrendingUp,
  equipment: Tractor,
  transport: Tractor,
  general: Bell,
};

const severityConfig: Record<string, { bg: string; border: string; badge: string }> = {
  critical: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
  warning: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
};

export default function Alerts() {
  const { data: alerts, isLoading, refetch } = useGetAlerts();
  const { mutateAsync: markRead } = useMarkAlertRead();

  const handleMarkRead = async (id: number) => {
    await markRead({ id });
    refetch();
  };

  if (isLoading) return <div className="flex items-center justify-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  const unread = (alerts || []).filter((a: any) => !a.isRead);
  const read = (alerts || []).filter((a: any) => a.isRead);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Bell className="w-8 h-8 text-primary" /> Alerts & Notifications</h1>
          <p className="text-muted-foreground mt-1">{unread.length} unread · {(alerts || []).length} total</p>
        </div>
        {unread.length > 0 && (
          <button onClick={async () => { for (const a of unread) await markRead({ id: a.id }); refetch(); }} className="text-sm text-primary hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {unread.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-500" /> Unread ({unread.length})</h2>
          <div className="space-y-3">
            {unread.map((alert: any) => {
              const Icon = typeIcons[alert.type] || Bell;
              const config = severityConfig[alert.severity] || severityConfig.info;
              return (
                <div key={alert.id} className={`border-2 rounded-2xl p-4 ${config.bg} ${config.border}`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl ${config.badge.split(' ')[0]} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full mr-2 ${config.badge}`}>{alert.severity}</span>
                          <span className="font-semibold">{alert.title}</span>
                        </div>
                        <button onClick={() => handleMarkRead(alert.id)} className="shrink-0 text-muted-foreground hover:text-foreground transition p-1" title="Mark as read">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="mt-1.5 text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(alert.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-3 text-muted-foreground">Read ({read.length})</h2>
          <div className="space-y-2">
            {read.map((alert: any) => {
              const Icon = typeIcons[alert.type] || Bell;
              return (
                <div key={alert.id} className="bg-card border rounded-xl p-4 opacity-60">
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-sm">{alert.title}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(!alerts || alerts.length === 0) && (
        <div className="text-center py-16 text-muted-foreground">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No alerts</p>
          <p className="text-sm">Your farm is running smoothly</p>
        </div>
      )}
    </div>
  );
}
