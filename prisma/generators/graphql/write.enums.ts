import { flatten } from 'lodash';
import { DMMF } from '@prisma/client/runtime/library';

import { writeFile } from '../utils';

const prefix = 'GQL_';

export async function writeEnums(enums: DMMF.DatamodelEnum[], output: string) {
  await Promise.all([
    generateEnumDef(enums, output),
    generateEnumGqlRegister(enums, output),
  ]);
}

async function generateEnumGqlRegister(
  enums: DMMF.DatamodelEnum[],
  output: string,
) {
  const content = flatten(
    enums.map(item => [
      `export enum ${prefix + item.name} {`,
      item.values.map(value => `${value.name}='${value.name}'`),
      `};\n\n`,
    ]),
  );

  await writeFile(content.join('\n'), output, 'gql.enums.ts');
}

export async function generateEnumDef(
  enums: DMMF.DatamodelEnum[],
  output: string,
) {
  const content = enums.map(
    item =>
      `registerEnumType(${prefix + item.name}, { name: '${item.name}' });`,
  );

  content.unshift(
    `import { ${enums
      .map(e => prefix + e.name)
      .join(', ')} } from './gql.enums';`,
  );

  content.unshift("import { registerEnumType } from '@nestjs/graphql'");
  content.push('export default null\n');
  await writeFile(content.join('\n'), output, 'register.gql.enum.ts');
}
