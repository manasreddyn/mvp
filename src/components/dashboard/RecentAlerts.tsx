import { cn } from '@/lib/utils';
import { getRecentAlerts } from '@/lib/mockData';
import { AlertTriangle, CheckCircle, Info, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const alerts = getRecentAlerts();

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'critical':
      return <XCircle className="h-4 w-4 text-destructive" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-success" />;
    default:
      return <Info className="h-4 w-4 text-info" />;
  }
};

const getAlertBg = (type: string) => {
  switch (type) {
    case 'critical':
      return 'bg-destructive/5 border-l-destructive';
    case 'warning':
      return 'bg-warning/5 border-l-warning';
    case 'success':
      return 'bg-success/5 border-l-success';
    default:
      return 'bg-info/5 border-l-info';
  }
};

export function RecentAlerts() {
  return (
    <div className="chart-container">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Recent Alerts</h3>
          <p className="text-sm text-muted-foreground">Latest system notifications</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border-l-4 transition-all hover:translate-x-1',
              getAlertBg(alert.type)
            )}
          >
            {getAlertIcon(alert.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{alert.message}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{alert.time}</span>
                {alert.station && (
                  <>
                    <span>•</span>
                    <span>{alert.station}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
