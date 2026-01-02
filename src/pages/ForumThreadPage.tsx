import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, MessageSquare, ThumbsUp, Flag, Share2, Pin } from "lucide-react";

const thread = {
  title: "Best strategies for the new dungeon?",
  category: "General Discussion",
  author: "DungeonMaster",
  authorAvatar: "🎮",
  date: "5 hours ago",
  views: 342,
  replies: 42,
  pinned: false,
  content: `
    Hey everyone! I've been trying to beat the new Ice Dungeon but keep getting stuck on the third floor boss. 

    Does anyone have tips on:
    1. Best gear to use?
    2. Team composition?
    3. Boss mechanics to watch out for?

    Any help would be appreciated! I've tried using full diamond armor with frost protection but still getting destroyed.
  `,
  posts: [
    {
      author: "ProGamer123",
      avatar: "⚔️",
      date: "4 hours ago",
      content: "The key is to use fire resistance potions! The boss does a lot of ice damage but also has a hidden fire phase. Also make sure your team has at least one healer.",
      likes: 24,
      isStaff: false,
    },
    {
      author: "AdminPro",
      avatar: "🛡️",
      date: "3 hours ago",
      content: "Great question! Here's the official strategy guide:\n\n1. Bring at least 3 players\n2. Tank should have 30+ armor points\n3. DPS should focus on the ice crystals first\n4. Healer stays at range\n\nGood luck!",
      likes: 56,
      isStaff: true,
    },
    {
      author: "IceBreaker",
      avatar: "❄️",
      date: "2 hours ago",
      content: "I beat it solo by using the Frost Enchantment on my sword. It makes you immune to the slow effect which is a game changer.",
      likes: 18,
      isStaff: false,
    },
  ],
};

export default function ForumThreadPage() {
  const { slug } = useParams();

  return (
    <Layout>
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/forums" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Forums
            </Link>

            {/* Thread Header */}
            <Card className="border-0 bg-card mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {thread.pinned && <Pin className="h-5 w-5 text-primary shrink-0" />}
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2">{thread.category}</Badge>
                    <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">{thread.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {thread.date}
                      </span>
                      <span>{thread.views} views</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {thread.replies} replies
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Original Post */}
            <Card className="border-0 bg-card mb-4">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="shrink-0 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl mb-2">
                      {thread.authorAvatar}
                    </div>
                    <p className="font-semibold text-sm">{thread.author}</p>
                    <Badge variant="secondary" className="text-xs mt-1">OP</Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground whitespace-pre-line">{thread.content}</p>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                        <Flag className="h-4 w-4" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Replies */}
            <div className="space-y-4 mb-8">
              {thread.posts.map((post, index) => (
                <Card key={index} className={`border-0 ${post.isStaff ? "bg-primary/5 border-l-2 border-primary" : "bg-card"}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="shrink-0 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl mb-2">
                          {post.avatar}
                        </div>
                        <p className="font-semibold text-sm">{post.author}</p>
                        {post.isStaff && <Badge className="text-xs mt-1 bg-red-500">Staff</Badge>}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
                        <p className="text-muted-foreground whitespace-pre-line">{post.content}</p>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                            <Flag className="h-4 w-4" />
                            Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Reply Box */}
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Post a Reply</h3>
                <Textarea placeholder="Write your reply..." className="min-h-32 mb-4" />
                <Button className="btn-primary-gradient">Submit Reply</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
