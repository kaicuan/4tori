import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/apiClient"

export type DemoResponse = {
  count: number
}

export type DemoAction = {
  action: "increment" | "decrement"
}

const DEMO_QUERY_KEY = ["demo"] as const

export function useDemo() {
  return useQuery<DemoResponse>({
    queryKey: DEMO_QUERY_KEY,
    queryFn: () => apiClient.get<DemoResponse>("/demo"),
  })
}

export function useUpdateDemo() {
  const queryClient = useQueryClient()
  return useMutation<DemoResponse, Error, DemoAction>({
    mutationFn: (body) => apiClient.post<DemoResponse>("/demo", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DEMO_QUERY_KEY }),
    onError: () => {
      toast.error("Failed to update count. Please try again.")
    },
  })
}
