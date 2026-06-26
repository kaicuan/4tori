import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/apiClient"

export type StatusData = {
  clientMs: number
  dbMs: number | null
  dbOk: boolean
}

const STATUS_QUERY_KEY = ["status"] as const

export function useStatus() {
  return useQuery<StatusData>({
    queryKey: STATUS_QUERY_KEY,
    queryFn: async () => {
      const clientStart = performance.now()
      const res = await apiClient.get<{ dbMs: number | null; dbOk: boolean }>("/status")
      const clientEnd = performance.now()
      return {
        clientMs: Math.round((clientEnd - clientStart) * 100) / 100,
        dbMs: res.dbMs,
        dbOk: res.dbOk,
      }
    },
  })
}
