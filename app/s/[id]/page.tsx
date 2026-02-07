"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditorStore } from "@/stores/editor";
import { useThemeStore } from "@/stores/theme";
import { useTheme } from "@/hooks/useTheme";

export default function SharedPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const setJson = useEditorStore((state) => state.setJson);
  const hasThemeHydrated = useThemeStore((state) => state._hasHydrated);

  useTheme();

  useEffect(() => {
    if (!id) {
      setStatus("error");
      setErrorMessage("Invalid share link");
      return;
    }

    async function loadShare() {
      try {
        const response = await fetch(`/api/share/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setErrorMessage(data.error || "Failed to load shared JSON");
          return;
        }

        // Load the JSON into the editor
        setJson(data.json, data.fileName || "shared.json", false);
        setStatus("success");

        // Redirect to editor
        router.push("/editor");
      } catch {
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      }
    }

    loadShare();
  }, [id, setJson, router]);

  // Wait for theme to hydrate
  if (!hasThemeHydrated) {
    return null;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--fg-secondary)]">Loading shared JSON...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-xl font-semibold text-[var(--fg-primary)] mb-2">
            Share Not Found
          </h1>
          <p className="text-[var(--fg-secondary)] mb-6">{errorMessage}</p>
          <button
            onClick={() => router.push("/editor")}
            className="px-4 py-2 bg-[var(--accent)] text-[var(--bg-base)] rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Editor
          </button>
        </div>
      </div>
    );
  }

  // Success state - will redirect, but show loading just in case
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--fg-secondary)]">Opening in editor...</p>
      </div>
    </div>
  );
}
