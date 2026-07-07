import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/apiClient"
import { DemoResponse, DemoAction } from "@4tori/shared/schemas/demo"

const DEMO_QUERY_KEY = ["demo"] as const

export function useDemo() {
  return useQuery({
    queryKey: DEMO_QUERY_KEY,
    queryFn: () => apiClient.get("/demo", DemoResponse),
  })
}

export function useUpdateDemo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: DemoAction) => apiClient.post("/demo", body, DemoResponse),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DEMO_QUERY_KEY }),
    onError: () => {
      toast.error("Failed to update count. Please try again.")
    },
  })
}
