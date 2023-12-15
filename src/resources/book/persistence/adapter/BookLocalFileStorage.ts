import { mkdtempSync, renameSync, rmSync } from "fs";
import { BookFileStoragePort } from "../port/BookFileStoragePort";
import { join } from "path";
import { tmpdir } from "os";

export class BookLocalFileStorage implements BookFileStoragePort {
	async storeCover(filename: string): Promise<string> {
		return filename;
	}
}
