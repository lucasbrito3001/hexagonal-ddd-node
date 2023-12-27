import { BookController } from "@/resources/book/controller/BookController";
import { BookEntity } from "@/resources/book/persistence/book.entity";
import { BookCoverCloudFileStorage } from "@/resources/book/persistence/adapter/BookCloudFileStorage";
import { BookRepositoryDatabase } from "@/resources/book/persistence/adapter/BookDatabaseRepository";
import { StockBookUseCase } from "@/resources/book/usecase/adapter/StockBookUseCase";
import { Storage } from "@google-cloud/storage";
import { Router } from "express";
import { randomUUID } from "node:crypto";
import { DataSourceConnection } from "../DataSource";
import { GetStockedBooksUseCase } from "@/resources/book/usecase/adapter/GetStockedBooksUseCase";
import { Multer } from "multer";
import { FileStorage } from "../FileStorage";

export class BookRouter {
	private bookController: BookController;

	constructor(
		private router: Router,
		private dataSource: DataSourceConnection,
		private readonly uploader: Multer
	) {
		if (process.env.SVC_ACC_GCP_BUCKET === undefined)
			throw new Error("Bucket credentials is missing");

		// repository port
		const repository = this.dataSource.getRepository(BookEntity);

		// file storage port
		const fileStorageCredentials = JSON.parse(process.env.SVC_ACC_GCP_BUCKET);
		const fileStorage = new FileStorage(fileStorageCredentials);
		const bucket = fileStorage.bucket("book-covers-stock");

		// persistence adapters
		const bookRepositoryAdapter = new BookRepositoryDatabase(repository);
		const bookCloudFileStorageAdapter = new BookCoverCloudFileStorage(bucket);

		// client adapters
		const stockBookAdapter = new StockBookUseCase(
			bookRepositoryAdapter,
			bookCloudFileStorageAdapter,
			randomUUID
		);
		const getStockedBooksAdapter = new GetStockedBooksUseCase(
			bookRepositoryAdapter
		);

		this.bookController = new BookController(
			stockBookAdapter,
			getStockedBooksAdapter
		);
	}

	expose() {
		this.router.post(
			"/",
			this.uploader.single("cover"),
			this.bookController.stock
		);
		this.router.get("/", this.bookController.search);
	}
}
