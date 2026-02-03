import { useState, useMemo } from 'react';
import { Users, TrendingUp, TrendingDown, MapPin, Clock, Download, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import { generateFootfallData, majorStations } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const footfallData = generateFootfallData(24);

// Station footfall data
const stationFootfall = majorStations.map(station => ({
  station: station.code,
  name: station.name,
  currentOccupancy: Math.floor(Math.random() * 8000) + 2000,
  maxCapacity: 15000,
  avgDwellTime: Math.floor(Math.random() * 20) + 10,
  entryRate: Math.floor(Math.random() * 500) + 100,
  exitRate: Math.floor(Math.random() * 480) + 100,
  status: Math.random() > 0.8 ? 'high' : Math.random() > 0.4 ? 'normal' : 'low',
}));

// Weekly comparison data
const weeklyComparison = Array.from({ length: 7 }, (_, i) => ({
  day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
  thisWeek: Math.floor(Math.random() * 100000) + 50000,
  lastWeek: Math.floor(Math.random() * 95000) + 48000,
}));

// Platform density data
const platformDensity = Array.from({ length: 8 }, (_, i) => ({
  platform: `P${i + 1}`,
  density: Math.floor(Math.random() * 100),
  waiting: Math.floor(Math.random() * 200) + 50,
}));

export default function FootfallAnalytics() {
  const [selectedStation, setSelectedStation] = useState('all');
  const [timeRange, setTimeRange] = useState('today');

  const stats = useMemo(() => {
    const totalEntry = footfallData.reduce((acc, d) => acc + d.entry, 0);
    const totalExit = footfallData.reduce((acc, d) => acc + d.exit, 0);
    const peakHour = footfallData.reduce((max, d) => d.entry > max.entry ? d : max, footfallData[0]);
    const avgOccupancy = stationFootfall.reduce((acc, s) => acc + (s.currentOccupancy / s.maxCapacity * 100), 0) / stationFootfall.length;
    
    return {
      totalEntry,
      totalExit,
      peakHour: peakHour.hour,
      avgOccupancy: avgOccupancy.toFixed(1),
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'text-destructive bg-destructive/10 border-destructive/30';
      case 'normal': return 'text-success bg-success/10 border-success/30';
      default: return 'text-info bg-info/10 border-info/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            Footfall Analytics
          </h1>
          <p className="text-muted-foreground">
            Station occupancy, crowd density, and passenger flow analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedStation} onValueChange={setSelectedStation}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stations</SelectItem>
              {majorStations.map(station => (
                <SelectItem key={station.code} value={station.code}>{station.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Entry</p>
                <p className="text-3xl font-bold mt-1">{(stats.totalEntry / 1000).toFixed(1)}K</p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-success">+15.3% from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Exit</p>
                <p className="text-3xl font-bold mt-1">{(stats.totalExit / 1000).toFixed(1)}K</p>
              </div>
              <div className="p-3 rounded-xl bg-info/10">
                <TrendingDown className="h-6 w-6 text-info" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-success">+12.1% from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Peak Hour</p>
                <p className="text-3xl font-bold mt-1">{stats.peakHour}:00</p>
              </div>
              <div className="p-3 rounded-xl bg-warning/10">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-sm text-muted-foreground">Highest density period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Occupancy</p>
                <p className="text-3xl font-bold mt-1">{stats.avgOccupancy}%</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${stats.avgOccupancy}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entry/Exit Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Entry & Exit Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={footfallData}>
                <defs>
                  <linearGradient id="colorEntry" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
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
                  dataKey="entry"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEntry)"
                />
                <Area
                  type="monotone"
                  dataKey="exit"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExit)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-chart-1" />
                <span className="text-sm text-muted-foreground">Entry</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-chart-3" />
                <span className="text-sm text-muted-foreground">Exit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="thisWeek" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lastWeek" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">This Week</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                <span className="text-sm text-muted-foreground">Last Week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Station Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Station Occupancy Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stationFootfall.slice(0, 8).map((station) => (
              <div key={station.station} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-mono font-bold text-lg">{station.station}</span>
                    <p className="text-xs text-muted-foreground">{station.name}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(station.status)}>
                    {station.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Occupancy</span>
                    <span className="font-medium">
                      {station.currentOccupancy.toLocaleString()} / {station.maxCapacity.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full',
                        station.status === 'high' ? 'bg-destructive' :
                        station.status === 'normal' ? 'bg-success' : 'bg-info'
                      )}
                      style={{ width: `${(station.currentOccupancy / station.maxCapacity) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Avg dwell: {station.avgDwellTime}min</span>
                    <span>Entry: {station.entryRate}/hr</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Density */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Density Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {platformDensity.map((platform) => (
              <div
                key={platform.platform}
                className={cn(
                  'p-4 rounded-lg text-center border',
                  platform.density > 80 ? 'bg-destructive/10 border-destructive/30' :
                  platform.density > 50 ? 'bg-warning/10 border-warning/30' :
                  'bg-success/10 border-success/30'
                )}
              >
                <p className="font-mono font-bold text-lg">{platform.platform}</p>
                <p className={cn(
                  'text-2xl font-bold',
                  platform.density > 80 ? 'text-destructive' :
                  platform.density > 50 ? 'text-warning' : 'text-success'
                )}>
                  {platform.density}%
                </p>
                <p className="text-xs text-muted-foreground">{platform.waiting} waiting</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
