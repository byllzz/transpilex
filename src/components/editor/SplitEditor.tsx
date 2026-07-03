import { ArrowRight } from 'lucide-react';
import { CodePanel } from './CodePanel';
import { useResizablePanels } from '../../hooks/useResizablePanels';
import { useTheme } from '../../context/ThemeContext';

interface SplitEditorProps {
  fromValue: string;
  toValue: string;
  onFromChange: (value: string) => void;
  fromLanguage: string;
  toLanguage: string;
  fromLabel?: string;
  toLabel?: string;
  fromLoading?: boolean;
  toLoading?: boolean;
}

export function SplitEditor({
  fromValue,
  toValue,
  onFromChange,
  fromLanguage,
  toLanguage,
  fromLabel = 'Input',
  toLabel = 'Output',
  fromLoading = false,
  toLoading = false,
}: SplitEditorProps) {
  const { containerRef, leftWidth, dragging, onMouseDown } = useResizablePanels();
  const { resolvedTheme } = useTheme();
  const editorTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'vs';

  return (
    <div ref={containerRef} className="relative flex-1 flex min-h-0 bg-white dark:bg-[#0a0a0a]">
      <div style={{ width: `${leftWidth}%` }} className="flex min-w-0">
        <CodePanel
          value={fromValue}
          onChange={onFromChange}
          language={fromLanguage}
          label={fromLabel}
          role="input"
          editorTheme={editorTheme}
          loading={fromLoading}
        />
      </div>

      {/* Resizer */}
      <div
        onMouseDown={onMouseDown}
        className="relative w-px shrink-0 bg-gray-200 dark:bg-[#1a1a1a] hover:bg-gray-400 dark:hover:bg-white/20 cursor-col-resize group transition-colors"
      >
        <div className="absolute inset-y-0 -left-1.5 -right-1.5" />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-8 rounded-full transition-colors ${
            dragging
              ? 'bg-indigo-500 dark:bg-white/40'
              : 'bg-gray-300 dark:bg-[#2a2a2a] group-hover:bg-indigo-400 dark:group-hover:bg-white/25'
          }`}
        />

        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-[#141414] border border-gray-200 dark:border-[#262626] flex items-center justify-center pointer-events-none transition-colors z-999">
          <ArrowRight className="w-3 h-3 text-gray-500 dark:text-[#666]" />
        </div>
      </div>

      <div style={{ width: `${100 - leftWidth}%` }} className="flex min-w-0">
        <CodePanel
          value={toValue}
          language={toLanguage}
          label={toLabel}
          role="output"
          readOnly
          editorTheme={editorTheme}
          loading={toLoading}
        />
      </div>
    </div>
  );
}
