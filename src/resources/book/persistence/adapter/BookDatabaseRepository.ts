import { Like, Repository } from "typeorm";
import { BookRepositoryPort } from "../port/BookRepositoryPort";
import { StockBookDTO } from "../../controller/dto/StockBookDto";
import { Book } from "../../domain/Book";

export class BookRepositoryDatabase implements BookRepositoryPort {
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
