import { StockBookDTO } from "@/resources/book/controller/dto/stock-book.dto";
import { Book } from "../domain/book.model";
import { BookError } from "../errors";
import { UnexpectedError } from "@/resources/error";

export interface StockBookPort {
	execute(
		stockBookDTO: StockBookDTO
	): Promise<Book | BookError | UnexpectedError>;
}
