import type { Readable } from "stream";

export function validateFileFormat(
	filename: string,
	allowedFileFormats: string[],
) {
	const fileParts = filename.split(".");
	const extension = fileParts[fileParts.length - 1].toLowerCase();

	return allowedFileFormats.includes(extension);
}

export async function validateFileSize(
	fileStream: Readable,
	allowedFileSizeInBytes: number,
) {
	return new Promise((resolve, reject) => {
		let fileSizeInBytes = 0;

		fileStream
			.on("data", (data: string | Buffer) => {
				fileSizeInBytes += Buffer.byteLength(data);
			})
			.on("end", () => {
				resolve(fileSizeInBytes <= allowedFileSizeInBytes);
			})
			.on("error", err => {
				reject(err);
			});
	});
}
