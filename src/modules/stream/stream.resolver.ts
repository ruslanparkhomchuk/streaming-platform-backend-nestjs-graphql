import {
	Args,
	Context,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from "@nestjs/graphql";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import type { FileUpload } from "graphql-upload/processRequest.mjs";

import type { User } from "@/prisma/generated";
import { Authorization } from "@/shared/decorators/auth.decorator";
import { Authorized } from "@/shared/decorators/authorized.decorator";
import { FileValidationPipe } from "@/shared/pipes/file-validation.pipe";
import type { GqlContext } from "@/shared/types/gql-context.type";

import { ChangeStreamInfoInput } from "./inputs/change-stream-info.input";
import { FiltersInput } from "./inputs/filters.input";
import { GenerateStreamTokenInput } from "./inputs/generate-stream-token.input";
import { GenerateStreamTokenModel } from "./models/generate-token-model";
import { StreamModel } from "./models/stream.model";
import { StreamService } from "./stream.service";

@Resolver(() => StreamModel)
export class StreamResolver {
	public constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel], { name: "findAllStreams" })
	public async findAll(@Args("filters") input: FiltersInput) {
		return this.streamService.findAll(input);
	}

	@Query(() => [StreamModel], { name: "findRandomStreams" })
	public async findRandom() {
		return this.streamService.findRandom();
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "changeStreamInfo" })
	public async changeInfo(
		@Authorized() user: User,
		@Args("data") input: ChangeStreamInfoInput,
	) {
		return this.streamService.changeInfo(user, input);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "changeStreamThumbnail" })
	public async changeThumbnail(
		@Authorized() user: User,
		@Args("thumbnail", { type: () => GraphQLUpload }, FileValidationPipe)
		thumbnail: Promise<FileUpload>,
	) {
		return this.streamService.changeThumbnail(user, await thumbnail);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "removeStreamThumbnail" })
	public async removeThumbnail(@Authorized() user: User) {
		return this.streamService.removeThumbnail(user);
	}

	@ResolveField(() => String, { nullable: true })
	public streamKey(
		@Parent() stream: StreamModel,
		@Context() { req }: GqlContext,
	) {
		if (!req?.session?.userId || req.session.userId !== stream.userId) {
			return null;
		}

		return stream.streamKey;
	}

	@Mutation(() => GenerateStreamTokenModel, { name: "generateStreamToken" })
	public async generateToken(
		@Context() { req }: GqlContext,
		@Args("data") input: GenerateStreamTokenInput,
	) {
		return this.streamService.generateToken(req, input);
	}
}
