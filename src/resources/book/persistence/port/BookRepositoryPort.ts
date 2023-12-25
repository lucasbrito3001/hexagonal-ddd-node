import { Book } from "../../domain/Book";
import { BookEntity } from "../book.entity";

export interface BookRepositoryPort {
	save(book: Book): Promise<void>;
	update(id: string, book: Book): Promise<void>;
	search(title: string): Promise<BookEntity[]>;
	get(id: string): Promise<BookEntity | null>;
	searchByIds(ids: string[]): Promise<BookEntity[]>;
	getByTitleAndEdition(
		title: string,
		edition: number
	): Promise<BookEntity | null>;
}
