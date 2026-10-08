import { BadRequestException, Logger } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "argon2";
import "dotenv/config";

import { Prisma, PrismaClient } from "@/prisma/generated";

const adapter = new PrismaPg({
	connectionString: process.env.POSTGRES_URI,
});

const prisma = new PrismaClient({
	adapter,
	transactionOptions: {
		maxWait: 5000,
		timeout: 10000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
	},
});

async function main() {
	try {
		Logger.log("Starting to seed the database");

		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.socialLink.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.category.deleteMany(),
		]);

		const categoriesData = [
			{
				title: "Sport",
				slug: "sport",
				description:
					"For people who live for the game. Watch matches together, argue about tactics, and follow the latest scores and news with other fans. You might even find someone to train with.",
				thumbnailUrl: "categories/sport.webp",
			},
			{
				title: "Gaming",
				slug: "gaming",
				description:
					"Speedruns, first playthroughs, late-night co-op sessions, whatever you play, someone here is streaming it. Drop into chat, pick up tips, or just enjoy watching someone else suffer through a boss fight.",
				thumbnailUrl: "categories/gaming.webp",
			},
			{
				title: "Just Chatting",
				slug: "just-chatting",
				description:
					"No game, no script, just people talking. Streamers share their day, answer questions and react to whatever comes up. The easiest way to get to know a creator.",
				thumbnailUrl: "categories/just-chatting.webp",
			},
			{
				title: "Music",
				slug: "music",
				description:
					"Live sets, jam sessions and songs written on stream. Hear new artists before anyone else, request a track, or watch how a beat comes together from scratch.",
				thumbnailUrl: "categories/music.webp",
			},
			{
				title: "Programming",
				slug: "programming",
				description:
					"Watch real projects get built, bugs included. From quick side projects to full apps, developers code live, explain their thinking and take questions from chat.",
				thumbnailUrl: "categories/programming.webp",
			},
			{
				title: "Art",
				slug: "art",
				description:
					"Digital painting, sketching, 3D modeling and everything in between. Follow a piece from the first line to the final touches, and ask artists about their process as they work.",
				thumbnailUrl: "categories/art.webp",
			},
			{
				title: "Cooking",
				slug: "cooking",
				description:
					"Home cooks and chefs making real meals in real time. Pick up recipes, learn a few tricks, and see what happens when a dish doesn't go to plan.",
				thumbnailUrl: "categories/cooking.webp",
			},
			{
				title: "Travel & IRL",
				slug: "travel-irl",
				description:
					"City walks, road trips and trips to places you may never visit yourself. Streamers take you along with them and show what everyday life looks like somewhere else.",
				thumbnailUrl: "categories/travel-irl.webp",
			},
			{
				title: "Fitness",
				slug: "fitness",
				description:
					"Workouts you can follow along with at home. Trainers stream full sessions, share form tips and keep each other motivated, from beginner routines to heavy lifting.",
				thumbnailUrl: "categories/fitness.webp",
			},
			{
				title: "Science & Tech",
				slug: "science-tech",
				description:
					"Experiments, gadget teardowns and deep dives into how things work. Good for anyone curious about space, electronics or the latest tech news.",
				thumbnailUrl: "categories/science-tech.webp",
			},
			{
				title: "Education",
				slug: "education",
				description:
					"Live lessons on languages, math, history and more. Study together, ask questions in real time, and learn from people who enjoy explaining things.",
				thumbnailUrl: "categories/education.webp",
			},
			{
				title: "Esports",
				slug: "esports",
				description:
					"Tournaments, scrims and pro players at their best. Follow your favorite teams, watch the big plays live and break them down with the rest of chat.",
				thumbnailUrl: "categories/esports.webp",
			},
		];

		await prisma.category.createMany({
			data: categoriesData,
		});

		Logger.log("Categories created successfully");

		const categories = await prisma.category.findMany();

		const categoriesBySlug = Object.fromEntries(
			categories.map(category => [category.slug, category]),
		);

		const streamTitles: Record<string, string[]> = {
			sport: [
				"Watching the derby live with chat",
				"Weekend football: all the big matches",
				"NBA night: predictions and reactions",
				"Tennis final watch party",
				"Breaking down last night's highlights",
				"Transfer news and rumors roundup",
				"Fantasy league draft day",
				"Morning run and sports talk",
				"Top 10 goals of the week",
				"Match day: pre-game, live, post-game",
			],
			gaming: [
				"First playthrough, no spoilers please",
				"Trying to beat my speedrun record",
				"Co-op night with viewers",
				"Hardcore mode: one life only",
				"Exploring every corner of this map",
				"Retro games marathon",
				"Ranked grind until I rank up",
				"Indie games you've never heard of",
				"Building the ultimate base",
				"Boss rush: no healing challenge",
			],
			"just-chatting": [
				"Morning coffee and chat",
				"Answering your questions, ask me anything",
				"Reacting to your recommendations",
				"Late night talk, come hang out",
				"Storytime: the worst trip I've ever had",
				"Planning next month's streams together",
				"Reading your messages from this week",
				"Chill stream, no plans",
				"Rating your setups",
				"Q&A: how I started streaming",
			],
			music: [
				"Writing a song from scratch",
				"Acoustic covers, drop your requests",
				"Making a beat live",
				"Late night lo-fi session",
				"Guitar practice, come keep me honest",
				"Reacting to your tracks",
				"Piano improvisation",
				"DJ set: house and techno",
				"Mixing and mastering a new single",
				"Learning a new instrument day 1",
			],
			programming: [
				"Building a full-stack app from zero",
				"Fixing bugs in production (live)",
				"NestJS + GraphQL: auth from scratch",
				"Code review of your projects",
				"Learning Rust, day one",
				"Building a Discord bot",
				"Solving LeetCode problems",
				"Refactoring legacy code",
				"Deploying to a VPS with Docker",
				"Game dev in TypeScript",
			],
			art: [
				"Digital painting: fantasy landscape",
				"Drawing your characters",
				"Sketchbook session, chill vibes",
				"Character design from scratch",
				"Pixel art for a small game",
				"Sculpting in Blender",
				"Watercolor practice",
				"Speedpaint challenge: 30 minutes",
				"Redrawing my old art",
				"Making stickers for the community",
			],
			cooking: [
				"Cooking dinner with chat",
				"Trying a recipe for the first time",
				"Homemade pizza night",
				"Baking bread from scratch",
				"Budget meals for the week",
				"Street food at home",
				"Dessert day: chocolate everything",
				"Meal prep Sunday",
				"Cooking dishes from your countries",
				"Can I make it without a recipe?",
			],
			"travel-irl": [
				"Walking around the old town",
				"Road trip: day 3",
				"Exploring a local market",
				"Night walk through the city",
				"Hiking to the viewpoint",
				"Trying street food abroad",
				"Train ride across the country",
				"Visiting a hidden beach",
				"Day in my life",
				"Finding the best coffee in town",
			],
			fitness: [
				"Full body workout, follow along",
				"Leg day, no skipping",
				"30-minute morning stretch",
				"Home workout without equipment",
				"Chasing a new deadlift PR",
				"Beginner-friendly cardio",
				"Yoga for better sleep",
				"Core challenge with chat",
				"Running 10K live",
				"Answering your training questions",
			],
			"science-tech": [
				"Unboxing and testing new gadgets",
				"Taking apart an old phone",
				"Building a PC with viewers",
				"Space news this week",
				"Arduino project: smart plant pot",
				"How does a CPU actually work",
				"Testing AI tools live",
				"Home lab tour and upgrades",
				"Soldering practice",
				"Science experiments you can do at home",
			],
			education: [
				"English speaking practice",
				"Math homework help",
				"History deep dive: ancient Rome",
				"Study with me: 3-hour Pomodoro",
				"Learning Spanish together",
				"Physics explained simply",
				"Exam prep session",
				"Chemistry basics for beginners",
				"Writing an essay step by step",
				"Economics in plain words",
			],
			esports: [
				"Watching the championship final",
				"Scrims with the team",
				"Analyzing pro player replays",
				"Tournament predictions",
				"Road to the qualifiers",
				"Best plays of the season",
				"Coaching session: fixing mistakes",
				"Draft analysis and strategy",
				"Community tournament finals",
				"Live commentary with chat",
			],
		};

		const usernames = [
			"ruslan",
			"alex",
			"bella",
			"carter",
			"dylan",
			"ethan",
			"fiona",
			"grace",
			"henry",
			"isabella",
			"jackson",
			"kate",
			"liam",
			"mia",
			"noah",
			"olivia",
			"parker",
			"quinn",
			"ryan",
			"sophia",
			"tyler",
			"uma",
			"victor",
			"willow",
			"xavier",
			"yara",
			"zane",
			"luna",
			"oscar",
			"nora",
		];

		await prisma.$transaction(async tx => {
			for (const username of usernames) {
				const randomCategory =
					categoriesBySlug[
						Object.keys(categoriesBySlug)[
							Math.floor(
								Math.random() *
									Object.keys(categoriesBySlug).length,
							)
						]
					];

				const userExists = await tx.user.findUnique({
					where: {
						username,
					},
				});

				if (!userExists) {
					const createdUser = await tx.user.create({
						data: {
							email: `${username}@streamingplatform.site`,
							password: await hash("12345678"),
							username,
							displayName: username,
							avatar: `channels/${username}.webp`,
							isEmailVerified: true,
							socialLinks: {
								createMany: {
									data: [
										{
											title: "Telegram",
											url: `https://t.me/${username}`,
											position: 1,
										},
										{
											title: "YouTube",
											url: `https://youtube.com/@${username}`,
											position: 2,
										},
									],
								},
							},
							notificationSettings: {
								create: {},
							},
						},
					});

					const randomTitles = streamTitles[randomCategory.slug];

					const randomTitle =
						randomTitles[
							Math.floor(Math.random() * randomTitles.length)
						];

					await tx.stream.create({
						data: {
							title: randomTitle,
							thumbnailUrl: `streams/${createdUser.username}.webp`,
							user: {
								connect: {
									id: createdUser.id,
								},
							},
							category: {
								connect: {
									id: randomCategory.id,
								},
							},
						},
					});

					Logger.log(
						`User "${createdUser.username}" and their stream created successfully`,
					);
				}
			}
		});

		Logger.log("Database seeding completed successfully");
	} catch (error) {
		Logger.error(error);
		throw new BadRequestException("Error while seeding the database");
	} finally {
		Logger.log("Closing the database connection...");
		await prisma.$disconnect();
		Logger.log("Database connection closed successfully");
	}
}

void main();
