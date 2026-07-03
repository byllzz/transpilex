import prettier from 'prettier';
import * as prettierPluginBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import * as prettierPluginHtml from 'prettier/plugins/html';
import * as prettierPluginCss from 'prettier/plugins/postcss';

export async function formatCode(code: string, language: string): Promise<string> {
  try {
    const parserMap: Record<string, string> = {
      html: 'html',
      jsx: 'babel',
      tsx: 'babel-ts',
      css: 'css',
      scss: 'scss',
      javascript: 'babel',
      typescript: 'babel-ts',
      json: 'json',
      markdown: 'markdown',
      svg: 'html',
    };

    const parser = parserMap[language] ?? 'babel';

    if (parser === 'json') {
      return JSON.stringify(JSON.parse(code), null, 2);
    }

    return await prettier.format(code, {
      parser,
      plugins: [prettierPluginBabel, prettierPluginEstree, prettierPluginHtml, prettierPluginCss],
      semi: true,
      singleQuote: false,
      tabWidth: 2,
    });
  } catch {
    return code; // Return unformatted if formatting fails
  }
}
