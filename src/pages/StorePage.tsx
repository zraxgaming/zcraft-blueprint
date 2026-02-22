import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";

export default function StorePage() {
  useEffect(() => {
    // Redirect to the canonical store domain/path
    window.location.replace("https://z-craft.xyz/store");
  }, []);

  return (
    <Layout
      seo={{
        title: "ZCraft Store - Support the Server & Get Perks",
        description: "Support ZCraft Network via our official store and unlock exclusive perks, cosmetics, and ranks.",
        keywords: "zcraft store, zcraft tebex, minecraft store, server store",
        url: "https://z-craft.xyz/store",
      }}
    >
      <div className="py-24 text-center">
        <p className="text-lg">Redirecting to the store…</p>
        <p className="mt-4">
          If you are not redirected automatically, <a href="https://z-craft.xyz/store" className="underline">click here</a>.
        </p>
      </div>
    </Layout>
  );
}

