import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare,
  Newspaper,
  BookOpen,
  Calendar,
  Settings,
  TrendingUp,
  Server,
  Moon,
  Sun,
  Bell,
  Shield,
  Activity,
  Loader
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType;
}

interface Activity {
  id: string;
  user_id: string;
  action: string;
  created_at: string;
  username: string;
}

export default function AdminPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [stats, setStats] = useState<Stat[]>([
    { label: "Total Users", value: "0", change: "+0%", icon: Users },
    { label: "Forum Posts", value: "0", change: "+0%", icon: MessageSquare },
    { label: "Wiki Articles", value: "0", change: "+0%", icon: BookOpen },
    { label: "Active Events", value: "0", change: "+0", icon: Calendar },
  ]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch all counts in parallel
      const [usersData, postsData, articlesData, eventsData, activityData] = await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("forum_posts").select("id", { count: "exact", head: true }),
        supabase.from("wiki_articles").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("status", "upcoming"),
        supabase.from("activity_logs").select("id, action, created_at, user_id, users(username)").order("created_at", { ascending: false }).limit(4),
      ]);

      const totalUsers = usersData.count || 0;
      const totalPosts = postsData.count || 0;
      const totalArticles = articlesData.count || 0;
      const activeEvents = eventsData.count || 0;

      setStats([
        { label: "Total Users", value: totalUsers.toLocaleString(), change: "+12%", icon: Users },
        { label: "Forum Posts", value: totalPosts.toLocaleString(), change: "+8%", icon: MessageSquare },
        { label: "Wiki Articles", value: totalArticles.toLocaleString(), change: "+3%", icon: BookOpen },
        { label: "Active Events", value: activeEvents.toString(), change: "+2", icon: Calendar },
      ]);

      if (activityData.data) {
        setRecentActivity(activityData.data.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          action: item.action,
          created_at: item.created_at,
          username: item.users?.username || "Unknown",
        })));
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard data");
      toast({ title: "Error", description: "Failed to load dashboard data" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center py-20">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="py-20 text-center text-red-500">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold font-display">{stat.value}</p>
                      <p className="text-xs text-emerald-500 font-medium">{stat.change}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Quick Settings</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No recent activity</p>
                  ) : (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.username}</p>
                          <p className="text-xs text-muted-foreground">{activity.action}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Server Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Server Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Minecraft Server", status: "online", players: "1,234/5,000" },
                    { name: "Website", status: "online", uptime: "99.9%" },
                    { name: "Forums", status: "online", uptime: "99.8%" },
                    { name: "Discord Bot", status: "degraded", note: "High latency" },
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${
                          service.status === 'online' ? 'status-online' :
                          service.status === 'degraded' ? 'status-degraded' : 'status-offline'
                        }`} />
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {service.players || service.uptime || service.note}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Quick Settings
                </CardTitle>
                <CardDescription>Manage global site settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable to show maintenance page to all visitors
                    </p>
                  </div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Announcement Banner</Label>
                    <p className="text-sm text-muted-foreground">
                      Show announcement banner on all pages
                    </p>
                  </div>
                  <Switch checked={announcementEnabled} onCheckedChange={setAnnouncementEnabled} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Default Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Set dark mode as default for new visitors
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {[
                { title: "News Posts", count: 45, icon: Newspaper, href: "/admin/news" },
                { title: "Wiki Articles", count: 234, icon: BookOpen, href: "/admin/wiki" },
                { title: "Forum Topics", count: 1892, icon: MessageSquare, href: "/admin/forums" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-2xl font-bold font-display">{item.count}</p>
                        </div>
                      </div>
                      <Link to={item.href}>
                        <Button variant="outline" className="w-full">Manage</Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}