import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ExternalLink, Activity } from "lucide-react";

export default function StatusPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border mb-6">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Live Status</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              System <span className="text-gradient">Status</span>
            </h1>

            <p className="text-muted-foreground mb-8">
              Real-time service status is provided by our official status page.
            </p>

            <Button asChild size="lg" className="btn-primary-gradient">
              <a
                href="https://status.z-craft.xyz"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Full Status Page
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Embedded Status Page */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative w-full h-[75vh] rounded-xl overflow-hidden border bg-card">
              <iframe
                src="https://status.z-craft.xyz"
                title="ZCraft Status"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
