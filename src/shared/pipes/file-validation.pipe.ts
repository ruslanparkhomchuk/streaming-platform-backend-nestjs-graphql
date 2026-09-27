import {
	BadRequestException,
	Injectable,
	type PipeTransform,
} from "@nestjs/common";
import type { FileUpload } from "graphql-upload/processRequest.mjs";

import { validateFileFormat, validateFileSize } from "../utils/file.util";

@Injectable()
export class FileValidationPipe implements PipeTransform {
	public async transform(value: Promise<FileUpload>) {
		const file = await value;

		if (!file.filename) {
			throw new BadRequestException("No file uploaded");
		}

		const { filename, createReadStream } = file;

		const fileStream = createReadStream();

		const allowedFormats = ["jpg", "jpeg", "png", "webp", "gif"];
		const isFileFormatValid = validateFileFormat(filename, allowedFormats);

		if (!isFileFormatValid) {
			throw new BadRequestException("Unsupported file format");
		}

		const isFileSizeValid = await validateFileSize(
			fileStream,
			10 * 1024 * 1024,
		);

		if (!isFileSizeValid) {
			throw new BadRequestException("File size exceeds 10 MB");
		}

		return value;
	}
}
