import { describe, test } from "node:test";
import { ok, rejects } from "node:assert";
import { GetStockedBooksUseCase } from "../usecase/GetStockedBooksUseCase";
import { StockBookUseCase } from "../usecase/StockBookUseCase";
import { BookMemoryRepository } from "../persistence/adapter/BookMemoryRepository";
import { INPUT_BOOK } from "./contants";
import { BookError, ERRORS_DATA } from "../BookError";
import { BookLocalFileStorage } from "../persistence/adapter/BookLocalFileStorage";

const { BOOK_NOT_FOUND } = ERRORS_DATA;

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

	test("should return BOOK_NOT_FOUND error", async () => {
		const bookMemoryRepository = new BookMemoryRepository();
		const getStock = new GetStockedBooksUseCase(bookMemoryRepository);

		const usecase = async () => await getStock.execute("Domain-Driven Design");

		rejects(usecase, new BookError("BOOK_NOT_FOUND", BOOK_NOT_FOUND.message));
	});
});
