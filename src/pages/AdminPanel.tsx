import { useState } from 'react';
import {
  Settings,
  Users,
  Shield,
  Database,
  Bell,
  Key,
  Mail,
  Globe,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            System configuration and user management
          </p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure general platform preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Platform Name</label>
                  <Input defaultValue="RailSync Pro" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Organization</label>
                  <Input defaultValue="Indian Railways" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Default Language</label>
                  <Select defaultValue="en">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Timezone</label>
                  <Select defaultValue="ist">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Feature Toggles</h4>
                {[
                  { name: 'Real-time Data Updates', enabled: true },
                  { name: 'AI Recommendations', enabled: true },
                  { name: 'Dark Mode', enabled: false },
                  { name: 'Beta Features', enabled: false },
                ].map((feature) => (
                  <div key={feature.name} className="flex items-center justify-between">
                    <span className="text-sm">{feature.name}</span>
                    <Switch defaultChecked={feature.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Refresh Settings</CardTitle>
              <CardDescription>Configure how often data is synchronized</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">IoT Telemetry</label>
                  <Select defaultValue="5">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Every 1 second</SelectItem>
                      <SelectItem value="5">Every 5 seconds</SelectItem>
                      <SelectItem value="10">Every 10 seconds</SelectItem>
                      <SelectItem value="30">Every 30 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Analytics Data</label>
                  <Select defaultValue="60">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">Every minute</SelectItem>
                      <SelectItem value="300">Every 5 minutes</SelectItem>
                      <SelectItem value="900">Every 15 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Pricing Engine</label>
                  <Select defaultValue="300">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">Every minute</SelectItem>
                      <SelectItem value="300">Every 5 minutes</SelectItem>
                      <SelectItem value="900">Every 15 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage platform users and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Admin User', email: 'admin@railways.gov.in', role: 'Administrator', status: 'active' },
                  { name: 'Operations Manager', email: 'ops@railways.gov.in', role: 'Manager', status: 'active' },
                  { name: 'Analyst', email: 'analyst@railways.gov.in', role: 'Viewer', status: 'active' },
                  { name: 'Vendor User', email: 'vendor@example.com', role: 'Vendor', status: 'pending' },
                ].map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{user.role}</Badge>
                      <Badge
                        className={
                          user.status === 'active'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-warning/10 text-warning border-warning/20'
                        }
                      >
                        {user.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure authentication and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { name: 'Two-Factor Authentication', description: 'Require 2FA for all users', enabled: true },
                  { name: 'Session Timeout', description: 'Auto logout after 30 minutes of inactivity', enabled: true },
                  { name: 'IP Whitelisting', description: 'Restrict access to approved IP addresses', enabled: false },
                  { name: 'Audit Logging', description: 'Log all user actions for compliance', enabled: true },
                ].map((setting) => (
                  <div key={setting.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{setting.name}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch defaultChecked={setting.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API access for integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Production API Key', created: '2026-01-15', lastUsed: '2 hours ago' },
                  { name: 'Development API Key', created: '2026-01-10', lastUsed: '1 day ago' },
                ].map((key) => (
                  <div
                    key={key.name}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{key.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {key.created} • Last used: {key.lastUsed}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        Regenerate
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4" variant="outline">
                <Key className="h-4 w-4 mr-2" />
                Generate New Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'IRCTC API', status: 'connected', icon: Globe },
              { name: 'Payment Gateway', status: 'connected', icon: Database },
              { name: 'SMS Provider', status: 'connected', icon: Mail },
              { name: 'Analytics Platform', status: 'pending', icon: Database },
            ].map((integration) => (
              <Card key={integration.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <integration.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <Badge
                          className={
                            integration.status === 'connected'
                              ? 'bg-success/10 text-success border-success/20'
                              : 'bg-warning/10 text-warning border-warning/20'
                          }
                        >
                          {integration.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { category: 'Critical Alerts', email: true, sms: true, push: true },
                  { category: 'System Updates', email: true, sms: false, push: true },
                  { category: 'Daily Reports', email: true, sms: false, push: false },
                  { category: 'Tender Updates', email: true, sms: false, push: true },
                ].map((pref) => (
                  <div
                    key={pref.category}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <span className="font-medium">{pref.category}</span>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={pref.email} />
                        <span className="text-sm text-muted-foreground">Email</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={pref.sms} />
                        <span className="text-sm text-muted-foreground">SMS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={pref.push} />
                        <span className="text-sm text-muted-foreground">Push</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
