import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { XIcon } from "@phosphor-icons/react"
import { useRegisterSW } from "virtual:pwa-register/react"

function PWABadge() {
  const period = 0

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return
      if (r?.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r)
      }
      else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker
          if (sw.state === "activated")
            registerPeriodicSync(period, swUrl, r)
        })
      }
    },
  })

  function close() {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <Item variant="outline" className="fixed bottom-4 right-4 z-50 w-90 pr-1.5">
      { needRefresh ? (
        <ItemContent>
          <ItemTitle>App Update</ItemTitle>
          <ItemDescription>
            New content available, click on reload button to update
          </ItemDescription>
        </ItemContent>
      ) : (
        <ItemContent>
          <ItemTitle>Offline Ready!</ItemTitle>
          <ItemDescription>
            App is ready to work offline
          </ItemDescription>
        </ItemContent>
      )}
      <ItemActions>
        {needRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateServiceWorker(true)}
          >
            Reload
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={close}
        >
          <XIcon size={14} weight="bold" />
        </Button>
      </ItemActions>
    </Item>
  )
}

export default PWABadge

function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
  if (period <= 0) return

  setInterval(async () => {
    if ("onLine" in navigator && !navigator.onLine)
      return

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        "cache": "no-store",
        "cache-control": "no-cache",
      },
    })

    if (resp?.status === 200)
      await r.update()
  }, period)
}
