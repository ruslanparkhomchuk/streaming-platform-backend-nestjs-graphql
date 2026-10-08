import { type ExecutionContext, Injectable } from "@nestjs/common";
import { type GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { ThrottlerGuard } from "@nestjs/throttler";
import type { Request, Response } from "express";

import type { GqlContext } from "../types/gql-context.type";

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
	protected getRequestResponse(context: ExecutionContext): {
		req: Request;
		res: Response;
	} {
		if (context.getType<GqlContextType>() === "graphql") {
			const ctx =
				GqlExecutionContext.create(context).getContext<GqlContext>();

			return { req: ctx.req, res: ctx.res };
		}

		const http = context.switchToHttp();

		return {
			req: http.getRequest<Request>(),
			res: http.getResponse<Response>(),
		};
	}

	protected getTracker(req: Request): Promise<string> {
		const cfIp = req.headers["cf-connecting-ip"];

		return Promise.resolve(
			(Array.isArray(cfIp) ? cfIp[0] : cfIp) ?? req.ip ?? "",
		);
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const type = context.getType<GqlContextType>();

		if (type === "graphql") {
			const ctx =
				GqlExecutionContext.create(context).getContext<
					Partial<GqlContext>
				>();

			if (!ctx.req) return true;
		} else if (type !== "http") {
			return true;
		}

		return super.canActivate(context);
	}
}
