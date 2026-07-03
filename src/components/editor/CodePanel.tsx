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
    text: 'text-indigo-300',
    badgeBg: 'bg-indigo-400/10',
    headerBg: 'bg-[#0d0d0d]',
    icon: ArrowRightToLine,
  },
  output: {
    accent: 'bg-emerald-500',
    text: 'text-emerald-300',
    badgeBg: 'bg-emerald-400/10',
    headerBg: 'bg-[#0b0f0d]',
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
}

export function CodePanel({
  value,
  onChange,
  language,
  label,
  role,
  readOnly = false,
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
      {/* Role accent strip */}
      <div className={`h-[2px] shrink-0 ${style.accent}`} />

      <div
        className={`px-3 py-1.5 border-b border-[#1a1a1a] ${style.headerBg} flex items-center justify-between shrink-0`}
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
          <span className="text-[10px] text-[#555] tabular-nums">
            {lines} {lines === 1 ? 'line' : 'lines'} · {chars} chars
          </span>
          <span className="text-[10px] text-[#555]">{language.toUpperCase()}</span>
          <button
            onClick={handleCopy}
            disabled={!value}
            title="Copy code"
            className="w-5 h-5 flex items-center justify-center rounded text-[#666] hover:text-[#e0e0e0] hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={monacoLanguage}
          value={value}
          onChange={val => onChange?.(val ?? '')}
          theme="vs-dark"
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
            <div className="h-full flex items-center justify-center bg-[#0d0d0d]">
              <div className="w-4 h-4 border-2 border-[#333] border-t-indigo-400 rounded-full animate-spin" />
            </div>
          }
        />
      </div>
    </div>
  );
}
