import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredPost = {
  title: "Summer Event 2024: Ice Kingdom Adventure",
  excerpt: "Explore the frozen realm, complete challenges, and earn exclusive rewards in our biggest event of the year!",
  date: "December 28, 2024",
  tag: "Event",
  image: "❄️",
};

const posts = [
  {
    title: "Server Update v3.2.1 - Performance Improvements",
    excerpt: "We've made significant optimizations to reduce lag and improve overall gameplay experience.",
    date: "December 25, 2024",
    tag: "Update",
    image: "⚡",
  },
  {
    title: "New Staff Applications Now Open",
    excerpt: "Are you passionate about helping others? Join our moderation team!",
    date: "December 20, 2024",
    tag: "Announcement",
    image: "📢",
  },
  {
    title: "December Build Contest Winners",
    excerpt: "Congratulations to all participants! Check out the amazing builds that won.",
    date: "December 18, 2024",
    tag: "Event",
    image: "🏆",
  },
  {
    title: "Scheduled Maintenance - December 15th",
    excerpt: "Brief downtime expected for server upgrades. ETA: 2 hours.",
    date: "December 14, 2024",
    tag: "Maintenance",
    image: "🔧",
  },
  {
    title: "New Custom Enchantments System",
    excerpt: "Discover over 50 new enchantments to enhance your gear and gameplay.",
    date: "December 10, 2024",
    tag: "Update",
    image: "✨",
  },
  {
    title: "Community Spotlight: Amazing Builds",
    excerpt: "Featuring the most impressive player creations from this month.",
    date: "December 5, 2024",
    tag: "Community",
    image: "🏠",
  },
];

const getTagColor = (tag: string) => {
  switch (tag) {
    case "Event":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    case "Update":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "Announcement":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "Maintenance":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    case "Community":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function NewsPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Latest <span className="text-gradient">News</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Stay updated with server announcements, events, and updates.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card className="card-hover border-0 bg-card max-w-4xl mx-auto overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 p-12 text-8xl">
                  {featuredPost.image}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge className={`w-fit mb-4 ${getTagColor(featuredPost.tag)}`}>
                    {featuredPost.tag}
                  </Badge>
                  <h2 className="font-display text-2xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </div>
                  <Button className="btn-primary-gradient w-fit gap-2">
                    Read More <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-8">All Posts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <Card key={index} className="card-hover border-0 bg-card cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-center bg-muted/50 py-8 text-5xl">
                      {post.image}
                    </div>
                    <div className="p-6">
                      <Badge className={`mb-3 ${getTagColor(post.tag)}`}>
                        {post.tag}
                      </Badge>
                      <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Posts
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
