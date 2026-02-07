import { NextRequest, NextResponse } from "next/server";
import { db, initDatabase } from "@/lib/db";

// Ensure database is initialized
let dbInitialized = false;
async function ensureDb() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string" || id.length !== 6) {
      return NextResponse.json(
        { error: "Invalid share ID" },
        { status: 400 }
      );
    }

    await ensureDb();

    const result = await db.execute({
      sql: "SELECT data, file_name, size_bytes, created_at, expires_at FROM shares WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Share not found" },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    const expiresAt = row.expires_at as number | null;

    // Check if expired
    if (expiresAt && Date.now() > expiresAt) {
      // Clean up expired share
      await db.execute({
        sql: "DELETE FROM shares WHERE id = ?",
        args: [id],
      });
      return NextResponse.json(
        { error: "Share has expired" },
        { status: 410 }
      );
    }

    return NextResponse.json({
      json: row.data as string,
      fileName: row.file_name as string | null,
      sizeBytes: row.size_bytes as number,
      createdAt: row.created_at as number,
      expiresAt,
    });
  } catch (error) {
    console.error("Error retrieving share:", error);
    return NextResponse.json(
      { error: "Failed to retrieve share" },
      { status: 500 }
    );
  }
}
