import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  MapPin,
  Gauge,
  Wrench,
  TrendingUp,
  Download,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  FileSpreadsheet,
  FileJson,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  ZAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import { trackSafetyData } from '@/lib/safetyMockData';
import { exportToCSV, exportToJSON, exportToTextReport, exportToPDF, type ExportData } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';

// Generate mock geometry trend data
const geometryTrendData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  gaugeDeviation: 2.5 + Math.random() * 2,
  crossLevel: 1.2 + Math.random() * 1.5,
  alignment: 2.0 + Math.random() * 1.8,
  twist: 0.8 + Math.random() * 0.6,
}));

// Mock defects data
const trackDefects = [
  {
    id: 'DEF-001',
    sectionId: 'DLI-NDLS-SEC-5',
    kmPost: 12.5,
    type: 'Crack',
    severity: 'critical',
    detected: '2026-01-28',
    predictedFailure: '2026-02-15',
    priority: 'emergency',
    status: 'open',
  },
  {
    id: 'DEF-002',
    sectionId: 'NDLS-AGC-SEC-12',
    kmPost: 45.8,
    type: 'Geometry',
    severity: 'moderate',
    detected: '2026-01-25',
    predictedFailure: '2026-03-10',
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: 'DEF-003',
    sectionId: 'BCT-CSMT-SEC-3',
    kmPost: 8.2,
    type: 'Sleeper',
    severity: 'moderate',
    detected: '2026-01-20',
    predictedFailure: '2026-04-01',
    priority: 'medium',
    status: 'open',
  },
  {
    id: 'DEF-004',
    sectionId: 'HWH-SDAH-SEC-7',
    kmPost: 22.1,
    type: 'Corrosion',
    severity: 'low',
    detected: '2026-01-15',
    predictedFailure: '2026-06-01',
    priority: 'low',
    status: 'resolved',
  },
];

// Risk matrix data
const riskMatrixData = [
  { x: 0.2, y: 30, z: 5, section: 'SEC-1', risk: 'low' },
  { x: 0.35, y: 68, z: 12, section: 'SEC-5', risk: 'moderate' },
  { x: 0.65, y: 45, z: 8, section: 'SEC-8', risk: 'high' },
  { x: 0.8, y: 85, z: 15, section: 'SEC-12', risk: 'critical' },
  { x: 0.15, y: 25, z: 4, section: 'SEC-3', risk: 'low' },
  { x: 0.45, y: 55, z: 10, section: 'SEC-6', risk: 'moderate' },
  { x: 0.55, y: 70, z: 11, section: 'SEC-9', risk: 'high' },
];

