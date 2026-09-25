import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { PrismaService } from "@/core/prisma/prisma.service";

import { GqlContext } from "../types/gql-context.type";

@Injectable()
export class GqlAuthGuard implements CanActivate {
	public constructor(private readonly prismaService: PrismaService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext<GqlContext>().req;

		if (typeof request.session.userId === "undefined") {
			throw new UnauthorizedException("User is not authorized");
		}

		const user = await this.prismaService.user.findUnique({
			where: {
				id: request.session.userId,
			},
		});
		if (!user) {
			throw new UnauthorizedException("User is not authorized");
		}

		request.user = user;

		return true;
	}
}
