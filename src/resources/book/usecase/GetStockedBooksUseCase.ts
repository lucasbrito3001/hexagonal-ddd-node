import { Book } from "../domain/Book";
import { BookRepositoryPort } from "../persistence/port/BookRepositoryPort";
import { BookError, ERRORS_DATA } from "../BookError";
import { GetStockedBooksPort } from "./adapter/GetStockBooksPort";

const { BOOK_NOT_FOUND } = ERRORS_DATA;

export class GetStockedBooksUseCase implements GetStockedBooksPort {
	constructor(private readonly bookRepository: BookRepositoryPort) {}

	execute = async (title: string): Promise<Book[]> => {
		const books = await this.bookRepository.search(title);

		if (books.length === 0)
			throw new BookError("BOOK_NOT_FOUND", BOOK_NOT_FOUND.message);

		return books;
	};
}
