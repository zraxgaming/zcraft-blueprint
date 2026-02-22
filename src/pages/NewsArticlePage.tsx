import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Eye, Tag, Rss } from "lucide-react";
import { useEffect, useState } from "react";
import { newsService, NewsArticle } from "@/services/newsService";
import { toast } from "@/components/ui/use-toast";

const fallbackArticle: NewsArticle = {
  id: "fallback",
  title: "Latest updates on ZCraft",
  slug: "latest-updates",
  content: "<p>Stay tuned for our newest events, patches, and seasonal updates.</p>",
  excerpt: "Fresh news from the ZCraft team.",
  author_id: "",
  author: { id: "system", username: "ZCraft Team", avatar_url: null },
  image_url: null,
  views: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function NewsArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) {
        setArticle(fallbackArticle);
        setLoading(false);
        return;
      }
      try {
        const data = await newsService.getNewsArticle(slug);
        setArticle(data);
      } catch (err: any) {
        setError(err?.message || "Unable to load article");
        setArticle(fallbackArticle);
        toast({ title: "Error", description: "Could not load this news post. Showing the latest update instead." });
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [slug]);

  const publishedTime = article?.created_at ? new Date(article.created_at).toISOString() : undefined;
  const views = article?.views ?? 0;

  if (loading) {
    return (
      <Layout breadcrumbs={[{ label: "Home", href: "/" }, { label: "News", href: "/news" }]}>
        <div className="flex items-center justify-center py-16 text-muted-foreground">Loading article...</div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout breadcrumbs={[{ label: "Home", href: "/" }, { label: "News", href: "/news" }]}>
        <div className="py-16 text-center text-red-500">{error || "Article not found"}</div>
      </Layout>
    );
  }

  return (
    <Layout
      seo={{
        title: `${article.title} - ZCraft News`,
        description: article.excerpt || article.title,
        keywords: `zcraft news, ${article.slug || "article"}, zcraft update`,
        url: `https://z-craft.xyz/news/${slug || article.slug}`,
        type: "article",
        publishedTime,
        breadcrumbs: [
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          { label: article.title, href: `/news/${slug || article.slug}` },
        ],
        rssLinks: [
          { title: "ZCraft News RSS", href: "https://z-craft.xyz/rss/news.xml" },
          { title: "ZCraft Changelogs RSS", href: "https://z-craft.xyz/rss/changelogs.xml" },
        ],
      }}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "News", href: "/news" },
        { label: article.title, href: `/news/${slug || article.slug}` },
      ]}
    >
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link to="/news" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to News
            </Link>

            <Card className="border-0 bg-card">
              <CardContent className="p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge>{article.author?.username || "ZCraft Team"}</Badge>
                  <Badge variant="outline">{article.slug}</Badge>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {article.created_at ? new Date(article.created_at).toLocaleDateString() : "Recently"}
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {views} views
                  </span>
                </div>

                <div
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-ul:space-y-2"
                  dangerouslySetInnerHTML={{ __html: article.content || "<p>No content yet.</p>" }}
                />

                <div className="mt-8 pt-8 border-t flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{article.slug}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <a href="/rss/news.xml" className="inline-flex items-center gap-2 text-primary hover:underline">
                      <Rss className="h-4 w-4" /> News RSS
                    </a>
                    <Button variant="outline" asChild>
                      <Link to="/news">More News</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
