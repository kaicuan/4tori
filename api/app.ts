import { Hono } from "hono";
import demo from "./features/demo";
import status from "./features/status";

const app = new Hono().basePath("/api");

app.route("/demo", demo);
app.route("/status", status);

export default app;
