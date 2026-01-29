import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { generatePlatformData } from '@/lib/mockData';

const data = generatePlatformData();
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(210 60% 50%)',
  'hsl(280 55% 50%)',
  'hsl(45 90% 50%)',
];

const pieData = data.map((item) => ({
  name: item.station.name,
  value: item.trainsScheduled,
}));

export function PlatformUtilizationChart() {
  return (
    <div className="chart-container">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Train Distribution</h3>
        <p className="text-sm text-muted-foreground">By major stations today</p>
      </div>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {pieData.slice(0, 5).map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
