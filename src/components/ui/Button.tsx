interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button', // default type
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm',
    ghost:
      'bg-transparent hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm',
  };

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  return <button type={type} className={classes} {...props} />;
}
