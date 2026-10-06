import dns from "dns";

/**
 * Windows/home-router DNS often refuses Node's SRV lookups for mongodb+srv://.
 * Vercel already resolves Atlas. Overriding DNS there makes the connection fail.
 */
export function ensureMongoDns() {
  if (process.platform !== "win32") return;
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    dns.setDefaultResultOrder("ipv4first");
  } catch {
    // ignore — best effort
  }
}

ensureMongoDns();
