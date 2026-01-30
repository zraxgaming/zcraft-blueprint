import { Layout } from "@/components/layout/Layout";
import { ServerListingCard } from "@/components/server/ServerListingCard";
import ServerLiveCard from "@/components/server/ServerLiveCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
const EXTERNAL_LISTINGS = [
  {
    name: "Minecraft IP List",
    url: "https://www.minecraftiplist.com/server/ZCraftNetwork-3914",
    host: "play.zcraftmc.xyz:11339",
  },
  { name: "Minecraft-ServerList", url: "https://minecraft-serverlist.com/server/4150", host: "play.zcraftmc.xyz:11339" },
  { name: "FindMCServer", url: "https://findmcserver.com/server/MSUIYCwRaD", host: "play.zcraftmc.xyz:11339" },
  { name: "Minecraft.buzz", url: "https://minecraft.buzz/server/18736", host: "play.zcraftmc.xyz:11339" },
  { name: "Minecraft-Server-List", url: "https://minecraft-server-list.com/server/517459/", host: "play.zcraftmc.xyz:11339" },
  { name: "MinecraftServers.org", url: "https://minecraftservers.org/server/682813", host: "play.zcraftmc.xyz:11339" },
];

export default function ServerListings() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return EXTERNAL_LISTINGS;
    return EXTERNAL_LISTINGS.filter((l) => l.name.toLowerCase().includes(q) || l.url.toLowerCase().includes(q));
  }, [query]);


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
          <div className="mb-8 sm:flex sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Server Listings</h1>
              <p className="text-muted-foreground mt-2">Where ZCraft is listed across community directories and server lists.</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline">{EXTERNAL_LISTINGS.length} Listings</Badge>
            </div>
          </div>

          {/* Live server status */}
          <div className="mb-6">
            <ServerLiveCard host="play.zcraftmc.xyz:11339" />
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="relative flex-1">
              <Input
                placeholder="Search listings by name or url..."
                className="pr-10"
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button variant="ghost" size="icon" aria-hidden>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="ghost" onClick={() => setQuery("")}>Clear</Button>
            <Button asChild variant="outline" size="sm">
              <a href="/support">Report a missing listing</a>
            </Button>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No listings match your search.</div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } }
              }}
            >
              {filtered.map((l) => (
                <motion.div key={l.url} variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}>
                  <ServerListingCard name={l.name} url={l.url} host={(l as any).host} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
