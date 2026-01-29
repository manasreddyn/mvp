import {
  IndianRupee,
  Train,
  Users,
  Activity,
  Cpu,
  Truck,
  Gavel,
  Zap,
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { PowerConsumptionChart } from '@/components/charts/PowerConsumptionChart';
import { FootfallChart } from '@/components/charts/FootfallChart';
import { TicketingChart } from '@/components/charts/TicketingChart';
import { PlatformUtilizationChart } from '@/components/charts/PlatformUtilizationChart';
import { RecentAlerts } from '@/components/dashboard/RecentAlerts';
import { getDashboardStats } from '@/lib/mockData';

const stats = getDashboardStats();

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of Indian Railways IoT platform
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium">Live Data</span>
          <span className="text-xs text-muted-foreground">
            Updated {new Date().toLocaleTimeString('en-IN')}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={stats.totalRevenue.value}
          unit={stats.totalRevenue.unit}
          change={stats.totalRevenue.change}
          trend={stats.totalRevenue.trend as 'up' | 'down'}
          icon={IndianRupee}
          iconColor="text-success"
        />
        <MetricCard
          title="Active Trains"
          value={stats.activeTrains.value.toLocaleString()}
          change={stats.activeTrains.change}
          trend={stats.activeTrains.trend as 'up' | 'down'}
          icon={Train}
          iconColor="text-primary"
        />
        <MetricCard
          title="Daily Passengers"
          value={stats.dailyPassengers.value}
          unit={stats.dailyPassengers.unit}
          change={stats.dailyPassengers.change}
          trend={stats.dailyPassengers.trend as 'up' | 'down'}
          icon={Users}
          iconColor="text-info"
        />
        <MetricCard
          title="On-Time Performance"
          value={stats.onTimePerformance.value}
          unit={stats.onTimePerformance.unit}
          change={stats.onTimePerformance.change}
          trend={stats.onTimePerformance.trend as 'up' | 'down'}
          icon={Activity}
          iconColor="text-warning"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active IoT Devices"
          value={stats.activeDevices.value.toLocaleString()}
          change={stats.activeDevices.change}
          trend={stats.activeDevices.trend as 'up' | 'down'}
          icon={Cpu}
          iconColor="text-chart-5"
        />
        <MetricCard
          title="Freight Volume"
          value={stats.freightVolume.value}
          unit={stats.freightVolume.unit}
          change={stats.freightVolume.change}
          trend={stats.freightVolume.trend as 'up' | 'down'}
          icon={Truck}
          iconColor="text-chart-2"
        />
        <MetricCard
          title="Active Tenders"
          value={stats.activeTenders.value}
          change={stats.activeTenders.change}
          trend={stats.activeTenders.trend as 'up' | 'down'}
          icon={Gavel}
          iconColor="text-chart-3"
        />
        <MetricCard
          title="Power Consumption"
          value={stats.powerConsumption.value}
          unit={stats.powerConsumption.unit}
          change={stats.powerConsumption.change}
          trend={stats.powerConsumption.trend as 'up' | 'down'}
          icon={Zap}
          iconColor="text-chart-4"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PowerConsumptionChart />
        <FootfallChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TicketingChart />
        </div>
        <PlatformUtilizationChart />
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAlerts />
        
        {/* Quick Actions */}
        <div className="chart-container">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Frequently used operations</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Train, label: 'Track Train', color: 'bg-primary/10 text-primary' },
              { icon: Cpu, label: 'Device Status', color: 'bg-info/10 text-info' },
              { icon: Users, label: 'Passenger Report', color: 'bg-success/10 text-success' },
              { icon: Zap, label: 'Power Analytics', color: 'bg-warning/10 text-warning' },
              { icon: Truck, label: 'Freight Booking', color: 'bg-chart-5/10 text-chart-5' },
              { icon: Gavel, label: 'View Tenders', color: 'bg-chart-3/10 text-chart-3' },
            ].map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
