"use client";

import { useMemo, useCallback, useRef, useEffect } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import { search, highlightSelectionMatches } from "@codemirror/search";
import { EditorView, keymap, ViewUpdate } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { createEditorTheme } from "@/lib/codemirror-theme";
import { useThemeStore } from "@/stores/theme";
import { useEditorStore } from "@/stores/editor";

interface EditorPanelProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function EditorPanel({ value, onChange, className }: EditorPanelProps) {
  const { theme } = useThemeStore();
  const {
    selectPathFromPosition,
    parsedJson,
    scrollTarget,
    clearScrollTarget,
    wordWrap,
  } = useEditorStore();
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const lastScrollTimestamp = useRef(0);

  const editorTheme = useMemo(() => createEditorTheme(theme), [theme]);

  const extensions = useMemo(() => {
    const exts = [
      json(),
      linter(jsonParseLinter()),
      lintGutter(),
      search(),
      highlightSelectionMatches(),
      keymap.of([indentWithTab]),
    ];
    if (wordWrap) {
      exts.push(EditorView.lineWrapping);
    }
    return exts;
  }, [wordWrap]);

  const handleChange = useCallback(
    (val: string) => {
      onChange(val);
    },
    [onChange]
  );

  const handleUpdate = useCallback(
    (update: ViewUpdate) => {
      // Only process cursor movements when JSON is valid
      if (!parsedJson) return;
      if (!update.selectionSet) return;

      const pos = update.state.selection.main.head;
      selectPathFromPosition(pos);
    },
    [parsedJson, selectPathFromPosition]
  );

  // Scroll to position when scrollTarget changes (from tree click)
  useEffect(() => {
    if (!scrollTarget) return;
    if (scrollTarget.timestamp <= lastScrollTimestamp.current) return;

    const view = editorRef.current?.view;
    if (!view) return;

    lastScrollTimestamp.current = scrollTarget.timestamp;

    // Scroll to position and select it
    view.dispatch({
      selection: { anchor: scrollTarget.pos },
      effects: EditorView.scrollIntoView(scrollTarget.pos, { y: "center" }),
    });

    clearScrollTarget();
  }, [scrollTarget, clearScrollTarget]);

  return (
    <div className={`h-full overflow-hidden ${className || ""}`}>
      <CodeMirror
        ref={editorRef}
        value={value}
        onChange={handleChange}
        onUpdate={handleUpdate}
        theme={editorTheme}
        extensions={extensions}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: false,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        style={{ height: "100%", fontSize: "15px" }}
      />
    </div>
  );
}

// Export ref type for parent components that need to control the editor
export type { ReactCodeMirrorRef };
