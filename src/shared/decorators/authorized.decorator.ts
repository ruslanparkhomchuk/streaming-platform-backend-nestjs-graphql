import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request } from "express";

import type { User } from "@/prisma/generated";

import type { GqlContext } from "../types/gql-context.type";

export const Authorized = createParamDecorator(
	(data: keyof User | undefined, ctx: ExecutionContext) => {
		let user: User | undefined;

		if (ctx.getType() === "http") {
			user = ctx.switchToHttp().getRequest<Request>().user;
		} else {
			const context = GqlExecutionContext.create(ctx);
			user = context.getContext<GqlContext>().req.user;
		}

		return data ? user?.[data] : user;
	},
);
