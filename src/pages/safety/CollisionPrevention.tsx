import { useState } from 'react';
import {
  AlertTriangle,
  Train,
  MapPin,
  Radio,
  Gauge,
  Shield,
  Zap,
  CheckCircle,
  XCircle,
  Signal,
  Navigation,
  Volume2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { cn } from '@/lib/utils';
import { collisionPreventionData } from '@/lib/safetyMockData';

// Mock nearby trains data
const nearbyTrains = [
  {
    trainA: '12345-EXP',
    trainB: '67890-FRT',
    distance: 1200,
    closingRate: 15,
    timeToCollision: 45,
    riskScore: 65,
    autoBrake: false,
    override: false,
  },
  {
    trainA: '54321-LOC',
    trainB: '09876-EXP',
    distance: 2500,
    closingRate: 8,
    timeToCollision: 180,
    riskScore: 25,
    autoBrake: false,
    override: false,
  },
  {
    trainA: '11111-FRT',
    trainB: '22222-LOC',
    distance: 800,
    closingRate: 22,
    timeToCollision: 28,
    riskScore: 82,
    autoBrake: true,
    override: false,
  },
];

// Auto-brake activations per day
const brakingData = [
  { day: 'Mon', activations: 12 },
  { day: 'Tue', activations: 8 },
  { day: 'Wed', activations: 15 },
  { day: 'Thu', activations: 6 },
  { day: 'Fri', activations: 18 },
  { day: 'Sat', activations: 10 },
  { day: 'Sun', activations: 5 },
];

// Alert distribution
const alertDistribution = [
  { name: 'Collision Risk', value: 35, color: 'hsl(var(--destructive))' },
  { name: 'SPAD Events', value: 15, color: 'hsl(var(--warning))' },
  { name: 'System Failures', value: 20, color: 'hsl(var(--info))' },
  { name: 'Speed Violations', value: 30, color: 'hsl(var(--chart-5))' },
];

// Risk trend over time
const riskTrendData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  riskDetected: Math.floor(Math.random() * 20) + 5,
  prevented: Math.floor(Math.random() * 15) + 3,
}));

