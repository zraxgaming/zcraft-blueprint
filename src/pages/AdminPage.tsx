import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, Users, MessageSquare, FileText, 
  Settings, Bell, Shield, Activity, TrendingUp,
  AlertTriangle, CheckCircle, XCircle, Edit, Trash2,
  Plus, Save, Eye, Moon, Sun, Megaphone
} from "lucide-react";
import { useState } from "react";

const stats = [
  { label: "Online Players", value: "1,247", change: "+12%", icon: Users },
  { label: "Forum Posts Today", value: "89", change: "+5%", icon: MessageSquare },
  { label: "New Registrations", value: "34", change: "+18%", icon: TrendingUp },
  { label: "Active Tickets", value: "12", change: "-3", icon: AlertTriangle },
];

const recentActivity = [
  { action: "New user registered", user: "NewPlayer123", time: "2 min ago" },
  { action: "Forum post created", user: "BuilderPro", time: "5 min ago" },
  { action: "Support ticket opened", user: "HelpNeeded", time: "12 min ago" },
  { action: "User banned", user: "Cheater99", time: "1 hour ago" },
];

export default function AdminPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [darkDefault, setDarkDefault] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen bg-background ${isDark ? 'dark' : ''}`}>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-card border-r p-4 hidden lg:block">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="font-display text-lg font-bold text-primary-foreground">Z</span>
            </div>
            <div>
              <span className="font-display font-bold text-gradient">ZCraft</span>
              <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { name: "Dashboard", icon: LayoutDashboard, active: true },
              { name: "Users", icon: Users },
              { name: "Forums", icon: MessageSquare },
              { name: "News", icon: FileText },
              { name: "Wiki", icon: FileText },
              { name: "Rules", icon: Shield },
              { name: "Settings", icon: Settings },
            ].map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.active 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t">
            <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
              <Eye className="h-4 w-4" />
              View Site
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Admin</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-0 bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className="h-5 w-5 text-muted-foreground" />
                      <Badge variant="secondary" className={stat.change.startsWith("+") ? "text-emerald-600" : "text-amber-600"}>
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="font-display text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="settings">Quick Settings</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Recent Activity */}
                  <Card className="border-0 bg-card">
                    <CardHeader>
                      <CardTitle className="font-display text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {recentActivity.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium text-sm">{item.action}</p>
                            <p className="text-xs text-muted-foreground">{item.user}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{item.time}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Server Status */}
                  <Card className="border-0 bg-card">
                    <CardHeader>
                      <CardTitle className="font-display text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Server Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { name: "Minecraft Server", status: "online" },
                        { name: "Website", status: "online" },
                        { name: "Database", status: "online" },
                        { name: "Discord Bot", status: "degraded" },
                      ].map((service) => (
                        <div key={service.name} className="flex items-center justify-between">
                          <span className="text-sm">{service.name}</span>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${
                              service.status === "online" ? "status-online" : "status-degraded"
                            }`} />
                            <span className={`text-sm ${
                              service.status === "online" ? "text-emerald-600" : "text-amber-600"
                            }`}>
                              {service.status === "online" ? "Online" : "Degraded"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="border-0 bg-card">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Quick Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Maintenance Mode */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Maintenance Mode</h4>
                          <p className="text-sm text-muted-foreground">Shows maintenance page to all visitors</p>
                        </div>
                      </div>
                      <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                    </div>

                    {/* Announcement Banner */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Megaphone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Announcement Banner</h4>
                          <p className="text-sm text-muted-foreground">Display banner at top of all pages</p>
                        </div>
                      </div>
                      <Switch checked={announcementEnabled} onCheckedChange={setAnnouncementEnabled} />
                    </div>

                    {announcementEnabled && (
                      <div className="pl-14 space-y-4">
                        <Input placeholder="Banner message..." defaultValue="🎮 Summer Event is LIVE! Join now for exclusive rewards →" />
                        <Button size="sm" className="btn-primary-gradient gap-2">
                          <Save className="h-4 w-4" />
                          Save Banner
                        </Button>
                      </div>
                    )}

                    {/* Dark Mode Default */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <Moon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Dark Mode Default</h4>
                          <p className="text-sm text-muted-foreground">Set dark mode as default for new visitors</p>
                        </div>
                      </div>
                      <Switch checked={darkDefault} onCheckedChange={setDarkDefault} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content">
                <Card className="border-0 bg-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-display text-lg">Content Management</CardTitle>
                    <Button className="btn-primary-gradient gap-2">
                      <Plus className="h-4 w-4" />
                      New Post
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { title: "Summer Event 2024", type: "News", status: "Published" },
                        { title: "Getting Started Guide", type: "Wiki", status: "Published" },
                        { title: "Server Rules", type: "Page", status: "Published" },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{item.type}</Badge>
                              <Badge variant="secondary" className="text-xs text-emerald-600">{item.status}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
