import { useState } from 'react';
import { Zap, AlertTriangle, TrendingUp, Battery, Gauge, Map } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts';
import { generatePowerData } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const powerData = generatePowerData(48);

// Anomaly data for scatter plot
const anomalyData = Array.from({ length: 50 }, (_, i) => ({
  voltage: 24500 + Math.random() * 1500,
  current: 700 + Math.random() * 600,
  anomaly: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'leakage' : 'surge') : 'normal',
  severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
}));

const getAnomalyColor = (anomaly: string) => {
  switch (anomaly) {
    case 'leakage':
      return 'hsl(var(--destructive))';
    case 'surge':
      return 'hsl(var(--warning))';
    default:
      return 'hsl(var(--success))';
  }
};

// Maintenance timeline data
const maintenanceData = [
  { date: '2026-01-20', type: 'completed', description: 'Transformer inspection - NR Zone' },
  { date: '2026-01-25', type: 'completed', description: 'Cable replacement - BCT Station' },
  { date: '2026-02-01', type: 'scheduled', description: 'Substation maintenance - Delhi' },
  { date: '2026-02-10', type: 'predicted', description: 'Transformer replacement (75% failure probability)' },
  { date: '2026-02-15', type: 'scheduled', description: 'Grid synchronization test' },
];

export default function PowerAnalytics() {
  const [timeRange, setTimeRange] = useState('24h');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Power & Electricity Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time power consumption, anomaly detection, and predictive maintenance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Data
          </Button>
          <Button size="sm">
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Draw"
          value="847"
          unit="MWh"
          change={-3.2}
          trend="down"
          icon={Zap}
          iconColor="text-warning"
        />
        <MetricCard
          title="Active Anomalies"
          value="12"
          change={4}
          trend="up"
          icon={AlertTriangle}
          iconColor="text-destructive"
        />
        <MetricCard
          title="Power Factor"
          value="0.92"
          change={2.1}
          trend="up"
          icon={Gauge}
          iconColor="text-success"
        />
        <MetricCard
          title="Grid Efficiency"
          value="94.7"
          unit="%"
          change={0.8}
          trend="up"
          icon={TrendingUp}
          iconColor="text-primary"
        />
      </div>

      {/* Main Chart */}
      <div className="chart-container">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Real-time Power Consumption</h3>
            <p className="text-sm text-muted-foreground">Power draw by train category</p>
          </div>
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="6h">6H</TabsTrigger>
              <TabsTrigger value="24h">24H</TabsTrigger>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={powerData}>
            <defs>
              <linearGradient id="powerExpress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="powerFreight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="powerLocal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="hour"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `${value}:00`}
            />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="express"
              stackId="1"
              stroke="hsl(var(--chart-1))"
              fill="url(#powerExpress)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="freight"
              stackId="1"
              stroke="hsl(var(--chart-2))"
              fill="url(#powerFreight)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="local"
              stackId="1"
              stroke="hsl(var(--chart-3))"
              fill="url(#powerLocal)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Anomaly Detection & Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Scatter Plot */}
        <div className="chart-container">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Anomaly Detection</h3>
            <p className="text-sm text-muted-foreground">Voltage vs Current analysis</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="voltage"
                name="Voltage"
                unit="V"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis
                dataKey="current"
                name="Current"
                unit="A"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Scatter name="Readings" data={anomalyData}>
                {anomalyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getAnomalyColor(entry.anomaly)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-warning" />
              <span className="text-sm text-muted-foreground">Surge</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive" />
              <span className="text-sm text-muted-foreground">Leakage</span>
            </div>
          </div>
        </div>

        {/* Predictive Maintenance Timeline */}
        <div className="chart-container">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Maintenance Timeline</h3>
            <p className="text-sm text-muted-foreground">Scheduled and predicted maintenance</p>
          </div>
          <div className="space-y-4">
            {maintenanceData.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      item.type === 'completed'
                        ? 'bg-success'
                        : item.type === 'scheduled'
                        ? 'bg-info'
                        : 'bg-warning'
                    }`}
                  />
                  {index < maintenanceData.length - 1 && (
                    <div className="w-0.5 h-12 bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {new Date(item.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        item.type === 'completed'
                          ? 'bg-success/10 text-success'
                          : item.type === 'scheduled'
                          ? 'bg-info/10 text-info'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone-wise Grid */}
      <div className="chart-container">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Zone-wise Power Distribution</h3>
          <p className="text-sm text-muted-foreground">Current power consumption by railway zone</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { zone: 'Northern Railway', consumption: 245, status: 'normal' },
            { zone: 'Western Railway', consumption: 312, status: 'high' },
            { zone: 'Southern Railway', consumption: 198, status: 'normal' },
            { zone: 'Eastern Railway', consumption: 167, status: 'low' },
            { zone: 'Central Railway', consumption: 289, status: 'normal' },
            { zone: 'South Eastern', consumption: 156, status: 'low' },
            { zone: 'South Central', consumption: 223, status: 'normal' },
            { zone: 'Northeast Frontier', consumption: 98, status: 'low' },
          ].map((zone) => (
            <div
              key={zone.zone}
              className={`p-4 rounded-lg border ${
                zone.status === 'high'
                  ? 'border-warning bg-warning/5'
                  : zone.status === 'low'
                  ? 'border-info bg-info/5'
                  : 'border-border bg-muted/30'
              }`}
            >
              <p className="text-sm text-muted-foreground">{zone.zone}</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono">{zone.consumption}</span>
                <span className="text-sm text-muted-foreground">MWh</span>
              </div>
              <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    zone.status === 'high'
                      ? 'bg-warning'
                      : zone.status === 'low'
                      ? 'bg-info'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${(zone.consumption / 350) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
