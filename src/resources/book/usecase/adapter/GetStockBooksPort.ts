import { Book } from "../../domain/Book";

export interface GetStockedBooksPort {
	execute(title: string): Promise<Book[]>;
}
