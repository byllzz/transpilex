import { ArrowLeftRight, Coffee, Heart } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="h-10 min-h-[40px] border-b border-gray-200 dark:border-[#1a1a1a] px-4 flex items-center justify-between bg-white dark:bg-[#0a0a0a] transition-colors">
      {/* Left: Brand */}
      <div className="flex items-center gap-2">
        <ArrowLeftRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-sm font-semibold text-gray-900 dark:text-[#e0e0e0] tracking-tight">
          TranspileX
        </h1>
        <span className="text-[10px] text-gray-500 dark:text-[#555] hidden sm:inline">
          Code Converter
        </span>
      </div>

      {/* Right: Tool actions + ThemeSwitcher */}
      <div className="flex items-center gap-0.5">
        <a
          href="https://buymeacoffee.com/bilalmlkdev"
          target="_blank"
          rel="noopener noreferrer"
          title="Buy me a coffee"
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 dark:text-[#666] hover:text-gray-700 dark:hover:text-[#e0e0e0] hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
        >
          <Coffee className="w-3.5 h-3.5" />
        </a>

        <a
          href="https://github.com/sponsors/byllzz"
          target="_blank"
          rel="noopener noreferrer"
          title="Sponsor"
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 dark:text-[#666] hover:text-gray-700 dark:hover:text-[#e0e0e0] hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
        >
          <Heart className="w-3.5 h-3.5" />
        </a>

        {/* Divider */}
        <div className="w-px h-4 bg-gray-200 dark:bg-[#1e1e1e] mx-1.5" />

        <a
          href="https://github.com/byllzz/transpilex"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-medium text-gray-600 dark:text-[#aaa] hover:text-gray-900 dark:hover:text-[#e0e0e0] bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.06] border border-gray-200 dark:border-[#1e1e1e] hover:border-gray-300 dark:hover:border-[#2a2a2a] transition-colors"
        >
          <FaGithub className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">GitHub</span>
        </a>

        {/* ThemeSwitcher inserted here */}
        {children}
      </div>
    </header>
  );
}
