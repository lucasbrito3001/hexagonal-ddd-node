import { StockBookDTO } from "../../controller/dto/StockBookDto";
import { Book } from "../../domain/Book";

export interface BookRepositoryPort {
	save(stockBook: StockBookDTO): Promise<void>;
	update(id: string, stockBook: StockBookDTO): Promise<void>;
	search(title: string): Promise<Book[]>;
	get(id: string): Promise<Book | null>;
	getByTitleAndEdition(title: string, edition: number): Promise<Book | null>;
}
