import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { Language } from '../../types';

interface CodePanelProps {
  value: string;
  onChange?: (value: string) => void;
  language: string;
  label: string;
  readOnly?: boolean;
}

export function CodePanel({ value, onChange, language, label, readOnly = false }: CodePanelProps) {
  const editorRef = useRef(null);

  const monacoLanguage =
    language === 'jsx' || language === 'tsx'
      ? 'javascript'
      : language === 'scss'
        ? 'css'
        : language === 'svg'
          ? 'xml'
          : language;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="px-3 py-1.5 border-b border-[#1a1a1a] bg-[#0d0d0d] flex items-center justify-between">
        <span className="text-[10px] font-semibold text-[#888] uppercase tracking-widest">
          {label}
        </span>
        <span className="text-[10px] text-[#555]">{language.toUpperCase()}</span>
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
