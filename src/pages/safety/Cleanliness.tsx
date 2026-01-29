
import { MetricCard } from "@/components/dashboard/MetricCard";
import { cleanlinessData } from "@/lib/safetyMockData";
import { Sparkles, Trash2, Wind, Users, Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Cleanliness() {
    const airQualityData = [
        { time: '06:00', aqi: 45 },
        { time: '09:00', aqi: 85 },
        { time: '12:00', aqi: 110 },
        { time: '15:00', aqi: 95 },
        { time: '18:00', aqi: 120 },
        { time: '21:00', aqi: 80 },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Top Selector Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex gap-4 items-center">
                    <Select defaultValue="ndls">
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Station" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ndls">New Delhi (NDLS)</SelectItem>
                            <SelectItem value="csm">CSMT Mumbai</SelectItem>
                            <SelectItem value="hwh">Howrah Junction</SelectItem>
                        </SelectContent>
                    </Select>
                    <Tabs defaultValue="station" className="w-[300px]">
                        <TabsList>
                            <TabsTrigger value="station">Station View</TabsTrigger>
                            <TabsTrigger value="train">Train View</TabsTrigger>
                            <TabsTrigger value="track">Track View</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <Button variant="outline">Download Report</Button>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Station Cleanliness"
                    value={cleanlinessData.cleanlinessScore}
                    unit="/100"
                    icon={Sparkles}
                    iconColor="text-blue-500"
                />
                <MetricCard
                    title="Swachh Bharat Compliance"
                    value="92%"
                    trend="up"
                    change={5}
                    icon={CheckCircle2}
                    iconColor="text-green-500"
                />
                <MetricCard
                    title="Passenger Rating"
                    value={cleanlinessData.passengerRating}
                    unit="/ 5.0"
                    icon={Users}
                    iconColor="text-yellow-500"
                />
                <MetricCard
                    title="AQI Status"
                    value={cleanlinessData.airQualityIndex}
                    unit="Moderate"
                    icon={Wind}
                    iconColor="text-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Floor Plan / Heatmap */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Station Floor Plan & Cleanliness Heatmap</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] bg-slate-100 rounded-lg relative overflow-hidden border border-slate-200">
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                <p>Interactive Floor Plan SVG Overlay</p>
                            </div>
                            {/* Mock Heatmap Zones */}
                            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/30 rounded-lg flex items-center justify-center border border-green-500 hover:bg-green-500/50 cursor-pointer transition-colors">
                                <span className="text-xs font-bold bg-white/80 px-1 rounded">Platform 1 (Good)</span>
                            </div>
                            <div className="absolute bottom-1/4 right-1/4 w-40 h-20 bg-red-500/30 rounded-lg flex items-center justify-center border border-red-500 hover:bg-red-500/50 cursor-pointer transition-colors">
                                <span className="text-xs font-bold bg-white/80 px-1 rounded">Food Court (Dirty)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Air Quality & Litter Charts */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Air Quality Trends (AQI)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={airQualityData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="aqi" fill="#f97316" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                                <div className="bg-slate-100 p-2 rounded">
                                    <p className="text-muted-foreground">CO2</p>
                                    <p className="font-bold">{cleanlinessData.co2Level} ppm</p>
                                </div>
                                <div className="bg-slate-100 p-2 rounded">
                                    <p className="text-muted-foreground">PM 2.5</p>
                                    <p className="font-bold">{cleanlinessData.pm2_5}</p>
                                </div>
                                <div className="bg-slate-100 p-2 rounded">
                                    <p className="text-muted-foreground">Temp</p>
                                    <p className="font-bold">28°C</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Waste Bin Levels</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1 text-sm">
                                    <span>Platform 1 - Bin A</span>
                                    <span className="text-red-500 font-bold">95%</span>
                                </div>
                                <Progress value={95} className="h-2 bg-slate-100" /> {/* Need to check if I can color the indicator */}
                            </div>
                            <div>
                                <div className="flex justify-between mb-1 text-sm">
                                    <span>Main Hall - Bin B</span>
                                    <span className="text-yellow-600 font-bold">75%</span>
                                </div>
                                <Progress value={75} className="h-2 bg-slate-100" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1 text-sm">
                                    <span>Exit Gate - Bin C</span>
                                    <span className="text-green-600 font-bold">30%</span>
                                </div>
                                <Progress value={30} className="h-2 bg-slate-100" />
                            </div>
                            <Button className="w-full mt-2" size="sm">Notify Cleaning Crew</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* AI Visual Inspection Grid */}
            <h3 className="text-lg font-semibold">AI Visual Inspection Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <div className="h-32 bg-slate-200 relative">
                            {/* Placeholder Image */}
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                <Camera className="h-8 w-8" />
                            </div>
                            {i === 1 && (
                                <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded shadow border border-white">
                                    LITTER DETECTED
                                </div>
                            )}
                        </div>
                        <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-sm">Camera #{i}</p>
                                    <p className="text-xs text-muted-foreground">{i === 1 ? "Platform 3 (North)" : "Waiting Hall"}</p>
                                </div>
                                {i === 1 ? (
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                ) : (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
