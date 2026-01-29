
import { MetricCard } from "@/components/dashboard/MetricCard";
import { collisionPreventionData } from "@/lib/safetyMockData";
import { AlertOctagon, Radio, Satellite, ShieldCheck, Signal, Train, Wifi, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CollisionPrevention() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Main Map Area */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="h-[500px] flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Real-time Train Tracking</CardTitle>
                                    <CardDescription>Live collision risk monitoring</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1 text-sm"><div className="w-3 h-3 rounded-full bg-green-500"></div> Safe</div>
                                    <div className="flex items-center gap-1 text-sm"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Monitor</div>
                                    <div className="flex items-center gap-1 text-sm"><div className="w-3 h-3 rounded-full bg-red-500"></div> Warning</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 bg-slate-900 rounded-b-lg relative overflow-hidden p-0">
                            {/* Placeholder for Map */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                <div className="text-center">
                                    <Satellite className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-xl font-semibold">Interactive Rail Map</h3>
                                    <p>Displaying train {collisionPreventionData.trainId} at {collisionPreventionData.latitude}, {collisionPreventionData.longitude}</p>
                                    <p className="text-sm mt-2">Collision Risk: <span className="text-red-400 font-bold">High</span> (Simulated)</p>
                                </div>
                            </div>

                            {/* Simulated Overlay */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-64 h-64 rounded-full border-2 border-red-500/50 bg-red-500/10 flex items-center justify-center animate-pulse">
                                    <div className="w-32 h-32 rounded-full border-2 border-red-500 bg-red-500/20"></div>
                                </div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8 text-white font-mono text-xs bg-black/50 px-2 rounded">
                                DIST: 1200m | CLOSING RATE: 15m/s
                            </div>
                        </CardContent>
                    </Card>

                    {/* Proximity Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Train-to-Train Proximity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="p-3">Train A</th>
                                            <th className="p-3">Train B</th>
                                            <th className="p-3">Distance</th>
                                            <th className="p-3">Closing Rate</th>
                                            <th className="p-3">Time to Impact</th>
                                            <th className="p-3">Risk Score</th>
                                            <th className="p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {collisionPreventionData.nearbyTrains.map((train, i) => (
                                            <tr key={i} className="border-b">
                                                <td className="p-3 font-medium">{collisionPreventionData.trainId}</td>
                                                <td className="p-3">{train.trainId}</td>
                                                <td className="p-3">{train.relativeDistance}m</td>
                                                <td className="p-3 text-red-500">{Math.abs(train.relativeSpeed)} m/s</td>
                                                <td className="p-3 font-bold text-red-600">{train.timeToCollision}s</td>
                                                <td className="p-3">{(train.collisionRisk * 100).toFixed(0)}%</td>
                                                <td className="p-3"><Badge variant="destructive">AUTO-BRAKE</Badge></td>
                                            </tr>
                                        ))}
                                        <tr className="border-b opacity-60">
                                            <td className="p-3 font-medium">99887-LCL</td>
                                            <td className="p-3">44556-EXP</td>
                                            <td className="p-3">4500m</td>
                                            <td className="p-3">0 m/s</td>
                                            <td className="p-3">N/A</td>
                                            <td className="p-3">5%</td>
                                            <td className="p-3"><Badge variant="outline">MONITOR</Badge></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel: System Status & Alerts */}
                <div className="space-y-6">
                    {/* System Status Panel */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-card">
                            <CardContent className="p-4 flex flex-col items-center text-center">
                                <ShieldCheck className="h-8 w-8 text-green-500 mb-2" />
                                <span className="text-xs text-muted-foreground">Kavach</span>
                                <span className="font-bold text-green-600">ACTIVE</span>
                            </CardContent>
                        </Card>
                        <Card className="bg-card">
                            <CardContent className="p-4 flex flex-col items-center text-center">
                                <Signal className="h-8 w-8 text-green-500 mb-2" />
                                <span className="text-xs text-muted-foreground">GPS Signal</span>
                                <span className="font-bold">98%</span>
                            </CardContent>
                        </Card>
                        <Card className="bg-card">
                            <CardContent className="p-4 flex flex-col items-center text-center">
                                <Wifi className="h-8 w-8 text-yellow-500 mb-2" />
                                <span className="text-xs text-muted-foreground">Comm.</span>
                                <span className="font-bold">Weak</span>
                            </CardContent>
                        </Card>
                        <Card className="bg-card">
                            <CardContent className="p-4 flex flex-col items-center text-center">
                                <Radio className="h-8 w-8 text-slate-400 mb-2" />
                                <span className="text-xs text-muted-foreground">AWS</span>
                                <span className="font-bold">Standby</span>
                            </CardContent>
                        </Card>
                    </div>

                    <MetricCard
                        title="System Health"
                        value="94%"
                        icon={Activity}
                        iconColor="text-green-500"
                    />

                    {/* Active Risk Alerts */}
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle className="text-lg">Active Risk Alerts</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[400px]">
                                <div className="space-y-1">
                                    <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-red-700 dark:text-red-400">Collision Risk</h4>
                                            <span className="text-xs text-muted-foreground">Now</span>
                                        </div>
                                        <p className="text-sm mt-1">Closing speed high between {collisionPreventionData.trainId} and {collisionPreventionData.nearbyTrains[0].trainId}.</p>
                                        <div className="mt-2 flex gap-2">
                                            <Button size="sm" variant="destructive" className="h-8">Emergency Stop</Button>
                                            <Button size="sm" variant="outline" className="h-8">View Cam</Button>
                                        </div>
                                    </div>
                                    <div className="p-4 border-l-4 border-yellow-500">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-yellow-700">Signal Passed at Danger</h4>
                                            <span className="text-xs text-muted-foreground">10m ago</span>
                                        </div>
                                        <p className="text-sm mt-1">Train 55443 passed red signal S-29.</p>
                                        <Button size="sm" variant="outline" className="h-8 mt-2">Investigate</Button>
                                    </div>
                                    <div className="p-4 border-b">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium">GPS Signal Lost</h4>
                                            <span className="text-xs text-muted-foreground">2h ago</span>
                                        </div>
                                        <p className="text-sm mt-1 text-muted-foreground">Intermittent signal loss in Zone South-4.</p>
                                    </div>
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
