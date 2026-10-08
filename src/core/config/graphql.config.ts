import type { ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

import type { GqlContext } from "@/shared/types/gql-context.type";
import { isDev } from "@/shared/utils/is-dev.util";

export function getGraphQLConfig(
	configService: ConfigService,
): ApolloDriverConfig {
	return {
		playground: isDev(configService),
		path: configService.getOrThrow<string>("GRAPHQL_PREFIX"),
		autoSchemaFile: isDev(configService)
			? join(process.cwd(), "src/core/graphql/schema.gql")
			: true,
		sortSchema: true,
		context: ({ req, res }: GqlContext) => ({ req, res }),
		installSubscriptionHandlers: true,
		introspection: true,
	};
}
