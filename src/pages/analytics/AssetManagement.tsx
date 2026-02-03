import { useState, useMemo } from 'react';
import { Package, TrendingUp, Wrench, AlertTriangle, IndianRupee, Download, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { generateAssets, formatINR, formatNumber } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const assets = generateAssets(50);

// Asset type distribution
const typeDistribution = [
  { name: 'Locomotives', value: 15, color: 'hsl(var(--chart-1))' },
  { name: 'Coaches', value: 35, color: 'hsl(var(--chart-2))' },
  { name: 'Track', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Buildings', value: 18, color: 'hsl(var(--chart-4))' },
  { name: 'Equipment', value: 12, color: 'hsl(var(--chart-5))' },
];

// Utilization trend data
const utilizationTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  utilization: 70 + Math.floor(Math.random() * 20),
  maintenance: Math.floor(Math.random() * 15) + 5,
}));

// Maintenance schedule
const maintenanceSchedule = [
  { asset: 'LOC-00012', type: 'Locomotive', scheduled: '2026-02-05', priority: 'high' },
  { asset: 'COH-00045', type: 'Coach', scheduled: '2026-02-08', priority: 'medium' },
  { asset: 'TRK-00089', type: 'Track', scheduled: '2026-02-10', priority: 'low' },
  { asset: 'EQP-00023', type: 'Equipment', scheduled: '2026-02-12', priority: 'high' },
  { asset: 'BLD-00007', type: 'Building', scheduled: '2026-02-15', priority: 'medium' },
];

export default function AssetManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch = asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || asset.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const totalValue = assets.reduce((acc, a) => acc + a.currentValue, 0);
    const avgUtilization = Math.round(assets.reduce((acc, a) => acc + a.utilizationRate, 0) / assets.length);
    const needsMaintenance = assets.filter(a => a.status === 'maintenance' || a.status === 'repair').length;
    const operational = assets.filter(a => a.status === 'operational').length;
    
    return { totalValue, avgUtilization, needsMaintenance, operational };
  }, []);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      operational: 'bg-success/10 text-success border-success/30',
      maintenance: 'bg-warning/10 text-warning border-warning/30',
      repair: 'bg-destructive/10 text-destructive border-destructive/30',
      retired: 'bg-muted text-muted-foreground',
    };
    return colors[status] || 'bg-muted';
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-destructive text-destructive-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-success text-success-foreground',
    };
    return colors[priority] || 'bg-muted';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-7 w-7 text-primary" />
            Asset Management
          </h1>
          <p className="text-muted-foreground">
            Track assets, utilization rates, and maintenance schedules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            Add Asset
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Asset Value</p>
                <p className="text-3xl font-bold mt-1">{formatINR(stats.totalValue, true)}</p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <IndianRupee className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Utilization</p>
                <p className="text-3xl font-bold mt-1">{stats.avgUtilization}%</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Progress value={stats.avgUtilization} className="mt-3" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Operational</p>
                <p className="text-3xl font-bold mt-1 text-success">{stats.operational}</p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <Package className="h-6 w-6 text-success" />
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {Math.round((stats.operational / assets.length) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Needs Attention</p>
                <p className="text-3xl font-bold mt-1 text-warning">{stats.needsMaintenance}</p>
              </div>
              <div className="p-3 rounded-xl bg-warning/10">
                <Wrench className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {typeDistribution.map((entry, index) => (
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
                {typeDistribution.map((item) => (
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

        {/* Utilization Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Utilization & Maintenance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={utilizationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
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
                <Line
                  type="monotone"
                  dataKey="utilization"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="maintenance"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--warning))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Utilization %</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-sm text-muted-foreground">Maintenance %</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-warning" />
            Upcoming Maintenance Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {maintenanceSchedule.map((item, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold">{item.asset}</span>
                  <Badge className={getPriorityBadge(item.priority)}>{item.priority}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.type}</p>
                <p className="text-sm font-medium mt-2">
                  {new Date(item.scheduled).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Asset ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Asset Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="locomotive">Locomotive</SelectItem>
            <SelectItem value="coach">Coach</SelectItem>
            <SelectItem value="track">Track</SelectItem>
            <SelectItem value="building">Building</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="repair">Repair</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Asset Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Asset ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-center">Utilization</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Next Maintenance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.slice(0, 15).map((asset) => (
                <TableRow key={asset.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono font-medium">{asset.id}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{asset.type}</Badge>
                  </TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            asset.utilizationRate > 80 ? 'bg-success' :
                            asset.utilizationRate > 50 ? 'bg-warning' : 'bg-destructive'
                          )}
                          style={{ width: `${asset.utilizationRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono">{asset.utilizationRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatINR(asset.currentValue, true)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={getStatusBadge(asset.status)}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{asset.nextMaintenance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min(15, filteredAssets.length)} of {filteredAssets.length} assets
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
