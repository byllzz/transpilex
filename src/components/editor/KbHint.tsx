export function KbHint({ keys, label }: { keys: readonly string[]; label: string }) {
  return (
    <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-[#383838]">
      {keys.map(k => (
        <kbd
          key={k}
          className="px-0.5  border border-gray-200 dark:border-[#1e1e1e] text-[9px] font-mono leading-tight"
        >
          {k}
        </kbd>
      ))}
      <span>{label}</span>
    </span>
  );
}
