import { ArrowLeftRight } from 'lucide-react';
import { languages } from '../../lib/languages';

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
      <select
        value={from}
        onChange={e => onFromChange(e.target.value)}
        className="bg-[#0d0d0d] border border-[#1a1a1a] text-[#e0e0e0] text-xs rounded-md px-2 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
      >
        {languages.map(lang => (
          <option key={lang.id} value={lang.id}>
            {lang.label}
          </option>
        ))}
      </select>

      <button
        onClick={onSwap}
        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#1a1a1a] transition-colors cursor-pointer"
        title="Swap languages"
      >
        <ArrowLeftRight className="w-3.5 h-3.5 text-[#888]" />
      </button>

      <select
        value={to}
        onChange={e => onToChange(e.target.value)}
        className="bg-[#0d0d0d] border border-[#1a1a1a] text-[#e0e0e0] text-xs rounded-md px-2 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
      >
        {languages
          .filter(l => l.id !== from)
          .map(lang => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
      </select>
    </div>
  );
}
