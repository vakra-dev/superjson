"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Button } from "@/components/ui/Button";
import { useEditorStore } from "@/stores/editor";
import { useThemeStore } from "@/stores/theme";
import { useTheme } from "@/hooks/useTheme";
import { decompressFromUrl } from "@/lib/utils/share";
import { AlertCircle } from "lucide-react";

function SharePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const setJson = useEditorStore((state) => state.setJson);
  const hasThemeHydrated = useThemeStore((state) => state._hasHydrated);

  useTheme();

  useEffect(() => {
    const data = searchParams.get("d");
    if (data) {
      const json = decompressFromUrl(data);
      if (json) {
        try {
          JSON.parse(json); // Validate
          setJson(json, "shared.json");
          // Redirect directly to editor
          router.push("/editor");
        } catch {
          setError("Invalid JSON in share link");
        }
      } else {
        setError("Could not decompress share link");
      }
    } else {
      setError("No data in share link");
    }
  }, [searchParams, setJson, router]);

  // Wait for theme hydration
  if (!hasThemeHydrated) {
    return null;
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col bg-[var(--bg-base)]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[var(--error)]" />
            <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-2">
              Invalid Share Link
            </h2>
            <p className="text-[var(--fg-muted)] mb-6">{error}</p>
            <Link href="/editor">
              <Button variant="primary">Open Editor</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state while redirecting
  return (
    <div className="h-screen flex items-center justify-center bg-[var(--bg-base)]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--fg-secondary)]">Loading shared JSON...</p>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-[var(--bg-base)]">
          <div className="text-[var(--fg-muted)]">Loading...</div>
        </div>
      }
    >
      <SharePageContent />
    </Suspense>
  );
}
