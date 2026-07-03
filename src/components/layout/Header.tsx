import { ArrowLeftRight, Code2 } from 'lucide-react';

export function Header() {
  return (
    <header className="h-10 min-h-[40px] border-b border-[#1a1a1a] px-4 flex items-center justify-between bg-[#0a0a0a]">
      <div className="flex items-center gap-2">
        <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
        <h1 className="text-sm font-semibold text-[#e0e0e0] tracking-tight">TranspileX</h1>
      </div>
      <span className="text-[10px] text-[#555]">Code Converter</span>
    </header>
  );
}
