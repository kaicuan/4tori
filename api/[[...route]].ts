import { Hono } from "hono";
import { serve } from "@hono/node-server"

const app = new Hono().basePath("/api");

let demoCount = 4;

app.get("/demo", (c) => c.json({ count: demoCount }));

app.post("/demo", async (c) => {
  const { action } = await c.req.json<{ action: "increment" | "decrement" }>();
  if (action === "increment") demoCount++;
  if (action === "decrement") demoCount--;
  return c.json({ count: demoCount });
});

if (!process.env.VERCEL_ENV) {
  serve(app)
  console.log(`API is online!`)
}

export default app;
