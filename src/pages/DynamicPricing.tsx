import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart,
  Zap,
  Target,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { generatePricingData, formatINR } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { cn } from '@/lib/utils';

const pricingData = generatePricingData(12);

// Historical pricing trends
const trendData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  basePrice: 1200 + Math.random() * 200,
  dynamicPrice: 1200 + Math.random() * 400 + (i > 15 ? 200 : 0),
  demand: 60 + Math.random() * 30,
}));

export default function DynamicPricing() {
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [priceFloor, setPriceFloor] = useState([80]);
  const [priceCeiling, setPriceCeiling] = useState([150]);

  const stats = {
    revenueIncrease: 12.5,
    avgPriceChange: 8.3,
    optimizedRoutes: 847,
    demandAccuracy: 94.2,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dynamic Pricing Engine</h1>
          <p className="text-muted-foreground">
            AI-powered real-time ticket pricing optimization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
            <Zap className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-success">AI Active</span>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync Prices
          </Button>
          <Button size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Revenue Increase"
          value={stats.revenueIncrease}
          unit="%"
          change={2.3}
          trend="up"
          icon={TrendingUp}
          iconColor="text-success"
        />
        <MetricCard
          title="Avg Price Change"
          value={stats.avgPriceChange}
          unit="%"
          icon={BarChart}
          iconColor="text-primary"
        />
        <MetricCard
          title="Optimized Routes"
          value={stats.optimizedRoutes}
          icon={Target}
          iconColor="text-info"
        />
        <MetricCard
          title="Demand Accuracy"
          value={stats.demandAccuracy}
          unit="%"
          icon={Zap}
          iconColor="text-warning"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pricing Trend Chart */}
        <div className="lg:col-span-2 chart-container">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Pricing Trends</h3>
              <p className="text-sm text-muted-foreground">Base vs Dynamic pricing (30 days)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                <span className="text-sm text-muted-foreground">Base Price</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Dynamic Price</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="dynamicGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="day"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `Day ${value}`}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`₹${value.toFixed(0)}`, '']}
              />
              <Line
                type="monotone"
                dataKey="basePrice"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="dynamicPrice"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                fill="url(#dynamicGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Controls Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Pricing Controls
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal text-muted-foreground">Auto-optimize</span>
                <Switch checked={autoOptimize} onCheckedChange={setAutoOptimize} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Price Floor</label>
                <span className="text-sm text-muted-foreground">{priceFloor[0]}% of base</span>
              </div>
              <Slider
                value={priceFloor}
                onValueChange={setPriceFloor}
                min={50}
                max={100}
                step={5}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Price Ceiling</label>
                <span className="text-sm text-muted-foreground">{priceCeiling[0]}% of base</span>
              </div>
              <Slider
                value={priceCeiling}
                onValueChange={setPriceCeiling}
                min={100}
                max={200}
                step={5}
              />
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <h4 className="text-sm font-medium">Active Strategies</h4>
              {[
                { name: 'Early Bird Discount', active: true },
                { name: 'Last-Minute Premium', active: true },
                { name: 'Demand Surge', active: true },
                { name: 'Group Discount', active: false },
              ].map((strategy) => (
                <div key={strategy.name} className="flex items-center justify-between">
                  <span className="text-sm">{strategy.name}</span>
                  <Switch checked={strategy.active} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Pricing Table */}
      <div className="chart-container p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold">Route-wise Pricing</h3>
          <p className="text-sm text-muted-foreground">Current price recommendations by AI</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Route</TableHead>
              <TableHead className="text-right">Base Price</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-center">Change</TableHead>
              <TableHead className="text-center">Demand</TableHead>
              <TableHead className="text-center">Occupancy</TableHead>
              <TableHead className="text-right">AI Suggested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pricingData.map((route) => (
              <TableRow key={route.route} className="data-table-row">
                <TableCell>
                  <div>
                    <p className="font-medium">{route.route}</p>
                    <p className="text-xs text-muted-foreground">{route.routeName}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatINR(route.basePrice)}
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {formatINR(route.currentPrice)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={cn(
                      'gap-1',
                      route.priceChange >= 0
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-destructive/10 text-destructive border-destructive/20'
                    )}
                  >
                    {route.priceChange >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {route.priceChange >= 0 ? '+' : ''}{route.priceChange.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        route.demandIndex > 1.2
                          ? 'bg-destructive'
                          : route.demandIndex > 0.8
                          ? 'bg-success'
                          : 'bg-warning'
                      )}
                    />
                    <span className="font-mono">{route.demandIndex.toFixed(2)}x</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          route.occupancy > 85
                            ? 'bg-destructive'
                            : route.occupancy > 60
                            ? 'bg-success'
                            : 'bg-warning'
                        )}
                        style={{ width: `${route.occupancy}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm">{route.occupancy}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn(
                    'font-mono font-medium',
                    route.suggestedPrice > route.currentPrice ? 'text-success' : 'text-destructive'
                  )}>
                    {formatINR(route.suggestedPrice)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'Peak Demand Detected',
            description: 'NDLS-BCT route showing 45% higher demand. Consider 15% price increase.',
            type: 'warning',
          },
          {
            title: 'Revenue Optimization',
            description: 'Implementing early bird discounts could increase bookings by 23%.',
            type: 'info',
          },
          {
            title: 'Competitor Alert',
            description: 'Flight prices on Delhi-Mumbai increased by 18%. Rail advantage improved.',
            type: 'success',
          },
        ].map((insight) => (
          <Card
            key={insight.title}
            className={cn(
              'border-l-4',
              insight.type === 'warning' && 'border-l-warning',
              insight.type === 'info' && 'border-l-info',
              insight.type === 'success' && 'border-l-success'
            )}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className={cn(
                  'h-4 w-4',
                  insight.type === 'warning' && 'text-warning',
                  insight.type === 'info' && 'text-info',
                  insight.type === 'success' && 'text-success'
                )} />
                AI Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{insight.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
