import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Eye, Tag } from "lucide-react";

const articles = {
  "summer-event-2024": {
    title: "Summer Event 2024: Ice Kingdom Adventure",
    date: "December 28, 2024",
    author: "ZCraftOwner",
    tag: "Event",
    views: "2.4K",
    content: `
      <p>Get ready for our biggest event of the year! The Ice Kingdom awaits brave adventurers who dare to explore its frozen depths.</p>
      
      <h2>Event Details</h2>
      <p>From December 28th through January 15th, players can access the magical Ice Kingdom through portals scattered across the main world.</p>
      
      <h2>Challenges & Rewards</h2>
      <ul>
        <li><strong>Frozen Dungeon</strong> - Complete the ice dungeon for exclusive armor sets</li>
        <li><strong>Snowball Fight Arena</strong> - PvP battles with special snowball weapons</li>
        <li><strong>Ice Fishing Competition</strong> - Catch rare winter fish for prizes</li>
        <li><strong>Building Contest</strong> - Build the best winter-themed structure</li>
      </ul>
      
      <h2>Exclusive Rewards</h2>
      <p>Earn event tokens by completing challenges and exchange them for:</p>
      <ul>
        <li>Frost Enchantments</li>
        <li>Ice Crown Cosmetic</li>
        <li>Penguin Pet</li>
        <li>Snowflake Trail Effect</li>
      </ul>
      
      <p>Don't miss out on this limited-time event! The Ice Kingdom will close on January 15th.</p>
    `,
  },
};

export default function NewsArticlePage() {
  const { slug } = useParams();
  const article = articles[slug as keyof typeof articles] || articles["summer-event-2024"];

  return (
    <Layout>
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link to="/news" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to News
            </Link>

            <Card className="border-0 bg-card">
              <CardContent className="p-8">
                <Badge className="mb-4">{article.tag}</Badge>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {article.views} views
                  </span>
                </div>

                <div 
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-ul:space-y-2"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                <div className="mt-8 pt-8 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{article.tag}</Badge>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/news">More News</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
