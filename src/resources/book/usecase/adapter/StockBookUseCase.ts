import {
	StockBookDTO,
	StockBookDTOSchema,
} from "../../controller/dto/StockBookDto";
import { StockBookPort } from "../port/StockBookPort";
import { Book } from "../../domain/Book";
import { BookRepositoryPort } from "../../persistence/port/BookRepositoryPort";
import { BookError } from "../../BookResult";
import { BookFileStoragePort } from "../../persistence/port/BookFileStoragePort";

export class StockBookUseCase implements StockBookPort {
	constructor(
		private readonly bookRepository: BookRepositoryPort,
		private readonly bookFileStorage: BookFileStoragePort,
		private readonly idGenerator: () => `${string}-${string}-${string}-${string}-${string}`
	) {}

	execute = async (stockBookDTO: StockBookDTO): Promise<Book | BookError> => {
		const schemaValidation = StockBookDTOSchema.safeParse(stockBookDTO);

		if (!schemaValidation.success)
			return new BookError("INVALID_DTO", schemaValidation.error.issues);

		const duplicatedBook = await this.bookRepository.getByTitleAndEdition(
			schemaValidation.data.title,
			schemaValidation.data.edition
		);

		if (duplicatedBook !== null) return new BookError("DUPLICATED_BOOK");

		const book = Book.register(schemaValidation.data, this.idGenerator);

		await this.bookFileStorage.storeCover(book.cover);
		await this.bookRepository.save(book);

		return book;
	};
}
