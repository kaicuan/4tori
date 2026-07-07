import { z } from "zod";

export const StatusResponse = z.object({
  dbMs: z.number().nullable(),
  dbOk: z.boolean(),
});

export type StatusResponse = z.infer<typeof StatusResponse>;
