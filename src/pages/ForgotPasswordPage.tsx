import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <Layout seo={{
      title: "Forgot Password - ZCraft Network",
      description: "Reset your ZCraft Network account password.",
      keywords: "password reset, forgot password, zcraft network",
      url: "https://z-craft.xyz/forgot-password",
      type: "website",
    }}>
      <section className="py-16 lg:py-24 min-h-[70vh] flex items-center">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto border-0 bg-card card-hover">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-3xl">
                  🔑
                </div>
              </div>
              <CardTitle className="font-display text-2xl">Reset Password</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your email and we'll send you a reset link
              </p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <Button className="w-full btn-primary-gradient">Send Reset Link</Button>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
