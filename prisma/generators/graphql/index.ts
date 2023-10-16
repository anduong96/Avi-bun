#!/usr/bin/env node

import { generatorHandler } from '@prisma/generator-helper';

import { writeEnums } from './write.enums';

generatorHandler({
  async onGenerate(options) {
    const enumList = options.dmmf.datamodel.enums;
    const output = options.generator.output?.value;

    if (output) {
      await writeEnums(enumList, output);
    }
  },
  onManifest() {
    return {
      defaultOutput: './types',
      prettyName: 'Prisma Gql Generator',
    };
  },
});
