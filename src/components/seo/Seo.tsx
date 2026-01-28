import { useEffect } from "react";

export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function Seo({
  title = "ZCraft Network — Minecraft Lifesteal & Survival Servers",
  description = "ZCraft Network — premium Minecraft servers featuring lifesteal, survival, factions, economy, and active community events.",
  keywords = "Minecraft server, lifesteal, minecraft lifesteal, zcraft, zcraft network, minecraft survival",
  image = "/assets/og-image.svg",
  url = "https://z-craft.xyz/",
}: SeoProps) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name: string, content?: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[name=\"${name}\"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setProperty = (prop: string, content?: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[property=\"${prop}\"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", prop);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("keywords", keywords);
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:image", image);
    setProperty("og:url", url);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);

    // JSON-LD structured data (Organization + WebSite)
    const ld = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ZCraft Network",
      url,
      logo: image,
      sameAs: [
        "https://discord.gg/zcraft",
        "https://twitter.com/ZCraftNetwork",
        "https://www.facebook.com/ZCraftNetwork",
      ],
    };

    const scriptId = "zcraft-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(ld);
  }, [title, description, keywords, image, url]);

  return null;
}

export default Seo;
