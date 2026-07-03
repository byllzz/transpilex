import { ArrowLeftRight } from 'lucide-react';
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
  fontFamily?: string; // 👈 new
  fontSize?: number; // 👈 new
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
  fontFamily = "'JetBrains Mono', monospace", // default
  fontSize = 13, // default
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
          fontFamily={fontFamily} // 👈 pass through
          fontSize={fontSize} // 👈 pass through
        />
      </div>

      {/* Resizer */}
      <div
        onMouseDown={onMouseDown}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(leftWidth)}
        className="relative w-0.5 shrink-0 bg-gray-300 dark:bg-[#2a2a2a] hover:bg-gray-400 dark:hover:bg-white/30 cursor-col-resize group transition-colors"
      >
        {/* Expanded hit area — ~20px */}
        <div className="absolute inset-y-0 -left-[10px] -right-[10px]" />

        {/* Visual handle pill */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[4px] h-8 rounded-full transition-colors ${
            dragging
              ? 'bg-indigo-500 dark:bg-white/50'
              : 'bg-gray-400 dark:bg-[#444] group-hover:bg-indigo-400 dark:group-hover:bg-white/30'
          }`}
        />

        {/* Two arrow icons (top and bottom) */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-[#141414] border border-gray-300 dark:border-[#333] flex items-center justify-center pointer-events-none transition-colors shadow-sm z-99">
          <ArrowLeftRight className="w-3 h-3 text-gray-600 dark:text-[#888]" />
        </div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-[#141414] border border-gray-300 dark:border-[#333] flex items-center justify-center pointer-events-none transition-colors shadow-sm z-99">
          <ArrowLeftRight className="w-3 h-3 text-gray-600 dark:text-[#888]" />
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
          fontFamily={fontFamily}
          fontSize={fontSize}
        />
      </div>
    </div>
  );
}
