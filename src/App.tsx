import { useEffect, useState } from 'react'
import PWABadge from './PWABadge.tsx'

function App() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.text())
      .then(setMessage)
  }, [])

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-4xl font-bold tracking-tight">4tori</h1>
      {message && (
        <p className="text-muted-foreground text-sm">{message}</p>
      )}
      <PWABadge />
    </main>
  )
}

export default App
