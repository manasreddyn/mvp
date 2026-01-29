
import { useState } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { trackSafetyData } from "@/lib/safetyMockData";
import { Activity, AlertTriangle, Gauge, Timer, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrackSafety() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Mock data for the chart
    const geometryData = [
        { name: 'Day 1', gauge: 2.4, crossLevel: 1.2 },
        { name: 'Day 2', gauge: 2.6, crossLevel: 1.3 },
        { name: 'Day 3', gauge: 2.8, crossLevel: 1.5 },
        { name: 'Day 4', gauge: 3.2, crossLevel: 1.8 }, // Spike
        { name: 'Day 5', gauge: 3.0, crossLevel: 1.6 },
        { name: 'Day 6', gauge: 2.9, crossLevel: 1.5 },
        { name: 'Day 7', gauge: 2.8, crossLevel: 1.4 },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Top Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex gap-4 w-full md:w-auto">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Zone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Zones</SelectItem>
                            <SelectItem value="north">North</SelectItem>
                            <SelectItem value="south">South</SelectItem>
                            <SelectItem value="east">East</SelectItem>
                            <SelectItem value="west">West</SelectItem>
                            <SelectItem value="central">Central</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="relative w-full md:w-[240px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search Section ID..." className="pl-8" />
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    {/* Date Picker Placeholder */}
                    <Button variant="outline">Last 7 Days</Button>
                    <Button>Apply Filters</Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricCard
                    title="Sections Monitored"
                    value="1,248"
                    icon={Activity}
                    iconColor="text-blue-500"
                />
                <MetricCard
                    title="Critical Alerts"
                    value="3"
                    trend="up"
                    change={12}
                    icon={AlertTriangle}
                    iconColor="text-red-500"
                />
                <MetricCard
                    title="Avg Health Score"
                    value="84"
                    unit="/100"
                    icon={Gauge}
                    iconColor="text-green-500"
                />
                <MetricCard
                    title="Maintenance Pending"
                    value="15"
                    icon={Timer}
                    iconColor="text-orange-500"
                />
                <MetricCard
                    title="Speed Restrictions"
                    value="8"
                    icon={AlertTriangle}
                    iconColor="text-yellow-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Geographic Track Health Map Placeholder */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Geographic Track Health Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] bg-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed">
                            <div className="text-center">
                                <Gauge className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">Interactive Map Component (Leaflet)</p>
                                <p className="text-sm text-muted-foreground/60">Would display color-coded track sections</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Track Geometry Trends Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Track Geometry Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={geometryData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="gauge" stroke="#8884d8" name="Gauge Deviation" />
                                    <Line type="monotone" dataKey="crossLevel" stroke="#82ca9d" name="Cross Level" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Track Defects Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Track Defects</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="p-3">Section ID</th>
                                    <th className="p-3">KM Post</th>
                                    <th className="p-3">Defect Type</th>
                                    <th className="p-3">Severity</th>
                                    <th className="p-3">Detected</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="p-3 font-medium cursor-pointer hover:text-primary">{trackSafetyData.sectionId}</td>
                                    <td className="p-3">{trackSafetyData.kilometerPost}</td>
                                    <td className="p-3">Crack Detected</td>
                                    <td className="p-3"><span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">Critical</span></td>
                                    <td className="p-3">Today</td>
                                    <td className="p-3 text-orange-600">Open</td>
                                    <td className="p-3"><Button size="sm" variant="outline">View</Button></td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-3 font-medium">NDLS-CNB-SEC-2</td>
                                    <td className="p-3">45.2</td>
                                    <td className="p-3">Gauge Deviation</td>
                                    <td className="p-3"><span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Moderate</span></td>
                                    <td className="p-3">Yesterday</td>
                                    <td className="p-3 text-blue-600">In Progress</td>
                                    <td className="p-3"><Button size="sm" variant="outline">View</Button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
