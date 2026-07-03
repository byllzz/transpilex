import { Button } from './ui/Button';
import { Copy, Check, Download, Settings, Info } from 'lucide-react';

interface ToolbarActionsProps {
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
  showSettings: boolean;
  onToggleSettings: () => void;
  showConversionInfo: boolean;
  onToggleConversionInfo: () => void;
  disabledCopy?: boolean;
  disabledDownload?: boolean;
}

export function ToolbarActions({
  copied,
  onCopy,
  onDownload,
  showSettings,
  onToggleSettings,
  showConversionInfo,
  onToggleConversionInfo,
  disabledCopy = false,
  disabledDownload = false,
}: ToolbarActionsProps) {
  return (
    <div className="flex items-center gap-1 relative">
      <Button variant="ghost" size="sm" onClick={onCopy} disabled={disabledCopy}>
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
        {copied ? 'Copied' : 'Copy'}
      </Button>
      <Button variant="ghost" size="sm" onClick={onDownload} disabled={disabledDownload}>
        <Download className="w-3.5 h-3.5" />
        Download
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleConversionInfo}
        className={showConversionInfo ? 'bg-gray-200 dark:bg-white/10' : ''}
        title="Toggle conversion info"
      >
        <Info className="w-3.5 h-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSettings}
        className={showSettings ? 'bg-gray-200 dark:bg-white/10' : ''}
        title="Open settings"
      >
        <Settings className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
