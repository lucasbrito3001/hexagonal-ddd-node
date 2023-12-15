import { beforeEach, describe, test } from "node:test";
import { ok, rejects, throws } from "node:assert";
import { StockBookUseCase } from "../usecase/StockBookUseCase";
import { GetStockedBooksUseCase } from "../usecase/GetStockedBooksUseCase";
import { BookMemoryRepository } from "../persistence/adapter/BookMemoryRepository";
import { Book } from "../domain/Book";
import { INPUT_BOOK } from "./contants";
import { StockBookDTO } from "../controller/dto/StockBookDto";
import { BookError, ERRORS_DATA } from "../BookError";
import { BookLocalFileStorage } from "../persistence/adapter/BookLocalFileStorage";

const { INVALID_DTO, DUPLICATED_BOOK } = ERRORS_DATA;

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

	test("should return INVALID_DTO error", () => {
		const { title, ...INVALID_BOOK_DTO } = INPUT_BOOK;

		const usecase = async () =>
			await stockBookUseCase.execute(INVALID_BOOK_DTO as StockBookDTO);

		rejects(usecase, new BookError("INVALID_DTO", INVALID_DTO.message));
	});

	test("should return DUPLICATED_BOOK error", async () => {
		await bookMemoryRepository.save(INPUT_BOOK);

		const usecase = async () => await stockBookUseCase.execute(INPUT_BOOK);

		rejects(usecase, new BookError("DUPLICATED_BOOK", DUPLICATED_BOOK.message));
	});
});
