import { test } from "node:test";
import { strictEqual, equal, deepEqual, ok } from "node:assert";
import { GetStockedBooksUseCase } from "../usecase/get-stocked-books.usecase";
import { StockBookUseCase } from "../usecase/stock-book.usecase";
import { StockBookDTO } from "../controller/dto/stock-book.dto";
import { BookMemoryRepository } from "../persistence/repository/book.memory.repository";
import { Book } from "../domain/book.model";
import { INPUT_BOOK } from "./contants";

test("should get stocked books", async () => {
	const stockedBookMemoryRepository = new BookMemoryRepository();
	const register = new StockBookUseCase(
		stockedBookMemoryRepository,
		() => `0-0-0-0-0`
	);
	const getStock = new GetStockedBooksUseCase(stockedBookMemoryRepository);

	await register.execute(INPUT_BOOK);
	const stockedBooks = await getStock.execute("Domain-Driven Design");

	strictEqual(stockedBooks.length, 1);
	ok(stockedBooks[0] instanceof Book);
});
