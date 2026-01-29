import { useState, useMemo } from 'react';
import { Cpu, Wifi, Battery, Thermometer, AlertTriangle, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { generateIoTDevices } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const devices = generateIoTDevices(50);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'bg-success text-success-foreground';
    case 'warning':
      return 'bg-warning text-warning-foreground';
    case 'critical':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    case 'critical':
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return <XCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function IoTTelemetry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch = device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.location.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || device.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = devices.length;
    const healthy = devices.filter((d) => d.status === 'healthy').length;
    const warning = devices.filter((d) => d.status === 'warning').length;
    const critical = devices.filter((d) => d.status === 'critical').length;
    const avgBattery = Math.round(devices.reduce((acc, d) => acc + d.batteryLevel, 0) / total);
    
    return { total, healthy, warning, critical, avgBattery };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">IoT Device Telemetry</h1>
          <p className="text-muted-foreground">
            Monitor track sensors, signals, and point machines across the network
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Data
          </Button>
          <Button size="sm">
            Add Device
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Devices"
          value={stats.total}
          icon={Cpu}
          iconColor="text-primary"
        />
        <MetricCard
          title="Online & Healthy"
          value={stats.healthy}
          change={((stats.healthy / stats.total) * 100)}
          trend="up"
          icon={Wifi}
          iconColor="text-success"
        />
        <MetricCard
          title="Requiring Attention"
          value={stats.warning + stats.critical}
          icon={AlertTriangle}
          iconColor="text-warning"
        />
        <MetricCard
          title="Avg Battery Level"
          value={stats.avgBattery}
          unit="%"
          icon={Battery}
          iconColor="text-info"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Device ID or Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Device Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="track_sensor">Track Sensors</SelectItem>
            <SelectItem value="signal">Signals</SelectItem>
            <SelectItem value="point_machine">Point Machines</SelectItem>
            <SelectItem value="environmental">Environmental</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Device Table */}
      <div className="chart-container p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Device ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-center">Temperature</TableHead>
              <TableHead className="text-center">Vibration</TableHead>
              <TableHead className="text-center">Battery</TableHead>
              <TableHead className="text-center">Signal</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Last Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.slice(0, 20).map((device) => (
              <TableRow key={device.id} className="data-table-row cursor-pointer">
                <TableCell className="font-mono font-medium">{device.id}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {device.type.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{device.location.name}</p>
                    <p className="text-xs text-muted-foreground">{device.location.code}</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Thermometer className={cn(
                      "h-4 w-4",
                      device.temperature > 55 ? "text-destructive" : device.temperature > 45 ? "text-warning" : "text-success"
                    )} />
                    <span className="font-mono">{device.temperature.toFixed(1)}°C</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn(
                    "font-mono",
                    device.vibration > 6 ? "text-destructive" : device.vibration > 4 ? "text-warning" : "text-foreground"
                  )}>
                    {device.vibration.toFixed(1)} mm/s
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          device.batteryLevel > 50 ? "bg-success" : device.batteryLevel > 20 ? "bg-warning" : "bg-destructive"
                        )}
                        style={{ width: `${device.batteryLevel}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm">{device.batteryLevel}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-mono">{device.signalQuality}%</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {getStatusIcon(device.status)}
                    <Badge className={cn("capitalize", getStatusColor(device.status))}>
                      {device.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(device.lastContact).toLocaleTimeString('en-IN')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min(20, filteredDevices.length)} of {filteredDevices.length} devices
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
