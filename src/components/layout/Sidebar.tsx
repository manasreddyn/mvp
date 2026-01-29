import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Truck,
  Gavel,
  TrendingUp,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Train,
  Zap,
  Cpu,
  Users,
  Building,
  Eye,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Rewind,
  FileWarning,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  children?: { label: string; path: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  {
    icon: BarChart3,
    label: 'Data Analytics',
    path: '/analytics',
    children: [
      { label: 'Power & Electricity', path: '/analytics/power', icon: Zap },
      { label: 'IoT Telemetry', path: '/analytics/iot', icon: Cpu },
      { label: 'Ticketing Traffic', path: '/analytics/ticketing', icon: Users },
      { label: 'Footfall Analytics', path: '/analytics/footfall', icon: Eye },
      { label: 'Asset Management', path: '/analytics/assets', icon: Building },
    ],
  },
  { icon: Truck, label: 'Logistics Hub', path: '/logistics' },
  { icon: Gavel, label: 'Auction Dashboard', path: '/auction' },
  { icon: TrendingUp, label: 'Dynamic Pricing', path: '/pricing' },
  { icon: Activity, label: 'Platform Efficiency', path: '/platform' },
  {
    icon: ShieldCheck,
    label: 'Safety Metrics',
    path: '/safety',
    children: [
      { label: 'Track Safety', path: '/safety/track', icon: Activity },
      { label: 'Collision Prevention', path: '/safety/collision', icon: AlertTriangle },
      { label: 'Cleanliness', path: '/safety/cleanliness', icon: Sparkles },
      { label: 'Legacy Integration', path: '/safety/legacy', icon: Rewind },
      { label: 'Incident Management', path: '/safety/incident', icon: FileWarning },
    ],
  },
  { icon: Settings, label: 'Admin Panel', path: '/admin' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const toggleExpanded = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Train className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-slide-in-left">
              <h1 className="text-lg font-bold text-sidebar-foreground">RailSync</h1>
              <p className="text-xs text-sidebar-foreground/60">Pro Platform</p>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive(item.path)
                        ? 'bg-sidebar-accent text-sidebar-primary'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 transition-transform',
                            expandedItem === item.label && 'rotate-90'
                          )}
                        />
                      </>
                    )}
                  </button>
                  {!collapsed && expandedItem === item.label && (
                    <ul className="mt-1 ml-4 space-y-1 border-l border-sidebar-border pl-4">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            className={cn(
                              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                              location.pathname === child.path
                                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                            )}
                          >
                            <child.icon className="h-4 w-4" />
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive(item.path)
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                  {item.badge && !collapsed && (
                    <span className="ml-auto rounded-full bg-sidebar-primary px-2 py-0.5 text-xs font-semibold text-sidebar-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary">
              <span className="text-sm font-semibold text-sidebar-primary-foreground">IR</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Indian Railways</p>
              <p className="text-xs text-sidebar-foreground/60">Connected</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-track-green animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
