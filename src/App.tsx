import { useState, useCallback, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { CodePanel } from './components/editor/CodePanel';
import { LanguageSelector } from './components/editor/LanguageSelector';
import { Button } from './components/ui/Button';
import { useConverter } from './hooks/useConverter';
import { Copy, Check, Download } from 'lucide-react';

function App() {
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

  // Auto-convert on changes with debounce
  useEffect(() => {
    if (!input.trim()) {
      return;
    }
    const timer = setTimeout(() => convert(input, from, to), 400);
    return () => clearTimeout(timer);
  }, [input, from, to]);

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
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-[#e0e0e0] overflow-hidden">
      <Header />

      {/* Language selector */}
      <div className="px-4 py-2 border-b border-[#1a1a1a] bg-[#0d0d0d] flex items-center justify-between">
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
              <Check className="w-3.5 h-3.5 text-green-400" />
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

      {/* Editor panels */}
      <div className="flex-1 flex min-h-0">
        <CodePanel value={input} onChange={setInput} language={from} label="Source" />
        <CodePanel
          value={error ? `Error: ${error}` : output}
          language={to}
          label={isConverting ? 'Converting...' : 'Output'}
          readOnly
        />
      </div>

      {/* Status bar */}
      <div className="h-6 min-h-[24px] border-t border-[#1a1a1a] px-4 flex items-center justify-between bg-[#0a0a0a] text-[10px] text-[#444]">
        <span>
          {from.toUpperCase()} → {to.toUpperCase()}
        </span>
        <span>{input.split('\n').length} lines</span>
      </div>
    </div>
  );
}

export default App;
