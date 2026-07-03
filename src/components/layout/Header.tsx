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

      {/* Right: Support buttons */}
      <div className="flex items-center gap-1">
        {/* Buy me a coffee */}
        <a
          href="https://buymeacoffee.com/bilalmlkdev"
          target="_blank"
          rel="noopener noreferrer"
          title="Buy me a coffee"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium text-[#888] hover:text-amber-400 hover:bg-amber-400/5 border border-transparent hover:border-amber-400/20 transition-all"
        >
          <Coffee className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Buy me a coffee</span>
        </a>

        {/* Sponsor */}
        <a
          href="https://github.com/sponsors/byllzz"
          target="_blank"
          rel="noopener noreferrer"
          title="Sponsor on GitHub"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium text-[#888] hover:text-pink-400 hover:bg-pink-400/5 border border-transparent hover:border-pink-400/20 transition-all"
        >
          <Heart className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sponsor</span>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/byllzz/transpilex"
          target="_blank"
          rel="noopener noreferrer"
          title="View on GitHub"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium text-[#888] hover:text-[#e0e0e0] hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
        >
          <FaGithub className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}
