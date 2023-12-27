import { Bucket, UploadOptions } from "@google-cloud/storage";
import { BookFileStoragePort } from "../port/BookFileStoragePort";
import {
	FileStorageBucket,
	FileStorageBucketOptions,
} from "@/application/FileStorage";

export class BookCoverCloudFileStorage implements BookFileStoragePort {
	constructor(private readonly bookCoverBucket: FileStorageBucket) {}

	async storeCover(filename: string): Promise<string> {
		const uploadOptions: FileStorageBucketOptions = {
			destination: filename,
		};

		const [file] = await this.bookCoverBucket.upload(
			`/tmp/uploads/${filename}`,
			uploadOptions
		);

		return file.baseUrl || "";
	}
}
