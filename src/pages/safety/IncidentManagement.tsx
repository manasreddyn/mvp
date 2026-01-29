
import { incidentData } from "@/lib/safetyMockData";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AlertCircle, Clock, FileText, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function IncidentManagement() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Dashboard Overview - KPI Cards */}
            <h1 className="text-3xl font-bold tracking-tight">Incident Management System</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <MetricCard title="Total Incidents" value="12" change={5} trend="up" icon={FileText} />
                <MetricCard title="Fatalities" value="0" icon={AlertCircle} iconColor="text-green-500" />
                <MetricCard title="Serious Injuries" value="3" icon={AlertCircle} iconColor="text-red-500" />
                <MetricCard title="Minor Incidents" value="8" icon={AlertCircle} iconColor="text-yellow-500" />
                <MetricCard title="Avg Response" value="8.5m" trend="down" icon={Clock} iconColor="text-blue-500" />
                <MetricCard title="Open Cases" value="2" icon={FileText} iconColor="text-orange-500" />
            </div>

            {/* Map and Log Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Incident Map & Heatmap</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] bg-slate-100 rounded-lg flex items-center justify-center border">
                            <p className="text-muted-foreground">Interactive Map (Leaflet) - Showing Incident Locations</p>
                            {/* Placeholder Marker */}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input placeholder="Search Incident ID..." />
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                                <SelectItem value="serious">Serious</SelectItem>
                                <SelectItem value="minor">Minor</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button className="w-full">Apply Filters</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Incident Log Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Incident Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="p-3">Incident ID</th>
                                    <th className="p-3">Date & Time</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Severity</th>
                                    <th className="p-3">Location</th>
                                    <th className="p-3">Casualties</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="p-3 font-medium text-blue-600 cursor-pointer">{incidentData.incidentId}</td>
                                    <td className="p-3">{new Date(incidentData.timestamp).toLocaleString()}</td>
                                    <td className="p-3 capitalize">{incidentData.type}</td>
                                    <td className="p-3"><Badge variant="destructive">Serious</Badge></td>
                                    <td className="p-3">{incidentData.location.stationCode} (KM {incidentData.location.kilometerPost})</td>
                                    <td className="p-3">3 Injured</td>
                                    <td className="p-3 bg-yellow-50 text-yellow-700 font-medium">Investigating</td>
                                    <td className="p-3"><Button size="sm" variant="outline">Details</Button></td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-3 font-medium text-blue-600 cursor-pointer">INC-2026-002</td>
                                    <td className="p-3">2026-01-27 10:15:00</td>
                                    <td className="p-3 capitalize">SPAD</td>
                                    <td className="p-3"><Badge variant="outline" className="text-orange-500 border-orange-500">Moderate</Badge></td>
                                    <td className="p-3">CNB-ALD-SEC-1</td>
                                    <td className="p-3">None</td>
                                    <td className="p-3 text-green-600 font-medium">Resolved</td>
                                    <td className="p-3"><Button size="sm" variant="outline">Details</Button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Feature: Incident Prediction Dashboard Link or Component */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardContent className="p-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-blue-900">Incident Prediction AI</h3>
                        <p className="text-blue-700">View high-risk zones based on predictive analysis.</p>
                    </div>
                    <Button>View Prediction Dashboard</Button>
                </CardContent>
            </Card>
        </div>
    );
}
