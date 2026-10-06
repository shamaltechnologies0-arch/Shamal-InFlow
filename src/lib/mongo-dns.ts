import dns from "dns";

/**
 * Windows/home-router DNS often refuses Node's SRV lookups for mongodb+srv://.
 * Force public resolvers so Atlas connects reliably in local/dev.
 */
export function ensureMongoDns() {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    dns.setDefaultResultOrder("ipv4first");
  } catch {
    // ignore — best effort
  }
}

ensureMongoDns();
