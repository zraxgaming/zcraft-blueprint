import { Layout } from "@/components/layout/Layout";

const EXTERNAL_LISTINGS = [
  {
    name: "Minecraft IP List",
    url: "https://www.minecraftiplist.com/server/ZCraftNetwork-3914",
  },
  { name: "Minecraft-ServerList", url: "https://minecraft-serverlist.com/server/4150" },
  { name: "FindMCServer", url: "https://findmcserver.com/server/MSUIYCwRaD" },
  { name: "Minecraft.buzz", url: "https://minecraft.buzz/server/18736" },
  { name: "Minecraft-Server-List", url: "https://minecraft-server-list.com/server/517459/" },
  { name: "MinecraftServers.org", url: "https://minecraftservers.org/server/682813" },
];

export default function ServerListings() {
  return (
    <Layout
      seo={{
        title: "ZCraft Server Listings — Find ZCraft on Top Minecraft Lists",
        description: "Find ZCraft Network on popular Minecraft server listing sites and compare stats, players, and reviews.",
        keywords: "zcraft server listings, minecraft server listings, zcraft network listings",
        url: "https://z-craft.xyz/server-listings",
      }}
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold mb-6">Server Listings</h1>
          <p className="text-muted-foreground mb-6">External listings where ZCraft Network appears:</p>

          <div className="grid gap-4">
            {EXTERNAL_LISTINGS.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border bg-card hover:shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{l.name}</div>
                  <div className="text-xs text-muted-foreground">External</div>
                </div>
                <div className="text-sm text-muted-foreground mt-2 break-all">{l.url}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
