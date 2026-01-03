import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Eye,
  Pin,
  Lock,
  Flag,
  Loader
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminLayout from "@/components/admin/AdminLayout";
import { forumService } from "@/services/forumService";
import { toast } from "@/components/ui/use-toast";

interface ForumThread {
  id: string;
  title: string;
  author: string;
  category: string;
  replies_count: number;
  created_at: string;
}

interface ForumCategory {
  id: string;
  name: string;
}

export default function AdminForumsPage() {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForumData();
  }, []);

  const loadForumData = async () => {
    try {
      const [threadsData, categoriesData] = await Promise.all([
        forumService.getAllThreads(),
        forumService.getCategories(),
      ]);
      setThreads(threadsData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err?.message || "Failed to load forums");
      toast({ title: "Error", description: "Failed to load forum data" });
    } finally {
      setLoading(false);
    }
  };

  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="Forums Management">
        <div className="flex items-center justify-center py-20">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Forums Management">
        <div className="py-20 text-center text-red-500">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Forums Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Threads", value: threads.length.toString() },
            { label: "Total Posts", value: threads.reduce((sum, t) => sum + (t.replies_count || 0), 0).toString() },
            { label: "Categories", value: categories.length.toString() },
            { label: "Reports Pending", value: "0" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold font-display">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Categories */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Categories</CardTitle>
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No categories</p>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.threads_count} threads • {category.posts_count} posts</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Threads */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Recent Threads
                </CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search threads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredThreads.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No threads found</p>
              ) : (
                filteredThreads.map((thread) => (
                  <div key={thread.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{thread.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>by {thread.author}</span>
                        <Badge variant="outline" className="text-xs">{thread.category}</Badge>
                        <span>{thread.replies_count} replies</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}