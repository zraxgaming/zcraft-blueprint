import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Terminal, Gamepad2, HelpCircle, Rocket, ChevronRight, FileText } from "lucide-react";

const wikiCategories = [
  {
    name: "Getting Started",
    icon: Rocket,
    description: "New to ZCraft? Start here!",
    articles: 12,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    name: "Commands",
    icon: Terminal,
    description: "All server commands explained",
    articles: 45,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    name: "Game Mechanics",
    icon: Gamepad2,
    description: "Learn how things work",
    articles: 28,
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    name: "FAQs",
    icon: HelpCircle,
    description: "Frequently asked questions",
    articles: 18,
    color: "bg-amber-500/10 text-amber-600",
  },
];

const popularArticles = [
  { title: "How to get started on ZCraft", views: "12.5K" },
  { title: "Complete commands list", views: "8.2K" },
  { title: "Economy guide for beginners", views: "6.8K" },
  { title: "Claiming and protecting land", views: "5.4K" },
  { title: "Custom enchantments explained", views: "4.9K" },
];

const recentArticles = [
  { title: "New dungeon mechanics", date: "2 days ago" },
  { title: "Updated teleportation commands", date: "4 days ago" },
  { title: "Winter event guide", date: "1 week ago" },
  { title: "Auction house tutorial", date: "1 week ago" },
];

export default function WikiPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border mb-6">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Knowledge Base</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Server <span className="text-gradient">Wiki</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to know about ZCraft, all in one place.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search the wiki..."
                className="pl-12 h-14 text-lg bg-card border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-bold mb-6">Browse Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wikiCategories.map((category) => (
              <Card key={category.name} className="card-hover border-0 bg-card cursor-pointer">
                <CardContent className="p-6">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${category.color} mb-4`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  <Badge variant="secondary">{category.articles} articles</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Popular */}
            <Card className="border-0 bg-card">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  📈 Popular Articles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {popularArticles.map((article, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{article.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{article.views} views</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent */}
            <Card className="border-0 bg-card">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  🕒 Recently Updated
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentArticles.map((article, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{article.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{article.date}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-0 bg-primary/5">
            <CardContent className="p-8 text-center">
              <h3 className="font-display text-xl font-bold mb-4">Can't find what you're looking for?</h3>
              <p className="text-muted-foreground mb-6">
                Check out our forums or contact support for additional help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-muted">
                  Visit Forums
                </Badge>
                <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-muted">
                  Contact Support
                </Badge>
                <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-muted">
                  Join Discord
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
