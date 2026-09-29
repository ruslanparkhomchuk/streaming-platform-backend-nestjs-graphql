import "dotenv/config";
import { IngressClient } from "livekit-server-sdk";

const client = new IngressClient(
	process.env.LIVEKIT_API_URL!,
	process.env.LIVEKIT_API_KEY,
	process.env.LIVEKIT_API_SECRET,
);

async function main() {
	const ingresses = await client.listIngress();

	let deleted = 0;

	for (const ingress of ingresses) {
		if (!ingress.ingressId) {
			continue;
		}

		console.log(
			`Deleting ${ingress.ingressId} (room: ${ingress.roomName})`,
		);
		await client.deleteIngress(ingress.ingressId);
		deleted++;
	}

	console.log(`Deleted ${deleted} ingress(es)`);
}

void main();
