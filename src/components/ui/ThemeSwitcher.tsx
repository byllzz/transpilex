import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const options = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find(o => o.value === theme);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
    <div ref={ref} className="relative ml-1.5">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle theme"
        aria-expanded={open}
        className={`
          flex items-center gap-1.5 h-8 px-2.5 rounded-md
          text-sm font-medium
          bg-gray-50 dark:bg-white/[0.04]
          border border-gray-200 dark:border-[#2a2a2a]
          text-gray-700 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-white/[0.08]
          hover:border-gray-300 dark:hover:border-[#3a3a3a]
          transition-all duration-200
          ${open ? 'ring-2 ring-indigo-500/30 border-indigo-400 dark:border-indigo-400' : ''}
        `}
      >
        {current && <current.icon className="w-4 h-4" />}
        <span className="hidden sm:inline">{current?.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-1.5 w-32
            bg-white dark:bg-[#0d0d0d]
            border border-gray-200 dark:border-[#2a2a2a]
            rounded-lg shadow-2xl
            overflow-hidden
            z-[100]
          "
        >
          {options.map(opt => {
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 text-sm
                  transition-colors duration-150
                  ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04]'
                  }
                `}
              >
                <opt.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{opt.label}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
