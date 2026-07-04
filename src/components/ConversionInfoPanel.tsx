import { Check, X } from 'lucide-react';
import { CiWarning } from 'react-icons/ci';

interface ConversionInfoPanelProps {
  fromLabel: string;
  toLabel: string;
  hasConverter: boolean;
  availableTargets: string[];
  onClose: () => void;
}

export function ConversionInfoPanel({
  fromLabel,
  toLabel,
  hasConverter,
  availableTargets,
  onClose,
}: ConversionInfoPanelProps) {
  return (
    <div className="absolute right-12 top-20  w-64 bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-[#2a2a2a] rounded-lg shadow-2xl p-4 z-[100]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-[#1a1a1a]">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Conversion Status
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-white/10"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Source:</span>
          <span className="font-mono text-gray-800 dark:text-gray-200">{fromLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Target:</span>
          <span className="font-mono text-gray-800 dark:text-gray-200">{toLabel}</span>
        </div>

        <div className="pt-2 border-t border-gray-100 dark:border-[#1a1a1a]">
          {hasConverter ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Check className="w-3.5 h-3.5" />
              <span>✅ Conversion supported</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <CiWarning className="w-3.5 h-3.5" />
                <span>⚠️ Not supported</span>
              </div>
              {availableTargets.length > 0 ? (
                <div className="mt-1 text-gray-500 dark:text-gray-400">
                  Available targets:{' '}
                  <span className="font-mono text-gray-700 dark:text-gray-300">
                    {availableTargets.join(', ')}
                  </span>
                </div>
              ) : (
                <div className="mt-1 text-gray-500 dark:text-gray-400">
                  No conversions available from this source.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-2 mt-1 border-t border-gray-100 dark:border-[#1a1a1a] text-[10px] text-gray-400 dark:text-gray-500">
          Toggle this panel to check conversion compatibility.
        </div>
      </div>
    </div>
  );
}
