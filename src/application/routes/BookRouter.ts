import { BookController } from "@/resources/book/controller/BookController";
import { BookEntity } from "@/resources/book/persistence/book.entity";
import { BookCoverCloudFileStorage } from "@/resources/book/persistence/adapter/BookCloudFileStorage";
import { BookRepositoryDatabase } from "@/resources/book/persistence/adapter/BookDatabaseRepository";
import { StockBookUseCase } from "@/resources/book/usecase/adapter/StockBookUseCase";
import { Storage } from "@google-cloud/storage";
import { Router } from "express";
import { randomUUID } from "node:crypto";
import { DataSource } from "typeorm";

export class BookRouter {
	private bookController: BookController;

	constructor(private router: Router, private dataSource: DataSource) {
		// persistence port
		const repository = dataSource.getRepository(BookEntity);
		const bucket = new Storage().bucket("book-covers-stock");

		// persistence adapters
		const bookRepositoryAdapter = new BookRepositoryDatabase(repository);
		const bookCloudFileStorageAdapter = new BookCoverCloudFileStorage(bucket);

		// client adapters
		const stockBookAdapter = new StockBookUseCase(
			bookRepositoryAdapter,
			bookCloudFileStorageAdapter,
			randomUUID
		);

		this.bookController = new BookController(stockBookAdapter);
	}

	expose() {
		this.router.post("/", this.bookController.stock);
		this.router.get("/", this.bookController.search);
	}
}
