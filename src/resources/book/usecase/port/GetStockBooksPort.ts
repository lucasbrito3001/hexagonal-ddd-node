import { BookError } from "../../BookResult";
import { Book } from "../../domain/Book";

export interface GetStockedBooksPort {
	execute(title: string): Promise<Book[] | BookError>;
}
