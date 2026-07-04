import { useState, useEffect, useRef } from 'react';
import { languages, conversionPairs } from '../lib/languages';

// Notification type
export type NotificationType = 'info' | 'warning' | 'combined';

export interface ConversionNotification {
  type: NotificationType;
  message: string;
  // For 'combined': carry both pieces so the UI can render them separately
  autoSelected?: string; // e.g. "JSX"
  warningDetail?: string; // e.g. "No converter from CSS to JSX. Available: ..."
}

export function useConversion(from: string, to: string, setTo: (lang: string) => void) {
  const [notification, setNotification] = useState<ConversionNotification | null>(null);
  const notificationTimeoutRef = useRef<number | null>(null);
  const isManualOutputChange = useRef(false);
  const prevFromRef = useRef(from);

  const clearTimer = () => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
      notificationTimeoutRef.current = null;
    }
  };

  const show = (n: ConversionNotification) => {
    clearTimer();
    setNotification(n);
  };

  // Auto-dismiss
  useEffect(() => {
    clearTimer();
    if (notification) {
      const duration =
        notification.type === 'warning' || notification.type === 'combined' ? 6000 : 3000;
      notificationTimeoutRef.current = setTimeout(() => setNotification(null), duration);
    }
    return clearTimer;
  }, [notification]);

  // React to input language change
  useEffect(() => {
    if (prevFromRef.current === from) return;
    prevFromRef.current = from;
    isManualOutputChange.current = false;

    const fromLabel = languages.find(l => l.id === from)?.label || from;
    const pairs = conversionPairs.filter(p => p.source.id === from);

    // Case 1: no converters at all from this source
    if (pairs.length === 0) {
      show({
        type: 'warning',
        message: `No converters available from ${fromLabel}.`,
      });
      return;
    }

    // Auto-select the best target
    const suggested = pairs[0].target;
    const converterExistsForSuggested = conversionPairs.some(
      p => p.source.id === from && p.target.id === suggested.id,
    );

    setTo(suggested.id);

    if (converterExistsForSuggested) {
      // Case 2: auto-selected and converter exists — simple info
      show({
        type: 'info',
        message: `Auto-selected output: ${suggested.label}`,
        autoSelected: suggested.label,
      });
    } else {
      // Case 3: auto-selected but no converter — combined banner
      const available = pairs.map(p => p.target.label).join(', ');
      show({
        type: 'combined',
        message: `Auto-selected ${suggested.label} but no converter found.`,
        autoSelected: suggested.label,
        warningDetail: `No converter from ${fromLabel} to ${suggested.label}. Available: ${available}`,
      });
    }
  }, [from]);

  // Validate on manual output change
  useEffect(() => {
    if (!from || !to || !isManualOutputChange.current) return;

    const hasConverter = conversionPairs.some(p => p.source.id === from && p.target.id === to);
    if (hasConverter) {
      setNotification(prev =>
        prev?.type === 'warning' || prev?.type === 'combined' ? null : prev,
      );
      return;
    }

    const fromLabel = languages.find(l => l.id === from)?.label || from;
    const toLabel = languages.find(l => l.id === to)?.label || to;
    const available = conversionPairs
      .filter(p => p.source.id === from)
      .map(p => p.target.label)
      .join(', ');

    show({
      type: 'warning',
      message: available
        ? `No converter from ${fromLabel} to ${toLabel}. Available: ${available}`
        : `No converters available from ${fromLabel}.`,
    });
  }, [to]);

  const handleManualToChange = (newTo: string) => {
    isManualOutputChange.current = true;
    setTo(newTo);
  };

  const hasConverter = conversionPairs.some(p => p.source.id === from && p.target.id === to);
  const fromLabel = languages.find(l => l.id === from)?.label || from;
  const toLabel = languages.find(l => l.id === to)?.label || to;
  const availableTargets = conversionPairs
    .filter(p => p.source.id === from)
    .map(p => p.target.label);

  return {
    notification,
    setNotification,
    handleManualToChange,
    hasConverter,
    fromLabel,
    toLabel,
    availableTargets,
  };
}
