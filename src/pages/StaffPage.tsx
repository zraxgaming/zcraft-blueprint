import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Shield, Star, Heart } from "lucide-react";

const staffRoles = [
  {
    name: "Owners",
    icon: Crown,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    members: [
      { name: "ZCraftOwner", avatar: "👑", joined: "2020" },
      { name: "ServerFounder", avatar: "🎮", joined: "2020" },
    ],
  },
  {
    name: "Administrators",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    members: [
      { name: "AdminPro", avatar: "🛡️", joined: "2021" },
      { name: "ServerManager", avatar: "⚙️", joined: "2021" },
      { name: "TechAdmin", avatar: "💻", joined: "2022" },
    ],
  },
  {
    name: "Moderators",
    icon: Star,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    members: [
      { name: "ModMaster", avatar: "✨", joined: "2022" },
      { name: "ChatGuardian", avatar: "💬", joined: "2022" },
      { name: "RuleKeeper", avatar: "📜", joined: "2023" },
      { name: "FairPlay", avatar: "⚖️", joined: "2023" },
      { name: "CommunityMod", avatar: "🌟", joined: "2023" },
    ],
  },
  {
    name: "Helpers",
    icon: Heart,
    color: "text-primary",
    bgColor: "bg-primary/10",
    members: [
      { name: "HelpfulHero", avatar: "💙", joined: "2024" },
      { name: "NewbieGuide", avatar: "🎯", joined: "2024" },
      { name: "SupportStar", avatar: "⭐", joined: "2024" },
      { name: "FriendlyHelper", avatar: "🤝", joined: "2024" },
    ],
  },
];

export default function StaffPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our <span className="text-gradient">Staff</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Meet the dedicated team that keeps ZCraft running smoothly.
            </p>
          </div>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {staffRoles.map((role) => (
              <div key={role.name}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${role.bgColor}`}>
                    <role.icon className={`h-5 w-5 ${role.color}`} />
                  </div>
                  <h2 className="font-display text-2xl font-bold">{role.name}</h2>
                  <Badge variant="secondary" className="ml-auto">
                    {role.members.length} members
                  </Badge>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {role.members.map((member) => (
                    <Card key={member.name} className="card-hover border-0 bg-card">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-2xl">
                            {member.avatar}
                          </div>
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">Since {member.joined}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Staff CTA */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-0 bg-card">
            <CardContent className="p-8 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-4xl mb-4">
                🚀
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">Want to Join the Team?</h3>
              <p className="text-muted-foreground mb-6">
                We're always looking for dedicated players to help our community grow.
              </p>
              <Badge variant="outline" className="text-base px-4 py-2">
                Applications opening soon!
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
