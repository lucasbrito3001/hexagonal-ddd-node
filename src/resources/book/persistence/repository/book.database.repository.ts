import { Like, Repository } from "typeorm";
import { BookRepository } from "./book.repository.port";
import { StockBookDTO } from "../../controller/dto/stock-book.dto";
import { Book } from "../../domain/book.model";

export class BookDatabaseRepository implements BookRepository {
	constructor(private readonly bookRepository: Repository<Book>) {}

	async save(stockBookDTO: StockBookDTO): Promise<void> {
		await this.bookRepository.insert(stockBookDTO);
	}

	async update(id: string, stockBookDTO: StockBookDTO): Promise<void> {
		await this.bookRepository.update(id, stockBookDTO);
	}

	async get(id: string): Promise<Book | null> {
		return await this.bookRepository.findOne({
			where: { id },
		});
	}

	async getByTitleAndEdition(
		title: string,
		edition: number
	): Promise<Book | null> {
		return await this.bookRepository.findOne({
			where: { title, edition },
		});
	}

	async search(title: string): Promise<Book[]> {
		return await this.bookRepository.findBy({ title: Like(`%${title}%`) });
	}
}
