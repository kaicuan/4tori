import type { z } from "zod";

const BASE_URL = "/api"

export class ApiError extends Error {
  status: number
  info?: unknown
  constructor(message: string, status: number, info?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.info = info
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
  schema?: z.ZodType<T>,
): Promise<T> {
  const { body, headers, ...rest } = options
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let info: unknown
    try {
      info = await res.json()
    } catch {
      info = await res.text().catch(() => undefined)
    }
    throw new ApiError(`Request failed: ${res.status}`, res.status, info)
  }
  if (res.status === 204) return undefined as T
  const data = await res.json()
  return schema ? schema.parse(data) : (data as T)
}

export const apiClient = {
  get: <T>(path: string, schema?: z.ZodType<T>, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }, schema),
  post: <T>(path: string, body?: unknown, schema?: z.ZodType<T>, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }, schema),
  put: <T>(path: string, body?: unknown, schema?: z.ZodType<T>, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }, schema),
  patch: <T>(path: string, body?: unknown, schema?: z.ZodType<T>, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }, schema),
  delete: <T>(path: string, schema?: z.ZodType<T>, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }, schema),
}
