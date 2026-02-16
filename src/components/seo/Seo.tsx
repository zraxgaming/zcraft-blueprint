import { useEffect } from "react";

export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | string;
  publishedTime?: string; // ISO date when the article was published
}

export function Seo({
  title = "ZCraft Network — Minecraft Lifesteal & Survival Servers",
  description = "ZCraft Network — premium Minecraft servers featuring lifesteal, survival, factions, economy, and active community events.",
  keywords = "Minecraft server, lifesteal, minecraft lifesteal, zcraft, zcraft network, minecraft survival",
  image = "/zcraft.png",
  url = "https://z-craft.xyz/",
  type = 'website',
  publishedTime,
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

    // Ensure absolute URLs for image and url
    const origin = 'https://z-craft.xyz';
    const absoluteUrl = url?.startsWith('http') ? url : `${origin}${url}`;
    const absoluteImage = image?.startsWith('http') ? image : `${origin}${image}`;

    setMeta("description", description);
    setMeta("keywords", keywords);
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:image", absoluteImage);
    setProperty("og:url", absoluteUrl);
    setProperty("og:type", type || 'website');
    setProperty("og:site_name", "ZCraft Network");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", absoluteImage);
    setMeta("twitter:site", "@ZCraftNetwork");
    setMeta("robots", "index, follow");

    // Canonical link
    if (absoluteUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', absoluteUrl);
    }

    // JSON-LD structured data (Organization + WebSite + optional SearchAction)
    const ld: any = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ZCraft Network",
      url: absoluteUrl,
      logo: absoluteImage,
      sameAs: [
        "https://discord.gg/zcraft",
        "https://twitter.com/ZCraftNetwork",
        "https://www.facebook.com/ZCraftNetwork",
      ],
    };

    // Add WebSite SearchAction for better search results
    ld.website = {
      "@type": "WebSite",
      url: origin || absoluteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    if (type === 'article' && publishedTime) {
      ld['@type'] = 'Article';
      ld.datePublished = publishedTime;
    }

    const scriptId = "zcraft-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(ld);
  }, [title, description, keywords, image, url, type, publishedTime]);

  return null;
}

export default Seo;
