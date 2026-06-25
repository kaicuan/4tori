
import PWABadge from "@/components/pwa/pwa-badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useDemo, useUpdateDemo } from "@/features/demo";
import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
})

function App() {
  const { data, isPending, isFetching, refetch, error } = useDemo();
  const { mutate, isPending: updatePending } = useUpdateDemo();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4">
      <div className="flex items-center gap-4">
        {error ? (
          <p className="text-red-500">Something went wrong</p>
        ) : (
          <>
            {isPending ? (
              <Skeleton className="w-24 h-10" />
            ) : (
              <h1 className="text-4xl font-bold tracking-tight">
                {data?.count}tori
              </h1>
            )}
            <ButtonGroup
              orientation="vertical"
              className="h-fit"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => mutate({ action: "increment" })}
                disabled={isFetching || updatePending}
                >
                <PlusIcon />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => mutate({ action: "decrement" })}
                disabled={isFetching || updatePending}
              >
                <MinusIcon />
              </Button>
            </ButtonGroup>
          </>
        )}
      </div>
      <Button
        onClick={() => refetch()}
        disabled={isFetching}
      >
        {isFetching ? (
          <>
            <Spinner data-icon="inline-start" />
            Refreshing...
          </>
        ) : (
          "Refresh"
        )}
      </Button>
      <PWABadge />
    </main>
  )
}
