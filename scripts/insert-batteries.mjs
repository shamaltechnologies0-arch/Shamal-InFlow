import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://shin:shin%2178@cluster0.i410wuv.mongodb.net/shamal-inflow?retryWrites=true&w=majority";

const packs = [
  { name: "0P2AH8K5340052", serialNumber: "0P2AH8K5340052", model: "TB60", status: "operational", flightCount: 12, flightHours: 0.32, cycleCount: 18, healthScore: 96, ownerLabel: "Francis Mallon" },
  { name: "0P2AH8K5340188", serialNumber: "0P2AH8K5340188", model: "TB60", status: "operational", flightCount: 44, flightHours: 8.5, cycleCount: 61, healthScore: 91, ownerLabel: "Shamal Technologies" },
  { name: "BAT-NEOM-08", serialNumber: "BAT-NEOM-08", model: "TB60", status: "maintenance", flightCount: 210, flightHours: 88.2, cycleCount: 189, healthScore: 65, ownerLabel: "Shamal Technologies" },
  { name: "BAT-EP-07", serialNumber: "BAT-EP-07", model: "TB65", status: "maintenance", flightCount: 156, flightHours: 52.1, cycleCount: 142, healthScore: 72, ownerLabel: "Shamal Technologies" },
  { name: "BAT-RYD-03", serialNumber: "BAT-RYD-03", model: "TB60", status: "operational", flightCount: 88, flightHours: 31.4, cycleCount: 97, healthScore: 88, ownerLabel: "Shamal Technologies" },
  { name: "BAT-JUB-02", serialNumber: "BAT-JUB-02", model: "TB65", status: "retired", flightCount: 420, flightHours: 140, cycleCount: 210, healthScore: 40, ownerLabel: "Shamal Technologies" },
  { name: "BAT-DMM-05", serialNumber: "BAT-DMM-05", model: "TB60", status: "operational", flightCount: 33, flightHours: 11.2, cycleCount: 41, healthScore: 93, ownerLabel: "Nawaf Alsahli" },
  { name: "BAT-ULA-11", serialNumber: "BAT-ULA-11", model: "TB60", status: "operational", flightCount: 19, flightHours: 6.8, cycleCount: 24, healthScore: 97, ownerLabel: "Shamal Technologies" },
];

const client = new MongoClient(uri);
await client.connect();
const db = client.db("shamal-inflow");
const org = await db.collection("organizations").findOne({});
if (!org) throw new Error("no org");

const now = new Date();
let added = 0;
for (const p of packs) {
  const exists = await db.collection("batteries").findOne({ serialNumber: p.serialNumber });
  if (exists) continue;
  await db.collection("batteries").insertOne({
    ...p,
    organization: org._id,
    shared: true,
    cycleLifespan: 200,
    flightLifespan: 500,
    createdAt: now,
    updatedAt: now,
  });
  added += 1;
}

await db.collection("batteries").updateOne(
  { serialNumber: "BAT-NEOM-01" },
  {
    $set: {
      name: "BAT-NEOM-01",
      shared: true,
      ownerLabel: "Shamal Technologies",
      flightCount: 40,
      flightLifespan: 500,
      cycleLifespan: 200,
      legalId: "BAT-NEOM-01",
      updatedAt: now,
    },
  },
);

console.log("added", added, "total", await db.collection("batteries").countDocuments());
await client.close();
