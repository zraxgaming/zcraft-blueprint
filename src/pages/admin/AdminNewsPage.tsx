import { useState } from "react";
import { 
  Newspaper, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Eye,
  Calendar
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

const newsPosts = [
  { id: 1, title: "Summer Event 2024 Announced!", status: "published", date: "2024-06-01", views: 2345, tag: "Event" },
  { id: 2, title: "Server Update 1.20.4", status: "published", date: "2024-05-28", views: 1890, tag: "Update" },
  { id: 3, title: "New Survival World Coming Soon", status: "draft", date: "2024-05-25", views: 0, tag: "Announcement" },
  { id: 4, title: "Maintenance Scheduled for Saturday", status: "published", date: "2024-05-20", views: 3421, tag: "Maintenance" },
  { id: 5, title: "Staff Applications Now Open", status: "published", date: "2024-05-15", views: 5678, tag: "Announcement" },
];

export default function AdminNewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredPosts = newsPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Event": return "bg-purple-500/10 text-purple-500";
      case "Update": return "bg-blue-500/10 text-blue-500";
      case "Maintenance": return "bg-amber-500/10 text-amber-500";
      default: return "bg-primary/10 text-primary";
    }
  };

  return (
    <AdminLayout title="News Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary-gradient gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create News Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Enter post title..." />
                </div>
                <div className="space-y-2">
                  <Label>Tag</Label>
                  <Input placeholder="e.g., Update, Event, Announcement" />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea placeholder="Write your post content..." rows={8} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button className="btn-primary-gradient">Publish</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Posts", value: "45" },
            { label: "Published", value: "42" },
            { label: "Drafts", value: "3" },
            { label: "Total Views", value: "156K" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold font-display">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              All Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Newspaper className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{post.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(post.tag)}`}>
                          {post.tag}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views.toLocaleString()} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}