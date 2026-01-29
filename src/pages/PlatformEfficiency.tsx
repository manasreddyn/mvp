import {
  Activity,
  Clock,
  Train,
  Users,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { generatePlatformData, majorStations } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

const platformData = generatePlatformData();

export default function PlatformEfficiency() {
  const avgUtilization = Math.round(
    platformData.reduce((acc, p) => acc + p.utilizationRate, 0) / platformData.length
  );
  const avgOnTime = Math.round(
    platformData.reduce((acc, p) => acc + p.onTimePerformance, 0) / platformData.length
  );
  const totalTrains = platformData.reduce((acc, p) => acc + p.trainsScheduled, 0);
  const totalDelayed = platformData.reduce((acc, p) => acc + p.trainsDelayed, 0);

  const getUtilizationColor = (rate: number) => {
    if (rate > 85) return 'hsl(var(--destructive))';
    if (rate > 70) return 'hsl(var(--warning))';
    return 'hsl(var(--success))';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Efficiency</h1>
          <p className="text-muted-foreground">
            Station platform utilization and train scheduling optimization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">
            Optimize Schedule
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Avg. Utilization"
          value={avgUtilization}
          unit="%"
          change={2.4}
          trend="up"
          icon={Activity}
          iconColor="text-primary"
        />
        <MetricCard
          title="On-Time Performance"
          value={avgOnTime}
          unit="%"
          change={-1.2}
          trend="down"
          icon={Clock}
          iconColor="text-warning"
        />
        <MetricCard
          title="Total Trains Today"
          value={totalTrains}
          icon={Train}
          iconColor="text-info"
        />
        <MetricCard
          title="Delayed Trains"
          value={totalDelayed}
          icon={AlertTriangle}
          iconColor="text-destructive"
        />
      </div>

      {/* Utilization Chart */}
      <div className="chart-container">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Platform Utilization by Station</h3>
            <p className="text-sm text-muted-foreground">Current capacity usage across major stations</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-success" />
              <span className="text-muted-foreground">Optimal (&lt;70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-warning" />
              <span className="text-muted-foreground">High (70-85%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Critical (&gt;85%)</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={platformData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              dataKey="station.name"
              type="category"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value}%`, 'Utilization']}
            />
            <Bar dataKey="utilizationRate" radius={[0, 4, 4, 0]}>
              {platformData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getUtilizationColor(entry.utilizationRate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformData.map((station) => (
          <Card key={station.station.code} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{station.station.name}</span>
                <Badge variant="outline">{station.station.code}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Platforms</span>
                <span className="font-medium">{station.platforms}</span>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Utilization</span>
                  <span className={cn(
                    'font-medium',
                    station.utilizationRate > 85 ? 'text-destructive' :
                    station.utilizationRate > 70 ? 'text-warning' : 'text-success'
                  )}>
                    {station.utilizationRate}%
                  </span>
                </div>
                <Progress
                  value={station.utilizationRate}
                  className={cn(
                    'h-2',
                    station.utilizationRate > 85 ? '[&>div]:bg-destructive' :
                    station.utilizationRate > 70 ? '[&>div]:bg-warning' : '[&>div]:bg-success'
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                <div className="text-center">
                  <p className="text-lg font-bold">{station.trainsScheduled}</p>
                  <p className="text-xs text-muted-foreground">Trains</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-success">{station.onTimePerformance}%</p>
                  <p className="text-xs text-muted-foreground">On-Time</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Peak Load</span>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono">{station.peakLoad.toLocaleString()}</span>
                </div>
              </div>

              {station.trainsDelayed > 5 && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">
                    {station.trainsDelayed} trains delayed
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottleneck Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                station: 'Mumbai Central',
                issue: 'Peak hour congestion detected between 8-10 AM',
                recommendation: 'Redistribute 3 trains to Platform 5-6',
                impact: '+15% efficiency',
                priority: 'high',
              },
              {
                station: 'Howrah Junction',
                issue: 'Average dwell time 18 mins (target: 12 mins)',
                recommendation: 'Implement parallel boarding system',
                impact: '-6 mins dwell time',
                priority: 'medium',
              },
              {
                station: 'Chennai Central',
                issue: 'Underutilized platforms 9-12 during afternoon',
                recommendation: 'Route additional services to balance load',
                impact: '+22% utilization',
                priority: 'low',
              },
            ].map((item) => (
              <div
                key={item.station}
                className={cn(
                  'p-4 rounded-lg border-l-4',
                  item.priority === 'high' && 'border-l-destructive bg-destructive/5',
                  item.priority === 'medium' && 'border-l-warning bg-warning/5',
                  item.priority === 'low' && 'border-l-info bg-info/5'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{item.station}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.issue}</p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Recommendation:</span> {item.recommendation}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={cn(
                      item.priority === 'high' && 'bg-destructive text-destructive-foreground',
                      item.priority === 'medium' && 'bg-warning text-warning-foreground',
                      item.priority === 'low' && 'bg-info text-info-foreground'
                    )}>
                      {item.priority} priority
                    </Badge>
                    <p className="text-sm font-medium text-success mt-2">{item.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
