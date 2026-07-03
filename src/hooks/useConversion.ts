import { useState, useEffect, useRef } from 'react';
import { languages, conversionPairs } from '../lib/languages';

export function useConversion(from: string, to: string, setTo: (lang: string) => void) {
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationTimeout, setNotificationTimeout] = useState<number | null>(null);

  const isManualOutputChange = useRef(false);
  const prevFromRef = useRef(from);

  const validateAndNotify = (source: string, target: string) => {
    const hasConverter = conversionPairs.some(
      p => p.source.id === source && p.target.id === target,
    );
    const fromLabel = languages.find(l => l.id === source)?.label || source;
    const toLabel = languages.find(l => l.id === target)?.label || target;

    if (!hasConverter) {
      const hasAny = conversionPairs.some(p => p.source.id === source);
      if (hasAny) {
        const available = conversionPairs
          .filter(p => p.source.id === source)
          .map(p => p.target.label)
          .join(', ');
        setNotification(
          `⚠️ Conversion from ${fromLabel} to ${toLabel} is not supported. Available: ${available}`,
        );
      } else {
        setNotification(`⚠️ No conversions available from ${fromLabel}.`);
      }
    } else {
      if (notification?.startsWith('⚠️')) {
        setNotification(null);
      }
    }
  };

  // Auto‑select when 'from' changes
  useEffect(() => {
    if (prevFromRef.current === from) return;
    prevFromRef.current = from;
    isManualOutputChange.current = false;

    const pair = conversionPairs.find(p => p.source.id === from);
    const fromLabel = languages.find(l => l.id === from)?.label || from;

    if (pair) {
      const suggested = pair.target.id;
      if (!isManualOutputChange.current && suggested !== to) {
        setTo(suggested);
        setNotification(`🔄 Auto‑selected output: ${pair.target.label}`);
        return;
      }
    } else {
      setNotification(`⚠️ No conversions available from ${fromLabel}.`);
      return;
    }

    validateAndNotify(from, to);
  }, [from, to, setTo]);

  // Validate on any change (manual)
  useEffect(() => {
    if (!from || !to) return;
    if (prevFromRef.current === from && isManualOutputChange.current) {
      validateAndNotify(from, to);
    } else if (prevFromRef.current !== from) {
      validateAndNotify(from, to);
    }
  }, [from, to]);

  // Auto‑dismiss notification
  useEffect(() => {
    if (notification) {
      if (notificationTimeout) clearTimeout(notificationTimeout);
      const duration = notification.startsWith('⚠️') ? 5000 : 3000;
      const timeout = setTimeout(() => setNotification(null), duration);
      setNotificationTimeout(timeout);
      return () => clearTimeout(timeout);
    } else {
      if (notificationTimeout) {
        clearTimeout(notificationTimeout);
        setNotificationTimeout(null);
      }
    }
  }, [notification]);

  const handleManualToChange = (newTo: string) => {
    isManualOutputChange.current = true;
    setTo(newTo);
  };

  // Compute conversion info for UI
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
