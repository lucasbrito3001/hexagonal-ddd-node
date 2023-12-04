import { StockBookDTO } from "../../controller/dto/stock-book.dto";
import { Book } from "../../domain/book.model";

export interface BookRepository {
	save(stockBook: StockBookDTO): Promise<void>;
	update(id: string, stockBook: StockBookDTO): Promise<void>;
	search(title: string): Promise<Book[]>;
	get(id: string): Promise<Book | null>;
	getByTitleAndEdition(title: string, edition: number): Promise<Book | null>;
}
