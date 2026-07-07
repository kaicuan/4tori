import { Hono } from "hono";
import { DemoAction, DemoResponse } from "@4tori/shared/schemas/demo";

const app = new Hono();

let demoCount = 4;

app.get("/", (c) => c.json(DemoResponse.parse({ count: demoCount })));

app.post("/", async (c) => {
  const { action } = DemoAction.parse(await c.req.json());
  if (action === "increment") demoCount++;
  if (action === "decrement") demoCount--;
  return c.json(DemoResponse.parse({ count: demoCount }));
});

export default app;
