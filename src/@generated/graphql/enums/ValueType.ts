import { registerEnumType } from 'type-graphql'

export enum GQL_ValueType {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN'
}
registerEnumType(GQL_ValueType, {
    name: 'ValueType',
})
