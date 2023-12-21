import { StockBookDTO } from "../../controller/dto/StockBookDto";
import { Book } from "../../domain/Book";
import { BookEntity } from "../BookEntity";

export interface BookRepositoryPort {
	save(stockBook: Book): Promise<void>;
	update(id: string, stockBook: Book): Promise<void>;
	search(title: string): Promise<BookEntity[]>;
	get(id: string): Promise<BookEntity | null>;
	searchByIds(ids: string[]): Promise<BookEntity[]>;
	getByTitleAndEdition(
		title: string,
		edition: number
	): Promise<BookEntity | null>;
}