export default function TrackSafety() {
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('gaugeDeviation');
  const { toast } = useToast();

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-destructive text-destructive-foreground',
      moderate: 'bg-warning text-warning-foreground',
      low: 'bg-success text-success-foreground',
    };
    return colors[severity] || 'bg-muted';
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      emergency: 'border-destructive text-destructive',
      high: 'border-warning text-warning',
      medium: 'border-info text-info',
      low: 'border-muted-foreground text-muted-foreground',
    };
    return colors[priority] || '';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const handleExportReport = (format: 'csv' | 'json' | 'txt' | 'pdf') => {
    const timestamp = new Date().toLocaleString('en-IN');
    const filename = `track-safety-report-${new Date().toISOString().split('T')[0]}`;
    
    const exportData: ExportData = {
      title: 'Track Safety Report',
      timestamp,
      summary: {
        sectionsMonitored: 1247,
        criticalAlerts: 12,
        avgTrackHealth: trackSafetyData.healthScore,
        maintenancePending: 45,
        speedRestrictions: 23,
        selectedZone: selectedZone === 'all' ? 'All Zones' : selectedZone.toUpperCase(),
      },
      data: trackDefects.map(defect => ({
        id: defect.id,
        sectionId: defect.sectionId,
        kmPost: defect.kmPost,
        type: defect.type,
        severity: defect.severity,
        detected: defect.detected,
        predictedFailure: defect.predictedFailure,
        priority: defect.priority,
        status: defect.status,
      })),
    };

    try {
      switch (format) {
        case 'csv':
          exportToCSV(exportData.data, filename);
          break;
        case 'json':
          exportToJSON(exportData, filename);
          break;
        case 'txt':
          exportToTextReport(exportData, filename);
          break;
        case 'pdf':
          exportToPDF(exportData, filename);
          break;
      }
      toast({
        title: 'Export Successful',
        description: `Report exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the report',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-7 w-7 text-primary" />
            Track Safety Monitoring
          </h1>
          <p className="text-muted-foreground">
            Real-time track condition monitoring with predictive maintenance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExportReport('csv')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportReport('json')}>
                <FileJson className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportReport('txt')}>
                <FileText className="h-4 w-4 mr-2" />
                Export as Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportReport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="north">Northern</SelectItem>
                <SelectItem value="south">Southern</SelectItem>
                <SelectItem value="east">Eastern</SelectItem>
                <SelectItem value="west">Western</SelectItem>
                <SelectItem value="central">Central</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="7days">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Risk Level:</span>
              {['Low', 'Moderate', 'High', 'Critical'].map((level) => (
                <Badge
                  key={level}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-muted-foreground">Sections Monitored</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">12</p>
                <p className="text-xs text-muted-foreground">Critical Risk Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Gauge className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{trackSafetyData.healthScore}</p>
                <p className="text-xs text-muted-foreground">Avg Track Health</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Wrench className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-xs text-muted-foreground">Maintenance Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <TrendingUp className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-muted-foreground">Speed Restrictions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Section Details */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Section: {trackSafetyData.sectionId}</span>
            <Badge
              className={cn(
                trackSafetyData.riskCategory === 'moderate'
                  ? 'bg-warning text-warning-foreground'
                  : 'bg-success text-success-foreground'
              )}
            >
              {trackSafetyData.riskCategory.toUpperCase()} RISK
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Health Score</p>
              <p className="text-2xl font-bold text-warning">{trackSafetyData.healthScore}</p>
              <Progress value={trackSafetyData.healthScore} className="mt-2 h-1" />
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Gauge Deviation</p>
              <p className="text-2xl font-bold">{trackSafetyData.gaugeDeviation} mm</p>
              <p className="text-xs text-muted-foreground">Standard: 1676mm</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Cross Level</p>
              <p className="text-2xl font-bold">{trackSafetyData.crossLevel} mm</p>
              <p className="text-xs text-muted-foreground">Limit: ±5mm</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Alignment</p>
              <p className="text-2xl font-bold">{trackSafetyData.alignment} mm</p>
              <p className="text-xs text-muted-foreground">Limit: ±3mm</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-destructive/10">
              <p className="text-xs text-muted-foreground mb-1">Crack Detected</p>
              <p className="text-2xl font-bold text-destructive">
                {trackSafetyData.crackLength} mm
              </p>
              <p className="text-xs text-destructive">Action Required</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-warning/10">
              <p className="text-xs text-muted-foreground mb-1">Time to Failure</p>
              <p className="text-2xl font-bold text-warning">
                {trackSafetyData.timeToFailure} days
              </p>
              <p className="text-xs text-muted-foreground">
                Prob: {(trackSafetyData.failureProbability * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Track Geometry Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Track Geometry Trends</CardTitle>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gaugeDeviation">Gauge Deviation</SelectItem>
                  <SelectItem value="crossLevel">Cross Level</SelectItem>
                  <SelectItem value="alignment">Alignment</SelectItem>
                  <SelectItem value="twist">Twist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={geometryTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'mm', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.2)"
                  strokeWidth={2}
                />
                {/* Threshold line */}
                <Line
                  type="monotone"
                  dataKey={() => 4}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Assessment Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Failure Probability"
                  domain={[0, 1]}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Failure Probability', position: 'bottom' }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Impact Severity"
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Impact Severity', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis type="number" dataKey="z" range={[100, 400]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value, name) => [value, name]}
                />
                <Scatter
                  data={riskMatrixData.filter((d) => d.risk === 'low')}
                  fill="hsl(var(--success))"
                />
                <Scatter
                  data={riskMatrixData.filter((d) => d.risk === 'moderate')}
                  fill="hsl(var(--warning))"
                />
                <Scatter
                  data={riskMatrixData.filter((d) => d.risk === 'high')}
                  fill="hsl(var(--chart-5))"
                />
                <Scatter
                  data={riskMatrixData.filter((d) => d.risk === 'critical')}
                  fill="hsl(var(--destructive))"
                />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {['low', 'moderate', 'high', 'critical'].map((risk) => (
                <div key={risk} className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-3 w-3 rounded-full',
                      risk === 'low' && 'bg-success',
                      risk === 'moderate' && 'bg-warning',
                      risk === 'high' && 'bg-chart-5',
                      risk === 'critical' && 'bg-destructive'
                    )}
                  />
                  <span className="text-xs capitalize">{risk}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Track Defects Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Track Defects Log</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section ID</TableHead>
                <TableHead>KM Post</TableHead>
                <TableHead>Defect Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead>Predicted Failure</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trackDefects.map((defect) => (
                <TableRow key={defect.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{defect.sectionId}</TableCell>
                  <TableCell>{defect.kmPost}</TableCell>
                  <TableCell>{defect.type}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityBadge(defect.severity)}>
                      {defect.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{defect.detected}</TableCell>
                  <TableCell className="text-warning">{defect.predictedFailure}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityBadge(defect.priority)}>
                      {defect.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(defect.status)}
                      <span className="capitalize text-sm">{defect.status.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      Schedule
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Urgent Maintenance Required',
                description:
                  'Section DLI-NDLS-SEC-5 shows crack propagation. Schedule immediate inspection.',
                impact: 'High',
                cost: '₹2.5 Lakhs',
                urgency: 'emergency',
              },
              {
                title: 'Preventive Action',
                description:
                  'Geometry degradation trend detected in Central zone. Pre-emptive tamping recommended.',
                impact: 'Medium',
                cost: '₹8 Lakhs',
                urgency: 'high',
              },
              {
                title: 'Resource Optimization',
                description:
                  'Combine maintenance windows for SEC-8 and SEC-9 to reduce operational disruption.',
                impact: 'Low',
                cost: 'Saves ₹1.2 Lakhs',
                urgency: 'routine',
              },
            ].map((insight, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-card border">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm">{insight.title}</h4>
                  <Badge
                    variant="outline"
                    className={
                      insight.urgency === 'emergency'
                        ? 'border-destructive text-destructive'
                        : insight.urgency === 'high'
                        ? 'border-warning text-warning'
                        : 'border-success text-success'
                    }
                  >
                    {insight.urgency}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span>Impact: {insight.impact}</span>
                  <span className="font-medium">{insight.cost}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="default" className="flex-1">
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Defer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
