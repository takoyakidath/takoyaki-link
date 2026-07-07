"use client"

import { useState } from "react"
import { Phone } from "lucide-react"

const CODE_PATTERN = /^[0-9]{4,12}$/

function toTelHref(phone: string | undefined): string | undefined {
  if (!phone) {
    return undefined
  }

  const normalized = phone.replace(/[^0-9+]/g, "")
  if (!normalized) {
    return undefined
  }

  return `tel:${normalized}`
}

type LookupResult = {
  success: boolean
  line_id?: string
  phone?: string
  message?: string
}

export function RoomkeyLookupForm() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState<LookupResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedCode = code.trim()

    if (!CODE_PATTERN.test(trimmedCode)) {
      setError("code must be numeric and 4-12 digits")
      setResult(null)
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/roomkey?code=${encodeURIComponent(trimmedCode)}`)
      const data = (await response.json()) as LookupResult

      if (!response.ok) {
        throw new Error(data.message || "Lookup failed")
      }

      setResult(data)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Roomkey Lookup</h2>
          <p className="text-sm text-muted-foreground">コードを入れると、そのほかの情報取得します。</p>
        </div>

        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={12}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>

        <div className="rounded-2xl bg-muted/30 p-4 text-sm" aria-live="polite">
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : result ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-foreground">Lookup result</p>
                <span
                  className={
                    result.success
                      ? "rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700"
                      : "rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-700"
                  }
                >
                  {result.success ? "success: true" : "success: false"}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                    href={toTelHref(result.phone)}
                  aria-disabled={!result.phone}
                  className={`group flex min-h-24 flex-col justify-between rounded-2xl border border-border bg-background p-4 transition ${
                    result.phone ? "hover:border-primary hover:shadow-sm" : "pointer-events-none opacity-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone</p>
                      <p className="mt-1 text-lg font-semibold text-foreground">{result.phone ?? "-"}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 p-2 text-primary transition group-hover:scale-105">
                      <Phone className="h-4 w-4" />
                    </span>
                  </div>
                </a>

                <a
                  href={result.line_id ? "https://line.me/R/path" : undefined}
                  aria-disabled={!result.line_id}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex min-h-24 flex-col justify-between rounded-2xl border border-border bg-background p-4 text-left transition ${
                    result.line_id ? "hover:border-primary hover:shadow-sm" : "pointer-events-none opacity-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">LINE ID</p>
                      <p className="mt-1 text-lg font-semibold text-foreground">{result.line_id ?? "-"}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 p-2 text-primary transition group-hover:scale-105">
                      <Phone className="h-4 w-4 rotate-90" />
                    </span>
                  </div>
                </a>
              </div>
            </div>
          ) : (null)

          }
        </div>
      </div>
    </section>
  )
}