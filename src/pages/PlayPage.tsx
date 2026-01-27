import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Monitor, Smartphone, ChevronRight } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    number: 1,
    title: "Launch Minecraft",
    description: "Open Minecraft Java Edition or Bedrock Edition on your device.",
  },
  {
    number: 2,
    title: "Add Server",
    description: "Go to Multiplayer > Add Server and enter our server address.",
  },
  {
    number: 3,
    title: "Connect & Play",
    description: "Select ZCraft from your server list and click Join Server!",
  },
];

export default function PlayPage() {
  const [copiedJava, setCopiedJava] = useState(false);
  const [copiedBedrock, setCopiedBedrock] = useState(false);
  const JAVA_IP = "play.zcraftmc.xyz";
  const JAVA_PORT = "11339";
  const BEDROCK_IP = "bedrock.zcraftmc.xyz";
  const BEDROCK_PORT = "11339";

  const copyAddress = (type: "java" | "bedrock") => {
    const address = type === "java" ? `${JAVA_IP}:${JAVA_PORT}` : `${BEDROCK_IP}:${BEDROCK_PORT}`;
    navigator.clipboard.writeText(address);
    if (type === "java") {
      setCopiedJava(true);
      setTimeout(() => setCopiedJava(false), 2000);
    } else {
      setCopiedBedrock(true);
      setTimeout(() => setCopiedBedrock(false), 2000);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              How to <span className="text-gradient">Join</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect to ZCraft in seconds. We support both Java and Bedrock editions!
            </p>
          </div>
        </div>
      </section>

      {/* Edition Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Java Edition */}
            <Card className="card-hover border-0 bg-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <CardHeader className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Monitor className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-2xl">Java Edition</CardTitle>
                    <p className="text-sm text-muted-foreground">PC / Mac / Linux</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Server Address</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <code className="font-mono text-lg font-semibold flex-1 break-all">{JAVA_IP}</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyAddress("java")}
                    >
                      {copiedJava ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Port</p>
                  <p className="font-semibold">{JAVA_PORT}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Supported Versions</p>
                  <p className="font-semibold">1.8.x – 1.21.x</p>
                </div>
              </CardContent>
            </Card>

            {/* Bedrock Edition */}
            <Card className="card-hover border-0 bg-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
              <CardHeader className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                    <Smartphone className="h-7 w-7 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-2xl">Bedrock Edition</CardTitle>
                    <p className="text-sm text-muted-foreground">Mobile / Console / Windows 10+</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Server Address</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <code className="font-mono text-lg font-semibold flex-1 break-all">{BEDROCK_IP}</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyAddress("bedrock")}
                    >
                      {copiedBedrock ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Port</p>
                  <p className="font-semibold">{BEDROCK_PORT}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Quick Start <span className="text-gradient">Guide</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex items-start gap-6 p-6 rounded-xl bg-card card-hover"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-bold text-xl">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="h-6 w-6 text-muted-foreground hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
