import { randomUUID } from "crypto";
import { StockBookDTO } from "../controller/dto/stock-book.dto";

export class Book {
	constructor(
		public id: string,
		public title: string,
		public edition: number,
		public author: string,
		public release: string,
		public cover: string,
		public quantity: number,
		public isVisible: boolean
	) {}

	static register = (
		bookDTO: StockBookDTO,
		idGenerator: () => `${string}-${string}-${string}-${string}-${string}` = randomUUID
	): Book => {
		const id = idGenerator();

		const book = new Book(
			id,
			bookDTO.title,
			bookDTO.edition,
			bookDTO.author,
			bookDTO.release,
			bookDTO.cover,
			bookDTO.quantity,
			false
		);

		return book;
	};
}
