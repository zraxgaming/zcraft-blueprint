import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, MessageSquare, FileText, Bell, User, Shield, Loader } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    const fetchUserPosts = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('forum_posts')
          .select('id, title, created_at, forum:forum_id(title)')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (!error && data) {
          setUserPosts(data);
        }
      } catch (err) {
        console.error('Error fetching user posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <Layout
        seo={{
          title: "Profile — ZCraft Network",
          description: "View and manage your ZCraft profile, posts, and settings.",
          keywords: "zcraft profile, player profile, minecraft account",
          url: "https://z-craft.xyz/profile",
        }}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user || !userProfile) {
    return (
      <Layout
        seo={{
          title: "Profile — ZCraft Network",
          description: "View and manage your ZCraft profile, posts, and settings.",
          keywords: "zcraft profile, player profile, minecraft account",
          url: "https://z-craft.xyz/profile",
        }}
      >
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
          <Button className="mt-4" onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </Layout>
    );
  }

  const joinDate = new Date(userProfile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
  return (
    <Layout
      seo={{
        title: `Profile — ${userProfile.username} | ZCraft Network`,
        description: `${userProfile.username}'s profile on ZCraft Network. View posts, threads, and account settings.`,
        keywords: `zcraft profile, ${userProfile.username}, player profile`,
        url: `https://z-craft.xyz/profile`,
      }}
    >
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <Card className="border-0 bg-card mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {userProfile.avatar_url ? (
                    <img
                      src={userProfile.avatar_url}
                      alt={userProfile.username}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-5xl">
                      👤
                    </div>
                  )}
                  <div className="text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h1 className="font-display text-2xl font-bold">{userProfile.username}</h1>
                      <Badge className={`${userProfile.role === 'admin' ? 'bg-red-500/10 text-red-600' : userProfile.role === 'moderator' ? 'bg-blue-500/10 text-blue-600' : 'bg-primary/10 text-primary'}`}>
                        {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Member since {joinDate}
                    </p>
                    {userProfile.bio && (
                      <p className="text-foreground mb-4">{userProfile.bio}</p>
                    )}
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                      <div>
                        <span className="font-semibold text-foreground">{userPosts.length}</span>{" "}
                        <span className="text-muted-foreground">Posts</span>
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
                    {userPosts.length > 0 ? (
                      userPosts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                          <div>
                            <h4 className="font-medium">{post.title}</h4>
                            <p className="text-sm text-muted-foreground">in {post.forum?.title || 'General'}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No posts yet</p>
                    )}
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
                      You have created {userPosts.length} threads.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="border-0 bg-card">
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      No new notifications
                    </p>
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
                        <Input disabled value={userProfile.email} />
                      </div>
                      <div className="space-y-2">
                        <Label>Username</Label>
                        <Input disabled value={userProfile.username} />
                      </div>
                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <Input defaultValue={userProfile.bio || ''} placeholder="Tell us about yourself" />
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
