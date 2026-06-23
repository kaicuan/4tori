import { Hono } from "hono";
import { serve } from '@hono/node-server'

const app = new Hono().basePath("/api");

app.get("/hello", (c) => c.text("Hello"));

if (!process.env.VERCEL_ENV) {
  serve(app)
  console.log(`API is online!`)
}

export default app;
