import { useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Eye,
  FolderOpen
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/components/admin/AdminLayout";

const wikiArticles = [
  { id: 1, title: "Getting Started Guide", category: "Basics", views: 8934, lastUpdated: "2024-05-28" },
  { id: 2, title: "Server Commands", category: "Commands", views: 12456, lastUpdated: "2024-05-25" },
  { id: 3, title: "Economy System", category: "Features", views: 5678, lastUpdated: "2024-05-20" },
  { id: 4, title: "Land Claiming", category: "Features", views: 4321, lastUpdated: "2024-05-18" },
  { id: 5, title: "PvP Arenas", category: "Minigames", views: 3456, lastUpdated: "2024-05-15" },
  { id: 6, title: "Ranks & Permissions", category: "Info", views: 7890, lastUpdated: "2024-05-10" },
];

const wikiCategories = [
  { name: "Basics", articles: 12 },
  { name: "Commands", articles: 24 },
  { name: "Features", articles: 18 },
  { name: "Minigames", articles: 8 },
  { name: "Info", articles: 15 },
];

export default function AdminWikiPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredArticles = wikiArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Wiki Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary-gradient gap-2">
                <Plus className="h-4 w-4" />
                New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Wiki Article</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Enter article title..." />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input placeholder="e.g., Basics, Commands, Features" />
                </div>
                <div className="space-y-2">
                  <Label>Content (Markdown)</Label>
                  <Textarea placeholder="Write article content..." rows={10} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button className="btn-primary-gradient">Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Articles", value: "234" },
            { label: "Categories", value: "12" },
            { label: "Total Views", value: "89K" },
            { label: "Updated Today", value: "5" },
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Categories
              </CardTitle>
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {wikiCategories.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary">{category.articles}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Articles */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                All Articles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{article.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline">{article.category}</Badge>
                        <span>{article.views.toLocaleString()} views</span>
                        <span>Updated {article.lastUpdated}</span>
                      </div>
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
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}