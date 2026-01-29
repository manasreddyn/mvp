
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Gauge, Activity, AlertTriangle, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function SafetyDashboard() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Safety Metrics Overview</h1>
                    <p className="text-muted-foreground">Unified view of all safety modules</p>
                </div>
                <div className="flex gap-2">
                    <Button>Generate Daily Report</Button>
                </div>
            </div>

            {/* Unified Safety Score */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
                    <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center">
                        <h2 className="text-2xl font-light mb-4">Unified Safety Score</h2>
                        <div className="relative flex items-center justify-center">
                            <Gauge className="w-48 h-48 text-green-400 opacity-80" strokeWidth={1} />
                            <div className="absolute flex flex-col items-center">
                                <span className="text-6xl font-bold text-green-400">87</span>
                                <span className="text-sm text-slate-300">/ 100</span>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-8">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Track</p>
                                <p className="text-xl font-bold text-green-400">84%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Collision</p>
                                <p className="text-xl font-bold text-green-400">94%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Cleanliness</p>
                                <p className="text-xl font-bold text-yellow-400">72%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Link to="/safety/track">
                        <MetricCard
                            title="Track Safety"
                            value="Stable"
                            icon={Activity}
                            iconColor="text-blue-500"
                            className="h-full hover:border-primary transition-colors cursor-pointer"
                        />
                    </Link>
                    <Link to="/safety/collision">
                        <MetricCard
                            title="Collision Prevention"
                            value="Active"
                            icon={AlertTriangle}
                            iconColor="text-green-500"
                            className="h-full hover:border-primary transition-colors cursor-pointer"
                        />
                    </Link>
                    <Link to="/safety/cleanliness">
                        <MetricCard
                            title="Cleanliness"
                            value="Needs Attn"
                            icon={Sparkles}
                            iconColor="text-yellow-500"
                            className="h-full hover:border-primary transition-colors cursor-pointer"
                        />
                    </Link>
                    <Link to="/safety/incident">
                        <MetricCard
                            title="Incident Prediction"
                            value="Low Risk"
                            icon={TrendingUp}
                            iconColor="text-purple-500"
                            className="h-full hover:border-primary transition-colors cursor-pointer"
                        />
                    </Link>
                </div>
            </div>

            {/* Global Recent Alerts Feed */}
            <Card>
                <CardHeader>
                    <CardTitle>Global Safety Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-100">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-red-100 rounded-full text-red-600"><AlertTriangle className="h-5 w-5" /></div>
                                <div>
                                    <h4 className="font-semibold text-red-900">Collision Risk Detected</h4>
                                    <p className="text-sm text-red-700">Train 12345 & 67890 proximity warning in Sector 4.</p>
                                </div>
                            </div>
                            <Button size="sm" variant="destructive">View</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-100 rounded-full text-blue-600"><Activity className="h-5 w-5" /></div>
                                <div>
                                    <h4 className="font-semibold">Track Deviation</h4>
                                    <p className="text-sm text-muted-foreground">Minor gauge deviation reported in Zone North.</p>
                                </div>
                            </div>
                            <Button size="sm" variant="outline">Details</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600"><Sparkles className="h-5 w-5" /></div>
                                <div>
                                    <h4 className="font-semibold">Cleanliness Alert</h4>
                                    <p className="text-sm text-muted-foreground">Bin overflow at NDLS Platform 3.</p>
                                </div>
                            </div>
                            <Button size="sm" variant="outline">Deploy</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
