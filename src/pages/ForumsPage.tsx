import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  MessageSquare,
  Clock,
  TrendingUp,
  ChevronRight,
  Loader,
} from "lucide-react";
import { useState, useEffect } from "react";
import { forumService } from "@/services/forumService";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ForumCategory {
  id: string;
  name: string;
  description: string;
}

interface ForumThread {
  id: string;
  title: string;
  author: string;
  category: string;
  replies_count: number;
  created_at: string;
}

export default function ForumsPage() {
  const { user } = useAuth();

  // ✅ HARDCODED SAMPLE CATEGORIES
  const categories: ForumCategory[] = [
    {
      id: "general",
      name: "General Discussion",
      description: "Talk about anything related to ZCraft.",
    },
    {
      id: "support",
      name: "Support & Help",
      description: "Need help? Ask the community or staff.",
    },
    {
      id: "suggestions",
      name: "Suggestions",
      description: "Suggest new features and improvements.",
    },
    {
      id: "bug-reports",
      name: "Bug Reports",
      description: "Report issues and glitches here.",
    },
    {
      id: "marketplace",
      name: "Marketplace",
      description: "Trade, buy, and sell with other players.",
    },
  ];

  const [latestThreads, setLatestThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newThreadForumId, setNewThreadForumId] = useState<string>(
    categories[0].id
  );

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      const threadsData = await forumService.getLatestThreads();
      setLatestThreads(threadsData);
    } catch (err: any) {
      setError(err?.message || "Failed to load forums");
      toast({ title: "Error", description: "Failed to load forum data" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout seo={{ title: "ZCraft Forums" }}>
        <div className="flex items-center justify-center py-20">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout seo={{ title: "ZCraft Forums" }}>
        <div className="py-20 text-center text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout seo={{ title: "ZCraft Forums" }}>
      {/* Hero */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Community <span className="text-primary">Forums</span>
          </h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search forums..."
              className="pl-12 h-12"
            />
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="pb-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
          {/* Categories */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Categories</h2>
              <Badge>{categories.length}</Badge>
            </div>

            {categories.map((category) => (
              <Card key={category.id} className="cursor-pointer hover:shadow-lg transition">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <ChevronRight />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Forum Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-primary">3.1K</p>
                  <p className="text-xs text-muted-foreground">Threads</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-primary">32K</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-primary">8.5K</p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-primary">142</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </CardContent>
            </Card>

            {/* Latest Threads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Latest Threads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {latestThreads.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No threads yet
                  </p>
                ) : (
                  latestThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className="p-3 rounded bg-muted hover:bg-muted/70 transition cursor-pointer"
                    >
                      <h4 className="text-sm font-medium">
                        {thread.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {thread.replies_count} replies
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Create Thread */}
            <Card>
              <CardContent className="p-6">
                {!showNewThread ? (
                  <>
                    <MessageSquare className="h-8 w-8 text-primary mb-3" />
                    <Button
                      className="w-full"
                      onClick={() => {
                        if (!user) {
                          toast({
                            title: "Login required",
                            description:
                              "Please log in to create a thread.",
                          });
                          return;
                        }
                        setShowNewThread(true);
                      }}
                    >
                      New Thread
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <input
                      placeholder="Thread title"
                      className="w-full p-2 rounded bg-muted"
                      value={newThreadTitle}
                      onChange={(e) =>
                        setNewThreadTitle(e.target.value)
                      }
                    />

                    <select
                      className="w-full p-2 rounded bg-muted"
                      value={newThreadForumId}
                      onChange={(e) =>
                        setNewThreadForumId(e.target.value)
                      }
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <textarea
                      placeholder="Write your thread..."
                      className="w-full p-2 rounded bg-muted min-h-[120px]"
                      value={newThreadContent}
                      onChange={(e) =>
                        setNewThreadContent(e.target.value)
                      }
                    />

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() =>
                          toast({
                            title: "Thread created (demo)",
                            description:
                              "This is currently using sample categories.",
                          })
                        }
                      >
                        Post Thread
                      </Button>

                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowNewThread(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
