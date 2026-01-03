import { useState } from "react";
import { 
  Settings, 
  Globe, 
  Bell, 
  Shield, 
  Palette,
  Server,
  Save
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [emailVerification, setEmailVerification] = useState(true);

  return (
    <AdminLayout title="Settings">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Server Settings
              </CardTitle>
              <CardDescription>Configure basic server information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Server Name</Label>
                  <Input defaultValue="ZCraft Network" />
                </div>
                <div className="space-y-2">
                  <Label>Server IP</Label>
                  <Input defaultValue="play.zcraft.net" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Server Description</Label>
                <Textarea defaultValue="The ultimate Minecraft survival experience. Build, explore, and conquer with thousands of players." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Discord Invite URL</Label>
                <Input defaultValue="https://discord.gg/zcraft" />
              </div>
              <div className="space-y-2">
                <Label>Store URL (Tebex)</Label>
                <Input defaultValue="https://store.zcraft.net" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site Status</CardTitle>
              <CardDescription>Control site-wide features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Redirects all visitors to maintenance page
                  </p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Announcement Banner</Label>
                  <p className="text-sm text-muted-foreground">
                    Display banner message on all pages
                  </p>
                </div>
                <Switch checked={announcementEnabled} onCheckedChange={setAnnouncementEnabled} />
              </div>
              {announcementEnabled && (
                <div className="space-y-2 pl-4 border-l-2 border-primary">
                  <Label>Banner Message</Label>
                  <Input defaultValue="🎉 Summer Event starts July 15th! Join now for exclusive rewards!" />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="btn-primary-gradient gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Theme Settings
              </CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Default Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Set dark mode as default for new visitors
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Allow Theme Toggle</Label>
                  <p className="text-sm text-muted-foreground">
                    Let users switch between light and dark mode
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  {["#3b82f6", "#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b"].map((color) => (
                    <button
                      key={color}
                      className="h-10 w-10 rounded-lg border-2 border-transparent hover:border-foreground transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="btn-primary-gradient gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Email Notifications
              </CardTitle>
              <CardDescription>Configure email settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SMTP Host</Label>
                  <Input placeholder="smtp.example.com" />
                </div>
                <div className="space-y-2">
                  <Label>SMTP Port</Label>
                  <Input placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label>SMTP Username</Label>
                  <Input placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>SMTP Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>From Email</Label>
                <Input defaultValue="noreply@zcraft.net" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="btn-primary-gradient gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Authentication Settings
              </CardTitle>
              <CardDescription>Manage user registration and login</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Allow Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable new user signups
                  </p>
                </div>
                <Switch checked={registrationEnabled} onCheckedChange={setRegistrationEnabled} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Require email verification for new accounts
                  </p>
                </div>
                <Switch checked={emailVerification} onCheckedChange={setEmailVerification} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rate Limiting</CardTitle>
              <CardDescription>Protect against abuse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Login Attempts (per hour)</Label>
                  <Input type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label>API Requests (per minute)</Label>
                  <Input type="number" defaultValue="60" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="btn-primary-gradient gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}