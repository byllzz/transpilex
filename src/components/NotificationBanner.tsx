import { X, ArrowRight } from 'lucide-react';
import type { ConversionNotification } from '../hooks/useConversion';

interface NotificationBannerProps {
  notification: ConversionNotification | null;
  onDismiss: () => void;
}

export function NotificationBanner({ notification, onDismiss }: NotificationBannerProps) {
  if (!notification) return null;

  const { type } = notification;

  // two-row banner - info row on top, warning row below
  if (type === 'combined') {
    return (
      <div className="border-b text-xs transition-colors">
        {/* Top row) */}
        <div className="px-4 py-1.5 flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border-b border-blue-100 dark:border-blue-500/15 text-blue-700 dark:text-blue-300">
          <ArrowRight className="w-3 h-3 shrink-0" />
          <span>
            Auto-selected output: <span className="font-semibold">{notification.autoSelected}</span>
          </span>
        </div>
        {/* Bottom row*/}
        <div className="px-4 py-1.5 flex items-center justify-between gap-2 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300">
          <span>{notification.warningDetail}</span>
          <button
            type="button"
            onClick={onDismiss}
            className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // info (blue) or warning (amber)
  const isWarning = type === 'warning';
  return (
    <div
      className={`px-4 py-1.5 border-b text-xs flex items-center justify-between transition-colors ${
        isWarning
          ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300'
          : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300'
      }`}
    >
      <span>{notification.message}</span>
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
