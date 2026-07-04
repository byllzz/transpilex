import { useRef, useEffect } from 'react';
import { Settings, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SettingsPanelProps {
  fontFamily: string;
  fontSize: number;
  onFontFamilyChange: (family: string) => void;
  onFontSizeChange: (size: number) => void;
  onClose: () => void;
}

const FONT_FAMILIES = [
  { label: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
  { label: 'Fira Code', value: "'Fira Code', monospace" },
  { label: 'Consolas', value: 'Consolas, monospace' },
  { label: 'Monaco', value: 'Monaco, monospace' },
  { label: 'Courier New', value: "'Courier New', monospace" },
];

const FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 18, 20];

const THEME_OPTIONS = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
] as const;

export function SettingsPanel({
  fontFamily,
  fontSize,
  onFontFamilyChange,
  onFontSizeChange,
  onClose,
}: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  // Close on outside click or Escape
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute top-20 right-5 mt-1.5 w-72 bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-[#2a2a2a] rounded-lg shadow-2xl p-4 z-[100]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 dark:border-[#1a1a1a]">
        <Settings className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Preferences</span>
      </div>

      {/* Theme Section */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          Theme
        </label>
        <div className="flex gap-1.5">
          {THEME_OPTIONS.map(opt => {
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value)}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/30'
                      : 'bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08]'
                  }
                `}
              >
                <opt.icon className="w-3.5 h-3.5" />
                <span>{opt.label}</span>
                {isActive && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Section */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Font Family
          </label>
          <select
            value={fontFamily}
            onChange={e => onFontFamilyChange(e.target.value)}
            className="w-full text-sm bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-md px-3 py-1.5 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
          >
            {FONT_FAMILIES.map(f => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Font Size
          </label>
          <select
            value={fontSize}
            onChange={e => onFontSizeChange(Number(e.target.value))}
            className="w-full text-sm bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-md px-3 py-1.5 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
          >
            {FONT_SIZES.map(size => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-[#1a1a1a] text-[10px] text-gray-400 dark:text-gray-500">
        Changes apply instantly.
      </div>
    </div>
  );
}
