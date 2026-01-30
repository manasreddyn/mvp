import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  Sparkles,
  FileWarning,
  Train,
  MapPin,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  trackSafetyData,
  collisionPreventionData,
  cleanlinessData,
  incidentData,
} from '@/lib/safetyMockData';

export default function SafetyDashboard() {
  const safetyModules = [
    {
      title: 'Track Safety',
      icon: Activity,
      path: '/safety/track',
      score: trackSafetyData.healthScore,
      status: trackSafetyData.riskCategory,
      alerts: trackSafetyData.alerts.length,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Collision Prevention',
      icon: AlertTriangle,
      path: '/safety/collision',
      score: 100 - Math.round(collisionPreventionData.collisionProbability * 100),
      status: collisionPreventionData.kavachStatus,
      alerts: collisionPreventionData.nearbyTrains.filter((t) => t.collisionRisk > 0.5).length,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Cleanliness',
      icon: Sparkles,
      path: '/safety/cleanliness',
      score: cleanlinessData.cleanlinessScore,
      status: cleanlinessData.litterDetected ? 'attention' : 'clean',
      alerts: cleanlinessData.litterCount,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Incident Management',
      icon: FileWarning,
      path: '/safety/incident',
      score: incidentData.investigationStatus === 'ongoing' ? 50 : 100,
      status: incidentData.investigationStatus,
      alerts: incidentData.severity === 'serious' ? 1 : 0,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'Track Defect',
      severity: 'critical',
      location: 'KM 12.5 - DLI-NDLS-SEC-5',
      time: '2 hours ago',
      icon: Activity,
    },
    {
      id: 2,
      type: 'Collision Risk',
      severity: 'warning',
      location: 'Train 67890-FRT approaching 12345-EXP',
      time: '15 mins ago',
      icon: AlertTriangle,
    },
    {
      id: 3,
      type: 'Cleanliness Alert',
      severity: 'moderate',
      location: 'Platform 3 - NDLS',
      time: '1 hour ago',
      icon: Sparkles,
    },
    {
      id: 4,
      type: 'SPAD Event',
      severity: 'critical',
      location: 'Signal SIG-234 - BCT',
      time: '3 hours ago',
      icon: FileWarning,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      case 'moderate':
        return 'bg-info text-info-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-primary" />
            Safety Metrics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive railway safety monitoring and incident prevention
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/20">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium text-success">All Systems Online</span>
        </div>
      </div>

      {/* Overall Safety Score */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-muted-foreground">
                Overall Safety Index
              </h2>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl font-bold text-primary">78</span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Based on real-time monitoring across all safety parameters
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-success/10">
                <CheckCircle className="h-8 w-8 text-success mx-auto" />
                <p className="text-2xl font-bold text-success mt-2">127</p>
                <p className="text-xs text-muted-foreground">Safe Sections</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-warning/10">
                <AlertTriangle className="h-8 w-8 text-warning mx-auto" />
                <p className="text-2xl font-bold text-warning mt-2">12</p>
                <p className="text-xs text-muted-foreground">Sections at Risk</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-destructive/10">
                <XCircle className="h-8 w-8 text-destructive mx-auto" />
                <p className="text-2xl font-bold text-destructive mt-2">3</p>
                <p className="text-xs text-muted-foreground">Critical Alerts</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-info/10">
                <Clock className="h-8 w-8 text-info mx-auto" />
                <p className="text-2xl font-bold text-info mt-2">8.5</p>
                <p className="text-xs text-muted-foreground">Avg Response (min)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {safetyModules.map((module) => (
          <Link key={module.title} to={module.path}>
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={cn('p-2 rounded-lg', module.bgColor)}>
                    <module.icon className={cn('h-5 w-5', module.color)} />
                  </div>
                  {module.alerts > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {module.alerts} alerts
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                  {module.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className={cn('text-3xl font-bold', getScoreColor(module.score))}>
                      {module.score}
                    </span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <Progress value={module.score} className="h-2" />
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        module.status === 'active' || module.status === 'clean'
                          ? 'border-success text-success'
                          : module.status === 'moderate' || module.status === 'attention'
                          ? 'border-warning text-warning'
                          : 'border-info text-info'
                      )}
                    >
                      {module.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Alerts & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Recent Safety Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      alert.severity === 'critical'
                        ? 'bg-destructive/10'
                        : alert.severity === 'warning'
                        ? 'bg-warning/10'
                        : 'bg-info/10'
                    )}
                  >
                    <alert.icon
                      className={cn(
                        'h-4 w-4',
                        alert.severity === 'critical'
                          ? 'text-destructive'
                          : alert.severity === 'warning'
                          ? 'text-warning'
                          : 'text-info'
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{alert.type}</p>
                      <Badge className={cn('text-xs', getSeverityColor(alert.severity))}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Kavach & Legacy Systems Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="h-5 w-5 text-primary" />
              Safety Systems Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Kavach (TCAS)',
                  status: 'active',
                  coverage: '2,500 km',
                  uptime: 99.8,
                },
                { name: 'AWS - Mumbai Suburban', status: 'active', coverage: '465 km', uptime: 97.2 },
                { name: 'TPWS Trial Sections', status: 'active', coverage: '342 km', uptime: 98.5 },
                { name: 'ACD (Legacy)', status: 'deprecated', coverage: '150 km', uptime: 85.0 },
              ].map((system) => (
                <div
                  key={system.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-3 w-3 rounded-full',
                        system.status === 'active'
                          ? 'bg-success animate-pulse'
                          : system.status === 'deprecated'
                          ? 'bg-muted-foreground'
                          : 'bg-warning'
                      )}
                    />
                    <div>
                      <p className="font-medium text-sm">{system.name}</p>
                      <p className="text-xs text-muted-foreground">Coverage: {system.coverage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        'font-bold',
                        system.uptime >= 98
                          ? 'text-success'
                          : system.uptime >= 90
                          ? 'text-warning'
                          : 'text-destructive'
                      )}
                    >
                      {system.uptime}%
                    </p>
                    <p className="text-xs text-muted-foreground">uptime</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/safety/legacy">
              <Button variant="outline" className="w-full mt-4">
                View Legacy Integration Details
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Train className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-xs text-muted-foreground">Trains Monitored</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success/5 to-transparent">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">68,103</p>
                <p className="text-xs text-muted-foreground">Track km Covered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning/5 to-transparent">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">-23%</p>
                <p className="text-xs text-muted-foreground">Incident Reduction</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-info/5 to-transparent">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-info" />
              <div>
                <p className="text-2xl font-bold">82%</p>
                <p className="text-xs text-muted-foreground">Swachh Bharat Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
