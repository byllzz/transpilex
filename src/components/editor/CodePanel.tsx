import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { ArrowRightToLine, ArrowLeftToLine, Check, Copy } from 'lucide-react';

type PanelRole = 'input' | 'output';

const ROLE_STYLES: Record<
  PanelRole,
  { accent: string; text: string; badgeBg: string; headerBg: string; icon: typeof ArrowRightToLine }
> = {
  input: {
    accent: 'bg-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-300',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-400/10',
    headerBg: 'bg-gray-50 dark:bg-[#0d0d0d]',
    icon: ArrowRightToLine,
  },
  output: {
    accent: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-300',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-400/10',
    headerBg: 'bg-gray-50 dark:bg-[#0b0f0d]',
    icon: ArrowLeftToLine,
  },
};

interface CodePanelProps {
  value: string;
  onChange?: (value: string) => void;
  language: string;
  label: string;
  role: PanelRole;
  readOnly?: boolean;
  editorTheme?: 'vs' | 'vs-dark';
  loading?: boolean;
}

export function CodePanel({
  value,
  onChange,
  language,
  label,
  role,
  readOnly = false,
  editorTheme = 'vs-dark',
  loading = false,
}: CodePanelProps) {
  const [copied, setCopied] = useState(false);
  const style = ROLE_STYLES[role];
  const RoleIcon = style.icon;

  const monacoLanguage =
    language === 'jsx' || language === 'tsx'
      ? 'javascript'
      : language === 'scss'
        ? 'css'
        : language === 'svg'
          ? 'xml'
          : language;

  const lines = value ? value.split('\n').length : 0;
  const chars = value.length;

  function handleCopy() {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      <div className={`h-[2px] shrink-0 ${style.accent}`} />

      <div
        className={`px-3 py-1.5 border-b border-gray-200 dark:border-[#1a1a1a] ${style.headerBg} flex items-center justify-between shrink-0 transition-colors`}
      >
        <div className="flex items-center gap-1.5">
          <RoleIcon className={`w-3 h-3 ${style.text}`} />
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${style.text}`}>
            {label}
          </span>
          {readOnly && (
            <span
              className={`text-[9px] font-medium ${style.text} ${style.badgeBg} px-1.5 py-0.5 rounded ml-0.5`}
            >
              read only
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 dark:text-[#555] tabular-nums">
            {lines} {lines === 1 ? 'line' : 'lines'} · {chars} chars
          </span>
          <span className="text-[10px] text-gray-500 dark:text-[#555]">
            {language.toUpperCase()}
          </span>
          <button
            onClick={handleCopy}
            disabled={!value}
            title="Copy code"
            className="w-5 h-5 flex items-center justify-center rounded text-gray-500 dark:text-[#666] hover:text-gray-900 dark:hover:text-[#e0e0e0] hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#0d0d0d]/80 z-10">
            <div className="w-5 h-5 border-2 border-gray-300 dark:border-[#333] border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
          </div>
        )}
        <Editor
          height="100%"
          language={monacoLanguage}
          value={value}
          onChange={val => onChange?.(val ?? '')}
          theme={editorTheme}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
          }}
          loading={
            <div className="h-full flex items-center justify-center bg-white dark:bg-[#0d0d0d]">
              <div className="w-4 h-4 border-2 border-gray-300 dark:border-[#333] border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
            </div>
          }
        />
      </div>
    </div>
  );
}
