import { NextResponse } from "next/server"

const ROOMKEY_ENDPOINT = "https://takoyakidath.vivian.jp/takoyakilink/api/index.php"
const REQUEST_TIMEOUT_MS = 5000
const CODE_PATTERN = /^[0-9]{4,12}$/
const RATE_LIMIT_MAX_REQUESTS = 20
const RATE_LIMIT_WINDOW_MS = 60_000

const requestLog = new Map<string, number[]>()

function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim()
    if (first) {
      return first
    }
  }

  return request.headers.get("x-real-ip") ?? "unknown"
}

function isRateLimited(clientKey: string): boolean {
  const now = Date.now()
  const recent = (requestLog.get(clientKey) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)
  recent.push(now)
  requestLog.set(clientKey, recent)
  return recent.length > RATE_LIMIT_MAX_REQUESTS
}

function extractLookupResult(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { success: false, message: "Invalid upstream response" }
  }

  const raw = payload as Record<string, unknown>
  const success = raw.success === true
  const lineId = typeof raw.line_id === "string" ? raw.line_id : undefined
  const phone = typeof raw.phone === "string" ? raw.phone : undefined
  const message = typeof raw.message === "string" ? raw.message : undefined

  return {
    success,
    ...(lineId ? { line_id: lineId } : {}),
    ...(phone ? { phone } : {}),
    ...(message ? { message } : {}),
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")?.trim() ?? ""

  if (!CODE_PATTERN.test(code)) {
    return NextResponse.json(
      { success: false, message: "code must be numeric and 4-12 digits" },
      { status: 400 },
    )
  }

  const clientKey = getClientKey(request)
  if (isRateLimited(clientKey)) {
    return NextResponse.json({ success: false, message: "Too many requests" }, { status: 429 })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    const upstreamResponse = await fetch(`${ROOMKEY_ENDPOINT}?code=${encodeURIComponent(code)}`, {
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => {
      clearTimeout(timeout)
    })

    const upstreamJson = (await upstreamResponse.json().catch(() => null)) as unknown
    const payload = extractLookupResult(upstreamJson)

    return NextResponse.json(payload, {
      status: upstreamResponse.status,
    })
  } catch {
    return NextResponse.json({ success: false, message: "Failed to reach upstream API" }, { status: 502 })
  }
}