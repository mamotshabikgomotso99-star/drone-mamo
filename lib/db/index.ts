import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("[db] DATABASE_URL not set — database calls will fail");
}

// Reuse connection across hot reloads in dev
declare global {
  var __pgClient: ReturnType<typeof postgres> | undefined;
}

const client =
  globalThis.__pgClient ??
  postgres(connectionString ?? "postgresql://localhost:5432/postgres", {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__pgClient = client;
}

export const db = drizzle(client, { schema });
export { client as pg };
