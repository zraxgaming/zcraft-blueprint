import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Users, Clock, TrendingUp, ChevronRight, Loader } from "lucide-react";
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
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [latestThreads, setLatestThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newThreadForumId, setNewThreadForumId] = useState<string | null>(null);

  useEffect(() => {
    loadForumData();
  }, []);

  const loadForumData = async () => {
    try {
      const [categoriesData, threadsData] = await Promise.all([
        forumService.getCategories(),
        forumService.getLatestThreads(),
      ]);
      setCategories(categoriesData);
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
      <Layout
        seo={{
          title: "ZCraft Forums - Community Discussions & Help",
          description: "Join the ZCraft community forums to ask questions, find guides, and chat with players.",
          keywords: "zcraft forums, minecraft forum, lifesteal discussion, zcraft community",
          url: "https://z-craft.xyz/forums",
        }}
      >
        <div className="flex items-center justify-center py-20">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout
        seo={{
          title: "ZCraft Forums - Community Discussions & Help",
          description: "Join the ZCraft community forums to ask questions, find guides, and chat with players.",
          keywords: "zcraft forums, minecraft forum, lifesteal discussion, zcraft community",
          url: "https://z-craft.xyz/forums",
        }}
      >
        <div className="py-20 text-center text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout
      seo={{
        title: "ZCraft Forums - Community Discussions & Help",
        description: "Join the ZCraft community forums to ask questions, find guides, and chat with players.",
        keywords: "zcraft forums, minecraft forum, lifesteal discussion, zcraft community",
        url: "https://z-craft.xyz/forums",
      }}
    >
      {/* Hero */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Community <span className="text-gradient">Forums</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join the conversation with thousands of players.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search forums..."
                className="pl-12 h-14 text-lg bg-card border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Categories */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">Categories</h2>
                <Badge variant="secondary">{categories.length} categories</Badge>
              </div>
              {categories.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No categories available</p>
              ) : (
                categories.map((category) => (
                  <Card key={category.id} className="card-hover border-0 bg-card cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                          📁
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1">{category.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{category.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <Card className="border-0 bg-card">
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Forum Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="font-display text-2xl font-bold text-primary">3.1K</p>
                    <p className="text-xs text-muted-foreground">Threads</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="font-display text-2xl font-bold text-primary">32K</p>
                    <p className="text-xs text-muted-foreground">Posts</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="font-display text-2xl font-bold text-primary">8.5K</p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="font-display text-2xl font-bold text-primary">142</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </CardContent>
              </Card>

              {/* Latest Threads */}
              <Card className="border-0 bg-card">
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Latest Threads
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {latestThreads.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No threads yet</p>
                  ) : (
                    latestThreads.map((thread) => (
                      <div
                        key={thread.id}
                        className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-2 mb-1">
                          <h4 className="text-sm font-medium line-clamp-1">{thread.title}</h4>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>by {thread.author}</span>
                          <span>•</span>
                          <span>{thread.replies_count} replies</span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="border-0 bg-primary/10">
                <CardContent className="p-6 text-center">
                  {!showNewThread ? (
                    <>
                      <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">Start a Discussion</h3>
                      <p className="text-sm text-muted-foreground mb-4">Share your thoughts with the community.</p>
                      <Button
                        className="btn-primary-gradient w-full"
                        onClick={() => {
                          if (!user) {
                            toast({ title: "Login required", description: "Please log in to create a thread." });
                            return;
                          }
                          setNewThreadForumId(categories?.[0]?.id || null);
                          setShowNewThread(true);
                        }}
                      >
                        New Thread
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-3 text-left">
                      <input
                        placeholder="Thread title"
                        className="w-full p-2 rounded-md bg-card border-0"
                        value={newThreadTitle}
                        onChange={(e) => setNewThreadTitle(e.target.value)}
                      />
                      <select
                        className="w-full p-2 rounded-md bg-card border-0"
                        value={newThreadForumId || ""}
                        onChange={(e) => setNewThreadForumId(e.target.value)}
                      >
                        {(categories || []).map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <textarea
                        placeholder="Write your thread..."
                        className="w-full p-2 rounded-md bg-card border-0 min-h-[120px]"
                        value={newThreadContent}
                        onChange={(e) => setNewThreadContent(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          className="btn-primary-gradient flex-1"
                          onClick={async () => {
                            if (!user || !newThreadForumId) {
                              toast({ title: "Error", description: "Missing forum selection or not logged in." });
                              return;
                            }
                            try {
                              setLoading(true);
                              await forumService.createForumPost({
                                forum_id: newThreadForumId,
                                author_id: user.id,
                                title: newThreadTitle,
                                content: newThreadContent,
                              } as any);
                              toast({ title: "Thread created", description: "Your thread was posted." });
                              setNewThreadTitle("");
                              setNewThreadContent("");
                              setShowNewThread(false);
                              await loadForumData();
                            } catch (err: any) {
                              console.error("Create thread error:", err);
                              toast({ title: "Error", description: err?.message || "Failed to create thread" });
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          Post Thread
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setShowNewThread(false);
                            setNewThreadTitle("");
                            setNewThreadContent("");
                          }}
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
        </div>
      </section>
    </Layout>
  );
}
