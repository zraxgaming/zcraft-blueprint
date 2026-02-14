export type MinecraftServerStatus = {
  online: boolean;
  ip?: string;
  port?: number;
  version?: string;
  players?: {
    online: number;
    max: number;
  } | null;
  latency?: number | null;
  motd?: string[];
};

const DEFAULT_TIMEOUT = 8000;

async function tryMcStatus(host: string) {
  const url = `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(host)}`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`mcstatus ${res.status}`);
    const data = await res.json();

    return {
      online: !!data.online,
      ip: data.host ?? host.split(":")[0],
      port: data.port ?? (host.includes(":") ? Number(host.split(":")[1]) : undefined),
      version: data.version?.name ?? data.software ?? undefined,
      players: data.players ? { online: data.players.online ?? 0, max: data.players.max ?? 0 } : null,
      latency: data.latency ?? null,
      motd: Array.isArray(data.motd?.clean) ? data.motd.clean : undefined,
    } as MinecraftServerStatus;
  } finally {
    clearTimeout(id);
  }
}

async function tryMcSrvStat(host: string) {
  const url = `https://api.mcsrvstat.us/2/${encodeURIComponent(host)}`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`mcsrvstat ${res.status}`);
    const data = await res.json();

    return {
      online: !!data.online,
      ip: data.ip ?? host.split(":")[0],
      port: data.port ?? (host.includes(":") ? Number(host.split(":")[1]) : undefined),
      version: data.version ?? data.software ?? undefined,
      players: data.players ? { online: data.players.online ?? 0, max: data.players.max ?? 0 } : null,
      // Some APIs provide a ping/latency field under debug or as "ping" - try both
      latency: data.debug?.ping ?? data.ping ?? null,
      motd: data.motd?.clean ?? (Array.isArray(data.motd) ? data.motd : undefined),
    } as MinecraftServerStatus;
  } finally {
    clearTimeout(id);
  }
}

export async function fetchMinecraftServerStatus(host: string): Promise<MinecraftServerStatus> {
  // Try mcstatus.io first (more detailed), then fallback to mcsrvstat.us
  try {
    return await tryMcStatus(host);
  } catch (e) {
    try {
      return await tryMcSrvStat(host);
    } catch (err) {
      // If both fail, return unavailable shape
      return {
        online: false,
      } as MinecraftServerStatus;
    }
  }
}
