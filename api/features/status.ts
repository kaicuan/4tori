import { Hono } from "hono";
import { sql } from "drizzle-orm";
import { db } from "../db";

const app = new Hono();

app.get("/", async (c) => {
  let dbMs: number | null;
  let dbOk: boolean;
  try {
    const start = performance.now();
    await db.execute(sql`SELECT 1`);
    dbMs = Math.round((performance.now() - start) * 100) / 100;
    dbOk = true;
  } catch {
    dbMs = null;
    dbOk = false;
  }
  return c.json({ dbMs, dbOk });
});

export default app;
