import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CommunitySection } from "@/components/home/CommunitySection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <CommunitySection />
    </Layout>
  );
};

export default Index;
