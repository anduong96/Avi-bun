import fs from 'fs/promises';
import * as path from 'path';
import * as prettier from 'prettier';

import { Logger } from '@app/lib/logger';

export async function writeFile(
  content: string,
  dir: string,
  fileName: string,
) {
  await fs.mkdir(dir, { recursive: true });
  const headline = '// GENERATED CONTENT\n// DO NOT MODIFY\n\n';
  const location = path.resolve(dir, fileName);
  const formattedContent = await prettier.format(headline + content, {
    parser: 'typescript',
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    useTabs: false,
  });

  await fs.writeFile(location, formattedContent);
  Logger.info('Written to %s', location);
}
