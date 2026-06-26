import { Hono } from "hono";

const app = new Hono();

let demoCount = 4;

app.get("/", (c) => c.json({ count: demoCount }));

app.post("/", async (c) => {
  const { action } = await c.req.json<{ action: "increment" | "decrement" }>();
  if (action === "increment") demoCount++;
  if (action === "decrement") demoCount--;
  return c.json({ count: demoCount });
});

export default app;
