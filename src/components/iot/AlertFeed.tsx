import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { IoTAlert } from '@/hooks/useIoTData';
import { formatDistanceToNow } from 'date-fns';

interface AlertFeedProps {
  alerts: IoTAlert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

const alertTypeConfig = {
  critical: { 
    icon: AlertTriangle, 
    color: 'text-destructive', 
    bg: 'bg-destructive/10',
    border: 'border-destructive/30'
  },
  warning: { 
    icon: AlertCircle, 
    color: 'text-warning', 
    bg: 'bg-warning/10',
    border: 'border-warning/30'
  },
  info: { 
    icon: Info, 
    color: 'text-info', 
    bg: 'bg-info/10',
    border: 'border-info/30'
  },
};

export function AlertFeed({ alerts, onAcknowledge, onResolve }: AlertFeedProps) {
  const activeAlerts = alerts.filter(a => !a.resolved_at);

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
      {activeAlerts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Check className="h-10 w-10 mx-auto mb-2 text-success" />
          <p className="text-sm">No active alerts</p>
        </div>
      ) : (
        activeAlerts.map((alert, index) => {
          const config = alertTypeConfig[alert.alert_type];
          const Icon = config.icon;
          
          return (
            <div
              key={alert.id}
              className={cn(
                'p-4 rounded-lg border animate-fade-in',
                config.bg,
                config.border,
                !alert.is_acknowledged && 'ring-1 ring-offset-1',
                alert.alert_type === 'critical' && !alert.is_acknowledged && 'ring-destructive/50'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={cn('p-1.5 rounded-lg', config.bg)}>
                  <Icon className={cn('h-4 w-4', config.color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <Badge variant="outline" className={cn('text-[10px]', config.color)}>
                      Severity: {alert.severity}/10
                    </Badge>
                  </div>
                  
                  {alert.message && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {alert.message}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                {!alert.is_acknowledged && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => onAcknowledge(alert.id)}
                  >
                    Acknowledge
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-7 text-xs"
                  onClick={() => onResolve(alert.id)}
                >
                  Resolve
                </Button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
