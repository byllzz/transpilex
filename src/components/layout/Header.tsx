import { ArrowLeftRight, Coffee, Heart } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export function Header() {
  return (
    <header className="h-10 min-h-[40px] border-b border-[#1a1a1a] px-4 flex items-center justify-between bg-[#0a0a0a]">
      {/* Left: Brand */}
      <div className="flex items-center gap-2">
        <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
        <h1 className="text-sm font-semibold text-[#e0e0e0] tracking-tight">TranspileX</h1>
        <span className="text-[10px] text-[#555] hidden sm:inline">Code Converter</span>
      </div>

      {/* Right: Tool actions */}
      <div className="flex items-center gap-0.5">
        <a
          href="https://buymeacoffee.com/bilalmlkdev"
          target="_blank"
          rel="noopener noreferrer"
          title="Buy me a coffee"
          className="w-7 h-7 flex items-center justify-center rounded-md text-[#666] hover:text-[#e0e0e0] hover:bg-white/[0.06] transition-colors"
        >
          <Coffee className="w-3.5 h-3.5" />
        </a>

        <a
          href="https://github.com/sponsors/byllzz"
          target="_blank"
          rel="noopener noreferrer"
          title="Sponsor"
          className="w-7 h-7 flex items-center justify-center rounded-md text-[#666] hover:text-[#e0e0e0] hover:bg-white/[0.06] transition-colors"
        >
          <Heart className="w-3.5 h-3.5" />
        </a>

        {/* Divider */}
        <div className="w-px h-4 bg-[#1e1e1e] mx-1.5" />

        <a
          href="https://github.com/byllzz/transpilex"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-medium text-[#aaa] hover:text-[#e0e0e0] bg-white/[0.03] hover:bg-white/[0.06] border border-[#1e1e1e] hover:border-[#2a2a2a] transition-colors"
        >
          <FaGithub className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}
