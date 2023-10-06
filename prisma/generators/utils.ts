import { Logger } from '@app/lib/logger';
import fs from 'fs/promises';
import * as path from 'path';
import * as prettier from 'prettier';

export async function writeFile(
  content: string,
  dir: string,
  fileName: string,
) {
  await fs.mkdir(dir, { recursive: true });
  const headline = '// GENERATED CONTENT\n// DO NOT MODIFY\n\n';
  const location = path.resolve(dir, fileName);
  const formattedContent = await prettier.format(headline + content, {
    trailingComma: 'es5',
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    useTabs: false,
    parser: 'typescript',
  });

  await fs.writeFile(location, formattedContent);
  Logger.info('Written to %s', location);
}
