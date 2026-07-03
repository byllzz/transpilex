import { ArrowRight } from 'lucide-react';
import { CodePanel } from './CodePanel';
import { useResizablePanels } from '../../hooks/useResizablePanels';

interface SplitEditorProps {
  fromValue: string;
  toValue: string;
  onFromChange: (value: string) => void;
  fromLanguage: string;
  toLanguage: string;
  fromLabel?: string;
  toLabel?: string;
}

export function SplitEditor({
  fromValue,
  toValue,
  onFromChange,
  fromLanguage,
  toLanguage,
  fromLabel = 'Input',
  toLabel = 'Output',
}: SplitEditorProps) {
  const { containerRef, leftWidth, dragging, onMouseDown } = useResizablePanels();

  return (
    <div ref={containerRef} className="relative flex-1 flex min-h-0 bg-[#0a0a0a]">
      <div style={{ width: `${leftWidth}%` }} className="flex min-w-0">
        <CodePanel
          value={fromValue}
          onChange={onFromChange}
          language={fromLanguage}
          label={fromLabel}
          role="input"
        />
      </div>

      {/* Resizer */}
      <div
        onMouseDown={onMouseDown}
        className="relative w-px shrink-0 bg-[#1a1a1a] hover:bg-white/20 cursor-col-resize group"
      >
        <div className="absolute inset-y-0 -left-1.5 -right-1.5" />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-8 rounded-full transition-colors ${
            dragging ? 'bg-white/40' : 'bg-[#2a2a2a] group-hover:bg-white/25'
          }`}
        />

        {/* Direction connector badge */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center pointer-events-none">
          <ArrowRight className="w-3 h-3 text-[#666]" />
        </div>
      </div>

      <div style={{ width: `${100 - leftWidth}%` }} className="flex min-w-0">
        <CodePanel value={toValue} language={toLanguage} label={toLabel} role="output" readOnly />
      </div>
    </div>
  );
}
