import { NextRequest, NextResponse } from "next/server";
import { db, generateShareId, initDatabase } from "@/lib/db";

// Maximum JSON size: 5MB
const MAX_SIZE = 5 * 1024 * 1024;

// Share expiration: 30 days
const EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000;

// Rate limiting: simple in-memory store (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Ensure database is initialized
let dbInitialized = false;
async function ensureDb() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { json, fileName } = body;

    if (!json || typeof json !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid JSON data" },
        { status: 400 }
      );
    }

    const sizeBytes = new TextEncoder().encode(json).length;

    if (sizeBytes > MAX_SIZE) {
      return NextResponse.json(
        { error: `JSON too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB` },
        { status: 413 }
      );
    }

    // Validate it's actually valid JSON
    try {
      JSON.parse(json);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    await ensureDb();

    // Generate unique ID (retry on collision)
    let id = generateShareId();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await db.execute({
        sql: "SELECT id FROM shares WHERE id = ?",
        args: [id],
      });
      if (existing.rows.length === 0) break;
      id = generateShareId();
      attempts++;
    }

    const now = Date.now();
    const expiresAt = now + EXPIRATION_MS;

    await db.execute({
      sql: "INSERT INTO shares (id, data, file_name, size_bytes, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
      args: [id, json, fileName || null, sizeBytes, now, expiresAt],
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                    request.headers.get("origin") ||
                    "https://superjson.dev";

    return NextResponse.json({
      id,
      url: `${baseUrl}/s/${id}`,
      expiresAt,
      sizeBytes,
    });
  } catch (error) {
    console.error("Error creating share:", error);
    return NextResponse.json(
      { error: "Failed to create share" },
      { status: 500 }
    );
  }
}
