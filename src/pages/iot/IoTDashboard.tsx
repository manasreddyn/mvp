import { useState } from 'react';
import {
  Cpu,
  Wifi,
  AlertTriangle,
  Activity,
  Brain,
  TrendingUp,
  RefreshCw,
  Zap,
  ThermometerSun,
  Gauge,
  WifiOff,
  Wrench,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIoTDevices, useSensorData, useIoTAlerts, useAIPredictions } from '@/hooks/useIoTData';
import { DeviceStatusCard } from '@/components/iot/DeviceStatusCard';
import { AlertFeed } from '@/components/iot/AlertFeed';
import { AIInsightsPanel } from '@/components/iot/AIInsightsPanel';
import { RealTimeStreamChart } from '@/components/iot/RealTimeStreamChart';
import { SensorDataStream } from '@/components/iot/SensorDataStream';
import { cn } from '@/lib/utils';

export default function IoTDashboard() {
  const { devices, loading: devicesLoading, deviceStats, refetch: refetchDevices } = useIoTDevices();
  const { readings, loading: readingsLoading, refetch: refetchReadings } = useSensorData();
  const { alerts, alertStats, acknowledgeAlert, resolveAlert, refetch: refetchAlerts } = useIoTAlerts();
  const { predictions, loading: predictionsLoading, refetch: refetchPredictions } = useAIPredictions();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchDevices(), refetchReadings(), refetchAlerts(), refetchPredictions()]);
    setTimeout(() => setRefreshing(false), 500);
  };

  // Calculate system health score
  const systemHealthScore = Math.round(
    ((deviceStats.active / Math.max(deviceStats.total, 1)) * 100 * 0.6) +
    ((1 - alertStats.critical / Math.max(alertStats.total, 1)) * 100 * 0.4)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            IoT Command Center
          </h1>
          <p className="text-muted-foreground">
            Real-time monitoring of railway IoT infrastructure with AI-powered insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium">Live Data</span>
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

      {/* System Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Devices Online */}
        <Card className="bg-gradient-to-br from-card to-card/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Devices Online</p>
                <p className="text-3xl font-bold mt-1">
                  {deviceStats.active}
                  <span className="text-lg text-muted-foreground font-normal">/{deviceStats.total}</span>
                </p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <Wifi className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="outline" className="text-success text-xs">
                {Math.round((deviceStats.active / Math.max(deviceStats.total, 1)) * 100)}% uptime
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card className="bg-gradient-to-br from-card to-card/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Alerts</p>
                <p className="text-3xl font-bold mt-1">{alertStats.total - alerts.filter(a => a.resolved_at).length}</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {alertStats.critical > 0 && (
                <Badge variant="destructive" className="text-xs">{alertStats.critical} critical</Badge>
              )}
              {alertStats.warning > 0 && (
                <Badge className="bg-warning/10 text-warning border-warning/30 text-xs">{alertStats.warning} warning</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-gradient-to-br from-card to-card/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">System Health</p>
                <p className={cn(
                  'text-3xl font-bold mt-1',
                  systemHealthScore >= 80 ? 'text-success' :
                  systemHealthScore >= 60 ? 'text-warning' : 'text-destructive'
                )}>
                  {systemHealthScore}%
                </p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  systemHealthScore >= 80 ? 'bg-success' :
                  systemHealthScore >= 60 ? 'bg-warning' : 'bg-destructive'
                )}
                style={{ width: `${systemHealthScore}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Throughput */}
        <Card className="bg-gradient-to-br from-card to-card/80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Data Points</p>
                <p className="text-3xl font-bold mt-1">{readings.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-info/10">
                <Gauge className="h-6 w-6 text-info" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="outline" className="text-info text-xs">
                Real-time sync
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI Predictions */}
        <Card className="bg-gradient-to-br from-card to-card/80">
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
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="outline" className="text-chart-5 text-xs">
                {predictions.filter(p => p.prediction_type === 'predictive_maintenance').length} maintenance
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Device Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-Time Data Stream */}
          <Card className="chart-container">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Real-Time Data Stream
                </CardTitle>
                <Tabs defaultValue="table" className="w-auto">
                  <TabsList className="h-8">
                    <TabsTrigger value="table" className="text-xs px-3">Table</TabsTrigger>
                    <TabsTrigger value="chart" className="text-xs px-3">Chart</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="table">
                <TabsContent value="table" className="mt-0">
                  <SensorDataStream readings={readings} devices={devices} limit={8} />
                </TabsContent>
                <TabsContent value="chart" className="mt-0">
                  <RealTimeStreamChart readings={readings} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Device Status Grid */}
          <Card className="chart-container">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  Device Status
                </CardTitle>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3 w-3 text-success" />
                    <span>{deviceStats.active} active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wrench className="h-3 w-3 text-warning" />
                    <span>{deviceStats.maintenance} maintenance</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <WifiOff className="h-3 w-3 text-destructive" />
                    <span>{deviceStats.error} error</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {devicesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-32 rounded-xl bg-muted/50 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                  {devices.slice(0, 12).map(device => (
                    <DeviceStatusCard key={device.id} device={device} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Alerts & AI Insights */}
        <div className="space-y-6">
          {/* Active Alerts */}
          <Card className="chart-container">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Active Alerts
                </CardTitle>
                <Badge variant="outline" className={cn(
                  alertStats.unacknowledged > 0 ? 'text-destructive border-destructive/30' : 'text-success'
                )}>
                  {alertStats.unacknowledged} unread
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <AlertFeed 
                alerts={alerts} 
                onAcknowledge={acknowledgeAlert}
                onResolve={resolveAlert}
              />
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="chart-container">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-chart-5" />
                  AI Insights
                </CardTitle>
                <Badge className="bg-chart-5/10 text-chart-5 border-chart-5/30">
                  Powered by Lovable AI
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <AIInsightsPanel predictions={predictions} loading={predictionsLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
