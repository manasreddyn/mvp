import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Area, ComposedChart 
} from 'recharts';
import type { SensorReading } from '@/hooks/useIoTData';

interface RealTimeStreamChartProps {
  readings: SensorReading[];
  sensorType?: string;
  className?: string;
}

export function RealTimeStreamChart({ readings, sensorType, className }: RealTimeStreamChartProps) {
  const chartData = useMemo(() => {
    const filtered = sensorType 
      ? readings.filter(r => r.sensor_type === sensorType)
      : readings;
    
    return filtered
      .slice(0, 20)
      .reverse()
      .map((r, index) => ({
        time: new Date(r.timestamp).toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        value: r.value,
        quality: r.quality * 100,
        unit: r.unit,
        index,
      }));
  }, [readings, sensorType]);

  const unit = chartData[0]?.unit || '';

  return (
    <div className={cn('h-[200px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            opacity={0.3}
          />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [`${value.toFixed(2)} ${unit}`, 'Value']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#valueGradient)"
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
