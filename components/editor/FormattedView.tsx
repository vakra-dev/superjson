"use client";

import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { createEditorTheme } from "@/lib/codemirror-theme";
import { useThemeStore } from "@/stores/theme";
import { useEditorStore } from "@/stores/editor";
import { formatJson } from "@/lib/json-format";
import { useSettingsStore } from "@/stores/settings";

interface FormattedViewProps {
  className?: string;
}

export function FormattedView({ className }: FormattedViewProps) {
  const { theme } = useThemeStore();
  const { parsedJson } = useEditorStore();
  const { indent } = useSettingsStore();

  const formattedJson = useMemo(() => {
    if (!parsedJson) return "";
    try {
      return formatJson(parsedJson, { indent });
    } catch {
      return "";
    }
  }, [parsedJson, indent]);

  const editorTheme = useMemo(() => createEditorTheme(theme), [theme]);

  const extensions = useMemo(() => {
    return [
      json(),
      EditorView.lineWrapping,
      EditorState.readOnly.of(true),
      EditorView.editable.of(false),
    ];
  }, []);

  if (!parsedJson) {
    return (
      <div
        className={`h-full flex items-center justify-center text-[var(--fg-muted)] ${className || ""}`}
      >
        No valid JSON to display
      </div>
    );
  }

  return (
    <div className={`h-full overflow-hidden ${className || ""}`}>
      <CodeMirror
        value={formattedJson}
        theme={editorTheme}
        extensions={extensions}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: false,
          highlightActiveLine: false,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: false,
          bracketMatching: true,
          closeBrackets: false,
          autocompletion: false,
          rectangularSelection: false,
          crosshairCursor: false,
          highlightSelectionMatches: false,
          closeBracketsKeymap: false,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: false,
          lintKeymap: false,
        }}
        editable={false}
        style={{ height: "100%", fontSize: "15px" }}
      />
    </div>
  );
}
