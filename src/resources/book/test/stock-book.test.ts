import { test } from "node:test";
import { equal, ok } from "node:assert";
import { StockBookDTO } from "@/resources/book/controller/dto/stock-book.dto";
import { StockBookUseCase } from "../usecase/stock-book.usecase";
import { GetStockedBooksUseCase } from "../usecase/get-stocked-books.usecase";
import { BookMemoryRepository } from "../persistence/repository/book.memory.repository";
import { Book } from "../domain/book.model";
import { INPUT_BOOK } from "./contants";

test("should stock a new book", async () => {
	const stockedBookMemoryRepository = new BookMemoryRepository();
	const stockBookUseCase = new StockBookUseCase(
		stockedBookMemoryRepository,
		() => `0-0-0-0-0`
	);
	const getStock = new GetStockedBooksUseCase(stockedBookMemoryRepository);

	const book = await stockBookUseCase.execute(INPUT_BOOK);
	const stockedBooks = await getStock.execute("Domain-Driven Design");

	ok(book instanceof Book);
	equal(stockedBooks.length, 1);
});
