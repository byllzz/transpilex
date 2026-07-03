import { ArrowRightToLine, ArrowLeftToLine } from 'lucide-react';

//  Panel role visual config

export type PanelRole = 'input' | 'output';

export const ROLE_STYLES: Record<
  PanelRole,
  {
    text: string;
    badgeBg: string;
    headerBg: string;
    icon: typeof ArrowRightToLine;
  }
> = {
  input: {
    text: 'text-indigo-600 dark:text-indigo-300',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-400/10',
    headerBg: 'bg-gray-50 dark:bg-[#0d0d0d]',
    icon: ArrowRightToLine,
  },
  output: {
    text: 'text-emerald-600 dark:text-emerald-300',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-400/10',
    headerBg: 'bg-gray-50 dark:bg-[#0b0f0d]',
    icon: ArrowLeftToLine,
  },
};

//  Language → Monaco language ID

const LANG_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  rb: 'ruby',
  sh: 'shell',
  bash: 'shell',
  md: 'markdown',
  yml: 'yaml',
  html: 'html',
  css: 'css',
  scss: 'scss',
  json: 'json',
  graphql: 'graphql',
  sql: 'sql',
  rust: 'rust',
  go: 'go',
};

export function toMonacoLang(language: string): string {
  return LANG_MAP[language.toLowerCase()] ?? language.toLowerCase();
}

//  Tags that must never be auto-closed

export const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

//  JSX / React snippet definitions

export const JSX_SNIPPETS: Record<string, string> = {
  useState: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});',
  useEffect: 'useEffect(() => {\n\t${1}\n\treturn () => {\n\t\t${2}\n\t};\n}, [${3}]);',
  useRef: 'const ${1:ref} = useRef<${2:HTMLDivElement}>(null);',
  useCb: 'const ${1:fn} = useCallback(() => {\n\t${2}\n}, [${3}]);',
  useMemo: 'const ${1:value} = useMemo(() => ${2}, [${3}]);',
  rfc: "import { FC } from 'react';\n\ninterface ${1:Component}Props {\n\t${2}\n}\n\nconst ${1:Component}: FC<${1:Component}Props> = ({ ${3} }) => {\n\treturn (\n\t\t<div>\n\t\t\t${4}\n\t\t</div>\n\t);\n};\n\nexport default ${1:Component};",
  div: '<div className="${1}">\n\t${2}\n</div>',
  btn: '<button\n\ttype="button"\n\tclassName="${1}"\n\tonClick={${2}}\n>\n\t${3}\n</button>',
};

//  Keyboard shortcut hints shown in the status bar

export const KB_HINTS = [
  { keys: ['Ctrl', 'Shift', 'F'], label: 'Format' },
  { keys: ['Ctrl', 'F'], label: 'Find' },
  { keys: ['Alt', 'Z'], label: 'Wrap' },
  { keys: ['Ctrl', 'S'], label: 'Save' },
] as const;
