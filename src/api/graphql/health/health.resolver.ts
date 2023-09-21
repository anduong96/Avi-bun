import { Authorized, Query, Resolver } from 'type-graphql';

@Resolver()
export class HealthResolver {
  @Authorized()
  @Query(() => String)
  health(): string {
    return 'ok';
  }
}
