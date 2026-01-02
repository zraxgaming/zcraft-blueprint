import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Server, Globe, MessageSquare, Bot, ShoppingCart, Activity } from "lucide-react";

const services = [
  {
    name: "Minecraft Server",
    status: "online",
    icon: Server,
    description: "Main game server",
    uptime: "99.98%",
    latency: "12ms",
  },
  {
    name: "Website",
    status: "online",
    icon: Globe,
    description: "Main website & API",
    uptime: "99.99%",
    latency: "45ms",
  },
  {
    name: "Forums",
    status: "online",
    icon: MessageSquare,
    description: "Community forums",
    uptime: "99.95%",
    latency: "38ms",
  },
  {
    name: "Discord Bot",
    status: "degraded",
    icon: Bot,
    description: "Discord integration",
    uptime: "98.50%",
    latency: "120ms",
  },
  {
    name: "Store",
    status: "online",
    icon: ShoppingCart,
    description: "Tebex store (external)",
    uptime: "99.90%",
    latency: "85ms",
  },
];

const incidents = [
  {
    date: "Dec 28, 2024",
    title: "Discord Bot Experiencing Delays",
    status: "investigating",
    description: "Some commands may be slower than usual. We're investigating the cause.",
  },
  {
    date: "Dec 25, 2024",
    title: "Scheduled Maintenance Completed",
    status: "resolved",
    description: "Server maintenance completed successfully. All systems operational.",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "status-online";
    case "degraded":
      return "status-degraded";
    case "offline":
      return "status-offline";
    default:
      return "bg-muted";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "online":
      return "Operational";
    case "degraded":
      return "Degraded";
    case "offline":
      return "Offline";
    default:
      return "Unknown";
  }
};

export default function StatusPage() {
  const allOperational = services.every((s) => s.status === "online");

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
            <div
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl ${
                allOperational ? "bg-emerald-500/10" : "bg-amber-500/10"
              }`}
            >
              <div className={`h-3 w-3 rounded-full ${allOperational ? "status-online" : "status-degraded"}`} />
              <span className={`font-semibold ${allOperational ? "text-emerald-600" : "text-amber-600"}`}>
                {allOperational ? "All Systems Operational" : "Some Systems Degraded"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-6">Services</h2>
            <div className="space-y-4">
              {services.map((service) => (
                <Card key={service.name} className="card-hover border-0 bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                        <service.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">{service.name}</h3>
                          <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(service.status)}`} />
                          <span
                            className={`text-sm ${
                              service.status === "online"
                                ? "text-emerald-600"
                                : service.status === "degraded"
                                ? "text-amber-600"
                                : "text-red-600"
                            }`}
                          >
                            {getStatusText(service.status)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="text-muted-foreground">Uptime</p>
                          <p className="font-mono font-semibold">{service.uptime}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">Latency</p>
                          <p className="font-mono font-semibold">{service.latency}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Incidents */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-6">Recent Incidents</h2>
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <Card key={index} className="border-0 bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${
                          incident.status === "resolved" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{incident.title}</h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              incident.status === "resolved"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {incident.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                        <p className="text-xs text-muted-foreground">{incident.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
