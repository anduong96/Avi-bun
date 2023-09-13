import { Query, Resolver, ResolverInterface } from "type-graphql";

@Resolver()
export class HealthResolver {
  @Query(() => String)
  health(): string {
    return "ok";
  }
}
