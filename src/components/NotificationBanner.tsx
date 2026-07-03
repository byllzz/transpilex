import { X } from 'lucide-react';

interface NotificationBannerProps {
  notification: string | null;
  onDismiss: () => void;
}

export function NotificationBanner({ notification, onDismiss }: NotificationBannerProps) {
  if (!notification) return null;

  const isWarning = notification.startsWith('⚠️');

  return (
    <div
      className={`px-4 py-1.5 border-b text-xs flex items-center justify-between transition-colors ${
        isWarning
          ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300'
          : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300'
      }`}
    >
      <span>{notification}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
        aria-label="Dismiss"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
