import { describe, test } from "node:test";
import { deepEqual, ok } from "node:assert";
import { GetStockedBooksUseCase } from "../usecase/adapter/GetStockedBooksUseCase";
import { StockBookUseCase } from "../usecase/adapter/StockBookUseCase";
import { BookMemoryRepository } from "../persistence/adapter/BookMemoryRepository";
import { INPUT_BOOK } from "./contants";
import { BookError } from "../BookResult";
import { BookLocalFileStorage } from "../persistence/adapter/BookLocalFileStorage";

describe("GetStockedBooksUseCase", () => {
	test("should get stocked books", async () => {
		const bookMemoryRepository = new BookMemoryRepository();
		const bookLocalFileStorage = new BookLocalFileStorage();
		const register = new StockBookUseCase(
			bookMemoryRepository,
			bookLocalFileStorage,
			() => `0-0-0-0-0`
		);
		const getStock = new GetStockedBooksUseCase(bookMemoryRepository);

		await register.execute(INPUT_BOOK);
		const stockedBooks = await getStock.execute("Domain-Driven Design");

		ok(Array.isArray(stockedBooks) && stockedBooks.length === 1);
	});

	test("should return INVALID_TITLE error", async () => {
		const bookMemoryRepository = new BookMemoryRepository();
		const getStock = new GetStockedBooksUseCase(bookMemoryRepository);

		const booksOrError = await getStock.execute(undefined as unknown as string);

		deepEqual(booksOrError, new BookError("INVALID_TITLE"));
	});

	test("should return BOOK_NOT_FOUND error", async () => {
		const bookMemoryRepository = new BookMemoryRepository();
		const getStock = new GetStockedBooksUseCase(bookMemoryRepository);

		const booksOrError = await getStock.execute("Domain-Driven Design");

		deepEqual(booksOrError, new BookError("BOOK_NOT_FOUND"));
	});
});
