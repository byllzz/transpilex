import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { SplitEditor } from './components/editor/SplitEditor';
import { LanguageSelector } from './components/editor/LanguageSelector';
import { Button } from './components/ui/Button';
import { ThemeSwitcher } from './components/ui/ThemeSwitcher';
import { useConverter } from './hooks/useConverter';
import { Copy, Check, Download } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const {
    input,
    setInput,
    output,
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

  useEffect(() => {
    if (!input.trim()) return;
    const timer = setTimeout(() => convert(input, from, to), 400);
    return () => clearTimeout(timer);
  }, [input, from, to, convert]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `output.${to === 'tsx' || to === 'jsx' ? to : to === 'javascript' ? 'js' : to === 'typescript' ? 'ts' : to}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 overflow-hidden transition-colors">
      <Header>
        <ThemeSwitcher />
      </Header>

      <div className="px-4 py-2 border-b border-gray-200 dark:border-[#1a1a1a] bg-gray-50 dark:bg-[#0d0d0d] flex flex-wrap items-center justify-between gap-2 transition-colors">
        <LanguageSelector
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          onSwap={swapLanguages}
        />
        <div className="flex items-center gap-1">
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
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border-b border-red-200 dark:border-red-500/20 px-4 py-2 text-red-600 dark:text-red-400 text-sm flex items-center gap-2 transition-colors">
          <span>⚠️</span> {error}
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
          toLoading={isConverting} // 👈 Show spinner in output while converting
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
