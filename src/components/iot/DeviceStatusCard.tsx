import { cn } from '@/lib/utils';
import { Cpu, Activity, AlertTriangle, Wrench, Wifi, WifiOff } from 'lucide-react';
import type { IoTDevice } from '@/hooks/useIoTData';

interface DeviceStatusCardProps {
  device: IoTDevice;
  onClick?: () => void;
}

const statusConfig = {
  active: { color: 'text-success', bg: 'bg-success/10', icon: Wifi, label: 'Active' },
  inactive: { color: 'text-muted-foreground', bg: 'bg-muted', icon: WifiOff, label: 'Inactive' },
  maintenance: { color: 'text-warning', bg: 'bg-warning/10', icon: Wrench, label: 'Maintenance' },
  error: { color: 'text-destructive', bg: 'bg-destructive/10', icon: AlertTriangle, label: 'Error' },
};

const categoryIcons = {
  railway: '🚂',
  industrial: '🏭',
  environmental: '🌿',
  fleet: '🚛',
  healthcare: '🏥',
  energy: '⚡',
  smart_home: '🏠',
};

export function DeviceStatusCard({ device, onClick }: DeviceStatusCardProps) {
  const status = statusConfig[device.status];
  const StatusIcon = status.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm',
        'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300',
        'cursor-pointer'
      )}
    >
      {/* Status indicator pulse */}
      <div className={cn(
        'absolute top-3 right-3 h-2.5 w-2.5 rounded-full',
        device.status === 'active' && 'bg-success animate-pulse',
        device.status === 'error' && 'bg-destructive animate-pulse',
        device.status === 'maintenance' && 'bg-warning',
        device.status === 'inactive' && 'bg-muted-foreground'
      )} />

      <div className="flex items-start gap-3">
        {/* Device icon */}
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg text-lg',
          status.bg
        )}>
          {categoryIcons[device.category]}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
            {device.device_name}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {device.location?.zone || 'Unknown Zone'}
          </p>
        </div>
      </div>

      {/* Device info */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className={cn('flex items-center gap-1', status.color)}>
          <StatusIcon className="h-3 w-3" />
          <span>{status.label}</span>
        </div>
        <span className="text-muted-foreground">
          v{device.firmware_version || 'N/A'}
        </span>
      </div>

      {/* Last seen */}
      <div className="mt-2 text-xs text-muted-foreground">
        Last seen: {new Date(device.last_seen).toLocaleTimeString('en-IN')}
      </div>
    </div>
  );
}
