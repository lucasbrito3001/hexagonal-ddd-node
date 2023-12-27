import { Book } from "../../domain/Book";
import { BookRepositoryPort } from "../../persistence/port/BookRepositoryPort";
import { BookError } from "../../BookResult";
import { GetStockedBooksPort } from "../port/GetStockedBooksPort";

export class GetStockedBooksUseCase implements GetStockedBooksPort {
	constructor(private readonly bookRepository: BookRepositoryPort) {}

	execute = async (title: string): Promise<Book[] | BookError> => {
		if (!title) return new BookError("INVALID_TITLE");

		const bookEntities = await this.bookRepository.search(title);

		if (bookEntities.length === 0) return new BookError("BOOK_NOT_FOUND");

		const books = bookEntities.map(
			(book) =>
				new Book(
					book.id as string,
					book.title as string,
					book.edition as number,
					book.author as string,
					book.release as string,
					book.cover as string,
					book.quantity as number,
					book.isVisible as boolean
				)
		);

		return books;
	};
}
