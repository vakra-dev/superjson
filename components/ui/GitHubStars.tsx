"use client";

import { useEffect, useState } from "react";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

interface GitHubStarsProps {
  owner: string;
  repo: string;
  className?: string;
}

export function GitHubStars({ owner, repo, className = "" }: GitHubStarsProps) {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check cache first
    const cacheKey = `github-stars-${owner}-${repo}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      const { count, timestamp } = JSON.parse(cached);
      // Cache for 1 hour
      if (Date.now() - timestamp < 60 * 60 * 1000) {
        setStars(count);
        setLoading(false);
        return;
      }
    }

    // Fetch from GitHub API
    fetch(`https://api.github.com/repos/${owner}/${repo}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({ count: data.stargazers_count, timestamp: Date.now() })
          );
        }
      })
      .catch(() => {
        // Silently fail
      })
      .finally(() => {
        setLoading(false);
      });
  }, [owner, repo]);

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return count.toString();
  };

  // If loading failed and no stars, show just the icon
  if (!loading && stars === null) {
    return (
      <a
        href={`https://github.com/${owner}/${repo}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors ${className}`}
      >
        <GitHubIcon className="w-6 h-6" />
      </a>
    );
  }

  return (
    <a
      href={`https://github.com/${owner}/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-sm text-[#c9d1d9] transition-colors ${className}`}
    >
      <GitHubIcon className="w-4 h-4" />
      <span className="font-medium">Star</span>
      {loading ? (
        <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#30363d] rounded-md">...</span>
      ) : (
        <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#30363d] rounded-md font-medium">
          {formatCount(stars!)}
        </span>
      )}
    </a>
  );
}
