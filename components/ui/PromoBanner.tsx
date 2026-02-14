"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const BANNER_HEIGHT = "40px"; // py-2.5 = 10px top + 10px bottom + content height

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("promo-banner-dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("promo-banner-dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Fixed banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 fixed top-0 left-0 right-0 z-[100]">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-sm">
          <span>Scrape any webpage to LLM-ready Markdown with</span>
          <a
            href="https://reader.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline hover:text-blue-100 transition-colors"
          >
            Reader - Open source & built for AI
          </a>
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Spacer to push content down */}
      <div style={{ height: BANNER_HEIGHT }} />
    </>
  );
}
