import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import id from "./locales/id.json"
import en from "./locales/en.json"

type Locale = "id" | "en"

const translations: Record<Locale, Record<string, unknown>> = { id, en }

type I18nProviderProps = {
  children: React.ReactNode
  defaultLocale?: Locale
  storageKey?: string
}

type PathInto<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T & string]: T[K] extends Record<string, unknown>
        ? `${K}.${PathInto<T[K]>}` | K
        : K
    }[keyof T & string]
  : never

type NestedTranslationKey = PathInto<typeof id>

type TranslationFunction = {
  (key: NestedTranslationKey, params?: Record<string, string | number>): string
  (key: string, params?: Record<string, string | number>): string
}

type I18nState = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationFunction
}

const I18nContext = createContext<I18nState | undefined>(undefined)

export function I18nProvider({
  children,
  defaultLocale = "id",
  storageKey = "app-language"
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return defaultLocale
    return (localStorage.getItem(storageKey) as Locale) || defaultLocale
  })

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale
    }
  }, [locale])

  const setLocale = useCallback((newLocale: Locale) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newLocale)
    }
    setLocaleState(newLocale)
  }, [storageKey])

  const t = useCallback<I18nState["t"]>(
    (key: string, params?: Record<string, string | number>) => {
      const value = resolveNested(translations[locale], key)
      if (typeof value === "string") return interpolate(value, params)
      
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Missing translation for key: "${key}" in locale: "${locale}"`)
      }
      return key
    },
    [locale],
  )

  const value = useMemo<I18nState>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  )

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)

  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider")
  }

  return context
}

function resolveNested(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = params[key]
    return value != null ? String(value) : `{{${key}}}`
  })
}
