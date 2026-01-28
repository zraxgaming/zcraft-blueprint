/**
 * consoleFilter.ts
 * Reduce console noise in production by silencing debug/info/log and
 * rate-limiting repeated error messages.
 */

const isProd = typeof import.meta !== "undefined" && !!(import.meta as any).env && (import.meta as any).env.PROD;

if (typeof window !== "undefined") {
  const original = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    debug: console.debug ? console.debug.bind(console) : console.log.bind(console),
  };

  // In production, silence verbose methods
  if (isProd) {
    console.log = () => {} as any;
    console.info = () => {} as any;
    console.debug = () => {} as any;
  }

  // Rate-limit repeated error messages to avoid flooding
  const recent = new Map<string, number>();
  const THROTTLE_MS = 10000; // allow same error once per 10s

  console.error = function (...args: any[]) {
    try {
      const key = args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join("|");
      const now = Date.now();
      const last = recent.get(key) || 0;
      if (now - last < THROTTLE_MS) return;
      recent.set(key, now);
    } catch (e) {
      // ignore
    }
    original.error(...args);
  };

  // Provide a simple runtime toggle via localStorage.debugConsole
  (window as any).showConsole = () => {
    console.log = original.log;
    console.info = original.info;
    console.debug = original.debug;
    console.error = original.error;
  };
}

export {};
