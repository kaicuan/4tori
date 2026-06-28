import { Hono } from "hono";
import { DemoAction } from "@4tori/shared";

const app = new Hono();

let demoCount = 4;

app.get("/", (c) => c.json({ count: demoCount }));

app.post("/", async (c) => {
  const { action } = DemoAction.parse(await c.req.json());
  if (action === "increment") demoCount++;
  if (action === "decrement") demoCount--;
  return c.json({ count: demoCount });
});

export default app;
