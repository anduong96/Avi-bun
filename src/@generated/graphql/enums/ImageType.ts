import { registerEnumType } from 'type-graphql'

export enum GQL_ImageType {
  SVG = 'SVG',
  PNG = 'PNG'
}
registerEnumType(GQL_ImageType, {
    name: 'ImageType',
})
