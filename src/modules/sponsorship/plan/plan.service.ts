import {
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "@/core/prisma/prisma.service";
import type { User } from "@/prisma/generated";

import { StripeService } from "../../libs/stripe/stripe.service";

import { CreatePlanInput } from "./inputs/create-plan.input";

@Injectable()
export class PlanService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly stripeService: StripeService,
	) {}

	public async findMyPlans(user: User) {
		const plans = await this.prismaService.sponsorshipPlan.findMany({
			where: {
				channelId: user.id,
			},
		});

		return plans;
	}

	public async create(user: User, input: CreatePlanInput) {
		const { title, description, price } = input;

		const channel = await this.prismaService.user.findUnique({
			where: {
				id: user.id,
			},
		});

		if (!channel) {
			throw new NotFoundException("Channel not found");
		}
		if (!channel.isVerified) {
			throw new ForbiddenException(
				"Only verified channels can create plans",
			);
		}

		const stripePlan = await this.stripeService.plans.create({
			amount: Math.round(price * 100),
			currency: "eur",
			interval: "month",
			product: {
				name: title,
			},
		});

		const stripeProductId =
			typeof stripePlan.product === "string"
				? stripePlan.product
				: stripePlan.product?.id;

		if (!stripeProductId) {
			throw new InternalServerErrorException(
				"Failed to create Stripe product",
			);
		}

		await this.prismaService.sponsorshipPlan.create({
			data: {
				title,
				description,
				price,
				stripeProductId,
				stripePlanId: stripePlan.id,
				channel: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		return true;
	}

	public async remove(user: User, planId: string) {
		const plan = await this.prismaService.sponsorshipPlan.findUnique({
			where: {
				id: planId,
				channelId: user.id,
			},
		});

		if (!plan) {
			throw new NotFoundException("Plan not found");
		}

		await this.stripeService.plans.del(plan.stripePlanId);
		await this.stripeService.products.del(plan.stripeProductId);

		await this.prismaService.sponsorshipPlan.delete({
			where: {
				id: plan.id,
			},
		});

		return true;
	}
}
