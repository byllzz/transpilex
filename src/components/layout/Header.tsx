import { ArrowLeftRight, Coffee, Heart } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export function Header() {
  return (
    <header className="h-12 min-h-[48px] border-b border-gray-200 dark:border-[#1a1a1a] px-4 flex items-center justify-between bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm transition-colors">
      {/* Left: Brand */}
      <div className="flex items-center">
        <div className="flex items-center justify-center w-7 h-7  text-indigo-600 dark:text-indigo-400">
          <ArrowLeftRight className="w-4 h-4" />
        </div>
        <div className="flex items-baseline">
          <h1 className="text-sm font-bold text-gray-900 dark:text-[#e0e0e0] tracking-tight">
            TranspileX
          </h1>
        </div>
        <span className="text-[11px] text-gray-500 dark:text-[#555] hidden md:inline border-l border-gray-200 dark:border-[#2a2a2a] pl-3">
          Code Converter
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <a
          href="https://buymeacoffee.com/bilalmlkdev"
          target="_blank"
          rel="noopener noreferrer"
          title="Buy me a coffee"
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-[#666] hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
        >
          <Coffee className="w-4 h-4" />
        </a>

        <a
          href="https://github.com/sponsors/byllzz"
          target="_blank"
          rel="noopener noreferrer"
          title="Sponsor"
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-[#666] hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors"
        >
          <Heart className="w-4 h-4" />
        </a>

        <div className="w-px h-5 bg-gray-200 dark:bg-[#2a2a2a] mx-1" />

        <a
          href="https://github.com/byllzz/transpilex"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 h-8 px-3 rounded-md text-[11px] font-medium text-gray-700 dark:text-[#ccc] hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-200 dark:border-[#2a2a2a] hover:border-gray-300 dark:hover:border-[#3a3a3a] transition-colors"
        >
          <FaGithub className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Star on GitHub</span>
          <span className="sm:hidden">GitHub</span>
        </a>
      </div>
    </header>
  );
}
