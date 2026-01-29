import { useState } from 'react';
import {
  Gavel,
  FileText,
  Users,
  Clock,
  TrendingUp,
  Search,
  Plus,
  Eye,
  Download,
  Filter,
  Calendar,
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { generateTenders, formatINR, formatNumber } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const tenders = generateTenders(20);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-success/10 text-success border-success/20';
    case 'evaluation':
      return 'bg-info/10 text-info border-info/20';
    case 'awarded':
      return 'bg-primary/10 text-primary border-primary/20';
    default:
      return 'bg-muted text-muted-foreground border-muted';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'energy':
      return '⚡';
    case 'technology':
      return '💻';
    case 'equipment':
      return '🔧';
    default:
      return '🏗️';
  }
};

export default function AuctionDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = {
    activeTenders: tenders.filter((t) => t.status === 'open').length,
    totalValue: tenders.reduce((acc, t) => acc + t.estimatedValue, 0),
    bidsReceived: tenders.reduce((acc, t) => acc + t.bidsReceived, 0),
    avgBidTime: 12,
  };

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tender.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auction Dashboard</h1>
          <p className="text-muted-foreground">
            Tender management and AI-powered bid evaluation
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Tender
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Tenders"
          value={stats.activeTenders}
          change={12}
          trend="up"
          icon={Gavel}
          iconColor="text-primary"
        />
        <MetricCard
          title="Total Tender Value"
          value={formatNumber(stats.totalValue)}
          icon={TrendingUp}
          iconColor="text-success"
        />
        <MetricCard
          title="Bids Received"
          value={stats.bidsReceived}
          change={8}
          trend="up"
          icon={FileText}
          iconColor="text-info"
        />
        <MetricCard
          title="Avg. Bid-to-Award"
          value={stats.avgBidTime}
          unit="days"
          icon={Clock}
          iconColor="text-warning"
        />
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'Energy & Power', count: 12, value: '₹45 Cr', icon: '⚡' },
          { name: 'Technology & IoT', count: 8, value: '₹28 Cr', icon: '💻' },
          { name: 'Rolling Stock', count: 15, value: '₹120 Cr', icon: '🚂' },
          { name: 'Infrastructure', count: 10, value: '₹85 Cr', icon: '🏗️' },
        ].map((category) => (
          <Card key={category.name} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{category.name}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold">{category.count}</span>
                    <span className="text-xs text-muted-foreground">• {category.value}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">All Tenders</TabsTrigger>
          <TabsTrigger value="evaluation">Under Evaluation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tenders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="evaluation">Evaluation</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tenders Table */}
          <div className="chart-container p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Tender ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Est. Value</TableHead>
                  <TableHead className="text-center">Bids</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenders.map((tender) => {
                  const daysRemaining = getDaysRemaining(tender.deadline);
                  return (
                    <TableRow key={tender.id} className="data-table-row">
                      <TableCell className="font-mono font-medium">{tender.id}</TableCell>
                      <TableCell>
                        <div className="max-w-[250px]">
                          <p className="font-medium truncate">{tender.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Published: {new Date(tender.publishedDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <span>{getCategoryIcon(tender.category)}</span>
                          <span className="capitalize">{tender.category}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatINR(tender.estimatedValue, true)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{tender.bidsReceived}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn('capitalize', getStatusColor(tender.status))}>
                          {tender.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm">
                              {new Date(tender.deadline).toLocaleDateString('en-IN')}
                            </p>
                            {daysRemaining > 0 ? (
                              <p className={cn(
                                "text-xs",
                                daysRemaining <= 7 ? "text-destructive" : "text-muted-foreground"
                              )}>
                                {daysRemaining} days left
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground">Expired</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="evaluation">
          <div className="chart-container min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Bid Evaluation</h3>
              <p className="text-muted-foreground">
                Select a tender to view and evaluate bids
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tender Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Average Bids per Tender', value: 8.5, max: 15 },
                    { label: 'Bid-to-Award Rate', value: 72, max: 100 },
                    { label: 'On-Time Completion', value: 89, max: 100 },
                    { label: 'Cost Savings', value: 12, max: 25 },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{metric.label}</span>
                        <span className="text-sm font-medium">
                          {metric.value}{metric.max === 100 ? '%' : ''}
                        </span>
                      </div>
                      <Progress value={(metric.value / metric.max) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Tata Projects Ltd.', contracts: 12, value: '₹245 Cr', rating: 4.8 },
                    { name: 'L&T Construction', contracts: 9, value: '₹189 Cr', rating: 4.7 },
                    { name: 'Siemens India', contracts: 7, value: '₹156 Cr', rating: 4.9 },
                    { name: 'BHEL', contracts: 6, value: '₹128 Cr', rating: 4.5 },
                    { name: 'ABB India', contracts: 5, value: '₹98 Cr', rating: 4.6 },
                  ].map((vendor, index) => (
                    <div
                      key={vendor.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {vendor.contracts} contracts • {vendor.value}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-warning">
                        <span className="font-medium">{vendor.rating}</span>
                        <span>★</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
