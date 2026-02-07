import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import type { Theme } from "./themes";

export function createEditorTheme(theme: Theme) {
  const colors = theme.colors;

  // Selection color: accent-tinted for all themes
  const selectionBg = `${colors.accent}40`;

  const editorTheme = EditorView.theme(
    {
      "&": {
        backgroundColor: colors.bgBase,
        color: colors.fgPrimary,
        height: "100%",
      },
      ".cm-content": {
        caretColor: colors.accent,
        fontFamily: "var(--font-mono)",
        fontSize: "15px",
        lineHeight: "1.6",
        padding: "12px 0",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: colors.accent,
        borderLeftWidth: "2px",
      },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {
        backgroundColor: `${selectionBg} !important`,
      },
      ".cm-line::selection, .cm-line *::selection": {
        backgroundColor: `${selectionBg} !important`,
      },
      ".cm-activeLine": {
        backgroundColor: colors.bgHover,
      },
      ".cm-gutters": {
        backgroundColor: colors.bgSurface,
        color: colors.fgMuted,
        border: "none",
        borderRight: `1px solid ${colors.border}`,
      },
      ".cm-activeLineGutter": {
        backgroundColor: colors.bgHover,
      },
      ".cm-lineNumbers .cm-gutterElement": {
        color: colors.fgMuted,
        padding: "0 12px 0 16px",
        minWidth: "48px",
      },
      ".cm-foldGutter .cm-gutterElement": {
        color: colors.fgMuted,
        padding: "0 4px",
      },
      ".cm-foldPlaceholder": {
        backgroundColor: colors.bgElevated,
        color: colors.fgMuted,
        border: `1px solid ${colors.border}`,
        borderRadius: "4px",
        padding: "0 4px",
        margin: "0 4px",
      },
      ".cm-matchingBracket": {
        backgroundColor: colors.accent + "30",
        outline: `1px solid ${colors.accent}`,
      },
      ".cm-nonmatchingBracket": {
        backgroundColor: colors.error + "30",
      },
      ".cm-searchMatch": {
        backgroundColor: colors.warning + "40",
      },
      ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: colors.accent + "40",
      },
      ".cm-selectionMatch": {
        backgroundColor: colors.accent + "20",
      },
      ".cm-panels": {
        backgroundColor: colors.bgSurface,
        color: colors.fgPrimary,
      },
      ".cm-panels.cm-panels-top": {
        borderBottom: `1px solid ${colors.border}`,
      },
      ".cm-panels.cm-panels-bottom": {
        borderTop: `1px solid ${colors.border}`,
      },
      ".cm-tooltip": {
        backgroundColor: colors.bgElevated,
        color: colors.fgPrimary,
        border: `1px solid ${colors.border}`,
        borderRadius: "6px",
      },
      ".cm-tooltip-autocomplete": {
        "& > ul > li[aria-selected]": {
          backgroundColor: colors.bgHover,
        },
      },
      ".cm-scroller": {
        fontFamily: "var(--font-mono)",
        overflow: "auto",
      },
    },
    { dark: theme.type === "dark" }
  );

  const highlightStyle = HighlightStyle.define([
    { tag: tags.propertyName, color: colors.typeKey },
    { tag: tags.string, color: colors.typeString },
    { tag: tags.number, color: colors.typeNumber },
    { tag: tags.bool, color: colors.typeBoolean },
    { tag: tags.null, color: colors.typeNull },
    { tag: tags.punctuation, color: colors.fgMuted },
    { tag: tags.bracket, color: colors.fgMuted },
    { tag: tags.separator, color: colors.fgMuted },
    { tag: tags.invalid, color: colors.error },
    { tag: tags.comment, color: colors.fgMuted, fontStyle: "italic" },
  ]);

  return [editorTheme, syntaxHighlighting(highlightStyle)];
}
