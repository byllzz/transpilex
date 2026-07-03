import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { SplitEditor } from './components/editor/SplitEditor';
import { LanguageSelector } from './components/editor/LanguageSelector';
import { Button } from './components/ui/Button';
import { SettingsPanel } from './components/ui/SettingsPanel';
import { useConverter } from './hooks/useConverter';
import { Copy, Check, Download, X, Settings } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { languages } from './lib/languages';
import { CiWarning } from 'react-icons/ci';

// Default settings
const DEFAULT_SETTINGS = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 13,
};

function AppContent() {
  const {
    input,
    setInput,
    output,
    setOutput,
    error,
    from,
    setFrom,
    to,
    setTo,
    isConverting,
    convert,
    swapLanguages,
  } = useConverter();

  const [copied, setCopied] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Load settings from localStorage
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('editor-settings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('editor-settings', JSON.stringify(settings));
  }, [settings]);

  const updateFontFamily = (family: string) => {
    setSettings(prev => ({ ...prev, fontFamily: family }));
  };

  const updateFontSize = (size: number) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
  };

  // Conversion
  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    const timer = setTimeout(() => convert(input, from, to), 100);
    return () => clearTimeout(timer);
  }, [input, from, to, convert, setOutput]);

  // Error auto‑hide
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
      {/* <-- ThemeSwitcher removed; now inside SettingsPanel */}

      <div className="px-4 py-2 border-b border-gray-200 dark:border-[#1a1a1a] bg-gray-50 dark:bg-[#0d0d0d] flex flex-wrap items-center justify-between gap-2 transition-colors">
        <LanguageSelector
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          onSwap={swapLanguages}
        />

        <div className="flex items-center gap-1 relative">
          <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload} disabled={!output}>
            <Download className="w-3.5 h-3.5" />
            Download
          </Button>

          {/* Settings button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className={showSettings ? 'bg-gray-200 dark:bg-white/10' : ''}
          >
            <Settings className="w-3.5 h-3.5" />
          </Button>

          {/* Settings panel */}
          {showSettings && (
            <SettingsPanel
              fontFamily={settings.fontFamily}
              fontSize={settings.fontSize}
              onFontFamilyChange={updateFontFamily}
              onFontSizeChange={updateFontSize}
              onClose={() => setShowSettings(false)}
            />
          )}
        </div>
      </div>

      {/* Error banner */}
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
          onFromChange={setInput}
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
