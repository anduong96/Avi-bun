import { Field, ObjectType, registerEnumType } from 'type-graphql';

import { ArrayElement } from '@app/types/common';
import { getTsaAirportCheckpointsStatus } from '@app/services/airports/get.tsa.wait.time';

type CheckPointTerminal = Exclude<
  ArrayElement<Awaited<ReturnType<typeof getTsaAirportCheckpointsStatus>>>,
  undefined
>;

type CheckPoint = CheckPointTerminal['checkpoints'][number];
type CheckPointHour = CheckPoint['hours'][number];

enum CheckPointStatus {
  CLOSE = 'close',
  OPEN = 'open',
}

registerEnumType(CheckPointStatus, {
  name: 'CheckPointStatus',
});

@ObjectType('AirportTsaCheckPointHour')
export class GQL_AirportTsaCheckPointHour implements CheckPointHour {
  @Field()
  hour: number;

  @Field(() => CheckPointStatus)
  status: CheckPointStatus;
}

@ObjectType('AirportTsaCheckPoints')
export class GQL_AirportTsaCheckPoints implements CheckPoint {
  @Field()
  checkPointName: string;

  @Field(() => [GQL_AirportTsaCheckPointHour])
  hours: GQL_AirportTsaCheckPointHour[];
}

@ObjectType('AirportTsaCheckPointTerminal')
export class GQL_AirportTsaCheckPointTerminal implements CheckPointTerminal {
  @Field(() => [GQL_AirportTsaCheckPoints])
  checkpoints: GQL_AirportTsaCheckPoints[];

  @Field()
  terminalName: string;
}
