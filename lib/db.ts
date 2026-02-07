import { createClient } from "@libsql/client";

// Create the database client (server-side only)
export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Initialize the database schema
export async function initDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS shares (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      file_name TEXT,
      size_bytes INTEGER,
      created_at INTEGER NOT NULL,
      expires_at INTEGER
    )
  `);

  // Create index for expiration cleanup
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_shares_expires_at ON shares(expires_at)
  `);
}

// Generate a short unique ID (6 chars = 2 billion possibilities)
export function generateShareId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// Clean up expired shares (call periodically)
export async function cleanupExpiredShares() {
  const now = Date.now();
  await db.execute({
    sql: "DELETE FROM shares WHERE expires_at IS NOT NULL AND expires_at < ?",
    args: [now],
  });
}
