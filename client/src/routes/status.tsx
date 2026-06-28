import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { useStatus } from "@/features/status"
import { useTranslation } from "@/i18n/context"
import { DatabaseIcon, DevicesIcon, HardDrivesIcon, type IconProps } from "@phosphor-icons/react"
import { createFileRoute } from "@tanstack/react-router"
import type { ComponentType } from "react"

export const Route = createFileRoute("/status")({
  component: StatusPage,
})

function Node({
  icon: Icon,
  label,
  dimmed,
}: {
  icon: ComponentType<IconProps>
  label: string
  dimmed?: boolean
}) {
  return (
    <div className={`flex flex-col items-center gap-2 ${dimmed ? "opacity-50" : ""}`}>
      <Icon size={40} className="text-foreground" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function Connector({
  ms,
  ok,
}: {
  ms?: number | null
  ok?: boolean | null
}) {
  const { t } = useTranslation()
  const up = ok === true
  const down = ok === false
  const lineColor = up ? "bg-green-500" : down ? "bg-red-500" : "bg-muted-foreground/15"
  const textColor = up ? "text-green-600" : down ? "text-red-500" : "text-muted-foreground"

  return (
    <div className="relative mx-2 flex h-10 w-16 flex-1 items-center">
      <div className={`h-0.5 w-full rounded-full ${lineColor}`} />
      <span
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-full -mt-0.5 px-1.5 whitespace-nowrap bg-background text-xs font-mono tabular-nums ${textColor}`}
      >
        {down ? t("status.fail") : ms != null ? `${ms}ms` : "—"}
      </span>
    </div>
  )
}

function ConnectorSkeleton() {
  return (
    <div className="relative mx-2 flex h-10 w-16 flex-1 items-center">
      <Skeleton className="h-0.5 w-full rounded-full" />
      <Skeleton className="h-4 w-12 absolute left-1/2 -translate-x-1/2 -translate-y-full -mt-0.5 px-1.5" />
    </div>
  )
}

function StatusPage() {
  const { t } = useTranslation()
  const { data, isFetching, refetch, error } = useStatus()

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-2xl font-bold tracking-tight">{t("status.title")}</h1>

      <div className="flex items-start justify-center px-2">
        {isFetching ? (
          <div className="flex items-start">
            <Node icon={DevicesIcon} label={t("status.client")} />
            <ConnectorSkeleton />
            <Node icon={HardDrivesIcon} label={t("status.server")} />
            <ConnectorSkeleton />
            <Node icon={DatabaseIcon} label={t("status.database")} />
          </div>
        ) : error ? (
          <div className="flex items-start">
            <Node icon={DevicesIcon} label={t("status.client")} />
            <Connector ok={false} />
            <Node icon={HardDrivesIcon} label={t("status.server")} dimmed />
            <Connector />
            <Node icon={DatabaseIcon} label={t("status.database")} dimmed />
          </div>
        ) : data ? (
          <div className="flex items-start">
            <Node icon={DevicesIcon} label={t("status.client")} />
            <Connector ms={data.clientMs} ok />
            <Node icon={HardDrivesIcon} label={t("status.server")} />
            <Connector ms={data.dbMs} ok={data.dbOk} />
            <Node icon={DatabaseIcon} label={t("status.database")} dimmed={!data.dbOk} />
          </div>
        ) : null}
      </div>

      <Button
        onClick={() => refetch()}
        disabled={isFetching}
      >
        {isFetching ? (
          <>
            <Spinner data-icon="inline-start" />
            {t("common.refreshing")}
          </>
        ) : (
          t("common.refresh")
        )}
      </Button>
    </main>
  )
}
