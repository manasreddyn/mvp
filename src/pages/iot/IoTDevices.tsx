import { useState } from 'react';
import {
  Cpu,
  Wifi,
  AlertTriangle,
  Activity,
  Brain,
  Settings,
  Bell,
  Lightbulb,
  Search,
  Filter,
  WifiOff,
  Wrench,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useIoTDevices, useIoTAlerts, useAIPredictions, IoTDevice, IoTAlert, AIPrediction } from '@/hooks/useIoTData';
import { AlertFeed } from '@/components/iot/AlertFeed';
import { AIInsightsPanel } from '@/components/iot/AIInsightsPanel';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Interface for IoT Rules
interface IoTRule {
  id: string;
  rule_name: string;
  device_id: string | null;
  condition: {
    operator?: string;
    threshold?: number;
    sensor_type?: string;
  };
  action: {
    type?: string;
    severity?: string;
    message?: string;
  };
  is_active: boolean;
  priority: number;
  trigger_count: number;
  created_at: string;
  updated_at: string;
}

export default function IoTDevices() {
  const { devices, loading: devicesLoading, deviceStats, refetch: refetchDevices } = useIoTDevices();
  const { alerts, alertStats, acknowledgeAlert, resolveAlert, refetch: refetchAlerts } = useIoTAlerts();
  const { predictions, loading: predictionsLoading, refetch: refetchPredictions } = useAIPredictions();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [rules, setRules] = useState<IoTRule[]>([]);
  const [rulesLoading, setRulesLoading] = useState(true);
  const { toast } = useToast();

  // Fetch rules
  useState(() => {
    fetchRules();
  });

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from('iot_rules')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;
      setRules((data || []) as IoTRule[]);
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setRulesLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchDevices(), refetchAlerts(), refetchPredictions(), fetchRules()]);
    setTimeout(() => setRefreshing(false), 500);
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || device.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Wifi className="h-4 w-4 text-success" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-warning" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <WifiOff className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-success/10 text-success border-success/30',
      maintenance: 'bg-warning/10 text-warning border-warning/30',
      error: 'bg-destructive/10 text-destructive border-destructive/30',
      inactive: 'bg-muted text-muted-foreground',
    };
    return colors[status] || 'bg-muted';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Cpu className="h-7 w-7 text-primary" />
            Device Management
          </h1>
          <p className="text-muted-foreground">
            Manage IoT devices, alerts, rules, and AI insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium">{deviceStats.active} Online</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Devices</p>
                <p className="text-3xl font-bold mt-1">{deviceStats.total}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Alerts</p>
                <p className="text-3xl font-bold mt-1 text-destructive">{alertStats.critical + alertStats.warning}</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Rules</p>
                <p className="text-3xl font-bold mt-1">{rules.filter(r => r.is_active).length}</p>
              </div>
              <div className="p-3 rounded-xl bg-info/10">
                <Settings className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">AI Predictions</p>
                <p className="text-3xl font-bold mt-1">{predictions.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-chart-5/10">
                <Brain className="h-6 w-6 text-chart-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alerts
            {alertStats.unacknowledged > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                {alertStats.unacknowledged}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Rules
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            All Insights
          </TabsTrigger>
        </TabsList>

        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Device Name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="railway">Railway</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
                <SelectItem value="fleet">Fleet</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Device Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Device Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Firmware</TableHead>
                    <TableHead>Last Seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devicesLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6}>
                          <div className="h-8 bg-muted animate-pulse rounded" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredDevices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No devices found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDevices.map((device) => (
                      <TableRow key={device.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(device.status)}
                            {device.device_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {device.device_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{device.category}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getStatusBadge(device.status)}>
                            {device.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {device.firmware_version || 'N/A'}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="p-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredDevices.length} of {devices.length} devices
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    All Alerts
                    <Badge variant="outline" className="ml-2">
                      {alerts.length} total
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AlertFeed 
                    alerts={alerts} 
                    onAcknowledge={acknowledgeAlert}
                    onResolve={resolveAlert}
                  />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Alert Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                    <span className="text-sm font-medium">Critical</span>
                    <Badge variant="destructive">{alertStats.critical}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10">
                    <span className="text-sm font-medium">Warning</span>
                    <Badge className="bg-warning text-warning-foreground">{alertStats.warning}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-info/10">
                    <span className="text-sm font-medium">Info</span>
                    <Badge className="bg-info text-info-foreground">{alertStats.info}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-sm font-medium">Unacknowledged</span>
                    <Badge variant="outline">{alertStats.unacknowledged}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-info" />
                  Automation Rules
                </CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {rulesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : rules.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No automation rules configured yet</p>
                  <p className="text-sm mt-1">Create rules to automate alerts and actions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className={cn(
                        'p-4 rounded-lg border',
                        rule.is_active ? 'bg-card' : 'bg-muted/50 opacity-60'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'p-2 rounded-lg',
                            rule.is_active ? 'bg-success/10' : 'bg-muted'
                          )}>
                            <Settings className={cn(
                              'h-4 w-4',
                              rule.is_active ? 'text-success' : 'text-muted-foreground'
                            )} />
                          </div>
                          <div>
                            <p className="font-medium">{rule.rule_name}</p>
                            <p className="text-sm text-muted-foreground">
                              Priority: {rule.priority} • Triggered: {rule.trigger_count} times
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={rule.is_active ? 'default' : 'outline'}>
                            {rule.is_active ? 'Active' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div className="p-2 rounded bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">Condition</p>
                          <p className="font-mono text-xs">
                            {rule.condition.sensor_type || 'Any'} {rule.condition.operator || '>'} {rule.condition.threshold || 'N/A'}
                          </p>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">Action</p>
                          <p className="font-mono text-xs">
                            {rule.action.type || 'Alert'}: {rule.action.severity || 'info'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-chart-5" />
                  AI Predictions & Insights
                  <Badge className="bg-chart-5/10 text-chart-5 border-chart-5/30 ml-2">
                    Powered by Lovable AI
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AIInsightsPanel predictions={predictions} loading={predictionsLoading} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Insight Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-destructive/10 text-center">
                    <p className="text-2xl font-bold text-destructive">
                      {predictions.filter(p => (p.predicted_value.risk_score || 0) > 70).length}
                    </p>
                    <p className="text-sm text-muted-foreground">High Risk</p>
                  </div>
                  <div className="p-4 rounded-lg bg-warning/10 text-center">
                    <p className="text-2xl font-bold text-warning">
                      {predictions.filter(p => p.prediction_type === 'predictive_maintenance').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Maintenance</p>
                  </div>
                  <div className="p-4 rounded-lg bg-success/10 text-center">
                    <p className="text-2xl font-bold text-success">
                      {predictions.filter(p => (p.confidence_score || 0) > 0.8).length}
                    </p>
                    <p className="text-sm text-muted-foreground">High Confidence</p>
                  </div>
                  <div className="p-4 rounded-lg bg-info/10 text-center">
                    <p className="text-2xl font-bold text-info">
                      {predictions.filter(p => p.prediction_type === 'anomaly_detection').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Anomalies</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="text-sm font-medium mb-2">Recent Activity</p>
                  <div className="space-y-2">
                    {predictions.slice(0, 3).map((pred) => (
                      <div key={pred.id} className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-chart-5" />
                        <span className="text-muted-foreground capitalize">
                          {pred.prediction_type.replace('_', ' ')}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(pred.prediction_timestamp), { addSuffix: true })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
