import { useState } from "react";
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
  Flag
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

const forumThreads = [
  { id: 1, title: "Welcome to ZCraft Forums!", author: "Admin", category: "Announcements", replies: 156, isPinned: true, isLocked: false, reports: 0 },
  { id: 2, title: "Server Rules - Read Before Playing", author: "Admin", category: "Announcements", replies: 45, isPinned: true, isLocked: true, reports: 0 },
  { id: 3, title: "Best Base Designs?", author: "BuilderPro", category: "General", replies: 89, isPinned: false, isLocked: false, reports: 0 },
  { id: 4, title: "Trading Diamond for Emeralds", author: "TraderJoe", category: "Trading", replies: 23, isPinned: false, isLocked: false, reports: 2 },
  { id: 5, title: "Bug Report: Nether Portal Issue", author: "BugHunter", category: "Bug Reports", replies: 12, isPinned: false, isLocked: false, reports: 0 },
  { id: 6, title: "Suggestion: New Minigame Mode", author: "GamerX", category: "Suggestions", replies: 67, isPinned: false, isLocked: false, reports: 0 },
];

const categories = [
  { name: "Announcements", threads: 24, posts: 892 },
  { name: "General Discussion", threads: 1234, posts: 15678 },
  { name: "Help & Support", threads: 567, posts: 2345 },
  { name: "Suggestions", threads: 345, posts: 1234 },
  { name: "Bug Reports", threads: 123, posts: 456 },
  { name: "Trading", threads: 890, posts: 4567 },
];

export default function AdminForumsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredThreads = forumThreads.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Forums Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Threads", value: "3,183" },
            { label: "Total Posts", value: "45,892" },
            { label: "Active Today", value: "234" },
            { label: "Reports Pending", value: "12" },
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
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.threads} threads • {category.posts} posts</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ))}
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
              {filteredThreads.map((thread) => (
                <div key={thread.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {thread.isPinned && <Pin className="h-3 w-3 text-primary" />}
                      {thread.isLocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                      <h3 className="font-medium truncate">{thread.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>by {thread.author}</span>
                      <Badge variant="outline" className="text-xs">{thread.category}</Badge>
                      <span>{thread.replies} replies</span>
                      {thread.reports > 0 && (
                        <span className="flex items-center gap-1 text-destructive">
                          <Flag className="h-3 w-3" />
                          {thread.reports} reports
                        </span>
                      )}
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
                        <Pin className="h-4 w-4 mr-2" />
                        {thread.isPinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Lock className="h-4 w-4 mr-2" />
                        {thread.isLocked ? "Unlock" : "Lock"}
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