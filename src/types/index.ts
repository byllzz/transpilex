export interface Language {
  id: string;
  label: string;
  extension: string;
  monacoLanguage: string;
}

export interface ConversionPair {
  id: string;
  source: Language;
  target: Language;
}

export interface ConversionResult {
  code: string;
  error: string | null;
}
