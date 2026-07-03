interface ToolBtnProps {
  onClick: () => void;
  title: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export function ToolBtn({
  onClick,
  title,
  active = false,
  disabled = false,
  children,
}: ToolBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={[
        'h-6 w-6 flex items-center justify-center rounded transition-colors',
        'text-gray-500 dark:text-[#555]',
        'hover:text-gray-700 dark:hover:text-[#e0e0e0]',
        'hover:bg-gray-100 dark:hover:bg-white/[0.06]',
        'disabled:opacity-30 disabled:pointer-events-none',
        active ? 'bg-gray-200 dark:bg-white/10 !text-gray-800 dark:!text-white' : '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
