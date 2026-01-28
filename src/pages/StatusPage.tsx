import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ExternalLink, Activity } from "lucide-react";
import { useEffect } from "react";

export default function StatusPage() {
  useEffect(() => {
    // Redirect to canonical status domain
    window.location.replace("https://status.z-craft.xyz");
  }, []);

  return (
    <Layout
      seo={{
        title: "Status — ZCraft Network",
        description: "Live status and incident reports for ZCraft Network services.",
        url: "https://z-craft.xyz/status",
      }}
    >
      <div className="py-24 text-center">
        <p className="text-lg">Redirecting to the live status page…</p>
        <p className="mt-4">
          If you are not redirected automatically, <a href="https://status.z-craft.xyz" className="underline">click here</a>.
        </p>
      </div>
    </Layout>
  );
}
