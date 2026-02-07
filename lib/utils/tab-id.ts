/**
 * Tab ID utility for multi-tab persistence
 *
 * Each browser tab gets a unique ID stored in sessionStorage.
 * This ID is used to key localStorage entries, allowing multiple tabs
 * to have independent persisted state while also surviving tab close.
 */

const TAB_ID_KEY = "superjson-tab-id";
const TABS_REGISTRY_KEY = "superjson-tabs";

/**
 * Generate a short unique ID (8 chars)
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Get or create a unique ID for the current tab
 */
export function getTabId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  let tabId = sessionStorage.getItem(TAB_ID_KEY);

  if (!tabId) {
    tabId = generateId();
    sessionStorage.setItem(TAB_ID_KEY, tabId);
  }

  return tabId;
}

/**
 * Tab metadata stored in the registry
 */
export interface TabInfo {
  id: string;
  fileName: string;
  lastModified: number;
  preview: string; // First ~100 chars of JSON for preview
}

/**
 * Get all tabs from the registry
 */
export function getTabsRegistry(): TabInfo[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem(TABS_REGISTRY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Update or add a tab in the registry
 */
export function updateTabRegistry(info: TabInfo): void {
  if (typeof window === "undefined") return;

  const tabs = getTabsRegistry();
  const existingIndex = tabs.findIndex((t) => t.id === info.id);

  if (existingIndex >= 0) {
    tabs[existingIndex] = info;
  } else {
    tabs.push(info);
  }

  // Keep only the last 20 tabs
  const trimmedTabs = tabs
    .sort((a, b) => b.lastModified - a.lastModified)
    .slice(0, 20);

  localStorage.setItem(TABS_REGISTRY_KEY, JSON.stringify(trimmedTabs));
}

/**
 * Remove a tab from the registry
 */
export function removeFromTabRegistry(tabId: string): void {
  if (typeof window === "undefined") return;

  const tabs = getTabsRegistry().filter((t) => t.id !== tabId);
  localStorage.setItem(TABS_REGISTRY_KEY, JSON.stringify(tabs));
}

/**
 * Get the storage key for a specific tab's editor state
 */
export function getEditorStorageKey(tabId: string): string {
  return `superjson-editor-${tabId}`;
}
