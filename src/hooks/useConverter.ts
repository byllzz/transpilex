import { useState, useCallback } from 'react';
import { convertCode } from '../lib/converters';
import { formatCode } from '../lib/format';
import type { ConversionResult } from '../types';

interface UseConverterOptions {
  initialInput?: string;
  initialOutput?: string;
  initialFrom?: string;
  initialTo?: string;
}

export function useConverter(options: UseConverterOptions = {}) {
  const {
    initialInput = '',
    initialOutput = '',
    initialFrom = 'html',
    initialTo = 'jsx',
  } = options;

  const [input, setInput] = useState(initialInput);
  const [output, setOutput] = useState(initialOutput);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const convert = useCallback(async (code: string, source: string, target: string) => {
    setIsConverting(true);
    setError(null);

    try {
      const result: ConversionResult = convertCode(code, source, target);
      if (result.error) {
        setError(result.error);
        setOutput('');
      } else {
        const formatted = await formatCode(result.code, target);
        setOutput(formatted);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown conversion error');
      setOutput('');
    } finally {
      setIsConverting(false);
    }
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
    setError,
    from,
    setFrom,
    to,
    setTo,
    isConverting,
    convert,
    swapLanguages,
  };
}
