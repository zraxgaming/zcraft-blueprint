import { MessageSquare, Bell, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { newsService } from "@/services/newsService";
import { forumService } from "@/services/forumService";

type Announcement = { id: string; title: string; date: string; type?: string; excerpt?: string };
type ThreadPreview = { id: string; title: string; author: string; replies_count: number; category: string };

export function CommunitySection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [forumPosts, setForumPosts] = useState<ThreadPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [newsData, threadsData] = await Promise.all([
          newsService.getNews(3, 0),
          forumService.getLatestThreads(3),
        ]);

        setAnnouncements(
          (newsData || []).map((n: any) => ({
            id: n.id,
            title: n.title,
            date: n.created_at ? new Date(n.created_at).toLocaleDateString() : "",
            type: "News",
            excerpt: n.excerpt || "",
          }))
        );

        setForumPosts(threadsData || []);
      } catch (err) {
        console.error("Error loading community data:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Community <span className="text-gradient">Hub</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest news and connect with fellow players.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Announcements */}
          <Card className="card-hover border-0 bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-display">
                <Bell className="h-5 w-5 text-primary" />
                Latest News
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/news" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground py-4">Loading...</p>
              ) : announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No news available</p>
              ) : (
                announcements.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <h4 className="font-semibold mb-1">{post.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Forum Activity */}
          <Card className="card-hover border-0 bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-display">
                <MessageSquare className="h-5 w-5 text-primary" />
                Forum Activity
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/forums" className="gap-1">
                  Browse Forums <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground py-4">Loading...</p>
              ) : forumPosts.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No forum posts available</p>
              ) : (
                forumPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{post.replies_count} replies</span>
                    </div>
                    <h4 className="font-semibold mb-1">{post.title}</h4>
                    <p className="text-sm text-muted-foreground">by {post.author}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Discord CTA */}
        <div className="mt-12 text-center">
          <Card className="inline-block card-hover border-0 bg-card max-w-2xl">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-4xl">
                💬
              </div>
              <div className="text-left flex-1">
                <h3 className="font-display text-xl font-bold mb-2">Join our Discord</h3>
                <p className="text-muted-foreground">
                  Chat with players, get support, and stay updated on all server events.
                </p>
              </div>
              <Button className="btn-primary-gradient">
                Join Discord
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}