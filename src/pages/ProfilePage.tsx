import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, MessageSquare, FileText, Bell, User, Shield } from "lucide-react";

const userStats = {
  username: "CraftMaster99",
  joinDate: "March 2023",
  rank: "Diamond",
  posts: 156,
  threads: 24,
  playtime: "342h",
};

const recentPosts = [
  { title: "Re: Best farming strategies?", date: "2 hours ago", category: "Help" },
  { title: "Re: Show off your builds!", date: "1 day ago", category: "General" },
  { title: "New enchantment ideas", date: "3 days ago", category: "Ideas" },
];

const notifications = [
  { text: "Your thread received a new reply", time: "1 hour ago", read: false },
  { text: "You earned the 'Veteran' badge", time: "2 days ago", read: true },
  { text: "Staff replied to your ticket", time: "3 days ago", read: true },
];

export default function ProfilePage() {
  return (
    <Layout>
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <Card className="border-0 bg-card mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-5xl">
                    🎮
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h1 className="font-display text-2xl font-bold">{userStats.username}</h1>
                      <Badge className="bg-primary/10 text-primary">{userStats.rank}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Member since {userStats.joinDate} • {userStats.playtime} playtime
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                      <div>
                        <span className="font-semibold text-foreground">{userStats.posts}</span>{" "}
                        <span className="text-muted-foreground">Posts</span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">{userStats.threads}</span>{" "}
                        <span className="text-muted-foreground">Threads</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full flex-wrap h-auto gap-2 bg-transparent p-0 mb-6">
                <TabsTrigger value="posts" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <MessageSquare className="h-4 w-4" />
                  Posts
                </TabsTrigger>
                <TabsTrigger value="threads" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileText className="h-4 w-4" />
                  Threads
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts">
                <Card className="border-0 bg-card">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Recent Posts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentPosts.map((post, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                        <div>
                          <h4 className="font-medium">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">in {post.category}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="threads">
                <Card className="border-0 bg-card">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Your Threads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      You have created {userStats.threads} threads.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="border-0 bg-card">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {notifications.map((notif, index) => (
                      <div key={index} className={`flex items-center justify-between p-4 rounded-lg transition-colors ${notif.read ? "bg-muted/30" : "bg-primary/5 border-l-2 border-primary"}`}>
                        <span className={notif.read ? "text-muted-foreground" : "font-medium"}>{notif.text}</span>
                        <span className="text-sm text-muted-foreground">{notif.time}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="border-0 bg-card">
                  <CardHeader>
                    <CardTitle className="font-display text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input defaultValue="player@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>Display Name</Label>
                        <Input defaultValue={userStats.username} />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button className="btn-primary-gradient">Save Changes</Button>
                      <Button variant="outline">Change Password</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
}
