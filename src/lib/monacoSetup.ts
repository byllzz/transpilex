import type { Monaco } from '@monaco-editor/react';
import type * as MonacoTypes from 'monaco-editor';
import { JSX_SNIPPETS, VOID_TAGS, toMonacoLang } from './constants';

//  Global config — runs once per page load

let configured = false;

export function configureMonaco(monaco: Monaco) {
  if (configured) return;
  configured = true;

  // TypeScript compiler options
  const shared = {
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
    jsxImportSource: 'react',
    lib: ['ESNext', 'DOM', 'DOM.Iterable'],
    strict: true,
    noEmit: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    allowNonTsExtensions: true,
    resolveJsonModule: true,
    experimentalDecorators: true,
  };

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(shared);
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ ...shared, strict: false });

  // Keep diagnostics fully on
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  // Minimal React type stubs — avoids red JSX squiggles without needing @types/react
  const reactTypes = `
declare module 'react' {
  export type FC<P = {}> = (props: P & { children?: ReactNode }) => ReactElement | null;
  export type ReactNode = ReactElement | string | number | boolean | null | undefined;
  export type ReactElement = { type: any; props: any; key: any };
  export function useState<T>(init: T | (() => T)): [T, (v: T | ((p: T) => T)) => void];
  export function useEffect(fn: () => void | (() => void), deps?: readonly any[]): void;
  export function useCallback<T extends (...a: any[]) => any>(fn: T, deps: readonly any[]): T;
  export function useMemo<T>(fn: () => T, deps: readonly any[]): T;
  export function useRef<T>(init: T | null): { current: T };
  export function useContext<T>(ctx: Context<T>): T;
  export function useReducer<S, A>(r: (s: S, a: A) => S, init: S): [S, (a: A) => void];
  export interface Context<T> { Provider: any; Consumer: any; }
  export function createContext<T>(d: T): Context<T>;
  export const Fragment: unique symbol;
}
declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export const Fragment: any;
}`;

  const libPath = 'file:///node_modules/@types/react/index.d.ts';
  monaco.languages.typescript.typescriptDefaults.addExtraLib(reactTypes, libPath);
  monaco.languages.typescript.javascriptDefaults.addExtraLib(reactTypes, libPath);

  // JSON schema validation for common config files
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemaValidation: 'error',
    schemas: [
      { uri: 'https://json.schemastore.org/package.json', fileMatch: ['package.json'] },
      { uri: 'https://json.schemastore.org/tsconfig.json', fileMatch: ['tsconfig*.json'] },
    ],
  });

  // JSX snippet completions for TS/JS
  const snippetProvider: MonacoTypes.languages.CompletionItemProvider = {
    provideCompletionItems(model: MonacoTypes.editor.ITextModel, position: MonacoTypes.Position) {
      const word = model.getWordUntilPosition(position);
      const range: MonacoTypes.IRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: Object.entries(JSX_SNIPPETS).map(([label, insertText]) => ({
          label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: `${label} snippet`,
          insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        })),
      };
    },
  };

  monaco.languages.registerCompletionItemProvider('typescript', snippetProvider);
  monaco.languages.registerCompletionItemProvider('javascript', snippetProvider);

  // CSS custom property completions inside var()
  monaco.languages.registerCompletionItemProvider('css', {
    triggerCharacters: ['-'],
    provideCompletionItems(model: MonacoTypes.editor.ITextModel, position: MonacoTypes.Position) {
      const line = model.getLineContent(position.lineNumber);
      if (!line.includes('var(')) return { suggestions: [] };

      const word = model.getWordUntilPosition(position);
      const range: MonacoTypes.IRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const props = [...new Set([...model.getValue().matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]))];

      return {
        suggestions: props.map(prop => ({
          label: prop,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: prop,
          range,
        })),
      };
    },
  });
}

//  Per-editor setup — runs on each editor mount

export function setupEditor(
  editor: MonacoTypes.editor.IStandaloneCodeEditor,
  monaco: Monaco,
  language: string,
) {
  const lang = toMonacoLang(language);
  const isMarkup = ['html', 'xml', 'javascript', 'typescript'].includes(lang);

  // Format document — Ctrl+Shift+F
  editor.addAction({
    id: 'netpen.format',
    label: 'Format Document',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
    run: ed => ed.getAction('editor.action.formatDocument')?.run(),
  });

  // Format on Ctrl+S
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () =>
    editor.getAction('editor.action.formatDocument')?.run(),
  );

  // Toggle word wrap — Alt+Z
  editor.addAction({
    id: 'netpen.wordWrap',
    label: 'Toggle Word Wrap',
    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
    run(ed) {
      const current = ed.getOption(monaco.editor.EditorOption.wordWrap);
      ed.updateOptions({ wordWrap: current === 'on' ? 'off' : 'on' });
    },
  });

  // Select all occurrences — Ctrl+Shift+L
  editor.addAction({
    id: 'netpen.selectAll',
    label: 'Select All Occurrences',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyL],
    run: ed => ed.getAction('editor.action.selectHighlights')?.run(),
  });

  // Auto close HTML/JSX tags on `>`
  if (isMarkup) {
    editor.onDidChangeModelContent(e => {
      for (const change of e.changes) {
        if (!change.text.endsWith('>')) continue;

        const model = editor.getModel();
        if (!model) continue;

        const offset = change.rangeOffset + change.text.length;
        const textBefore = model.getValue().slice(0, offset);

        // Skip self-closing and closing tags
        if (/\/\s*>$/.test(textBefore)) continue;
        if (/<\/[\w-]+\s*>$/.test(textBefore)) continue;

        // Extract open tag name (supports dots for JSX like Foo.Bar)
        const match = textBefore.match(/<([\w][\w.-]*)(?:\s[^>]*)?>$/);
        if (!match) continue;

        const tagName = match[1];
        if (VOID_TAGS.has(tagName.toLowerCase())) continue;

        const closeTag = `</${tagName}>`;
        const textAfter = model.getValue().slice(offset);
        if (textAfter.startsWith(closeTag)) continue; // already present

        const pos = model.getPositionAt(offset);

        editor.executeEdits('auto-close-tag', [
          {
            range: new monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column),
            text: closeTag,
            forceMoveMarkers: false,
          },
        ]);

        // Keep cursor between the tags
        editor.setPosition(pos);
      }
    });
  }
}
