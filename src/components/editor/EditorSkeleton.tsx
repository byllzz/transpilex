export function EditorSkeleton() {
  return (
    <div className="h-full flex flex-col gap-2 p-3 bg-white dark:bg-[#0d0d0d]">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded bg-gray-100 dark:bg-[#1a1a1a] animate-pulse"
          style={{ width: `${38 + ((i * 17) % 52)}%`, opacity: 1 - i * 0.055 }}
        />
      ))}
    </div>
  );
}
