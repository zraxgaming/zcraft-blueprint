import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  Shield, 
  Ban, 
  Mail,
  ChevronLeft,
  ChevronRight,
  Filter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error: queryError } = await supabase
        .from("users")
        .select("id, username, email, role, created_at")
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setAllUsers(
        (data || []).map((user: any) => ({
          ...user,
          status: "active",
        }))
      );
    } catch (err: any) {
      setError(err?.message || "Failed to load users");
      toast({ title: "Error", description: "Failed to load users" });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin": return "destructive";
      case "moderator": return "default";
      case "helper": return "secondary";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-emerald-500";
      case "banned": return "text-red-500";
      case "inactive": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Users">
        <div className="flex items-center justify-center py-20">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Users">
        <div className="py-20 text-center text-red-500">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Users">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: "12,458" },
            { label: "Active Today", value: "2,341" },
            { label: "New This Week", value: "156" },
            { label: "Banned", value: "89" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold font-display">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="helper">Helper</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-medium text-primary">{user.username[0]}</span>
                            </div>
                            <div>
                              <p className="font-medium">{user.username}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`capitalize ${getStatusColor(user.status)}`}>{user.status}</span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Shield className="h-4 w-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Ban className="h-4 w-4 mr-2" />
                              Ban User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">Showing 1-8 of 12,458 users</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">1</Button>
                <Button variant="ghost" size="sm">2</Button>
                <Button variant="ghost" size="sm">3</Button>
                <span className="text-muted-foreground">...</span>
                <Button variant="ghost" size="sm">1558</Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}