export default function CollisionPrevention() {
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  const getZoneColor = (distance: number, risk: number) => {
    if (risk > 80 || distance < 500) return 'bg-destructive';
    if (risk > 60 || distance < 1000) return 'bg-chart-5';
    if (risk > 30 || distance < 2000) return 'bg-warning';
    return 'bg-success';
  };

  const getSystemStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-7 w-7 text-warning" />
            Collision Prevention System
          </h1>
          <p className="text-muted-foreground">
            Real-time train tracking with AI-powered collision risk monitoring
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={liveUpdates} onCheckedChange={setLiveUpdates} />
            <span className="text-sm">Live Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={soundAlerts} onCheckedChange={setSoundAlerts} />
            <Volume2 className="h-4 w-4" />
          </div>
          {liveUpdates && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success">Live</span>
            </div>
          )}
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-success/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <Shield className="h-5 w-5 text-success" />
              {getSystemStatusIcon(collisionPreventionData.kavachStatus)}
            </div>
            <p className="font-semibold">Kavach System</p>
            <p className="text-xs text-muted-foreground mt-1">SIL-4 Certified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <Radio className="h-5 w-5 text-muted-foreground" />
              {getSystemStatusIcon(collisionPreventionData.awsStatus)}
            </div>
            <p className="font-semibold">AWS Status</p>
            <p className="text-xs text-muted-foreground mt-1">Mumbai Suburban</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <Signal className="h-5 w-5 text-primary" />
              {getSystemStatusIcon(collisionPreventionData.tpwsStatus)}
            </div>
            <p className="font-semibold">TPWS Status</p>
            <p className="text-xs text-muted-foreground mt-1">ETCS Level 1</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="h-5 w-5 text-info" />
              <span
                className={cn(
                  'text-lg font-bold',
                  collisionPreventionData.gpsQuality >= 95
                    ? 'text-success'
                    : collisionPreventionData.gpsQuality >= 80
                    ? 'text-warning'
                    : 'text-destructive'
                )}
              >
                {collisionPreventionData.gpsQuality}%
              </span>
            </div>
            <p className="font-semibold">GPS Quality</p>
            <p className="text-xs text-muted-foreground mt-1">Multi-constellation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="h-5 w-5 text-chart-5" />
              <span className="text-lg font-bold text-success">98%</span>
            </div>
            <p className="font-semibold">Comm Quality</p>
            <p className="text-xs text-muted-foreground mt-1">5G/LTE Active</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/10 to-transparent">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">92</p>
              <p className="text-xs text-muted-foreground mt-1">System Health</p>
              <Progress value={92} className="mt-2 h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Train Detail Panel */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" />
            Train: {collisionPreventionData.trainId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <MapPin className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-medium text-sm">
                {collisionPreventionData.latitude.toFixed(4)}°N
              </p>
              <p className="font-medium text-sm">
                {collisionPreventionData.longitude.toFixed(4)}°E
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Gauge className="h-5 w-5 text-warning mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Speed</p>
              <p className="text-2xl font-bold">{collisionPreventionData.currentSpeed}</p>
              <p className="text-xs text-muted-foreground">km/h</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Navigation className="h-5 w-5 text-info mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Heading</p>
              <p className="text-2xl font-bold">{collisionPreventionData.heading}°</p>
              <p className="text-xs text-muted-foreground">SE</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-warning/10">
              <AlertTriangle className="h-5 w-5 text-warning mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Collision Prob.</p>
              <p className="text-2xl font-bold text-warning">
                {(collisionPreventionData.collisionProbability * 100).toFixed(0)}%
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Zap className="h-5 w-5 text-success mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Auto-Brake</p>
              <p
                className={cn(
                  'text-lg font-bold',
                  collisionPreventionData.automaticBrakeApplied
                    ? 'text-destructive'
                    : 'text-success'
                )}
              >
                {collisionPreventionData.automaticBrakeApplied ? 'ACTIVE' : 'Standby'}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-success/10">
              <Shield className="h-5 w-5 text-success mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Kavach</p>
              <p className="text-lg font-bold text-success uppercase">
                {collisionPreventionData.kavachStatus}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Train Info */}
      {collisionPreventionData.nearbyTrains.length > 0 && (
        <Card
          className={cn(
            'border-2',
            collisionPreventionData.nearbyTrains[0].collisionRisk > 0.5
              ? 'border-warning'
              : 'border-success'
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Train className="h-5 w-5" />
              Nearest Train: {collisionPreventionData.nearbyTrains[0].trainId}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="text-2xl font-bold">
                  {collisionPreventionData.nearbyTrains[0].relativeDistance}m
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Relative Speed</p>
                <p className="text-2xl font-bold">
                  {collisionPreventionData.nearbyTrains[0].relativeSpeed} km/h
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Time to Collision</p>
                <p
                  className={cn(
                    'text-2xl font-bold',
                    collisionPreventionData.nearbyTrains[0].timeToCollision < 60
                      ? 'text-destructive'
                      : 'text-warning'
                  )}
                >
                  {collisionPreventionData.nearbyTrains[0].timeToCollision}s
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Collision Risk</p>
                <p className="text-2xl font-bold text-warning">
                  {(collisionPreventionData.nearbyTrains[0].collisionRisk * 100).toFixed(0)}%
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button variant="destructive" size="sm">
                  Emergency Stop
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Train Proximity Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Train-to-Train Proximity Monitor</CardTitle>
            <Badge variant="outline">Auto-refresh: 5s</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Train A</TableHead>
                <TableHead>Train B</TableHead>
                <TableHead>Distance (m)</TableHead>
                <TableHead>Closing Rate (m/s)</TableHead>
                <TableHead>Time to Collision</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Auto-Brake</TableHead>
                <TableHead>Override</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nearbyTrains.map((pair, idx) => (
                <TableRow
                  key={idx}
                  className={cn(pair.riskScore > 80 && 'bg-destructive/5')}
                >
                  <TableCell className="font-medium">{pair.trainA}</TableCell>
                  <TableCell className="font-medium">{pair.trainB}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'h-2 w-2 rounded-full',
                          getZoneColor(pair.distance, pair.riskScore)
                        )}
                      />
                      {pair.distance}
                    </div>
                  </TableCell>
                  <TableCell>{pair.closingRate}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'font-bold',
                        pair.timeToCollision < 60 ? 'text-destructive' : 'text-foreground'
                      )}
                    >
                      {pair.timeToCollision}s
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={pair.riskScore}
                        className={cn(
                          'w-16 h-2',
                          pair.riskScore > 80
                            ? '[&>div]:bg-destructive'
                            : pair.riskScore > 50
                            ? '[&>div]:bg-warning'
                            : '[&>div]:bg-success'
                        )}
                      />
                      <span className="text-sm">{pair.riskScore}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {pair.autoBrake ? (
                      <Badge variant="destructive">ACTIVE</Badge>
                    ) : (
                      <Badge variant="outline">Standby</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" disabled={!pair.autoBrake}>
                      Request Override
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Auto-Brake Activations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Auto-Brake Activations (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={brakingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="activations" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alert Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alert Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={alertDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {alertDistribution.map((entry, index) => (
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
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {alertDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-1 text-xs">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Collision Risks (24 Hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={riskTrendData.slice(0, 12)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="riskDetected"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  name="Detected"
                />
                <Line
                  type="monotone"
                  dataKey="prevented"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  name="Prevented"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Zone Legend */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-success" />
              <span className="text-sm">Safe Zone (&gt;2000m, Risk &lt;30)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-warning" />
              <span className="text-sm">Monitor (1000-2000m, Risk 30-60)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-chart-5" />
              <span className="text-sm">Warning (500-1000m, Risk 60-80)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-destructive" />
              <span className="text-sm">Critical (&lt;500m, Risk &gt;80)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
