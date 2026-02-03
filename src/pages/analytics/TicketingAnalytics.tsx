import { useState, useMemo } from 'react';
import { Ticket, TrendingUp, TrendingDown, Users, IndianRupee, Calendar, Download, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { generateTicketingData, majorStations, formatINR } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const ticketingData = generateTicketingData(30);
const recentData = ticketingData.slice(0, 7);

// Station-wise booking data
const stationBookings = majorStations.map(station => ({
  station: station.code,
  name: station.name,
  bookings: Math.floor(Math.random() * 50000) + 10000,
  revenue: Math.floor(Math.random() * 50000000) + 10000000,
  growth: (Math.random() * 20 - 5).toFixed(1),
}));

// Class-wise distribution
const classDistribution = [
  { name: 'Sleeper', value: 45, color: 'hsl(var(--chart-1))' },
  { name: 'AC 3-Tier', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'AC 2-Tier', value: 15, color: 'hsl(var(--chart-3))' },
  { name: 'AC 1st Class', value: 8, color: 'hsl(var(--chart-4))' },
  { name: 'General', value: 7, color: 'hsl(var(--chart-5))' },
];

// Hourly booking pattern
const hourlyPattern = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  bookings: Math.floor(Math.random() * 15000) + (i >= 8 && i <= 22 ? 10000 : 2000),
  cancellations: Math.floor(Math.random() * 2000) + 500,
}));

export default function TicketingAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  
  const stats = useMemo(() => {
    const totalBookings = recentData.reduce((acc, d) => acc + d.totalBookings, 0);
    const totalRevenue = recentData.reduce((acc, d) => acc + d.revenue, 0);
    const avgConfirmRate = recentData.reduce((acc, d) => acc + (d.confirmed / d.totalBookings), 0) / recentData.length * 100;
    const totalCancelled = recentData.reduce((acc, d) => acc + d.cancelled, 0);
    
    return {
      totalBookings,
      totalRevenue,
      avgConfirmRate: avgConfirmRate.toFixed(1),
      totalCancelled,
    };
  }, []);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Ticket className="h-7 w-7 text-primary" />
            Ticketing Traffic Analytics
          </h1>
          <p className="text-muted-foreground">
            Real-time booking trends, revenue analysis, and passenger insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Today</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
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
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Bookings</p>
                <p className="text-3xl font-bold mt-1">{formatValue(stats.totalBookings)}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Ticket className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-success">+12.5% from last period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Revenue</p>
                <p className="text-3xl font-bold mt-1">{formatINR(stats.totalRevenue, true)}</p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <IndianRupee className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-success">+8.3% growth</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Confirm Rate</p>
                <p className="text-3xl font-bold mt-1">{stats.avgConfirmRate}%</p>
              </div>
              <div className="p-3 rounded-xl bg-info/10">
                <Users className="h-6 w-6 text-info" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-success">+2.1% improvement</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Cancellations</p>
                <p className="text-3xl font-bold mt-1 text-destructive">{formatValue(stats.totalCancelled)}</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-success" />
              <span className="text-sm text-success">-5.2% reduction</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recentData} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-IN', { weekday: 'short' });
                  }}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={formatValue}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatValue(value)}
                />
                <Bar dataKey="confirmed" stackId="a" fill="hsl(var(--success))" radius={[0, 0, 0, 0]} />
                <Bar dataKey="waitlisted" stackId="a" fill="hsl(var(--warning))" radius={[0, 0, 0, 0]} />
                <Bar dataKey="cancelled" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-sm text-muted-foreground">Waitlisted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">Cancelled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Class-wise Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={classDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {classDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
              <div className="flex-1 space-y-3">
                {classDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Pattern & Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hourly Booking Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={hourlyPattern}>
                <defs>
                  <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
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
                  dataKey="bookings"
                  stroke="hsl(var(--primary))"
                  fill="url(#bookingsGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={recentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                  }}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value / 10000000).toFixed(0)}Cr`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatINR(value, true), 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--success))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Station Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Station-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stationBookings.slice(0, 6).map((station) => (
              <div key={station.station} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold">{station.station}</span>
                  <Badge variant={Number(station.growth) > 0 ? 'default' : 'destructive'} className="text-xs">
                    {Number(station.growth) > 0 ? '+' : ''}{station.growth}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{station.name}</p>
                <p className="text-lg font-bold">{formatValue(station.bookings)}</p>
                <p className="text-xs text-muted-foreground">{formatINR(station.revenue, true)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
