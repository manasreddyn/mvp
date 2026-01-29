import { useState } from 'react';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  Plus,
  ArrowRight,
  Flame,
  Droplets,
  Zap,
  Car,
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { generateLogisticsRequests, majorStations, formatINR } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const requests = generateLogisticsRequests(25);

const getCargoIcon = (type: string) => {
  switch (type) {
    case 'chemicals':
      return <Droplets className="h-4 w-4" />;
    case 'oil_gas':
      return <Flame className="h-4 w-4" />;
    case 'automotive':
      return <Car className="h-4 w-4" />;
    case 'electronics':
      return <Zap className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-success/10 text-success border-success/20';
    case 'in_transit':
      return 'bg-info/10 text-info border-info/20';
    case 'matched':
      return 'bg-warning/10 text-warning border-warning/20';
    default:
      return 'bg-muted text-muted-foreground border-muted';
  }
};

// AI Recommendations mock
const aiRecommendations = [
  {
    trainNumber: '12952',
    name: 'Mumbai Rajdhani',
    departureTime: '16:30',
    arrivalTime: '08:35',
    transitTime: 16.08,
    cost: 85000,
    capacityAvailable: 120,
    matchScore: 94,
    riskScore: 'low',
  },
  {
    trainNumber: '12301',
    name: 'Kolkata Rajdhani',
    departureTime: '17:00',
    arrivalTime: '10:10',
    transitTime: 17.17,
    cost: 78000,
    capacityAvailable: 85,
    matchScore: 88,
    riskScore: 'low',
  },
  {
    trainNumber: '12565',
    name: 'Bihar Sampark Kranti',
    departureTime: '18:45',
    arrivalTime: '08:00',
    transitTime: 13.25,
    cost: 62000,
    capacityAvailable: 200,
    matchScore: 82,
    riskScore: 'medium',
  },
];

export default function LogisticsHub() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = {
    activeShipments: requests.filter((r) => r.status === 'in_transit').length,
    pendingRequests: requests.filter((r) => r.status === 'pending').length,
    deliveredToday: 47,
    totalVolume: requests.reduce((acc, r) => acc + r.weight, 0),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Logistics Hub</h1>
          <p className="text-muted-foreground">
            AI-powered freight management with smart train matching
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Booking
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Shipments"
          value={stats.activeShipments}
          icon={Truck}
          iconColor="text-info"
        />
        <MetricCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={Clock}
          iconColor="text-warning"
        />
        <MetricCard
          title="Delivered Today"
          value={stats.deliveredToday}
          change={12}
          trend="up"
          icon={CheckCircle}
          iconColor="text-success"
        />
        <MetricCard
          title="Total Volume"
          value={stats.totalVolume.toLocaleString()}
          unit="Tonnes"
          icon={Package}
          iconColor="text-primary"
        />
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="bookings">Active Bookings</TabsTrigger>
          <TabsTrigger value="new">New Request</TabsTrigger>
          <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          {/* Search & Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, shipper, or route..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bookings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.slice(0, 9).map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono">{request.id}</CardTitle>
                    <Badge className={cn('capitalize', getStatusColor(request.status))}>
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getCargoIcon(request.cargoType)}
                    <span className="text-sm font-medium capitalize">
                      {request.cargoType.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{request.weight}T</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{request.origin.code}</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{request.destination.code}</span>
                    </div>
                    <span className="text-muted-foreground ml-auto">{request.distance} km</span>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{request.shipper}</span>
                    <span className="font-semibold text-sm">{formatINR(request.estimatedCost)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Cargo Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Company Name</label>
                  <Input placeholder="Enter company name" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Cargo Type</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select cargo type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Goods</SelectItem>
                      <SelectItem value="chemicals">Chemicals</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="fmcg">FMCG</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="oil_gas">Oil & Gas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Weight (Tonnes)</label>
                    <Input type="number" placeholder="0" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Volume (m³)</label>
                    <Input type="number" placeholder="0" className="mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Origin Station</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {majorStations.map((station) => (
                        <SelectItem key={station.code} value={station.code}>
                          {station.name} ({station.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Destination Station</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {majorStations.map((station) => (
                        <SelectItem key={station.code} value={station.code}>
                          {station.name} ({station.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full mt-4">
                  Find Best Trains
                </Button>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-warning" />
                AI Recommendations
              </h3>
              <div className="space-y-3">
                {aiRecommendations.map((train, index) => (
                  <Card key={train.trainNumber} className={cn(
                    "hover:shadow-lg transition-all cursor-pointer",
                    index === 0 && "border-primary ring-1 ring-primary/20"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{train.trainNumber}</span>
                            <span className="text-muted-foreground">{train.name}</span>
                            {index === 0 && (
                              <Badge className="bg-primary text-primary-foreground">
                                Best Match
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Departure</p>
                              <p className="font-medium">{train.departureTime}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Arrival</p>
                              <p className="font-medium">{train.arrivalTime}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Transit</p>
                              <p className="font-medium">{train.transitTime}h</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Capacity</p>
                              <p className="font-medium">{train.capacityAvailable}T</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{train.matchScore}%</div>
                          <div className="text-sm text-muted-foreground">Match Score</div>
                          <div className="mt-2">
                            <span className="text-lg font-semibold">{formatINR(train.cost)}</span>
                          </div>
                          <Badge className={cn(
                            "mt-1",
                            train.riskScore === 'low' ? 'badge-success' : 'badge-warning'
                          )}>
                            {train.riskScore} risk
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button size="sm">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tracking">
          <div className="chart-container min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Live Shipment Tracking</h3>
              <p className="text-muted-foreground">
                Select an active shipment to view real-time location
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
