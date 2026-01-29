
import { legacySystemsData } from "@/lib/safetyMockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle, Info, ShieldCheck } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function LegacyIntegration() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Legacy Systems Integration</h1>
                <p className="text-muted-foreground">Evolution from manual operations to Kavach (TCAS)</p>
            </div>

            {/* Historical Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>Safety Systems Evolution Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex gap-4 pb-4">
                            {legacySystemsData.timeline.map((item, i) => (
                                <div key={i} className="flex flex-col items-center min-w-[200px] p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                    <span className="text-2xl font-bold text-primary">{item.era}</span>
                                    <div className="h-0.5 w-full bg-slate-200 my-2 relative">
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary"></div>
                                    </div>
                                    <h3 className="font-semibold mt-2">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground text-center whitespace-normal mt-1">{item.description}</p>
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* System Comparison Matrix */}
            <Card>
                <CardHeader>
                    <CardTitle>System Comparison Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-3 text-left">Feature</th>
                                    <th className="p-3">AWS</th>
                                    <th className="p-3">TPWS</th>
                                    <th className="p-3">ACD</th>
                                    <th className="p-3 bg-green-50 text-green-700 border-b-2 border-green-500">Kavach (Modern)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {legacySystemsData.comparison.map((row, i) => (
                                    <tr key={i} className="border-b even:bg-slate-50">
                                        <td className="p-3 font-medium text-left">{row.feature}</td>
                                        <td className="p-3 text-muted-foreground">{row.aws}</td>
                                        <td className="p-3 text-muted-foreground">{row.tpws}</td>
                                        <td className="p-3 text-muted-foreground">{row.acd}</td>
                                        <td className="p-3 font-semibold text-green-700 bg-green-50">{row.kavach}</td>
                                    </tr>
                                ))}
                                <tr className="border-b even:bg-slate-50">
                                    <td className="p-3 font-medium text-left">Safety Integrity Level (SIL)</td>
                                    <td className="p-3"><Badge variant="destructive">None</Badge></td>
                                    <td className="p-3"><Badge className="bg-green-500 hover:bg-green-600">SIL-4</Badge></td>
                                    <td className="p-3"><Badge variant="outline" className="text-orange-500 border-orange-500">None</Badge></td>
                                    <td className="p-3 bg-green-50"><Badge className="bg-green-500 hover:bg-green-600">SIL-4</Badge></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Deep Dives */}
            <Tabs defaultValue="kavach" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="aws">AWS</TabsTrigger>
                    <TabsTrigger value="tpws">TPWS</TabsTrigger>
                    <TabsTrigger value="acd">ACD</TabsTrigger>
                    <TabsTrigger value="kavach">Kavach</TabsTrigger>
                </TabsList>
                <TabsContent value="kavach" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-6 w-6 text-green-600" />
                                <CardTitle>Kavach: Indigenous Train Collision Avoidance System</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2">Key Advantages:</h4>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-green-500" /> Multi-sensor fusion (GPS + RFID + 5G)</li>
                                    <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-green-500" /> Affordable: ₹30-50 lakhs per km</li>
                                    <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-green-500" /> Scalable for entire network</li>
                                    <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-green-500" /> Automatic Brake Application</li>
                                </ul>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h4 className="font-semibold text-green-800 mb-2">Migration Plan</h4>
                                <p className="text-sm text-green-700">Currently deployed on 1,465 Rkm. Planned coverage for 3,000 Rkm in FY 2026-27 (Delhi-Mumbai & Delhi-Howrah corridors).</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="aws" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-6 w-6 text-orange-600" />
                                <CardTitle>Auxiliary Warning System (AWS)</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">Legacy system primarily used in Mumbai suburban network. Relies on track magnets.</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-lg bg-red-50">
                                    <h4 className="font-semibold text-red-700 flex items-center gap-2"><X className="h-4 w-4" /> Limitations</h4>
                                    <ul className="list-disc list-inside text-sm text-red-600 mt-2">
                                        <li>Prone to theft of track magnets</li>
                                        <li>No continuous speed monitoring</li>
                                        <li>Limited data capacity</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Simplified handlers for others */}
                <TabsContent value="tpws" className="mt-4"><Card><CardContent className="p-6">Content for TPWS Deep Dive...</CardContent></Card></TabsContent>
                <TabsContent value="acd" className="mt-4"><Card><CardContent className="p-6">Content for ACD Deep Dive...</CardContent></Card></TabsContent>
            </Tabs>

        </div>
    );
}
