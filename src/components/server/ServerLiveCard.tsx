import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Server } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchMinecraftServerStatus } from "@/services/serverService";
import { toast } from "@/components/ui/use-toast";

export default function ServerLiveCard({ host }: { host: string }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["serverStatus", host],
    queryFn: () => fetchMinecraftServerStatus(host),
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(host);
      toast({ title: "Copied", description: `Server address ${host} copied to clipboard.` });
    } catch {
      toast({ title: "Copy failed", description: "Could not copy server IP.", variant: 'destructive' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-0 bg-card">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5" />
            <div>
              <div className="font-medium">ZCraft Main Server</div>
              <div className="text-xs text-muted-foreground">{host}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Live status • updates every 30s</div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </div>
          ) : error || !data ? (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Players: 256+</div>
              <div className="text-destructive">Unavailable</div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${data.online ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <div className="font-medium">{data.online ? 'Online' : 'Offline'}</div>
              </div>

              <div className="text-sm text-muted-foreground">Players: {data.players?.online ?? '—'}{data.players ? ` / ${data.players.max}` : ''}</div>
              {data.version && <div className="text-sm text-muted-foreground">Version: {data.version}</div>}
              <div className="text-sm text-muted-foreground">Latency: {data.latency ?? '—'} ms</div>
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-end">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>Refresh</Button>
            <Button variant="ghost" size="sm" onClick={copy}>Copy IP</Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
