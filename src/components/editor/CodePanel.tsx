import { useState, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';
import type * as MonacoTypes from 'monaco-editor';
import { Check, Copy, WrapText, AlignLeft, Maximize2, Minimize2, Search } from 'lucide-react';

import { ROLE_STYLES, KB_HINTS, toMonacoLang, type PanelRole } from '../../lib/constants';
import { configureMonaco, setupEditor } from '../../lib/monacoSetup';
import { EditorSkeleton } from './EditorSkeleton';
import { KbHint } from './KbHint';
import { ToolBtn } from './ToolBtn';

interface CodePanelProps {
  value: string;
  onChange?: (value: string) => void;
  language: string;
  label: string;
  role: PanelRole;
  editorTheme: string;
  readOnly?: boolean;
  loading?: boolean;
  onFullscreenToggle?: () => void;
  isFullscreen?: boolean;
  fontFamily?: string;
  fontSize?: number;
}

export function CodePanel({
  value,
  onChange,
  language,
  label,
  role,
  editorTheme,
  readOnly = false,
  loading = false,
  onFullscreenToggle,
  isFullscreen = false,
  fontFamily = "'JetBrains Mono', monospace",
  fontSize = 13,
}: CodePanelProps) {
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on');
  const [findOpen, setFindOpen] = useState(false);

  const editorRef = useRef<MonacoTypes.editor.IStandaloneCodeEditor | null>(null);
  const styles = ROLE_STYLES[role];
  const monacoLang = toMonacoLang(language);

  // Copy with fallback
  const handleCopy = useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      document.body.removeChild(textarea);
    }
  }, [value]);

  const handleWrapToggle = useCallback(() => {
    setWordWrap(prev => {
      const next = prev === 'on' ? 'off' : 'on';
      editorRef.current?.updateOptions({ wordWrap: next });
      return next;
    });
  }, []);

  const handleFormat = useCallback(() => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
  }, []);

  const handleFind = useCallback(() => {
    editorRef.current?.getAction('actions.find')?.run();
    setFindOpen(f => !f);
  }, []);

  const handleMount = useCallback(
    (editor: MonacoTypes.editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editor;
      configureMonaco(monaco);
      setupEditor(editor, monaco, language);
    },
    [language],
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0a0a0a] transition-colors">
      {/* Header */}
      <div
        className={`h-9 min-h-[36px] border-b border-gray-200 dark:border-[#1a1a1a] px-3 flex items-center justify-between ${styles.headerBg}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <styles.icon className={`w-3.5 h-3.5 shrink-0 ${styles.text}`} />
          <span className="text-xs font-medium text-gray-700 dark:text-[#ccc] truncate">
            {label}
          </span>
          <span
            className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded shrink-0 ${styles.badgeBg} ${styles.text}`}
          >
            {language}
          </span>
        </div>

        <div className="flex items-center gap-0.5 ml-2 shrink-0">
          <ToolBtn onClick={handleFind} title="Find / Replace (Ctrl+F)" active={findOpen}>
            <Search className="w-3 h-3" />
          </ToolBtn>
          <ToolBtn
            onClick={handleWrapToggle}
            title="Toggle Word Wrap (Alt+Z)"
            active={wordWrap === 'on'}
          >
            <WrapText className="w-3 h-3" />
          </ToolBtn>
          {!readOnly && (
            <ToolBtn onClick={handleFormat} title="Format Document (Ctrl+Shift+F)">
              <AlignLeft className="w-3 h-3" />
            </ToolBtn>
          )}
          {onFullscreenToggle && (
            <ToolBtn onClick={onFullscreenToggle} title="Toggle Fullscreen">
              {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </ToolBtn>
          )}

          <div className="w-px h-4 bg-gray-200 dark:bg-[#252525] mx-1" />

          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            title="Copy to clipboard"
            className="h-6 px-2 flex items-center gap-1 text-[11px] font-medium rounded transition-colors text-gray-500 dark:text-[#555] hover:text-gray-700 dark:hover:text-[#e0e0e0] hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-40 disabled:pointer-events-none"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor container */}
      <div className="flex-1 overflow-visible relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 dark:bg-black/60 backdrop-blur-sm pointer-events-none">
            <div className="w-6 h-6 border-2 border-gray-200 dark:border-[#333] border-t-indigo-500 rounded-full animate-spin mb-2" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Converting…
            </span>
          </div>
        )}
        <Editor
          height="100%"
          language={monacoLang}
          value={value}
          onChange={val => onChange?.(val ?? '')}
          theme={editorTheme}
          onMount={handleMount}
          loading={<EditorSkeleton />}
          options={{
            readOnly,
            fontSize,
            fontFamily,
            lineNumbers: 'on',
            wordWrap,
            scrollBeyondLastLine: false,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            automaticLayout: true,

            glyphMargin: false,
            lineDecorationsWidth: 4,
            lineNumbersMinChars: 3,

            bracketPairColorization: { enabled: true, independentColorPoolPerBracketType: true },
            guides: {
              bracketPairs: 'active',
              bracketPairsHorizontal: true,
              highlightActiveBracketPair: true,
              indentation: true,
              highlightActiveIndentation: true,
            },

            stickyScroll: { enabled: true, maxLineCount: 5 },

            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'mouseover',

            tabCompletion: 'on',
            quickSuggestions: { other: true, comments: false, strings: true },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            parameterHints: { enabled: true, cycle: true },
            snippetSuggestions: 'inline',
            wordBasedSuggestions: 'allDocuments',
            inlineSuggest: { enabled: true },
            suggest: {
              preview: true,
              filterGraceful: true,
              localityBonus: true,
              insertMode: 'replace',
              showSnippets: true,
              showKeywords: true,
              showStatusBar: false,
              showInlineDetails: false,
            },

            inlayHints: { enabled: 'on', fontSize: 11, padding: true },

            formatOnType: true,
            formatOnPaste: true,
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoClosingDelete: 'always',
            autoClosingOvertype: 'always',
            autoSurround: 'languageDefined',
            autoIndent: 'full',

            multiCursorModifier: 'ctrlCmd',

            hover: { enabled: true, delay: 300, sticky: true },
            links: true,
            colorDecorators: true,

            minimap: { enabled: false },
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              useShadows: false,
              alwaysConsumeMouseWheel: false,
            },
            overviewRulerBorder: false,
            overviewRulerLanes: 3,

            occurrencesHighlight: 'multiFile',
            selectionHighlight: true,
            matchBrackets: 'always',
          }}
        />
      </div>

      {/* Status bar */}
      <div className="h-5 min-h-[20px] border-t border-gray-100 dark:border-[#111] px-3 flex items-center gap-4 bg-gray-50/80 dark:bg-[#090909]">
        {KB_HINTS.filter(h => !readOnly || h.label !== 'Save').map(h => (
          <KbHint key={h.label} keys={h.keys} label={h.label} />
        ))}
      </div>
    </div>
  );
}
