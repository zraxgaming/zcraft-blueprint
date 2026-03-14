import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CommunitySection } from "@/components/home/CommunitySection";

const Index = () => {
  return (
    <Layout
      seo={{
        title: "ZCraft Network — #1 Minecraft Lifesteal SMP Server | Join Now",
        description: "Join ZCraft Network, the premier Minecraft lifesteal SMP server with competitive PvP, custom economy, factions, and active community events. Best Minecraft server for lifesteal gameplay, survival, and social gaming.",
        keywords: "zcraft network, minecraft lifesteal server, lifesteal smp, minecraft server, best minecraft server, minecraft factions, minecraft economy, minecraft pvp, minecraft survival server, minecraft community server, play minecraft lifesteal",
        url: "/",
        type: "website",
        tags: ["minecraft", "lifesteal", "smp", "server", "gaming", "community"]
      }}
    >
      <HeroSection />
      <FeaturesSection />
      <CommunitySection />
    </Layout>
  );
};

export default Index;
