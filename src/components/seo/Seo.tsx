import { useEffect } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | string;
  publishedTime?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  rssLinks?: { title: string; href: string }[];
}

export function Seo({
  title = "ZCraft Network - Minecraft Lifesteal & Survival Servers",
  description = "ZCraft Network - premium Minecraft servers featuring lifesteal, survival, factions, economy, and active community events.",
  keywords = "Minecraft server, lifesteal, minecraft lifesteal, zcraft, zcraft network, minecraft survival",
  image = "/assets/og-image.svg",
  url = "https://z-craft.xyz/",
  type = "website",
  publishedTime,
  noindex = false,
  breadcrumbs,
  rssLinks,
}: SeoProps) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name: string, content?: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setProperty = (prop: string, content?: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", prop);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const absoluteUrl = url?.startsWith("http") ? url : `${origin}${url}`;
    const absoluteImage = image?.startsWith("http") ? image : `${origin}${image}`;
    const baseUrl = origin || (absoluteUrl ? new URL(absoluteUrl).origin : "");
    const robotsContent = noindex ? "noindex, nofollow" : "index, follow";

    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("robots", robotsContent);
    setMeta("theme-color", "#0F172A");
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:image", absoluteImage);
    setProperty("og:url", absoluteUrl);
    setProperty("og:type", type || "website");
    setProperty("og:site_name", "ZCraft Network");
    setProperty("og:locale", "en_US");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", absoluteImage);
    setMeta("twitter:site", "@ZCraftNetwork");

    // Canonical link
    if (absoluteUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", absoluteUrl);
    }

    // RSS / Atom alternate links
    const rssFeedLinks =
      rssLinks ||
      [
        { title: "ZCraft News RSS", href: `${baseUrl}/rss/news.xml` },
        { title: "ZCraft Changelogs RSS", href: `${baseUrl}/rss/changelogs.xml` },
      ];

    rssFeedLinks.forEach((feed, index) => {
      if (!feed.href) return;
      const feedHref = feed.href.startsWith("http") ? feed.href : `${baseUrl}${feed.href}`;
      const selector = `link[data-rss-index="${index}"]`;
      let link = document.querySelector(selector) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "alternate");
        link.setAttribute("type", "application/rss+xml");
        link.setAttribute("data-rss-index", `${index}`);
        document.head.appendChild(link);
      }
      link.setAttribute("title", feed.title);
      link.setAttribute("href", feedHref);
    });

    // Structured data
    const graph: any[] = [
      {
        "@type": "Organization",
        name: "ZCraft Network",
        url: absoluteUrl,
        logo: absoluteImage,
        sameAs: [
          "https://discord.gg/zcraft",
          "https://twitter.com/ZCraftNetwork",
          "https://www.facebook.com/ZCraftNetwork",
        ],
      },
      {
        "@type": "WebSite",
        url: origin || absoluteUrl,
        name: "ZCraft Network",
        potentialAction: {
          "@type": "SearchAction",
          target: `${origin}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ];

    if (type === "article" && publishedTime) {
      graph.push({
        "@type": "Article",
        headline: title,
        datePublished: publishedTime,
        dateModified: publishedTime,
        mainEntityOfPage: absoluteUrl,
        image: absoluteImage,
        author: {
          "@type": "Organization",
          name: "ZCraft Network",
        },
      });
    }

    if (breadcrumbs?.length) {
      graph.push({
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.label,
          item: crumb.href ? (crumb.href.startsWith("http") ? crumb.href : `${origin}${crumb.href}`) : absoluteUrl,
        })),
      });
    }

    const scriptId = "zcraft-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });
  }, [title, description, keywords, image, url, type, publishedTime, noindex, breadcrumbs, rssLinks]);

  return null;
}

export default Seo;
