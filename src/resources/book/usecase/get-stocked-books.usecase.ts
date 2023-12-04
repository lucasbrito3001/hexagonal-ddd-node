import { Book } from "../domain/book.model";
import { BookRepository } from "../persistence/repository/book.repository.port";

export class GetStockedBooksUseCase {
	constructor(private readonly stockedBookRepository: BookRepository) {}

	execute = async (title: string): Promise<Book[]> => {
		return await this.stockedBookRepository.search(title);
	};
}
