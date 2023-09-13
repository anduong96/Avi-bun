import { registerEnumType } from 'type-graphql'

export enum GQL_AlertChannel {
  PUSH = 'PUSH'
}
registerEnumType(GQL_AlertChannel, {
    name: 'AlertChannel',
})
