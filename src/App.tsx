import { useState, useEffect, useRef } from 'react';
import { Header } from './components/layout/Header';
import { SplitEditor } from './components/editor/SplitEditor';
import { LanguageSelector } from './components/editor/LanguageSelector';
import { SettingsPanel } from './components/ui/SettingsPanel';
import { ConversionInfoPanel } from './components/ConversionInfoPanel';
import { NotificationBanner } from './components/NotificationBanner';
import { ToolbarActions } from './components/ToolbarActions';
import { useConverter } from './hooks/useConverter';
import { useSettings } from './hooks/useSettings';
import { useConversion } from './hooks/useConversion';
import { ThemeProvider } from './context/ThemeContext';
import { languages, conversionPairs } from './lib/languages';
import { CiWarning } from 'react-icons/ci';
import { SAMPLES } from './lib/samples';
import { X } from 'lucide-react';

// ---- Read stored values ----
const STORAGE_KEYS = {
  input: 'transpilex-input',
  output: 'transpilex-output',
  from: 'transpilex-from',
  to: 'transpilex-to',
};

function getStoredValues() {
  return {
    input: localStorage.getItem(STORAGE_KEYS.input) || '',
    output: localStorage.getItem(STORAGE_KEYS.output) || '',
    from: localStorage.getItem(STORAGE_KEYS.from) || 'html',
    to: localStorage.getItem(STORAGE_KEYS.to) || 'jsx',
  };
}

function AppContent() {
  //  Hydrate from localStorage
  const stored = getStoredValues();

  const {
    input,
    setInput,
    output,
    setOutput,
    error,
    setError,
    from,
    setFrom,
    to,
    setTo,
    isConverting,
    convert,
    swapLanguages,
  } = useConverter({
    initialInput: stored.input,
    initialOutput: stored.output,
    initialFrom: stored.from,
    initialTo: stored.to,
  });

  const [copied, setCopied] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showConversionInfo, setShowConversionInfo] = useState(false);

  //  Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.input, input);
    localStorage.setItem(STORAGE_KEYS.output, output);
    localStorage.setItem(STORAGE_KEYS.from, from);
    localStorage.setItem(STORAGE_KEYS.to, to);
  }, [input, output, from, to]);

  //  Use settings & conversion hooks
  const { settings, updateFontFamily, updateFontSize } = useSettings();
  const {
    notification,
    setNotification,
    handleManualToChange,
    hasConverter,
    fromLabel,
    toLabel,
    availableTargets,
  } = useConversion(from, to, setTo);

  //  Track if user has manually typed
  const hasUserTyped = useRef(false);
  const isInitialMount = useRef(true);

  //  Load sample when 'from' changes (but NOT on initial mount if we have stored input)
  useEffect(() => {
    // Skip initial mount if we have stored input or user has typed
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Don't load sample if we have stored input OR if user already typed
      if (stored.input || hasUserTyped.current) return;
    }

    // If user has typed at any point, don't override their work
    if (hasUserTyped.current) return;

    if (SAMPLES[from] && !input.trim()) {
      setInput(SAMPLES[from]);
    }
  }, [from, setInput, stored.input, input]);

  //  Mark that user has typed when input changes manually
  const handleInputChange = (newValue: string) => {
    hasUserTyped.current = true;
    setInput(newValue);
  };

  //  Conversion effect
  useEffect(() => {
    const hasConverter = conversionPairs.some(p => p.source.id === from && p.target.id === to);
    if (!input.trim() || !hasConverter) {
      if (!input.trim()) {
        setOutput('');
      }
      return;
    }
    const timer = setTimeout(() => convert(input, from, to), 100);
    return () => clearTimeout(timer);
  }, [input, from, to, convert, setOutput]);

  //  Error auto‑hide
  useEffect(() => {
    if (error) {
      setShowError(true);
      if (errorTimeout) clearTimeout(errorTimeout);
      const timeout = setTimeout(() => setShowError(false), 2000);
      setErrorTimeout(timeout);
      return () => clearTimeout(timeout);
    } else {
      setShowError(false);
      if (errorTimeout) {
        clearTimeout(errorTimeout);
        setErrorTimeout(null);
      }
    }
  }, [error]);

  const handleCloseError = () => {
    setShowError(false);
    if (errorTimeout) {
      clearTimeout(errorTimeout);
      setErrorTimeout(null);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      document.body.removeChild(textarea);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const lang = languages.find(l => l.id === to);
    const ext = lang?.extension || `.${to}`;
    link.download = `output${ext}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 overflow-hidden transition-colors">
      <Header />

      <NotificationBanner notification={notification} onDismiss={() => setNotification(null)} />

      <div className="px-4 py-2 border-b border-gray-200 dark:border-[#1a1a1a] bg-gray-50 dark:bg-[#0d0d0d] flex flex-wrap items-center justify-between gap-2 transition-colors">
        <LanguageSelector
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={handleManualToChange}
          onSwap={swapLanguages}
        />

        <ToolbarActions
          copied={copied}
          onCopy={handleCopy}
          onDownload={handleDownload}
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
          showConversionInfo={showConversionInfo}
          onToggleConversionInfo={() => setShowConversionInfo(!showConversionInfo)}
          disabledCopy={!output}
          disabledDownload={!output}
        />

        {showSettings && (
          <SettingsPanel
            fontFamily={settings.fontFamily}
            fontSize={settings.fontSize}
            onFontFamilyChange={updateFontFamily}
            onFontSizeChange={updateFontSize}
            onClose={() => setShowSettings(false)}
          />
        )}

        {showConversionInfo && (
          <ConversionInfoPanel
            fromLabel={fromLabel}
            toLabel={toLabel}
            hasConverter={hasConverter}
            availableTargets={availableTargets}
            onClose={() => setShowConversionInfo(false)}
          />
        )}
      </div>

      {showError && error && (
        <div className="bg-red-50 dark:bg-red-500/10 border-b border-red-200 dark:border-red-500/20 px-4 py-2 text-red-600 dark:text-red-400 text-sm flex items-center justify-between gap-2 transition-colors">
          <div className="flex items-center gap-2">
            <CiWarning className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={handleCloseError}
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            aria-label="Close error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex-1 flex min-h-0">
        <SplitEditor
          fromValue={input}
          toValue={output}
          onFromChange={handleInputChange}
          fromLanguage={from}
          toLanguage={to}
          fromLabel="Source"
          toLabel="Output"
          toLoading={isConverting}
          fontFamily={settings.fontFamily}
          fontSize={settings.fontSize}
        />
      </div>

      <div className="h-6 min-h-[24px] border-t border-gray-200 dark:border-[#1a1a1a] px-4 flex items-center justify-between bg-gray-50 dark:bg-[#0a0a0a] text-[10px] text-gray-500 dark:text-[#444] transition-colors">
        <span>
          {from.toUpperCase()} → {to.toUpperCase()}
        </span>
        <span>{input.split('\n').length} lines</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
