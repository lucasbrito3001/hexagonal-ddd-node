import { Bucket, UploadOptions } from "@google-cloud/storage";
import { BookFileStoragePort } from "../port/BookFileStoragePort";

export class BookCoverCloudFileStorage implements BookFileStoragePort {
	constructor(private readonly bookCoverBucket: Bucket) {}

	async storeCover(filename: string): Promise<string> {
		const uploadOptions: UploadOptions = {
			destination: filename,
		};

		const [file] = await this.bookCoverBucket.upload(
			`/${filename}`,
			uploadOptions
		);

		return file.baseUrl || "";
	}
}
