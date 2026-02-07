import { NextRequest, NextResponse } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit

// Block internal/private IPs to prevent SSRF
const BLOCKED_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
  "metadata.google.internal",
  "169.254.169.254", // AWS/GCP metadata
];

function isPrivateIP(hostname: string): boolean {
  // Check blocked hostnames
  if (BLOCKED_HOSTNAMES.includes(hostname.toLowerCase())) {
    return true;
  }

  // Check private IP ranges
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = hostname.match(ipv4Regex);
  if (match) {
    const [, a, b] = match.map(Number);
    // 10.x.x.x, 172.16-31.x.x, 192.168.x.x
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 127) return true;
    if (a === 0) return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Only allow http/https
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json(
      { error: "Only HTTP and HTTPS URLs are supported" },
      { status: 400 }
    );
  }

  // Block internal/private IPs (SSRF protection)
  if (isPrivateIP(parsedUrl.hostname)) {
    return NextResponse.json(
      { error: "Internal URLs are not allowed" },
      { status: 403 }
    );
  }

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "superjson.dev/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Fetch failed: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Check content length
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_SIZE) {
      return NextResponse.json(
        { error: "Response too large (max 5MB)" },
        { status: 413 }
      );
    }

    const text = await response.text();

    // Validate it's JSON
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Response is not valid JSON" },
        { status: 422 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Fetch failed: ${message}` }, { status: 500 });
  }
}
