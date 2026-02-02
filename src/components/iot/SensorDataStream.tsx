import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, Wifi, WifiOff } from 'lucide-react';
import type { SensorReading, IoTDevice } from '@/hooks/useIoTData';
import { formatDistanceToNow } from 'date-fns';

interface SensorDataStreamProps {
  readings: SensorReading[];
  devices: IoTDevice[];
  limit?: number;
}

export function SensorDataStream({ readings, devices, limit = 10 }: SensorDataStreamProps) {
  const deviceMap = useMemo(() => {
    return devices.reduce((acc, d) => {
      acc[d.id] = d;
      return acc;
    }, {} as Record<string, IoTDevice>);
  }, [devices]);

  const recentReadings = readings.slice(0, limit);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[200px]">Device</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Unit</TableHead>
            <TableHead className="text-center">Quality</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentReadings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Waiting for sensor data...</p>
              </TableCell>
            </TableRow>
          ) : (
            recentReadings.map((reading, index) => {
              const device = deviceMap[reading.device_id];
              const qualityPercent = Math.round(reading.quality * 100);
              
              return (
                <TableRow 
                  key={reading.id}
                  className={cn(
                    'animate-fade-in',
                    index === 0 && 'bg-primary/5'
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {device?.status === 'active' ? (
                        <Wifi className="h-3 w-3 text-success" />
                      ) : (
                        <WifiOff className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className="truncate max-w-[150px]">
                        {device?.device_name || 'Unknown Device'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {reading.sensor_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {reading.value.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {reading.unit}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs',
                      qualityPercent >= 90 ? 'bg-success/10 text-success' :
                      qualityPercent >= 70 ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    )}>
                      {qualityPercent}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(reading.timestamp), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
