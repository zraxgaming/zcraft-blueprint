import fs from "fs";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SITE_URL = process.env.SITE_URL || "https://z-craft.xyz";
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const escapeCdata = (text = "") => text.replace("]]>", "]]]]><![CDATA[>");

const buildRss = (title, description, items) => {
  const now = new Date().toUTCString();
  const rssItems = items
    .map(
      (item) => `
    <item>
      <title><![CDATA[${escapeCdata(item.title)}]]></title>
      <link>${item.link}</link>
      <guid>${item.guid || item.link}</guid>
      <pubDate>${item.pubDate || now}</pubDate>
      <description><![CDATA[${escapeCdata(item.description || "")}]]></description>
    </item>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${title}</title>
    <link>${SITE_URL}</link>
    <description>${description}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>${rssItems}
  </channel>
</rss>`;
};

async function fetchData() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("Supabase env vars missing; generating feeds with placeholders.");
    return {
      news: [
        {
          title: "ZCraft updates",
          slug: "zcraft-updates",
          excerpt: "Keep up with the latest events and releases on ZCraft.",
          created_at: new Date().toISOString(),
          content: "Follow our news feed to stay in the loop.",
        },
      ],
      changelogs: [
        {
          version: "v1.0.0",
          title: "Initial release",
          description: "First public release of ZCraft.",
          changes: ["Launch of lifesteal servers", "New community events"],
          released_at: new Date().toISOString(),
        },
      ],
    };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const [newsRes, changelogRes] = await Promise.all([
    supabase.from("news").select("title, slug, excerpt, content, created_at, updated_at").order("created_at", { ascending: false }).limit(50),
    supabase.from("changelogs").select("version, title, description, changes, released_at, updated_at").order("released_at", { ascending: false }).limit(50),
  ]);

  if (newsRes.error) throw newsRes.error;
  if (changelogRes.error) throw changelogRes.error;

  return {
    news: newsRes.data || [],
    changelogs: changelogRes.data || [],
  };
}

async function main() {
  console.log("Generating RSS feeds...");
  const data = await fetchData();

  ensureDir("public/rss");

  // News feed
  const newsItems = (data.news || []).map((item) => ({
    title: item.title,
    link: `${SITE_URL}/news/${item.slug}`,
    guid: `${SITE_URL}/news/${item.slug}`,
    pubDate: new Date(item.updated_at || item.created_at || Date.now()).toUTCString(),
    description: item.excerpt || item.content?.slice(0, 240) || item.title,
  }));
  if (newsItems.length === 0) {
    newsItems.push({
      title: "News feed warming up",
      link: `${SITE_URL}/news`,
      guid: `${SITE_URL}/news`,
      pubDate: new Date().toUTCString(),
      description: "No news posts yet. Check back soon for updates.",
    });
  }

  const newsRss = buildRss("ZCraft News", "Official announcements, events, and updates.", newsItems);
  fs.writeFileSync("public/rss/news.xml", newsRss, "utf8");
  console.log(`Wrote public/rss/news.xml (${newsItems.length} items)`);

  // Changelogs feed
  const changelogItems = (data.changelogs || []).map((item) => ({
    title: `${item.title} (v${item.version})`,
    link: `${SITE_URL}/changelogs/${encodeURIComponent(item.version)}`,
    guid: `${SITE_URL}/changelogs/${encodeURIComponent(item.version)}`,
    pubDate: new Date(item.updated_at || item.released_at || Date.now()).toUTCString(),
    description: `${item.description || ""}${item.changes ? ` Changes: ${item.changes.join("; ")}` : ""}`,
  }));
  if (changelogItems.length === 0) {
    changelogItems.push({
      title: "Changelog feed warming up",
      link: `${SITE_URL}/changelogs`,
      guid: `${SITE_URL}/changelogs`,
      pubDate: new Date().toUTCString(),
      description: "No changelogs published yet. Releases will appear here automatically.",
    });
  }

  const changelogRss = buildRss("ZCraft Changelogs", "Release notes for new features, fixes, and improvements.", changelogItems);
  fs.writeFileSync("public/rss/changelogs.xml", changelogRss, "utf8");
  console.log(`Wrote public/rss/changelogs.xml (${changelogItems.length} items)`);
}

main().catch((err) => {
  console.error("Error generating feeds", err);
  process.exit(1);
});
