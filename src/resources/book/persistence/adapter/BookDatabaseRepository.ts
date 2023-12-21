import { In, Like, Repository } from "typeorm";
import { BookRepositoryPort } from "../port/BookRepositoryPort";
import { StockBookDTO } from "../../controller/dto/StockBookDto";
import { BookEntity } from "../BookEntity";

export class BookRepositoryDatabase implements BookRepositoryPort {
	constructor(private readonly bookRepository: Repository<BookEntity>) {}

	async save(stockBookDTO: StockBookDTO): Promise<void> {
		await this.bookRepository.insert(stockBookDTO);
	}

	async update(id: string, stockBookDTO: StockBookDTO): Promise<void> {
		await this.bookRepository.update(id, stockBookDTO);
	}

	async get(id: string): Promise<BookEntity | null> {
		return await this.bookRepository.findOne({
			where: { id },
		});
	}

	async getByTitleAndEdition(
		title: string,
		edition: number
	): Promise<BookEntity | null> {
		return await this.bookRepository.findOne({
			where: { title, edition },
		});
	}

	async search(title: string): Promise<BookEntity[]> {
		return await this.bookRepository.findBy({ title: Like(`%${title}%`) });
	}

	async searchByIds(ids: string[]): Promise<BookEntity[]> {
		return await this.bookRepository.findBy({ id: In(ids) });
	}
}
