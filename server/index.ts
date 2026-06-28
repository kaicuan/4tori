import app from "./app";

if (!process.env.VERCEL_ENV) {
  const { serve } = await import("@hono/node-server");
  serve(app);
  console.log("API is online!");
}

export default app;