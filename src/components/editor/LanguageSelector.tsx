import { useEffect, useRef, useState } from 'react';
import { ArrowLeftRight, Check, ChevronDown } from 'lucide-react';
import { languages } from '../../lib/languages';
import { LanguageIcon } from '../../lib/languageIcons';

interface LangDropdownProps {
  value: string;
  options: typeof languages;
  onChange: (id: string) => void;
  align?: 'left' | 'right';
}

function LangDropdown({ value, options, onChange, align = 'left' }: LangDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(l => l.id === value) ?? options[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Select language"
        aria-expanded={open}
        className="flex items-center gap-1.5 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[#1a1a1a] hover:border-gray-400 dark:hover:border-[#2a2a2a] text-gray-800 dark:text-[#e0e0e0] text-xs rounded-md pl-2 pr-1.5 py-1.5 min-w-[112px] transition-colors cursor-pointer"
      >
        <LanguageIcon
          id={selected.id}
          className="w-3.5 h-3.5 shrink-0 text-gray-500 dark:text-[#999]"
        />
        <span className="flex-1 text-left truncate">{selected.label}</span>
        <ChevronDown
          className={`w-3 h-3 text-gray-500 dark:text-[#666] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`absolute z-20 mt-1 w-48 max-h-64 overflow-y-auto bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-[#1a1a1a] rounded-md py-1 shadow-lg shadow-black/20 dark:shadow-black/40 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map(lang => {
            const active = lang.id === value;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => {
                  onChange(lang.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                  active
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-400/[0.06]'
                    : 'text-gray-700 dark:text-[#ccc] hover:bg-gray-100 dark:hover:bg-white/[0.05]'
                }`}
              >
                <LanguageIcon
                  id={lang.id}
                  className="w-3.5 h-3.5 shrink-0 text-gray-500 dark:text-[#999]"
                />
                <span className="flex-1 truncate">{lang.label}</span>
                {active && <Check className="w-3 h-3 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface LanguageSelectorProps {
  from: string;
  to: string;
  onFromChange: (lang: string) => void;
  onToChange: (lang: string) => void;
  onSwap: () => void;
}

export function LanguageSelector({
  from,
  to,
  onFromChange,
  onToChange,
  onSwap,
}: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <LangDropdown value={from} options={languages} onChange={onFromChange} align="left" />

      <button
        type="button"
        onClick={onSwap}
        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer text-gray-500 dark:text-[#888] hover:text-gray-700 dark:hover:text-white"
        title="Swap languages"
        aria-label="Swap languages"
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
      </button>

      <LangDropdown
        value={to}
        options={languages.filter(l => l.id !== from)}
        onChange={onToChange}
        align="right"
      />
    </div>
  );
}
