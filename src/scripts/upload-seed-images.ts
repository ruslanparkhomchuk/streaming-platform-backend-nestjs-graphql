import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const client = new S3Client({
	endpoint: process.env.S3_ENDPOINT,
	region: process.env.S3_REGION,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID!,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
	},
});

const ROOT = "seed-images";
const FOLDERS = ["categories", "channels", "streams"];

async function main() {
	let count = 0;

	for (const folder of FOLDERS) {
		for (const file of readdirSync(join(ROOT, folder))) {
			await client.send(
				new PutObjectCommand({
					Bucket: process.env.S3_BUCKET_NAME,
					Key: `${folder}/${file}`,
					Body: readFileSync(join(ROOT, folder, file)),
					ContentType: "image/webp",
				}),
			);

			console.log(`Uploaded ${folder}/${file}`);
			count++;
		}
	}

	console.log(`Done: ${count} files`);
}

void main();
