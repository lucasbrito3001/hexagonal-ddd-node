import { ReqBody } from "@/application/decorators/reqBody.decorator";
import { StockBookPort } from "../usecase/port/StockBookPort";
import { StockBookDTO } from "./dto/StockBookDto";
import { BookError } from "../BookResult";
import { UnexpectedError } from "@/resources/error";
import { Book } from "../domain/Book";

export class BookController {
	constructor(private readonly stockBookUseCase: StockBookPort) {}

	async stock(
		@ReqBody() stockBookDTO: StockBookDTO
	): Promise<Book | BookError | UnexpectedError> {
		try {
			const book = await this.stockBookUseCase.execute(stockBookDTO);
			return book;
		} catch (error) {
			if (error instanceof BookError) {
				return error;
			}

			return new UnexpectedError();
		}
	}
}
