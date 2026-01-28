import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CommunitySection } from "@/components/home/CommunitySection";

const Index = () => {
  return (
    <Layout
      seo={{
        title: "ZCraft Network — Play Lifesteal & Survival Minecraft Servers",
        description:
          "Play ZCraft Network — top Minecraft lifesteal servers with active events, custom plugins, economy, and a friendly community. Join now to experience lifesteal gameplay.",
        keywords:
          "ZCraft, ZCraft Network, Minecraft lifesteal, lifesteal server, minecraft server, play minecraft",
        url: "https://z-craft.xyz/",
      }}
    >
      <HeroSection />
      <FeaturesSection />
      <CommunitySection />
    </Layout>
  );
};

export default Index;
