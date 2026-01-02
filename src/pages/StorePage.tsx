import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";

export default function StorePage() {
  return (
    <Layout>
      <section className="py-32 lg:py-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <Card className="max-w-xl mx-auto border-0 bg-card card-hover">
            <CardContent className="p-12 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                <ShoppingCart className="h-10 w-10 text-primary" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                ZCraft Store
              </h1>
              <p className="text-muted-foreground mb-8">
                You're being redirected to our official Tebex store. Support the server while getting awesome perks!
              </p>
              <Button size="lg" className="btn-primary-gradient gap-2">
                Continue to Store
                <ExternalLink className="h-5 w-5" />
              </Button>
              <p className="text-xs text-muted-foreground mt-6">
                Powered by Tebex • Secure checkout
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
