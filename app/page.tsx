"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  Keyboard,
  Palette,
  Search,
  Copy,
  Share2,
  Github,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GitHubStars } from "@/components/ui/GitHubStars";
import { paper, getThemeCssVars } from "@/lib/themes";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Native JSON parsing with virtualized rendering. Handles large files smoothly.",
  },
  {
    icon: Keyboard,
    title: "Power Shortcuts",
    description: "Format, minify, and repair JSON with keyboard shortcuts. ⌘E, ⌘M, ⌘D.",
  },
  {
    icon: Palette,
    title: "Beautiful Themes",
    description: "Carefully crafted color schemes. Dark and light modes for any environment.",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Search keys and values instantly. Results highlight as you type.",
  },
  {
    icon: Copy,
    title: "Copy Paths",
    description: "JSONPath, jq, or JavaScript accessors. Click to copy any path.",
  },
  {
    icon: Share2,
    title: "Share Links",
    description: "Compressed URLs for quick sharing. No server storage for small files.",
  },
];

export default function HomePage() {
  const themeVars = getThemeCssVars(paper);

  // Set body background to match landing page theme (prevents dark flash on overscroll)
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = paper.colors.bgBase;
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-[var(--bg-base)]"
      style={{
        ...themeVars,
        overscrollBehaviorY: 'none',
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-base)] fixed top-[40px] left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-mono font-medium">
              <span className="text-[var(--accent)]">{"{ "}</span>
              <span className="text-[var(--fg-primary)]">"super"</span>
              <span className="text-[var(--fg-muted)]">: </span>
              <span className="text-[var(--fg-primary)]">"json"</span>
              <span className="text-[var(--accent)]">{" }"}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <GitHubStars owner="vakra-dev" repo="superjson" />
            <Link href="/editor">
              <Button variant="primary" size="md">
                Open Editor
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-4 relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-[0.15] blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${paper.colors.accent} 0%, transparent 70%)` }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-[0.1] blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${paper.colors.typeKey} 0%, transparent 70%)` }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-sm text-[var(--fg-muted)] mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            Open source JSON viewer
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-[var(--fg-primary)] mb-6 tracking-tight">
            Simple, beautiful JSON
          </h1>
          <p className="text-xl sm:text-2xl text-[var(--fg-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
            A keyboard driven JSON explorer. Easy on your eyes. Nothing in your way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/editor">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
                Start Exploring
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a
              href="https://github.com/vakra-dev/superjson"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </a>
          </div>

          {/* JSON Preview Card */}
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-xl border border-[var(--border)] shadow-2xl shadow-black/5 overflow-hidden"
              style={{ backgroundColor: '#2e3440' }}
            >
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: '#434c5e', backgroundColor: '#3b4252' }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#bf616a' }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ebcb8b' }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#a3be8c' }} />
                </div>
                <span className="text-xs ml-2" style={{ color: '#677690' }}>super.json</span>
              </div>
              {/* Code preview */}
              <div className="p-5 font-mono text-sm text-left leading-relaxed" style={{ color: '#eceff4' }}>
                <div><span style={{ color: '#81a1c1' }}>{"{"}</span></div>
                <div className="pl-4">
                  <span style={{ color: '#81a1c1' }}>"name"</span>
                  <span style={{ color: '#677690' }}>: </span>
                  <span style={{ color: '#a3be8c' }}>"superjson"</span>
                  <span style={{ color: '#677690' }}>,</span>
                </div>                
                <div className="pl-4">
                  <span style={{ color: '#81a1c1' }}>"features"</span>
                  <span style={{ color: '#677690' }}>: </span>
                  <span style={{ color: '#81a1c1' }}>{"["}</span>
                  <span style={{ color: '#a3be8c' }}>"fast"</span>
                  <span style={{ color: '#677690' }}>, </span>
                  <span style={{ color: '#a3be8c' }}>"beautiful"</span>
                  <span style={{ color: '#677690' }}>, </span>
                  <span style={{ color: '#a3be8c' }}>"simple"</span>
                  <span style={{ color: '#81a1c1' }}>{"]"}</span>
                  <span style={{ color: '#677690' }}>,</span>
                </div>
                <div className="pl-4">
                  <span style={{ color: '#81a1c1' }}>"ready"</span>
                  <span style={{ color: '#677690' }}>: </span>
                  <span style={{ color: '#b48ead' }}>true</span>
                </div>
                <div><span style={{ color: '#81a1c1' }}>{"}"}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-[var(--bg-surface)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-[var(--fg-primary)] text-center mb-12">
            Built for developers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg bg-[var(--bg-base)] border border-[var(--border)]"
              >
                <feature.icon className="w-8 h-8 text-[var(--accent)] mb-4" />
                <h3 className="text-xl font-medium text-[var(--fg-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-base text-[var(--fg-muted)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keyboard shortcuts preview */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-[var(--fg-primary)] text-center mb-8">
            Keyboard shortcuts
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { keys: "⌘E", action: "Format JSON" },
              { keys: "⌘M", action: "Minify JSON" },
              { keys: "⌘D", action: "Repair JSON" },
              { keys: "⌘K", action: "Command palette" },
              { keys: "⌘\\", action: "Cycle layout" },
              { keys: "⌘⇧V", action: "Toggle view mode" },
            ].map((shortcut) => (
              <div
                key={shortcut.keys}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)]"
              >
                <span className="text-[var(--fg-secondary)]">{shortcut.action}</span>
                <kbd className="px-2 py-1 text-xs font-mono bg-[var(--bg-elevated)] text-[var(--fg-primary)] rounded border border-[var(--border)]">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[var(--bg-surface)]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-[var(--fg-primary)] mb-4">
            Ready to explore?
          </h2>
          <p className="text-[var(--fg-muted)] mb-6">
            Paste JSON, upload a file, or import from a URL. It's that simple.
          </p>
          <Link href="/editor">
            <Button variant="primary" size="lg">
              Open Editor
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--border)] bg-[var(--bg-base)]">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 text-lg text-[var(--fg-muted)]">
          <span>MIT License</span>
          <span>·</span>
          <a
            href="https://github.com/vakra-dev/superjson"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--fg-primary)] transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
