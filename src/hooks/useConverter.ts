import { useState, useCallback } from 'react';
import { convertCode } from '../lib/converters';
import { formatCode } from '../lib/format';
import type { ConversionResult } from '../types';

export function useConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState('html');
  const [to, setTo] = useState('jsx');
  const [isConverting, setIsConverting] = useState(false);

  const convert = useCallback(async (code: string, source: string, target: string) => {
    setIsConverting(true);
    setError(null);

    const result: ConversionResult = convertCode(code, source, target);

    if (result.error) {
      setError(result.error);
      setOutput('');
      setIsConverting(false);
      return;
    }

    const formatted = await formatCode(result.code, target);
    setOutput(formatted);
    setIsConverting(false);
  }, []);

  const swapLanguages = useCallback(() => {
    setFrom(to);
    setTo(from);
    setInput(output);
    setOutput('');
  }, [from, to, output]);

  return {
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
  };
}
