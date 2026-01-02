import { Sword, Users, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Sword,
    title: "Survival Experience",
    description: "Classic survival gameplay with unique twists, custom enchantments, and challenging dungeons.",
  },
  {
    icon: Users,
    title: "Active Community",
    description: "Join thousands of active players, make friends, and build together in our welcoming community.",
  },
  {
    icon: Shield,
    title: "Anti-Cheat Protected",
    description: "State-of-the-art protection ensures fair gameplay for everyone, every time.",
  },
  {
    icon: Zap,
    title: "Zero Lag",
    description: "Optimized servers with dedicated hardware provide the smoothest experience possible.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Why Play <span className="text-gradient">ZCraft</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover what makes our server special and why players keep coming back.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="card-hover border-0 bg-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
