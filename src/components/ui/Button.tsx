import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
  size?: 'default' | 'sm' | 'icon';
}

export function Button({
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'rounded-md font-medium cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed';
  const variants = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-500',
    ghost: 'bg-transparent hover:bg-[#1a1a1a] text-[#888] hover:text-[#e0e0e0]',
  };
  const sizes = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-2.5 py-1 text-xs',
    icon: 'w-8 h-8 p-0',
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}
