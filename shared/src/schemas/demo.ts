import { z } from "zod";

export const DemoResponse = z.object({
  count: z.number(),
});

export const DemoAction = z.object({
  action: z.enum(["increment", "decrement"]),
});

export type DemoResponse = z.infer<typeof DemoResponse>;
export type DemoAction = z.infer<typeof DemoAction>;
