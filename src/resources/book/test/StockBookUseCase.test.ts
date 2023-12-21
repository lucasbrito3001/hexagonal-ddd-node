import { beforeEach, describe, test } from "node:test";
import { deepEqual, ok } from "node:assert";
import { StockBookUseCase } from "../usecase/adapter/StockBookUseCase";
import { GetStockedBooksUseCase } from "../usecase/adapter/GetStockedBooksUseCase";
import { BookMemoryRepository } from "../persistence/adapter/BookMemoryRepository";
import { Book } from "../domain/Book";
import { INPUT_BOOK } from "./contants";
import { StockBookDTO } from "../controller/dto/StockBookDto";
import { BookError } from "../BookResult";
import { BookLocalFileStorage } from "../persistence/adapter/BookLocalFileStorage";

describe("StockBookUseCase", () => {
	let stockBookUseCase: StockBookUseCase;
	let getStockBookUseCase: GetStockedBooksUseCase;
	let bookMemoryRepository: BookMemoryRepository;

	beforeEach(() => {
		bookMemoryRepository = new BookMemoryRepository();
		const bookLocalFileStorage = new BookLocalFileStorage();

		stockBookUseCase = new StockBookUseCase(
			bookMemoryRepository,
			bookLocalFileStorage,
			() => `0-0-0-0-0`
		);

		getStockBookUseCase = new GetStockedBooksUseCase(bookMemoryRepository);
	});

	test("should stock a new book successfully", async () => {
		const book = await stockBookUseCase.execute(INPUT_BOOK);
		const stockedBooks = await getStockBookUseCase.execute(
			"Domain-Driven Design"
		);

		ok(book instanceof Book);
		ok(Array.isArray(stockedBooks) && stockedBooks.length === 1);
	});

	test("should return INVALID_DTO error", async () => {
		const { title, ...INVALID_BOOK_DTO } = INPUT_BOOK;

		const bookOrError = await stockBookUseCase.execute(
			INVALID_BOOK_DTO as StockBookDTO
		);

		deepEqual(bookOrError, new BookError("INVALID_DTO"));
	});

	test("should return DUPLICATED_BOOK error", async () => {
		await bookMemoryRepository.save(INPUT_BOOK);

		const bookOrError = await stockBookUseCase.execute(INPUT_BOOK);

		deepEqual(bookOrError, new BookError("DUPLICATED_BOOK"));
	});
});
