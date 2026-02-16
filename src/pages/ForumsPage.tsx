import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Clock, TrendingUp, ChevronRight, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { forumService } from "@/services/forumService";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ForumThread {
  id: string;
  title: string;
  author: string;
  category: string;
  replies_count: number;
  created_at: string;
}

const FORUM_CATEGORIES = [
  { value: "general", label: "💬 General Discussion" },
  { value: "support", label: "🛠️ Support" },
  { value: "suggestions", label: "💡 Suggestions" },
  { value: "bugs", label: "🐛 Bug Reports" },
  { value: "marketplace", label: "💰 Marketplace" },
];

export default function ForumsPage() {
  const { user } = useAuth();

  const [latestThreads, setLatestThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newThreadCategory, setNewThreadCategory] = useState(FORUM_CATEGORIES[0].value);

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      const threads = await forumService.getLatestThreads();
      setLatestThreads(threads);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to load threads",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout seo={{ title: "ZCraft Forums" }}>
        <div className="flex justify-center py-20">
          <Loader className="animate-spin h-8 w-8 text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout seo={{ title: "ZCraft Forums" }}>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            ZCraft <span className="text-primary">Forums</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Community discussions, ideas, and support.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input className="pl-12 h-12" placeholder="Search threads..." />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
          {/* Categories */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Categories</h2>
              <Badge>{FORUM_CATEGORIES.length}</Badge>
            </div>

            {FORUM_CATEGORIES.map((category) => (
              <Card
                key={category.value}
                className="hover:shadow-lg transition cursor-pointer border-0 bg-card"
              >
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{category.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      Discuss topics related to {category.value}.
                    </p>
                  </div>
                  <ChevronRight />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats (static) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
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
                            description: "Please log in first.",
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
                    <Input
                      placeholder="Thread title"
                      value={newThreadTitle}
                      onChange={(e) => setNewThreadTitle(e.target.value)}
                    />

                    <select
                      className="w-full p-2 rounded-md bg-muted"
                      value={newThreadCategory}
                      onChange={(e) => setNewThreadCategory(e.target.value)}
                    >
                      {FORUM_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>

                    <textarea
                      placeholder="Write your thread..."
                      className="w-full p-2 rounded-md bg-muted min-h-[120px]"
                      value={newThreadContent}
                      onChange={(e) => setNewThreadContent(e.target.value)}
                    />

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={async () => {
                          if (!newThreadTitle || !newThreadContent || !newThreadCategory) {
                            toast({ title: "Error", description: "All fields are required." });
                            return;
                          }

                          try {
                            await forumService.createForumPost({
                              title: newThreadTitle,
                              content: newThreadContent,
                              category: newThreadCategory,
                              author_id: user?.id,
                            } as any);

                            toast({
                              title: "Thread created",
                              description: "Your thread has been posted.",
                            });

                            setShowNewThread(false);
                            setNewThreadTitle("");
                            setNewThreadContent("");
                            loadThreads();
                          } catch (err: any) {
                            toast({
                              title: "Error",
                              description: err?.message || "Failed to create thread",
                            });
                          }
                        }}
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

            {/* Latest Threads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <Clock className="h-5 w-5 text-primary" />
                  Latest Threads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {latestThreads.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No threads yet.</p>
                ) : (
                  latestThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className="p-3 rounded bg-muted hover:bg-muted/70 transition cursor-pointer"
                    >
                      <h4 className="text-sm font-medium">{thread.title}</h4>
                      <p className="text-xs text-muted-foreground">{thread.category}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
