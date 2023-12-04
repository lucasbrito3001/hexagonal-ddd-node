import { StockBookDTO } from "../../controller/dto/stock-book.dto";
import { Book } from "../../domain/book.model";
import { BookRepository } from "./book.repository.port";

export class BookMemoryRepository implements BookRepository {
	private books: Book[] = [];

	async save(stockBookDTO: StockBookDTO): Promise<void> {
		const book = Book.register(stockBookDTO);
		this.books.push(book);
	}

	async update(id: string, stockBookDTO: StockBookDTO): Promise<void> {
		const book = Book.register(stockBookDTO);
		const index = this.books.findIndex((stock) => stock.id === id);
		this.books[index] = book;
	}

	async get(id: string): Promise<Book | null> {
		return this.books.find((stock) => stock.id === id) || null;
	}

	async getByTitleAndEdition(
		title: string,
		edition: number
	): Promise<Book | null> {
		return (
			this.books.find(
				(book) => book.title === title && book.edition === edition
			) || null
		);
	}

	async search(title: string): Promise<Book[]> {
		return this.books.filter((stock) => stock.title === title);
	}
}
