import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, MessageSquare, Newspaper } from "lucide-react";

const searchResults = {
  forums: [
    { title: "Best strategies for the new dungeon?", category: "General", replies: 42 },
    { title: "How to get started with farming", category: "Help", replies: 18 },
    { title: "Suggestion: New enchantment system", category: "Ideas", replies: 67 },
  ],
  wiki: [
    { title: "Getting Started Guide", views: "12.5K" },
    { title: "Commands List", views: "8.2K" },
    { title: "Economy Tutorial", views: "6.8K" },
  ],
  news: [
    { title: "Summer Event 2024 is Here!", date: "Dec 28, 2024", tag: "Event" },
    { title: "Server Update v3.2.1", date: "Dec 25, 2024", tag: "Update" },
  ],
};

export default function SearchPage() {
  return (
    <Layout seo={{
      title: "Search ZCraft Network",
      description: "Search the ZCraft Network website for forums, news, wiki articles, changelogs, and more.",
      keywords: "search, zcraft network, minecraft",
      url: "https://z-craft.xyz/search",
      type: "website",
    }}>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-4xl font-bold mb-4">
                <span className="text-gradient">Search</span>
              </h1>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search forums, wiki, news..."
                  className="pl-12 h-14 text-lg bg-card border-0"
                  defaultValue="dungeon"
                />
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full flex-wrap h-auto gap-2 bg-transparent p-0 mb-6">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  All Results
                </TabsTrigger>
                <TabsTrigger value="forums" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <MessageSquare className="h-4 w-4" />
                  Forums
                </TabsTrigger>
                <TabsTrigger value="wiki" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileText className="h-4 w-4" />
                  Wiki
                </TabsTrigger>
                <TabsTrigger value="news" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Newspaper className="h-4 w-4" />
                  News
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {/* Forums Results */}
                <Card className="border-0 bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-sm flex items-center gap-2 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      Forums
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {searchResults.forums.map((result, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                        <h4 className="font-medium mb-1">{result.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">{result.category}</Badge>
                          <span>{result.replies} replies</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Wiki Results */}
                <Card className="border-0 bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-sm flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Wiki
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {searchResults.wiki.map((result, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                        <h4 className="font-medium mb-1">{result.title}</h4>
                        <span className="text-sm text-muted-foreground">{result.views} views</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* News Results */}
                <Card className="border-0 bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-sm flex items-center gap-2 text-muted-foreground">
                      <Newspaper className="h-4 w-4" />
                      News
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {searchResults.news.map((result, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{result.title}</h4>
                          <Badge variant="secondary" className="text-xs">{result.tag}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{result.date}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="forums">
                <Card className="border-0 bg-card">
                  <CardContent className="p-6 space-y-2">
                    {searchResults.forums.map((result, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                        <h4 className="font-medium mb-1">{result.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">{result.category}</Badge>
                          <span>{result.replies} replies</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wiki">
                <Card className="border-0 bg-card">
                  <CardContent className="p-6 space-y-2">
                    {searchResults.wiki.map((result, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                        <h4 className="font-medium mb-1">{result.title}</h4>
                        <span className="text-sm text-muted-foreground">{result.views} views</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="news">
                <Card className="border-0 bg-card">
                  <CardContent className="p-6 space-y-2">
                    {searchResults.news.map((result, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{result.title}</h4>
                          <Badge variant="secondary" className="text-xs">{result.tag}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{result.date}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
}
