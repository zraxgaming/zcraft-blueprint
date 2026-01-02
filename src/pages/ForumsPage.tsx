import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Pin, Users, Clock, TrendingUp, ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Announcements",
    description: "Official server news and updates",
    icon: "📢",
    threads: 45,
    posts: 892,
    color: "bg-amber-500/10",
  },
  {
    name: "General Discussion",
    description: "Chat about anything ZCraft related",
    icon: "💬",
    threads: 1234,
    posts: 15678,
    color: "bg-blue-500/10",
  },
  {
    name: "Help & Support",
    description: "Get help from the community",
    icon: "❓",
    threads: 567,
    posts: 4532,
    color: "bg-emerald-500/10",
  },
  {
    name: "Ideas & Feedback",
    description: "Share your suggestions",
    icon: "💡",
    threads: 234,
    posts: 1890,
    color: "bg-purple-500/10",
  },
  {
    name: "Events",
    description: "Community events and competitions",
    icon: "🎉",
    threads: 89,
    posts: 756,
    color: "bg-pink-500/10",
  },
  {
    name: "Bug Reports",
    description: "Report issues and bugs",
    icon: "🐛",
    threads: 156,
    posts: 892,
    color: "bg-red-500/10",
  },
  {
    name: "Off-Topic",
    description: "Anything goes (within rules)",
    icon: "🎭",
    threads: 789,
    posts: 8934,
    color: "bg-gray-500/10",
  },
];

const latestThreads = [
  {
    title: "Welcome to the new forums!",
    author: "ZCraftOwner",
    category: "Announcements",
    replies: 156,
    pinned: true,
    time: "2 hours ago",
  },
  {
    title: "Best strategies for the new dungeon?",
    author: "DungeonMaster",
    category: "General",
    replies: 42,
    pinned: false,
    time: "5 hours ago",
  },
  {
    title: "Can't connect to server - Error 404",
    author: "NewPlayer123",
    category: "Help",
    replies: 8,
    pinned: false,
    time: "6 hours ago",
  },
  {
    title: "Suggestion: New enchantment system",
    author: "EnchantPro",
    category: "Ideas",
    replies: 67,
    pinned: false,
    time: "1 day ago",
  },
];

export default function ForumsPage() {
  return (
    <Layout>
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
              {categories.map((category) => (
                <Card key={category.name} className="card-hover border-0 bg-card cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${category.color} text-2xl`}>
                        {category.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{category.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{category.description}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="font-semibold">{category.threads.toLocaleString()}</p>
                          <p className="text-muted-foreground">Threads</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{category.posts.toLocaleString()}</p>
                          <p className="text-muted-foreground">Posts</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                  {latestThreads.map((thread, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-2 mb-1">
                        {thread.pinned && <Pin className="h-3 w-3 text-primary shrink-0 mt-1" />}
                        <h4 className="text-sm font-medium line-clamp-1">{thread.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>by {thread.author}</span>
                        <span>•</span>
                        <span>{thread.replies} replies</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="border-0 bg-primary/10">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Start a Discussion</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share your thoughts with the community.
                  </p>
                  <Button className="btn-primary-gradient w-full">
                    New Thread
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
