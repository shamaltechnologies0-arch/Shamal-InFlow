import dns from "node:dns";

/**
 * Must run before Next/Payload boot (via NODE_OPTIONS --import).
 * Windows often points Node at 127.0.0.1 DNS which refuses SRV (mongodb+srv).
 */
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // best effort
}
