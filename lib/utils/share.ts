import LZString from "lz-string";

const MAX_URL_LENGTH = 8000; // Safe limit for URLs

/**
 * Compress JSON for URL sharing
 */
export function compressForUrl(json: string): string {
  return LZString.compressToEncodedURIComponent(json);
}

/**
 * Decompress JSON from URL
 */
export function decompressFromUrl(compressed: string): string | null {
  try {
    return LZString.decompressFromEncodedURIComponent(compressed);
  } catch {
    return null;
  }
}

/**
 * Check if JSON can fit in URL
 */
export function canFitInUrl(json: string): boolean {
  const compressed = compressForUrl(json);
  return compressed.length < MAX_URL_LENGTH;
}

/**
 * Generate a share URL (for small JSON that fits in URL)
 */
export function generateShareUrl(
  json: string,
  baseUrl: string
): { url: string; needsStorage: boolean } {
  const compressed = compressForUrl(json);

  if (compressed.length < MAX_URL_LENGTH) {
    return {
      url: `${baseUrl}/share?d=${compressed}`,
      needsStorage: false,
    };
  }

  return {
    url: "",
    needsStorage: true,
  };
}

/**
 * Create a server-stored share for large JSON
 */
export async function createServerShare(
  json: string,
  fileName?: string
): Promise<{ id: string; url: string; expiresAt: number } | { error: string }> {
  try {
    const response = await fetch("/api/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ json, fileName }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to create share" };
    }

    return {
      id: data.id,
      url: data.url,
      expiresAt: data.expiresAt,
    };
  } catch (error) {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Smart share: uses URL compression for small JSON, server storage for large
 */
export async function createShare(
  json: string,
  baseUrl: string,
  fileName?: string
): Promise<{ url: string; isServerStored: boolean; expiresAt?: number } | { error: string }> {
  // Try URL-based sharing first
  const urlResult = generateShareUrl(json, baseUrl);

  if (!urlResult.needsStorage) {
    return {
      url: urlResult.url,
      isServerStored: false,
    };
  }

  // Fall back to server storage
  const serverResult = await createServerShare(json, fileName);

  if ("error" in serverResult) {
    return serverResult;
  }

  return {
    url: serverResult.url,
    isServerStored: true,
    expiresAt: serverResult.expiresAt,
  };
}

/**
 * Extract JSON from share URL
 */
export function extractFromShareUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const data = urlObj.searchParams.get("d");
    if (data) {
      return decompressFromUrl(data);
    }
    return null;
  } catch {
    return null;
  }
}
