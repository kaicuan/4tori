import app from "./app";

if (!process.env.VERCEL_ENV) {
  console.log("API is online!");
}

export default {
  fetch: app.fetch,
  port: 3000,
};
