"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Kbd } from "@/components/ui/Kbd";
import { cn } from "@/lib/utils/cn";
import { useEditorStore } from "@/stores/editor";
import { useThemeStore } from "@/stores/theme";
import { useSettingsStore } from "@/stores/settings";
import { formatJson, minifyJson } from "@/lib/json-format";
import {
  FileCode,
  Minimize2,
  Wrench,
  LayoutPanelLeft,
  LayoutPanelTop,
  MonitorPlay,
  Eye,
  TreeDeciduous,
  FileText,
  Palette,
  Search,
  Expand,
  Shrink,
  Sun,
  Moon,
} from "lucide-react";

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onOpenThemePicker: () => void;
}

export function CommandPalette({ open, onClose, onOpenThemePicker }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    rawJson,
    fileName,
    layoutMode,
    viewMode,
    setJson,
    setLayoutMode,
    setViewMode,
    setShowSearch,
    expandAll,
    collapseAll,
    repairCurrentJson,
  } = useEditorStore();

  const { theme, toggleDarkLight } = useThemeStore();
  const { indent } = useSettingsStore();

  const commands = useMemo<Command[]>(() => {
    const cmds: Command[] = [
      // JSON Operations
      {
        id: "format",
        label: "Format JSON",
        description: "Pretty print with indentation",
        icon: FileCode,
        shortcut: "⌘E",
        category: "JSON",
        action: () => {
          if (rawJson) {
            try {
              const formatted = formatJson(rawJson, { indent });
              setJson(formatted, fileName);
            } catch {
              // Invalid JSON
            }
          }
          onClose();
        },
      },
      {
        id: "minify",
        label: "Minify JSON",
        description: "Remove all whitespace",
        icon: Minimize2,
        shortcut: "⌘M",
        category: "JSON",
        action: () => {
          if (rawJson) {
            try {
              const minified = minifyJson(rawJson);
              setJson(minified, fileName);
            } catch {
              // Invalid JSON
            }
          }
          onClose();
        },
      },
      {
        id: "repair",
        label: "Repair JSON",
        description: "Fix common JSON errors",
        icon: Wrench,
        shortcut: "⌘D",
        category: "JSON",
        action: () => {
          repairCurrentJson();
          onClose();
        },
      },
      // Layout
      {
        id: "layout-split-h",
        label: "Split Horizontal",
        description: "Editor on left, preview on right",
        icon: LayoutPanelLeft,
        category: "Layout",
        action: () => {
          setLayoutMode("split-horizontal");
          onClose();
        },
      },
      {
        id: "layout-split-v",
        label: "Split Vertical",
        description: "Editor on top, preview on bottom",
        icon: LayoutPanelTop,
        category: "Layout",
        action: () => {
          setLayoutMode("split-vertical");
          onClose();
        },
      },
      {
        id: "layout-editor",
        label: "Editor Only",
        description: "Show only the editor",
        icon: MonitorPlay,
        category: "Layout",
        action: () => {
          setLayoutMode("editor-only");
          onClose();
        },
      },
      {
        id: "layout-preview",
        label: "Preview Only",
        description: "Show only the preview",
        icon: Eye,
        category: "Layout",
        action: () => {
          setLayoutMode("preview-only");
          onClose();
        },
      },
      // View
      {
        id: "view-tree",
        label: "Tree View",
        description: "Collapsible tree structure",
        icon: TreeDeciduous,
        shortcut: "⌘⇧V",
        category: "View",
        action: () => {
          setViewMode("tree");
          onClose();
        },
      },
      {
        id: "view-formatted",
        label: "Formatted View",
        description: "Syntax highlighted JSON",
        icon: FileText,
        shortcut: "⌘⇧V",
        category: "View",
        action: () => {
          setViewMode("formatted");
          onClose();
        },
      },
      // Tree operations
      {
        id: "expand-all",
        label: "Expand All",
        description: "Expand all tree nodes",
        icon: Expand,
        shortcut: "E",
        category: "Tree",
        action: () => {
          expandAll();
          onClose();
        },
      },
      {
        id: "collapse-all",
        label: "Collapse All",
        description: "Collapse all tree nodes",
        icon: Shrink,
        shortcut: "C",
        category: "Tree",
        action: () => {
          collapseAll();
          onClose();
        },
      },
      // Search
      {
        id: "search",
        label: "Search",
        description: "Search keys and values",
        icon: Search,
        shortcut: "/",
        category: "Navigation",
        action: () => {
          onClose();
          setTimeout(() => setShowSearch(true), 100);
        },
      },
      // Theme
      {
        id: "theme",
        label: "Change Theme",
        description: `Current: ${theme.name}`,
        icon: Palette,
        shortcut: "T",
        category: "Appearance",
        action: () => {
          onClose();
          setTimeout(() => onOpenThemePicker(), 100);
        },
      },
      {
        id: "toggle-dark-light",
        label: theme.type === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
        description: "Toggle between dark and light themes",
        icon: theme.type === "dark" ? Sun : Moon,
        category: "Appearance",
        action: () => {
          toggleDarkLight();
          onClose();
        },
      },
    ];

    // Add current state indicators
    return cmds.map((cmd) => {
      if (cmd.id === `layout-${layoutMode.replace("-", "-")}`) {
        return { ...cmd, description: `${cmd.description} (current)` };
      }
      if (cmd.id === `view-${viewMode}`) {
        return { ...cmd, description: `${cmd.description} (current)` };
      }
      return cmd;
    });
  }, [
    rawJson,
    fileName,
    layoutMode,
    viewMode,
    theme,
    indent,
    setJson,
    setLayoutMode,
    setViewMode,
    setShowSearch,
    expandAll,
    collapseAll,
    repairCurrentJson,
    toggleDarkLight,
    onClose,
    onOpenThemePicker,
  ]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lowerQuery = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lowerQuery) ||
        cmd.description?.toLowerCase().includes(lowerQuery) ||
        cmd.category.toLowerCase().includes(lowerQuery)
    );
  }, [commands, query]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  const flatFilteredCommands = useMemo(() => {
    return Object.values(groupedCommands).flat();
  }, [groupedCommands]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) =>
            i < flatFilteredCommands.length - 1 ? i + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) =>
            i > 0 ? i - 1 : flatFilteredCommands.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (flatFilteredCommands[selectedIndex]) {
            flatFilteredCommands[selectedIndex].action();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [flatFilteredCommands, selectedIndex, onClose]
  );

  return (
    <Dialog open={open} onClose={onClose} className="max-w-xl">
      <div className="overflow-hidden">
        {/* Search input */}
        <div className="p-3">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-[var(--bg-base)]">
            <Search className="w-4 h-4 text-[var(--fg-muted)] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command..."
              className="flex-1 bg-transparent text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)] outline-none focus:outline-none focus-visible:outline-none text-base"
            />
          </div>
        </div>

        {/* Command list */}
        <div ref={listRef} className="max-h-[300px] overflow-y-auto py-2">
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category}>
              <div className="px-4 py-1.5 text-[11px] font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                {category}
              </div>
              {cmds.map((cmd) => {
                const globalIndex = flatFilteredCommands.indexOf(cmd);
                const isSelected = globalIndex === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    data-index={globalIndex}
                    onClick={() => cmd.action()}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 text-left transition-colors",
                      isSelected
                        ? "bg-[var(--bg-hover)]"
                        : "hover:bg-[var(--bg-hover)]"
                    )}
                  >
                    <cmd.icon className="w-4 h-4 text-[var(--fg-muted)] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] text-[var(--fg-primary)]">
                        {cmd.label}
                      </div>
                      {cmd.description && (
                        <div className="text-[14px] text-[var(--fg-muted)] truncate">
                          {cmd.description}
                        </div>
                      )}
                    </div>
                    {cmd.shortcut && (
                      <Kbd className="flex-shrink-0">{cmd.shortcut}</Kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          {flatFilteredCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-[var(--fg-muted)]">
              No commands found
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
