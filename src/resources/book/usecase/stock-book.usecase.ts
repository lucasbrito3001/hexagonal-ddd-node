import {
	StockBookDTO,
	StockBookDTOSchema,
} from "../controller/dto/stock-book.dto";
import { StockBookPort } from "../port/stock-book.port";
import { Book } from "../domain/book.model";
import { BookRepository } from "../persistence/repository/book.repository.port";
import { BookError, ERRORS_DATA } from "../errors";
import { UnexpectedError } from "@/resources/error";

const { DUPLICATED_BOOK, INVALID_DTO } = ERRORS_DATA;

export class StockBookUseCase implements StockBookPort {
	constructor(
		private readonly stockedBookRepository: BookRepository,
		private readonly idGenerator: () => `${string}-${string}-${string}-${string}-${string}`
	) {}

	execute = async (stockBookDTO: StockBookDTO): Promise<Book | BookError | UnexpectedError> => {
		try {
			const schemaValidation = StockBookDTOSchema.safeParse(stockBookDTO);

			if (!schemaValidation)
				throw new BookError("INVALID_DTO", INVALID_DTO.message);

			const duplicatedBook = this.stockedBookRepository.getByTitleAndEdition(
				stockBookDTO.title,
				stockBookDTO.edition
			);

			if (!duplicatedBook)
				throw new BookError("DUPLICATED_BOOK", DUPLICATED_BOOK.message);

			const book = Book.register(stockBookDTO, this.idGenerator);

			await this.stockedBookRepository.save(book);

			return book;
		} catch (error) {
			if (error instanceof BookError) {
				return error;
			}

			return new UnexpectedError();
		}
	};
}
