import {
	StockBookDTO,
	StockBookDTOSchema,
} from "../controller/dto/StockBookDto";
import { StockBookPort } from "./adapter/StockBookPort";
import { Book } from "../domain/Book";
import { BookRepositoryPort } from "../persistence/port/BookRepositoryPort";
import { BookError, ERRORS_DATA } from "../BookError";
import { BookFileStoragePort } from "../persistence/port/BookFileStoragePort";

const { DUPLICATED_BOOK, INVALID_DTO } = ERRORS_DATA;

export class StockBookUseCase implements StockBookPort {
	constructor(
		private readonly bookRepository: BookRepositoryPort,
		private readonly bookFileStorage: BookFileStoragePort,
		private readonly idGenerator: () => `${string}-${string}-${string}-${string}-${string}`
	) {}

	execute = async (stockBookDTO: StockBookDTO): Promise<Book> => {
		const schemaValidation = StockBookDTOSchema.safeParse(stockBookDTO);

		if (!schemaValidation.success)
			throw new BookError("INVALID_DTO", INVALID_DTO.message);

		const duplicatedBook = await this.bookRepository.getByTitleAndEdition(
			schemaValidation.data.title,
			schemaValidation.data.edition
		);

		if (duplicatedBook !== null)
			throw new BookError("DUPLICATED_BOOK", DUPLICATED_BOOK.message);

		const book = Book.register(schemaValidation.data, this.idGenerator);

		await this.bookFileStorage.storeCover(book.cover);
		await this.bookRepository.save(book);

		return book;
	};
}
